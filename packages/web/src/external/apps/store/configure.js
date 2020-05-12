import { createStore, applyMiddleware, compose } from 'redux';
import { middleware as thunkMiddleware } from 'redux-saga-thunk';
import { createLogger } from 'redux-logger';

import { middleware as apiMiddleware } from 'sly/web/services/api';
import reducer from 'sly/web/external/apps/store/reducer';
import { isDev, isBrowser } from 'sly/web/config';

const devtools =
  isDev && isBrowser && window.devToolsExtension
    ? window.devToolsExtension
    : () => fn => fn;

const loggerMiddleware = createLogger();

const configureStore = (initialState) => {
  const middlewares = [
    apiMiddleware, thunkMiddleware,
  ];

  if (isBrowser && isDev) {
    middlewares.push(loggerMiddleware);
  }

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools(),
  ];

  const store = createStore(reducer, initialState, compose(...enhancers));

  return store;
};

export default configureStore;
