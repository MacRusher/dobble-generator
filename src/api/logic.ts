import shuffle from 'lodash/shuffle';
import uniqueId from 'lodash/uniqueId';
import { createLogic, Logic } from 'redux-logic';

import exampleFiles from '../images/exampleFiles.json';

import { appendImages, generatePdfComplete, removeAll } from './actions';
import { fileToDataUrl, generatePdf, getImageRatio, sleep } from './lib';
import {
  CardImage,
  GENERATE_PDF,
  GeneratePdfAction,
  LOAD_EXAMPLES,
  State,
  UPLOAD_IMAGES,
  UploadImagesAction,
} from './types';

export const uploadImagesLogic = createLogic({
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

export const generatePdfLogic = createLogic({
  type: GENERATE_PDF,
  latest: true,
  validate(
    { action, getState }: { action: GeneratePdfAction; getState: () => State },
    allow,
    reject,
  ) {
    const { processing } = getState();
    if (processing) {
      // Allow only single operation at a time
      reject(action);
    } else {
      allow(action);
    }
  },
  async process(
    { action, getState }: { action: GeneratePdfAction; getState: () => State },
    dispatch,
    done,
  ) {
    const images: CardImage[] = getState().images;

    // Unlock the thread before heavy computations starts
    await sleep(10);

    const pdf = await generatePdf(images, action.payload);

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

export const loadExamplesLogic = createLogic({
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

export default [
  uploadImagesLogic,
  generatePdfLogic,
  loadExamplesLogic,
] as Logic[];
