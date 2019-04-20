import * as types from './types';

export const appendImages = (images: types.CardImage[]) => ({
  type: types.APPEND_IMAGES,
  payload: images,
});
export const loadExamples = () => ({
  type: types.LOAD_EXAMPLES,
});

export const removeAll = () => ({
  type: types.REMOVE_ALL,
});

export const uploadImages = () => ({
  type: types.UPLOAD_IMAGES,
});
