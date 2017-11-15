import { createStore, applyMiddleware, compose } from 'redux';
import reducer from '../reducer';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import api from '../middlewares/api';
import startWS, { webSocketMiddleware } from '../middlewares/socketMiddleware';

const logger = createLogger();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk, api, webSocketMiddleware/*, randomId*/ , logger));

const store = createStore(reducer, {}, enhancer);
startWS(store);

window.store = store;
export default store;