import shuffle from 'lodash/shuffle';
import uniqueId from 'lodash/uniqueId';
import { createLogic, Logic } from 'redux-logic';

import { appendImages, removeAll } from './actions';
import { CardImage, LOAD_EXAMPLES, UPLOAD_IMAGES } from './types';

import exampleFiles from '../images/exampleFiles.json';

export const uploadImages = createLogic({
  type: UPLOAD_IMAGES,
});

export const loadExamples = createLogic({
  type: LOAD_EXAMPLES,
  latest: true,
  async process(obj, dispatch, done) {
    dispatch(removeAll());

    const images: CardImage[] = await Promise.all(
      shuffle(exampleFiles).map(async file => ({
        base64src: (await import(`../images/${file}`)).default,
        id: uniqueId('exampleImage_'),
        title: file,
      })),
    );

    dispatch(appendImages(images));
    done();
  },
});

export default [uploadImages, loadExamples] as Logic[];
