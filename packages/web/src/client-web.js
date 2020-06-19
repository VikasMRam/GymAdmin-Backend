/* eslint-disable no-underscore-dangle */
import 'intersection-observer';
import '@babel/polyfill';
import 'react-hot-loader/patch';
import 'isomorphic-fetch';

import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import { loadableReady } from '@loadable/component';

import RetentionPopup from 'sly/web/services/retentionPopup';
import App from 'sly/web/components/App';
import configureStore from 'sly/web/store/configure';
import WSProvider from 'sly/web/services/ws/WSProvider';
import NotificationSubscriptions from 'sly/web/services/notifications/Subscriptions';

// For Lazy loading images, used in ResponsiveImage
require('sly/web/services/yall');

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);

const renderApp = () => (
  <Provider store={store}>
    <WSProvider>
      <NotificationSubscriptions>
        <BrowserRouter>
          <>
            <RetentionPopup />
            <App />
          </>
        </BrowserRouter>
      </NotificationSubscriptions>
    </WSProvider>
  </Provider>
);

const root = document.getElementById('app');

Modal.setAppElement('#app');

loadableReady(() => {
  hydrate(renderApp(), root);
});
