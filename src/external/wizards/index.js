/* eslint-disable no-underscore-dangle, no-console */
// https://github.com/diegohaz/arc/wiki/Example-app
// for less frustration - https://stackoverflow.com/questions/46270984/warning-failed-prop-type-invalid-prop-children-of-type-object-supplied-to
import '@babel/polyfill';
import 'react-hot-loader/patch';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { host, authTokenUrl } from 'sly/config';
import { getOrigin } from 'sly/services/helpers/url';
import api from 'sly/services/api';
import { ApiProvider, createApi } from 'sly/services/newApi';
import configureStore from 'sly/external/wizards/store/configure';
import WizardApp from 'sly/external/wizards/WizardApp';

const store = configureStore({}, { api: api.create({ credentials: 'include' }) });
const beesApi = createApi();

const renderApp = () => (
  <ApiProvider api={beesApi}>
    <Provider store={store}>
      <BrowserRouter>
        <WizardApp />
      </BrowserRouter>
    </Provider>
  </ApiProvider>
);

const root = document.getElementById('app');
const origin = getOrigin();

if (origin.indexOf(host) !== -1) {
  fetch(authTokenUrl, { credentials: 'same-origin' })
    .then(() => render(renderApp(), root));
} else {
  console.warn('Javascript not loading because CORS: got', origin, 'but was expecting', host);
}

if (module.hot) {
  module.hot.accept('./WizardApp', () => {
    require('./WizardApp');
    render(renderApp(), root);
  });
}
