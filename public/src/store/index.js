import { createStore, applyMiddleware, compose } from 'redux';
import reducer from '../reducer';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Map } from 'immutable';

import api from '../middlewares/api';
import startWS, { webSocketMiddleware } from '../middlewares/socketMiddleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let middleware = [thunk, api, webSocketMiddleware];

if (process.env.NODE_ENV !== 'production' && false) {
  const logger = createLogger();

  middleware = [...middleware, logger];
}

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const initialState = Map({});

const store = createStore(reducer, initialState, enhancer);
startWS(store);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = require('../reducer').default;
    store.replaceReducer(nextRootReducer);
  });
}

// window.store = store;
export default store;
