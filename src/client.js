/* eslint-disable no-underscore-dangle */
import 'babel-polyfill';
import 'react-hot-loader/patch';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ServerStateProvider } from 'react-router-server';
import Modal from 'react-modal';

import { basename } from 'sly/config';
import configureStore from 'sly/store/configure';
import api from 'sly/services/api';
import App from 'sly/components/App';

const serverState = window.__SERVER_STATE__;
const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, { api: api.create({ credentials: 'include' }) });

const renderApp = () => (
  <ServerStateProvider state={serverState}>
    <Provider store={store}>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </Provider>
  </ServerStateProvider>
);

const root = document.getElementById('app');

Modal.setAppElement('#app');

render(renderApp(), root);

if (module.hot) {
  module.hot.accept('components/App', () => {
    require('components/App');
    render(renderApp(), root);
  });
}
