// LandingPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import LandingPage from '../LandingPage';
import APPCONSTANTS from '../../../constants/appConstants';
import { roleSelector, userDataSelector, getUserSuiteAccessSelector } from '../../../store/user/selectors';

// Mock assets
jest.mock('../../../assets/images/admin.svg', () => ({
  ReactComponent: () => <div>AdminPortalLogo</div>
}));

jest.mock('../../../assets/images/reports.svg', () => ({
  ReactComponent: () => <div>ReportingPortalLogo</div>
}));

jest.mock('../../../assets/images/insights.svg', () => ({
  ReactComponent: () => <div>InsightsLogo</div>
}));

// Mock selectors
jest.mock('../../../store/user/selectors');

// Mock route util
jest.mock('../../../utils/routeUtil', () => ({
  goToUrl: jest.fn()
}));

// Mock useHistory
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush
  })
}));

describe('LandingPage', () => {
  const mockStore = configureStore();
  let store: any;

  beforeEach(() => {
    store = mockStore({
      user: {
        role: APPCONSTANTS.ROLES.SUPER_ADMIN,
        userData: {
          country: {
            id: 1,
            tenantId: 123
          }
        },
        suiteAccess: [APPCONSTANTS.SUITE_ACCESS.ADMIN, APPCONSTANTS.SUITE_ACCESS.CFR]
      }
    });

    (roleSelector as unknown as jest.Mock).mockReturnValue(APPCONSTANTS.ROLES.SUPER_ADMIN);
    (userDataSelector as unknown as jest.Mock).mockReturnValue({
      country: {
        id: 1,
        tenantId: 123
      }
    });
    (getUserSuiteAccessSelector as unknown as jest.Mock).mockReturnValue([
      APPCONSTANTS.SUITE_ACCESS.ADMIN,
      APPCONSTANTS.SUITE_ACCESS.CFR
    ]);
  });

  it('should render the LandingPage component correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });
  });

  it('should open a new tab for suites with domain', async () => {
    window.open = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </Provider>
    );
    const reportLink = await screen.findByText('Reports');
    expect(reportLink.closest('a')).toHaveAttribute('href', process.env.REACT_APP_CFR_WEB_URL);
    expect(reportLink.closest('a')).toHaveAttribute('target', '_blank');
  });
});
