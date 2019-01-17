import { createStore, applyMiddleware, compose } from 'redux';
import reducer from '../reducer';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import api from '../middlewares/api';
import startWS, { webSocketMiddleware } from '../middlewares/socketMiddleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let middleware = [ thunk, api, webSocketMiddleware ];

if (process.env.NODE_ENV !== 'production' && false) {
  const logger = createLogger();

  middleware = [ ...middleware, logger ];
}

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const store = createStore(reducer, {}, enhancer);
startWS(store);

window.store = store;
export default store;