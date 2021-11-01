import {
  Actions,
  APPEND_IMAGES,
  GENERATE_PDF,
  GENERATE_PDF_COMPLETE,
  REMOVE_ALL,
  REMOVE_IMAGE,
  SET_SETTINGS,
  State,
} from './types';

const initialState: State = {
  images: [],
  processing: false,
  settings: {
    pageWidth: 210, // A4
    pageHeight: 297, // A4
    cardRadius: 42, // Size of a single card
    symbolMargin: -0.1, // Percent of card radius
    rotateSymbols: true, // Whether the symbols should be randomly rotated
  },
};

export default function reducer(state = initialState, action: Actions): State {
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
    case SET_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
