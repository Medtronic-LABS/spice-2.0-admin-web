import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppRoutes } from '../routes';
import APPCONSTANTS from '../constants/appConstants';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from '../constants/route';

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

const mockStore = configureStore([thunk]);

describe('AppRoutes', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      user: {
        isLoggedIn: false,
        role: APPCONSTANTS.ROLES.SUPER_ADMIN,
        user: {
          country: {
            id: 1,
            tenantId: 123
          }
        }
      }
    });
  });

  it('should render public routes when not logged in', () => {
    const { container } = render(
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
    const store1 = mockStore({
      user: {
        isLoggedIn: true,
        role: APPCONSTANTS.ROLES.SUPER_ADMIN,
        user: {
          country: {
            id: 1,
            tenantId: 1
          }
        },
        suiteAccess: [APPCONSTANTS.SUITE_ACCESS.ADMIN, APPCONSTANTS.SUITE_ACCESS.CFR]
      }
    });

    const { container } = render(
      <Provider store={store1}>
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
});
