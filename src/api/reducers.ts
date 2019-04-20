import { Actions, APPEND_IMAGES, CardImage, REMOVE_ALL } from './types';

export interface State {
  images: CardImage[];
}

const initialState: State = {
  images: [],
};

export default function(state = initialState, action: Actions): State {
  switch (action.type) {
    case APPEND_IMAGES:
      return {
        images: [...(state.images || []), ...action.payload],
      };
    case REMOVE_ALL:
      return {
        images: [],
      };
    default:
      return state;
  }
}
