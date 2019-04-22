import shuffle from 'lodash/shuffle';
import uniqueId from 'lodash/uniqueId';
import { createLogic, Logic } from 'redux-logic';

import exampleFiles from '../images/exampleFiles.json';

import { appendImages, removeAll } from './actions';
import { fileToDataUrl } from './lib';
import {
  CardImage,
  LOAD_EXAMPLES,
  UPLOAD_IMAGES,
  UploadImagesAction,
} from './types';

export const uploadImages = createLogic({
  type: UPLOAD_IMAGES,
  async process({ action }: { action: UploadImagesAction }, dispatch, done) {
    const images: CardImage[] = await Promise.all(
      action.payload.map(async image => ({
        base64src: await fileToDataUrl(image),
        id: uniqueId('image_'),
        title: image.name,
      })),
    );

    dispatch(appendImages(images));
    done();
  },
});

export const loadExamples = createLogic({
  type: LOAD_EXAMPLES,
  latest: true,
  async process(obj, dispatch, done) {
    dispatch(removeAll());

    const images: CardImage[] = await Promise.all(
      shuffle(exampleFiles).map(async file => ({
        base64src: (await import(`../images/${file}`)).default,
        id: uniqueId('image_'),
        title: file,
      })),
    );

    dispatch(appendImages(images));
    done();
  },
});

export default [uploadImages, loadExamples] as Logic[];
