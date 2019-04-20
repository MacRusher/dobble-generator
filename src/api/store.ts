import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogicMiddleware } from 'redux-logic';

import logic from './logic';
import reducers from './reducers';

export type State = ReturnType<typeof reducers>;

export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(createLogicMiddleware(logic))),
);
