import { createLogic, Logic } from 'redux-logic';

import { LOAD_EXAMPLES, UPLOAD_IMAGES } from './types';

export const uploadImages = createLogic({
  type: UPLOAD_IMAGES,
});

export const loadExamples = createLogic({
  type: LOAD_EXAMPLES,
});

export default [uploadImages, loadExamples] as Logic[];
