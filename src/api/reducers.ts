import {
  Actions,
  APPEND_IMAGES,
  GENERATE_PDF,
  GENERATE_PDF_COMPLETE,
  REMOVE_ALL,
  REMOVE_IMAGE,
  State,
} from './types';

const initialState: State = {
  images: [],
  processing: false,
};

export default function(state = initialState, action: Actions): State {
  switch (action.type) {
    case APPEND_IMAGES:
      return {
        ...state,
        images: [...state.images, ...action.payload],
      };
    case GENERATE_PDF:
      return {
        ...state,
        processing: true,
      };
    case GENERATE_PDF_COMPLETE:
      return {
        ...state,
        processing: false,
      };
    case REMOVE_ALL:
      return {
        ...state,
        images: [],
      };
    case REMOVE_IMAGE:
      return {
        ...state,
        images: state.images.filter(image => image.id !== action.payload),
      };
    default:
      return state;
  }
}
