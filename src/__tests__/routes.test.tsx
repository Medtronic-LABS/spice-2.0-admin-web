import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { AppRoutes } from '../routes';
import APPCONSTANTS from '../constants/appConstants';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from '../constants/route';
import { goToUrl } from '../utils/routeUtil';

// Mocking the utility functions
jest.mock('../utils/routeUtil', () => ({
  goToUrl: jest.fn(),
  decryptData: jest.fn()
}));

jest.mock('../../../assets/images/app-logo.svg', () => ({
  ReactComponent: 'Logo'
}));

jest.mock('../../../assets/images/admin.svg', () => ({
  ReactComponent: () => <div>AdminPortalLogo</div>
}));

jest.mock('../../../assets/images/reports.svg', () => ({
  ReactComponent: () => <div>ReportingPortalLogo</div>
}));

jest.mock('../../../assets/images/insights.svg', () => ({
  ReactComponent: () => <div>InsightsLogo</div>
}));

jest.mock('../components/loader/Loader', () => () => <div data-testid='loader'>Loader</div>);

const mockStore = configureStore();

const initialState = {
  user: {
    isLoggedIn: false,
    loggingIn: false,
    role: APPCONSTANTS.ROLES.SUPER_ADMIN,
    user: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'test@example.com',
      userId: '123'
    }
  }
};
describe('AppRoutes', () => {
  const store = mockStore(initialState);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render public routes when not logged in', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[PUBLIC_ROUTES.login]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument(); // Ensure protected routes are not rendered
  });

  it('should render protected routes when logged in', () => {
    const localStore = mockStore({
      user: {
        ...initialState.user,
        isLoggedIn: true,
        suiteAccess: [APPCONSTANTS.SUITE_ACCESS.ADMIN, APPCONSTANTS.SUITE_ACCESS.CFR]
      }
    });

    render(
      <Provider store={localStore}>
        <MemoryRouter initialEntries={[PROTECTED_ROUTES.landingPage]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    // Ensure LandingPage component is rendered
    waitFor(() => {
      expect(screen.getByText('ADMIN')).toBeInTheDocument();
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });
  });

  it('should redirect to the login page when not logged in and navigating to a protected route', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[PROTECTED_ROUTES.landingPage]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should render loader when initializing', () => {
    const localStore = mockStore({
      user: {
        ...initialState.user,
        isLoggedIn: false,
        loggingIn: true
      }
    });
    const { getByTestId } = render(
      <Provider store={localStore}>
        <MemoryRouter initialEntries={[PROTECTED_ROUTES.landingPage]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    expect(getByTestId('loader')).toBeInTheDocument();
  });

  it('should redirect to the next URL when logged in and next parameter is present', async () => {
    const nextUrl = '/dashboard';
    // Mock the URLSearchParams
    const mockURLSearchParams = jest.fn(() => ({
      get: jest.fn().mockReturnValue(nextUrl)
    }));
    global.URLSearchParams = mockURLSearchParams as any;

    const localStore = mockStore({
      user: {
        ...initialState.user,
        isLoggedIn: true,
        loggingIn: false,
        loggingOut: false,
        loading: false,
        initializing: false
      }
    });

    render(
      <Provider store={localStore}>
        <MemoryRouter initialEntries={[`${PUBLIC_ROUTES.login}?next=${nextUrl}`]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(goToUrl).toHaveBeenCalledWith(nextUrl);
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
