import { Actions, LOAD_EXAMPLES, UPLOAD_IMAGES } from './types';

export interface State {
  images: string[];
}

const initialState: State = {
  images: [],
};

export default function(state = initialState, action: Actions): State {
  switch (action.type) {
    case 'UPLOAD_IMAGES':
      return {
        images: [],
      };
    case 'LOAD_EXAMPLES':
      return {
        images: [],
      };
    default:
      return state;
  }
}
