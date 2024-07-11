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
import sessionStorageServices from './global/sessionStorageServices';
import APPCONSTANTS from './constants/appConstants';
import { addToken } from './store/user/actions';

// Retrieve the secret token and set up initial state
const secretToken = sessionStorageServices.getItem(APPCONSTANTS.SECRET_TOKEN);
if (secretToken) {
  store.dispatch(addToken(secretToken));
  sessionStorageServices.setItem(APPCONSTANTS.AUTHTOKEN, secretToken);
}
sessionStorageServices.deleteItem(APPCONSTANTS.SECRET_TOKEN);

setupInterceptors(store);

// Create root and render the app using React 18 API
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// Service worker registration
serviceWorker.unregister();
