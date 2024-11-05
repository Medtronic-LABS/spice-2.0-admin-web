import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from './App';

const mockStore = configureStore();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000'
  })
}));

jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  pageview: jest.fn(),
  send: jest.fn()
}));

jest.mock('./assets/images/app-logo.svg', () => ({
  ReactComponent: 'Logo'
}));

jest.mock('./components/header/Header', () => () => <div data-testid='header'>Mock Header</div>);

describe('App Component', () => {
  beforeAll(() => {
    process.env.REACT_APP_GA_TRACKING_ID = 'G-12345ABCDE';
  });

  const store = mockStore({
    user: {
      isLoggedIn: true
    }
  });

  describe('App', () => {
    test('should render header without errors', () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );
      expect(getByTestId('header')).toBeInTheDocument();
    });

    test('should render header without errors with no ga tracking id', () => {
      process.env.REACT_APP_GA_TRACKING_ID = '';
      const { getByTestId } = render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );
      expect(getByTestId('header')).toBeInTheDocument();
    });

    test('should not render header if not logged in', () => {
      const localStore = mockStore({
        user: {
          isLoggedIn: false
        }
      });
      const { queryByTestId } = render(
        <Provider store={localStore}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );
      expect(queryByTestId('header')).not.toBeInTheDocument();
    });
  });
});
