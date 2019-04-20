// Possible redux action types
export const UPLOAD_IMAGES = 'UPLOAD_IMAGES';
export const LOAD_EXAMPLES = 'LOAD_EXAMPLES';
export const REMOVE_ALL = 'REMOVE_ALL';

// Payload types

// Action types
interface UploadImagesAction {
  type: typeof UPLOAD_IMAGES;
}

interface LoadExamplesAction {
  type: typeof LOAD_EXAMPLES;
}

interface RemoveAllAction {
  type: typeof REMOVE_ALL;
}

export type Actions = UploadImagesAction | LoadExamplesAction | RemoveAllAction;
