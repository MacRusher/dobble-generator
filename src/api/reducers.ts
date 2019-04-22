import {
  Actions,
  APPEND_IMAGES,
  REMOVE_ALL,
  REMOVE_IMAGE,
  State,
} from './types';

const initialState: State = {
  images: [],
};

export default function(state = initialState, action: Actions): State {
  switch (action.type) {
    case APPEND_IMAGES:
      return {
        images: [...state.images, ...action.payload],
      };
    case REMOVE_ALL:
      return {
        images: [],
      };
    case REMOVE_IMAGE:
      return {
        images: state.images.filter(image => image.id !== action.payload),
      };
    default:
      return state;
  }
}
