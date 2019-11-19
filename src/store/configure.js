import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { middleware as sagaThunkMiddleware } from 'redux-saga-thunk';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { middleware } from '../services/newApi';
import reducer from './reducer';
import sagas from './sagas';

import { isDev, isBrowser, muteReduxLogger } from 'sly/config';

const devtools =
  isDev && isBrowser && window.devToolsExtension
    ? window.devToolsExtension
    : () => fn => fn;

const loggerMiddleware = createLogger();

export default function (initialState, services = {}) {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    middleware, thunkMiddleware, sagaThunkMiddleware, sagaMiddleware,
  ];

  if (isBrowser && !muteReduxLogger) {
    middlewares.push(loggerMiddleware);
  }

  const enhancers = [
    applyMiddleware(...middlewares),
    devtools(),
  ];

  const store = createStore(reducer, initialState, compose(...enhancers));
  let sagaTask = sagaMiddleware.run(sagas, services);

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer').default;
      store.replaceReducer(nextReducer);
    });
    module.hot.accept('./sagas', () => {
      const nextSagas = require('./sagas').default;
      sagaTask.cancel();
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(nextSagas, services);
      });
    });
  }

  return store;
}
