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

export const removeImage = (id: string) => ({
  type: types.REMOVE_IMAGE,
  payload: id,
});

export const uploadImages = (files: FileList | null) => ({
  type: types.UPLOAD_IMAGES,
  payload: files ? [...files] : [],
});
