// Possible redux action types
export const APPEND_IMAGES = 'APPEND_IMAGES';
export const LOAD_EXAMPLES = 'LOAD_EXAMPLES';
export const REMOVE_ALL = 'REMOVE_ALL';
export const REMOVE_IMAGE = 'REMOVE_IMAGE';
export const UPLOAD_IMAGES = 'UPLOAD_IMAGES';

// Payload types
export interface CardImage {
  base64src: string;
  id: string;
  title?: string;
}

// Action types
interface AppendImages {
  type: typeof APPEND_IMAGES;
  payload: CardImage[];
}

interface LoadExamplesAction {
  type: typeof LOAD_EXAMPLES;
}

interface RemoveAllAction {
  type: typeof REMOVE_ALL;
}

interface RemoveImageAction {
  type: typeof REMOVE_IMAGE;
  payload: string;
}

interface UploadImagesAction {
  type: typeof UPLOAD_IMAGES;
}

export type Actions =
  | AppendImages
  | LoadExamplesAction
  | RemoveAllAction
  | RemoveImageAction
  | UploadImagesAction;
