import {
  APPEND_IMAGES,
  AppendImagesAction,
  CardImage,
  GENERATE_PDF,
  GENERATE_PDF_COMPLETE,
  GeneratePdfAction,
  GeneratePdfCompleteAction,
  LOAD_EXAMPLES,
  LoadExamplesAction,
  Prime,
  REMOVE_ALL,
  REMOVE_IMAGE,
  RemoveAllAction,
  RemoveImageAction,
  SET_SETTINGS,
  SetSettingsAction,
  Settings,
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

export const generatePdfComplete = (): GeneratePdfCompleteAction => ({
  type: GENERATE_PDF_COMPLETE,
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

export const setSettings = (settings: Partial<Settings>): SetSettingsAction => ({
  type: SET_SETTINGS,
  payload: settings,
});
