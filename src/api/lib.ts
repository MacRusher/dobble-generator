import Ajv, { SchemaObject } from 'ajv';
import Jimp from 'jimp';
import JsPDF from 'jspdf';
import chunk from 'lodash/chunk';
import random from 'lodash/random';
import shuffle from 'lodash/shuffle';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';

import { CardImage, CardSymbol, Prime, Settings } from './types';

/**
 * Generate supported plains (dimensions) according to the Ray-Chaudhuri–Wilson theorem
 * n - prime number
 * @see https://math.stackexchange.com/questions/36798/what-is-the-math-behind-the-game-spot-it
 */
export const plains = ([2, 3, 5, 7, 11] as Prime[]).map((n: Prime) => ({
  n,
  symbols: n ** 2 + n + 1,
  symbolsPerCard: n + 1,
}));

/**
 * Generate unique cards for available plains
 * @see https://math.stackexchange.com/questions/1303497/what-is-the-algorithm-to-generate-the-cards-in-the-game-dobble-known-as-spo
 */
export const generateCards = (n: Prime): number[][] => {
  const d = [...Array(n).keys()];

  return shuffle([
    shuffle([...d, n]),
    ...d.flatMap(a => [
      shuffle([0, ...d.map(b => n + 1 + n * a + b)]),
      ...d.map(b =>
        shuffle([a + 1, ...d.map(c => n + 1 + n * c + ((a * c + b) % n))]),
      ),
    ]),
  ]);
};

/**
 * Promisify the FileReader::readAsDataURL method
 */
export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

/**
 * Promisify the FileReader::readAsDataURL method
 */
export const getImageRatio = (dataUrl: string): Promise<number> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = reject;
    img.onload = () => resolve(img.height / img.width);
    img.src = dataUrl;
  });

/**
 * Unlock event loop and wait
 */
export const sleep = (t = 0): Promise<never> =>
  new Promise(r => setTimeout(r, t));

/**
 * Generate PDF instance with cards
 */
export const generatePdf = async (
  images: CardImage[] = [],
  options: { n: Prime } & Settings,
): Promise<JsPDF> => {
  const {
    n, // No of plains
    pageWidth = 210, // A4
    pageHeight = 297, // A4
    cardRadius = 42, // Size of a single card
    symbolMargin = -0.1, // Percent of card radius; value is negative to allow overlap since rotated symbols are smaller
    rotateSymbols = true, // Whether the symbols should be randomly rotated
  } = options;

  // Apply images to generated card sequences
  const cards = generateCards(n).map(card => card.map(s => images[s]));

  // PDF sizes in mm
  const columnsPerPage = Math.floor(pageWidth / (cardRadius * 2));
  const rowsPerPage = Math.floor(pageHeight / (cardRadius * 2));
  const cardsPerPage = columnsPerPage * rowsPerPage;
  const columnWidth = pageWidth / columnsPerPage;
  const rowHeight = pageHeight / rowsPerPage;

  const pdf = new JsPDF();

  // Split cards into pages
  for (const [page, pageCards] of chunk(cards, cardsPerPage).entries()) {
    if (page > 0) {
      pdf.addPage();
    }

    for (const [i, card] of pageCards.entries()) {
      const { x, y } = getCardMiddle(i, columnWidth, rowHeight);

      // Draw outline
      pdf.circle(x, y, cardRadius, 'S');

      const symbols = arrangeSymbolsOnCard(card, symbolMargin, n);

      // Add symbols to pdf
      for (let s of symbols) {
        if (rotateSymbols) {
          s = await rotateSymbol(s);
        }
        pdf.addImage(
          s.image.base64src,
          'PNG',
          x + s.x * cardRadius,
          y + s.y * cardRadius,
          cardRadius * s.width,
          cardRadius * s.height,
          s.image.id,
          'NONE',
          0,
        );
      }
    }
  }

  return pdf;
};

const rotateSymbol = (symbol: CardSymbol) =>
  new Promise<CardSymbol>((resolve, reject) => {
    const image = symbol.image;
    const buffer = Buffer.from(image.base64src.split(',')[1], 'base64');
    void Jimp.read(buffer).then(jimpImage => {
      jimpImage
        .rotate(symbol.rotation)
        .getBase64('image/png', (err, base64) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              ...symbol,
              image: {
                ...image,
                base64src: base64,
              },
            });
          }
        });
    });
  });

function arrangeSymbolsOnCard(
  card: CardImage[],
  symbolMargin: number,
  n: number,
) {
  const symbols: CardSymbol[] = [];
  // Brute-force it until it will look good :)
  let k1 = 500;
  while (k1-- > 0) {
    card.forEach(image => {
      let k2 = 100;
      while (k2-- > 0) {
        const s = getSymbolInRandomPosition(image, k2, n);

        // Test if element is within the circle
        if (isWithinCircle(s)) {
          continue;
        }
        // Test if there is no collision with other symbols
        if (areThereCollisions(symbols, s, symbolMargin)) {
          continue;
        }
        // Everything ok, add it to the collection
        symbols.push(s);
        break;
      }
    });

    if (symbols.length !== n + 1) {
      // Not able to generate a layout, start from scratch:
      symbols.length = 0;
      continue;
    }

    // Everything ok
    break;
  }

  if (symbols.length !== n + 1) {
    throw new Error('Could not generate a possible card layout');
  }
  return symbols;
}

const isWithinCircle = (s: CardSymbol): boolean => {
  return (
    (s.x + s.width) ** 2 + s.y ** 2 > 1 ||
    (s.x + s.width) ** 2 + (s.y + s.height) ** 2 > 1 ||
    s.x ** 2 + s.y ** 2 > 1 ||
    s.x ** 2 + (s.y + s.height) ** 2 > 1
  );
};

function areThereCollisions(
  symbols: CardSymbol[],
  s: CardSymbol,
  symbolMargin: number,
) {
  return symbols.some(
    s2 =>
      s.x - symbolMargin < s2.x + s2.width &&
      s.x + s.width + symbolMargin > s2.x &&
      s.y - symbolMargin < s2.y + s2.height &&
      s.y + s.height + symbolMargin > s2.y,
  );
}

function getSymbolInRandomPosition(image: CardImage, k2: number, n: number) {
  const size = getRandomImageSize(k2, n);

  const s: CardSymbol = {
    x: random(-1, 1 - size, true),
    y: random(-1, 1 - size, true),
    rotation: random(0, 359, false),
    width: size * image.ratio,
    height: size * image.ratio,
    image,
  };
  return s;
}

function getRandomImageSize(k2: number, n: number) {
  return random(
    // Try a smaller image after each iteration, up to some limit
    Math.max((0.6 * k2) / 100, 0.3),
    // Limit upper size for high n values
    n < 7 ? 1 : 0.8,
  );
}

function getCardMiddle(
  i: number,
  columnWidth: number,
  rowHeight: number,
): { x: number; y: number } {
  return {
    x: (i % 2) * columnWidth + columnWidth / 2,
    y: Math.floor(i / 2) * rowHeight + rowHeight / 2,
  };
}

export function createBridge(schema: SchemaObject): JSONSchemaBridge {
  const ajv = new Ajv({ allErrors: true, useDefaults: true });

  function createValidator(schema: SchemaObject) {
    const validator = ajv.compile(schema);

    return (model: Record<string, unknown>) => {
      validator(model);
      return validator.errors?.length ? { details: validator.errors } : null;
    };
  }

  return new JSONSchemaBridge(schema, createValidator(schema));
}
