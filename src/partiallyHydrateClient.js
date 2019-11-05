/* eslint-disable no-underscore-dangle */
import '@babel/polyfill';
import 'react-hot-loader/patch';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ServerStateProvider } from 'react-router-server';
import Modal from 'react-modal';
import { ApiProvider, createApi } from 'sly/services/newApi';
import configureStore from 'sly/store/configure';
import theme from 'sly/components/themes/default';
import api from 'sly/services/api';
import { hydrateComponents } from 'sly/partialHydration';
import { ThemeProvider } from 'styled-components';

export default function partiallyHydrateClient(componentsToHydrate, root) {
  const serverState = window.__SERVER_STATE__;
  const initialState = window.__INITIAL_STATE__;
  const store = configureStore(initialState, { api: api.create() });

  const beesApi = createApi();

  Modal.setAppElement('#app');

  const Providers = ({ children }) => (
    <ServerStateProvider state={serverState}>
      <ApiProvider api={beesApi}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      </ApiProvider>
    </ServerStateProvider>
  );

  hydrateComponents(componentsToHydrate, root, Providers);
}
