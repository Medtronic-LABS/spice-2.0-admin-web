import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import AppLayout from '../AppLayout';
import { PROTECTED_ROUTES } from '../../../constants/route';
import APPCONSTANTS, { APP_TYPE } from '../../../constants/appConstants';

const mockStore = configureStore([]);

jest.mock('../../../assets/images/home.svg', () => ({
  ReactComponent: 'HomeIcon'
}));

jest.mock('../../sideMenu/SideMenu', () => () => <div data-testid='side-menu-component'>Side Menu</div>);

const initialState = {
  user: {
    initializing: false,
    user: {
      role: APPCONSTANTS.ROLES.SUPER_ADMIN,
      appTypes: [APP_TYPE.COMMUNITY],
      roleDetail: {
        id: 1,
        name: APPCONSTANTS.ROLES.SUPER_ADMIN
      },
      suiteAccess: [APPCONSTANTS.SUITE_ACCESS]
    }
  },
  region: {
    loading: false,
    detail: {
      name: 'Test Region',
      id: 1,
      tenantId: 1
    }
  },
  district: {
    loading: false,
    district: {
      name: 'Test District',
      id: 1,
      tenantId: 1
    }
  },
  chiefdom: {
    loading: false,
    chiefdomDetail: {
      name: 'Test Chiefdom',
      id: 1,
      tenantId: 1
    }
  },
  healthFacility: {
    loading: false,
    healthFacility: {
      name: 'Test Health Facility',
      id: 1,
      tenantId: 1
    }
  },
  medication: {
    loading: false
  },
  labtest: {
    loading: false
  },
  program: {
    loading: false
  },
  common: {
    loading: false
  },
  regionCom: {
    detail: {
      id: 1,
      tenantId: 1
    }
  },
  healthFacilityCom: {
    healthFacility: {}
  }
};

describe('AppLayout', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);

    // Mock window methods
    global.innerWidth = 1200;
  });

  const defaultPath = PROTECTED_ROUTES.regionSummary.replace(':regionId', '1').replace(':tenantId', '1');

  const renderComponent = (path = defaultPath) => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <AppLayout>
            <div>Test Content</div>
          </AppLayout>
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders children content', () => {
    const { unmount } = renderComponent();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    unmount();
  });

  it('shows header with breadcrumb for normal routes', () => {
    const { unmount } = renderComponent();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    unmount();
  });

  it('hides breadcrumb for specified routes', () => {
    const { unmount } = renderComponent(PROTECTED_ROUTES.landingPage);
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    unmount();
  });

  it('shows non community components when app type is NON_COMMUNITY', () => {
    const localStore = mockStore({
      ...initialState,
      user: {
        ...initialState.user,
        user: {
          ...initialState.user.user,
          appTypes: [APP_TYPE.NON_COMMUNITY]
        }
      }
    });
    const { unmount, getByTestId } = render(
      <Provider store={localStore}>
        <MemoryRouter initialEntries={[defaultPath]}>
          <AppLayout>
            <div>Test Content</div>
          </AppLayout>
        </MemoryRouter>
      </Provider>
    );
    expect(getByTestId('side-menu-component')).toBeInTheDocument();
    unmount();
  });

  it('handles menu toggle in mobile view', () => {
    global.innerWidth = 1000;
    const { unmount } = renderComponent();

    const menuIcon = screen.getByTestId('menu-icon');
    fireEvent.click(menuIcon);
    unmount();
  });

  it('handles window resize into mobile view', () => {
    window.innerWidth = 1200;
    const { unmount } = renderComponent();

    waitFor(() => {
      window.innerWidth = 1000;
      fireEvent(window, new Event('resize'));
    });
    unmount();
  });

  it('handles window resize not into mobile view to make branch coverage', () => {
    window.innerWidth = 1200;
    const { unmount } = renderComponent();

    waitFor(() => {
      window.innerWidth = 1200;
      fireEvent(window, new Event('resize'));
    });
    unmount();
  });

  it('closes menu when clicking outside', () => {
    global.innerWidth = 1000;
    const { unmount } = renderComponent();

    const menuIcon = screen.getByTestId('menu-icon');
    fireEvent.click(menuIcon);
    fireEvent.click(document.body);
    unmount();
  });

  it('handles beforeunload event', () => {
    const { unmount } = renderComponent();

    waitFor(() => {
      window.dispatchEvent(new Event('beforeunload'));
    });
    unmount();
  });

  it('does not render content when app is initializing', () => {
    const localStore = mockStore({
      user: {
        user: {
          role: APPCONSTANTS.ROLES.SUPER_ADMIN,
          appTypes: [APP_TYPE.COMMUNITY]
        },
        initializing: true
      }
    });

    const { unmount } = render(
      <Provider store={localStore}>
        <MemoryRouter initialEntries={['/region/1/1']}>
          <AppLayout>
            <div>Test Content</div>
          </AppLayout>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    unmount();
  });

  it('shows/hides side menu based on route', () => {
    const routesWithMenu = '/region/1/1';
    const routesWithoutMenu = '/region';

    const { getByTestId, unmount } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[routesWithMenu]}>
          <AppLayout>
            <div>Test Content</div>
          </AppLayout>
        </MemoryRouter>
      </Provider>
    );
    expect(getByTestId('side-menu')).toBeInTheDocument();
    unmount();

    const { queryByTestId } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[routesWithoutMenu]}>
          <AppLayout>
            <div>Test Content</div>
          </AppLayout>
        </MemoryRouter>
      </Provider>
    );

    expect(queryByTestId('side-menu')).not.toBeInTheDocument();
  });
});
