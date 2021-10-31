// Redux store state
export interface State {
  images: CardImage[];
  processing: boolean;
}

// Possible redux action types
export const APPEND_IMAGES = 'APPEND_IMAGES';
export const GENERATE_PDF = 'GENERATE_PDF';
export const GENERATE_PDF_COMPLETE = 'GENERATE_PDF_COMPLETE';
export const LOAD_EXAMPLES = 'LOAD_EXAMPLES';
export const REMOVE_ALL = 'REMOVE_ALL';
export const REMOVE_IMAGE = 'REMOVE_IMAGE';
export const UPLOAD_IMAGES = 'UPLOAD_IMAGES';

// Payload types
export type Prime = 2 | 3 | 5 | 7 | 11;

export interface CardImage {
  base64src: string;
  id: string;
  ratio: number;
  title?: string;
}

export interface CardSymbol {
  image: CardImage;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// Action types
export interface AppendImagesAction {
  type: typeof APPEND_IMAGES;
  payload: CardImage[];
}

export interface GeneratePdfAction {
  type: typeof GENERATE_PDF;
  payload: {
    n: Prime;
  };
}

export interface GeneratePdfCompleteAction {
  type: typeof GENERATE_PDF_COMPLETE;
}

export interface LoadExamplesAction {
  type: typeof LOAD_EXAMPLES;
}

export interface RemoveAllAction {
  type: typeof REMOVE_ALL;
}

export interface RemoveImageAction {
  type: typeof REMOVE_IMAGE;
  payload: string;
}

export interface UploadImagesAction {
  type: typeof UPLOAD_IMAGES;
  payload: File[];
}

export type Actions =
  | AppendImagesAction
  | GeneratePdfAction
  | GeneratePdfCompleteAction
  | LoadExamplesAction
  | RemoveAllAction
  | RemoveImageAction
  | UploadImagesAction;
