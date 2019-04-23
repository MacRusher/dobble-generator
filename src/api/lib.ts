import JsPDF from 'jspdf';
import chunk from 'lodash/chunk';
import random from 'lodash/random';
import shuffle from 'lodash/shuffle';

import { CardImage, CardSymbol, Prime } from './types';

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
export const generateCards = (n: Prime) => {
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
export const sleep = (t: number = 0) => new Promise(r => setTimeout(r, t));

/**
 * Generate PDF instance with cards
 */
export const generatePdf = (
  images: CardImage[] = [],
  options: { n: Prime },
): JsPDF => {
  const { n } = options;

  // Apply images to generated card sequences
  const cards = generateCards(n).map(card => card.map(s => images[s]));

  // PDF sizes in mm
  const pageWidth = 210; // A4
  const pageHeight = 297; // A4
  const cardRadius = 42; // Size of a single card
  const columnsPerPage = Math.floor(pageWidth / (cardRadius * 2));
  const rowsPerPage = Math.floor(pageHeight / (cardRadius * 2));
  const cardsPerPage = columnsPerPage * rowsPerPage;
  const columnWidth = pageWidth / columnsPerPage;
  const rowHeight = pageHeight / rowsPerPage;

  const pdf = new JsPDF();

  // Split cards into pages
  chunk(cards, cardsPerPage).forEach((cards, page) => {
    if (page > 0) {
      pdf.addPage();
    }

    cards.forEach((card, i) => {
      // Determine middle of the card
      const x = (i % 2) * columnWidth + columnWidth / 2;
      const y = Math.floor(i / 2) * rowHeight + rowHeight / 2;

      // Draw outline
      pdf.circle(x, y, cardRadius, 'S');

      // Prepare randomly aligned symbols on the card
      const symbols: CardSymbol[] = [];

      // Brute-force it until it will look good :)
      let k1 = 100;
      while (k1-- > 0) {
        card.forEach(image => {
          let k2 = 100;
          while (k2-- > 0) {
            const size = random(
              // Try a smaller image after each iteration, up to some limit
              Math.max((0.4 * k2) / 100, 0.2),
              // Limit upper size for high n values
              n < 7 ? 1 : 0.6,
            );

            const s: CardSymbol = {
              x: random(-1, 1, true),
              y: random(-1, 1, true),
              width: size,
              height: size * image.ratio,
              image,
            };

            // Test if element is within the circle
            if (
              (s.x + s.width) ** 2 + s.y ** 2 > 1 ||
              (s.x + s.width) ** 2 + (s.y + s.height) ** 2 > 1 ||
              s.x ** 2 + s.y ** 2 > 1 ||
              s.x ** 2 + (s.y + s.height) ** 2 > 1
            ) {
              continue;
            }

            // Test if there is no collision with other symbols
            if (
              symbols.some(
                s2 =>
                  s.x < s2.x + s2.width &&
                  s.x + s.width > s2.x &&
                  s.y < s2.y + s2.height &&
                  s.y + s.height > s2.y,
              )
            ) {
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

      symbols.forEach(s => {
        const { base64src, id } = s.image;
        pdf.addImage(
          base64src,
          'PNG',
          x + s.x * cardRadius,
          y + s.y * cardRadius,
          cardRadius * s.width,
          cardRadius * s.height,
          id,
          'NONE',
          0, // random(0, 359),
        );
      });
    });
  });

  return pdf;
};
