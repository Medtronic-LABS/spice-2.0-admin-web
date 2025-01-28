// LandingPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Router, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import LandingPage from '../LandingPage';
import APPCONSTANTS, { APP_TYPE } from '../../../constants/appConstants';
import { goToUrl } from '../../../utils/routeUtil';
import { HOME_PAGE_BY_ROLE } from '../../../constants/route';
import { createMemoryHistory } from 'history';

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

// Mock route util
jest.mock('../../../utils/routeUtil', () => ({
  goToUrl: jest.fn()
}));

const mockStore = configureStore();
const initialState = {
  user: {
    user: {
      role: APPCONSTANTS.ROLES.SUPER_ADMIN,
      suiteAccess: [APPCONSTANTS.SUITE_ACCESS.ADMIN, APPCONSTANTS.SUITE_ACCESS.CFR],
      appTypes: [APP_TYPE.COMMUNITY]
    }
  },
  regionCom: {
    detail: {
      id: 1,
      tenantId: 1
    }
  }
};
describe('LandingPage', () => {
  let store: any;

  beforeAll(() => {
    process.env.REACT_APP_CFR_WEB_URL = 'http://localhost:8000';
  });

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the LandingPage component correctly with region details', async () => {
    const localStore = mockStore(initialState);
    const { getByText, unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(getByText('Admin')).toBeInTheDocument();
      expect(getByText('Reports')).toBeInTheDocument();
    });
    unmount();
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
    // expect(reportLink.closest('a')).toHaveAttribute('href', process.env.REACT_APP_CFR_WEB_URL);
    expect(reportLink.closest('a')).toHaveAttribute('target', '_blank');
  });
  it('should render the LandingPage component correctly with CFR suite access only', async () => {
    const localStore = mockStore({
      user: {
        user: {
          ...initialState.user.user,
          suiteAccess: [APPCONSTANTS.SUITE_ACCESS.CFR]
        }
      },
      regionCom: {
        ...initialState.regionCom
      }
    });
    render(
      <Provider store={localStore}>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </Provider>
    );
    expect(goToUrl).toHaveBeenCalledWith(process.env.REACT_APP_CFR_WEB_URL);
  });

  it('should render the LandingPage component correctly with Admin suite access', async () => {
    const adminUrl = HOME_PAGE_BY_ROLE[APPCONSTANTS.ROLES.SUPER_ADMIN];
    const history = createMemoryHistory();
    const localStore = mockStore({
      user: {
        user: {
          ...initialState.user.user,
          suiteAccess: [APPCONSTANTS.SUITE_ACCESS.ADMIN]
        }
      },
      regionCom: {
        ...initialState.regionCom
      }
    });
    render(
      <Provider store={localStore}>
        <Router history={history}>
          <LandingPage />
        </Router>
      </Provider>
    );
    expect(history.location.pathname).toBe(adminUrl);
  });

  it('should render the LandingPage component correctly with community app type', async () => {
    const history = createMemoryHistory();
    const localStore = mockStore({
      user: {
        user: {
          ...initialState.user.user,
          suiteAccess: [APPCONSTANTS.SUITE_ACCESS.ADMIN, APPCONSTANTS.SUITE_ACCESS.CFR],
          appTypes: [APP_TYPE.COMMUNITY]
        }
      },
      regionCom: {
        ...initialState.regionCom
      }
    });
    render(
      <Provider store={localStore}>
        <Router history={history}>
          <LandingPage />
        </Router>
      </Provider>
    );
    const reportLink = await screen.findByText('Reports');
    expect(reportLink.closest('a')).toHaveAttribute('target', '_blank');
  });
});
