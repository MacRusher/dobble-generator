import JsPDF from 'jspdf';
import chunk from 'lodash/chunk';
import random from 'lodash/random';
import shuffle from 'lodash/shuffle';
import uniqueId from 'lodash/uniqueId';
import { createLogic, Logic } from 'redux-logic';

import exampleFiles from '../images/exampleFiles.json';

import { appendImages, generatePdfComplete, removeAll } from './actions';
import { fileToDataUrl, generateCards, getImageRatio } from './lib';
import {
  CardImage,
  GENERATE_PDF,
  GeneratePdfAction,
  LOAD_EXAMPLES,
  State,
  UPLOAD_IMAGES,
  UploadImagesAction,
} from './types';

export const uploadImages = createLogic({
  type: UPLOAD_IMAGES,
  async process({ action }: { action: UploadImagesAction }, dispatch, done) {
    const images: CardImage[] = await Promise.all(
      action.payload.map(async image => {
        const base64src = await fileToDataUrl(image);
        return {
          base64src,
          id: uniqueId('image_'),
          ratio: await getImageRatio(base64src),
          title: image.name,
        };
      }),
    );

    dispatch(appendImages(images));
    done();
  },
});

export const generatePdf = createLogic({
  type: GENERATE_PDF,
  async process(
    { action, getState }: { action: GeneratePdfAction; getState: () => State },
    dispatch,
    done,
  ) {
    const { n } = action.payload;
    const images: CardImage[] = getState().images;

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

        interface CardElement {
          image: CardImage;
          x: number;
          y: number;
          width: number;
          height: number;
        }

        // Prepare randomly aligned elements on the card
        const elements: CardElement[] = [];

        // Brute-force it until it will look good :)
        let k1 = 100;
        while (k1-- > 0) {
          card.forEach(image => {
            let k2 = 100;
            while (k2-- > 0) {
              // Size can smaller after each iteration
              const size = random(Math.max((0.4 * k2) / 100, 0.3), 0.6);

              const element: CardElement = {
                x: random(-1, 1, true),
                y: random(-1, 1, true),
                width: size,
                height: size,
                image,
              };

              // Test if element is within the circle
              if (
                (element.x + element.width) ** 2 + element.y ** 2 > 1 ||
                (element.x + element.width) ** 2 +
                  (element.y + element.height) ** 2 >
                  1 ||
                element.x ** 2 + element.y ** 2 > 1 ||
                element.x ** 2 + (element.y + element.height) ** 2 > 1
              ) {
                continue;
              }

              // Test if there is no collision with other elements
              if (
                elements.some(
                  element2 =>
                    element.x < element2.x + element2.width &&
                    element.x + element.width > element2.x &&
                    element.y < element2.y + element2.height &&
                    element.y + element.height > element2.y,
                )
              ) {
                continue;
              }

              // Everything ok, add it to the collection
              elements.push(element);
              break;
            }
          });

          if (elements.length !== n + 1) {
            // Not able to generate a layout, start from scratch:
            elements.length = 0;
            continue;
          }

          // Everything ok
          break;
        }

        if (elements.length !== n + 1) {
          throw new Error('Could not generate a possible card layout');
        }

        elements.forEach(element => {
          const { base64src, id } = element.image;
          pdf.addImage(
            base64src,
            'PNG',
            x + element.x * cardRadius,
            y + element.y * cardRadius,
            cardRadius * element.width,
            cardRadius * element.height,
            id,
            'NONE',
            0, // random(0, 359),
          );
        });
      });
    });

    if (process.env.NODE_ENV === 'production') {
      // Force file download
      await pdf.save('Cards.pdf', { returnPromise: true });
    } else {
      // Easier mode to preview during development
      window.open(URL.createObjectURL(pdf.output('blob')));
    }

    dispatch(generatePdfComplete());
    done();
  },
});

export const loadExamples = createLogic({
  type: LOAD_EXAMPLES,
  latest: true,
  async process(obj, dispatch, done) {
    dispatch(removeAll());

    const images: CardImage[] = await Promise.all(
      shuffle(exampleFiles).map(async file => {
        const base64src = (await import(`../images/${file}`)).default;
        return {
          base64src,
          id: uniqueId('image_'),
          ratio: await getImageRatio(base64src),
          title: file,
        };
      }),
    );

    dispatch(appendImages(images));
    done();
  },
});

export default [uploadImages, generatePdf, loadExamples] as Logic[];
