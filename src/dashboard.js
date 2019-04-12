/* eslint-disable no-underscore-dangle, no-console */
import 'babel-polyfill';
import 'react-hot-loader/patch';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';

import configureStore from 'sly/store/configure';
import api from 'sly/services/api';
import DashboardApp from 'sly/components/DashboardApp';
import ApiProvider from 'sly/services/newApi/ApiProvider';
import createApi from 'sly/services/newApi/createApi';

Modal.setAppElement('#app');

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, { api: api.create() });

const beesApi = createApi();

const renderApp = () => (
  <Provider store={store}>
    <ApiProvider api={beesApi}>
      <BrowserRouter>
        <DashboardApp />
      </BrowserRouter>
    </ApiProvider>
  </Provider>
);

const root = document.getElementById('app');

render(renderApp(), root);

if (module.hot) {
  module.hot.accept('components/DashboardApp', () => {
    require('components/DashboardApp');
    render(renderApp(), root);
  });
}
