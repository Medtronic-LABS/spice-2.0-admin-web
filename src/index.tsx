import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import 'bootstrap';
import App from './App';
import store from './store';
import * as serviceWorker from './serviceWorker';
import { setupInterceptors } from './global/interceptors';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary';
import localStorageService from './global/localStorageServices';
import APPCONSTANTS, { APP_TYPE_NAME } from './constants/appConstants';
import { setAppType } from './store/user/actions';
import { jsonParse } from './utils/commonUtils';
import sessionStorageServices from './global/sessionStorageServices';
import { fetchCountryDetailReq } from './store/region/actions';

setupInterceptors(store);

const storedData = localStorageService.getItem(APP_TYPE_NAME);
const appTypes = jsonParse(storedData) || [];

if (!!appTypes && appTypes.length) {
  store.dispatch(setAppType(appTypes));
}

if (sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID)) {
  store.dispatch(fetchCountryDetailReq({ id: sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID) }));
}

// Create root and render the app using React 18 API
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.Fragment>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.Fragment>
);

// Service worker registration
serviceWorker.unregister();
