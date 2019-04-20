import * as types from './types';

export const uploadImages = () => ({
  type: types.UPLOAD_IMAGES,
});

export const loadExamples = () => ({
  type: types.LOAD_EXAMPLES,
});

export const removeAll = () => ({
  type: types.REMOVE_ALL,
});
