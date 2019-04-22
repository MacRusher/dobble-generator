import {
  APPEND_IMAGES,
  AppendImagesAction,
  CardImage,
  GENERATE_PDF,
  GeneratePdfAction,
  LOAD_EXAMPLES,
  LoadExamplesAction,
  Prime,
  REMOVE_ALL,
  REMOVE_IMAGE,
  RemoveAllAction,
  RemoveImageAction,
  UPLOAD_IMAGES,
  UploadImagesAction,
} from './types';

export const appendImages = (images: CardImage[]): AppendImagesAction => ({
  type: APPEND_IMAGES,
  payload: images,
});

export const generatePdf = (n: Prime): GeneratePdfAction => ({
  type: GENERATE_PDF,
  payload: { n },
});

export const loadExamples = (): LoadExamplesAction => ({
  type: LOAD_EXAMPLES,
});

export const removeAll = (): RemoveAllAction => ({
  type: REMOVE_ALL,
});

export const removeImage = (id: string): RemoveImageAction => ({
  type: REMOVE_IMAGE,
  payload: id,
});

export const uploadImages = (files: FileList | null): UploadImagesAction => ({
  type: UPLOAD_IMAGES,
  payload: files ? [...files] : [],
});
