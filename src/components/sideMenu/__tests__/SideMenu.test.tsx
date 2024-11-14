import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import SideMenu from '../SideMenu';
import configureMockStore from 'redux-mock-store';
import { render, waitFor } from '@testing-library/react';
import APPCONSTANTS from '../../../constants/appConstants';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/commonDataConstants';
import { createMemoryHistory } from 'history';
import { FETCH_SIDEMENU_REQUEST } from '../../../store/common/actionTypes';
import { PROTECTED_ROUTES } from '../../../constants/route';

const { ROLES } = APPCONSTANTS;
const mockStore = configureMockStore();
const { MOCK_SIDEMENU } = MOCK_DATA_CONSTANTS;

jest.mock('../../../components/loader/Loader', () => () => <div data-testid='loader-component' />);

const initialState = {
  user: {
    user: { role: ROLES.SUPER_ADMIN, country: { id: 1 } }
  },
  region: {
    loading: false
  },
  district: {
    loading: false
  },
  chiefdom: {
    loading: false
  },
  healthFacility: {
    loading: false,
    clinicalWorkflowLoading: false
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
    loading: false,
    sideMenu: {
      list: MOCK_SIDEMENU[0]
    }
  }
};

jest.mock('../../../global/sessionStorageServices', () => ({
  getItem: () => '1'
}));

const renderComponent = (store: any, mockPath: string, route: string) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[mockPath]}>
        <Route path={route}>
          <SideMenu />
        </Route>
      </MemoryRouter>
    </Provider>
  );
};
const history = createMemoryHistory();

describe('SideMenu', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch sidemenu if sidemenu list not available', () => {
    const localStore = mockStore({
      ...initialState,
      common: {
        ...initialState.common,
        sideMenu: { list: [] }
      }
    });
    const { unmount } = renderComponent(localStore, '/region/2/3', PROTECTED_ROUTES.region);
    const actions = localStore.getActions();
    const fetchSideMenuActionType = actions.find((action) => action.type === FETCH_SIDEMENU_REQUEST);
    expect(fetchSideMenuActionType).toBeTruthy();
    fetchSideMenuActionType.payload.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(fetchSideMenuActionType.payload, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
    unmount();
  });
  it('should fetch sidemenu if sidemenu list is undefined', () => {
    const localStore = mockStore({
      ...initialState,
      common: {
        ...initialState.common,
        sideMenu: { list: undefined }
      }
    });
    const { unmount } = renderComponent(localStore, '/region/2/3', PROTECTED_ROUTES.region);
    const actions = localStore.getActions();
    const fetchSideMenuActionType = actions.find((action) => action.type === FETCH_SIDEMENU_REQUEST);
    expect(fetchSideMenuActionType).toBeTruthy();
    fetchSideMenuActionType.payload.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(fetchSideMenuActionType.payload, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
    unmount();
  });
  it('Should render the SideMenu component', () => {
    const store = mockStore(initialState);
    const mockPath = '/region/2/3';
    history.push(mockPath);
    const { getByTestId, unmount } = renderComponent(store, mockPath, PROTECTED_ROUTES.region);
    expect(getByTestId('side-menu-component')).toBeInTheDocument();
    unmount();
  });
  it('should render the Loader component if common loading is true', () => {
    const localStore = mockStore({
      ...initialState,
      common: {
        ...initialState.common,
        loading: true
      }
    });
    const { getByTestId, unmount } = renderComponent(localStore, '/region/2/3', PROTECTED_ROUTES.region);
    expect(getByTestId('loader-component')).toBeInTheDocument();
    unmount();
  });
  it('should not render the Loader component if other store loading is true', () => {
    const localStore = mockStore({
      ...initialState,
      region: {
        loading: true
      }
    });
    const { queryByTestId, unmount } = renderComponent(localStore, '/region/2/3', PROTECTED_ROUTES.region);
    expect(queryByTestId('loader-component')).not.toBeInTheDocument();
    unmount();
  });
  it('should render region details for region admin', () => {
    const localStore = mockStore({
      ...initialState,
      common: {
        ...initialState.common,
        sideMenu: {
          list: {
            BY_REGION_DETAILS: [
              {
                displayName: 'Region',
                route: PROTECTED_ROUTES.region,
                name: 'REGION',
                order: 1
              },
              {
                name: 'REGION_CUSTOMIZATION',
                order: 2,
                route: PROTECTED_ROUTES.customizationByRegion,
                displayName: 'Region Customization'
              }
            ]
          }
        }
      },
      user: {
        user: { role: ROLES.REGION_ADMIN, country: { id: 1 } }
      }
    });
    const { getByTestId, unmount } = renderComponent(localStore, '/region/2/3', PROTECTED_ROUTES.region);
    expect(getByTestId('side-menu-component')).toBeInTheDocument();
    unmount();
  });

  it('should get countryId from sessionStorage if redux country is not available', () => {
    const localStore = mockStore({
      ...initialState,
      user: {
        user: { country: null }
      },
      common: {
        ...initialState.common,
        sideMenu: {
          list: {
            BY_DISTRICT: [
              {
                name: 'DISTRICT_SUMMARY',
                order: 1,
                route: PROTECTED_ROUTES.districtSummary,
                displayName: 'County',
                disabled: true
              }
            ]
          }
        }
      }
    });
    sessionStorage.setItem(APPCONSTANTS.COUNTRY_ID, '1');
    const { unmount, getByTestId } = renderComponent(localStore, '/district/2/3', PROTECTED_ROUTES.districtSummary);
    expect(getByTestId('side-menu-component')).toBeInTheDocument();
    expect(sessionStorage.getItem(APPCONSTANTS.COUNTRY_ID)).toBe('1');
    unmount();
  });

  it('should fetch sidemenu for region admin with sessionStorage value', () => {
    const localStore = mockStore({
      ...initialState,
      user: {
        user: { country: null, role: ROLES.REGION_ADMIN }
      },
      common: {
        ...initialState.common,
        sideMenu: {
          list: {}
        }
      }
    });
    const { unmount } = renderComponent(localStore, '/district/2/3', PROTECTED_ROUTES.districtSummary);
    const actions = localStore.getActions();
    const fetchSideMenuActionType = actions.find((action) => action.type === FETCH_SIDEMENU_REQUEST);
    expect(fetchSideMenuActionType).toBeTruthy();
    fetchSideMenuActionType.payload.failureCb({ message: 'error' });
    const failureCbSpy = jest.spyOn(fetchSideMenuActionType.payload, 'failureCb');
    waitFor(() => {
      expect(failureCbSpy).toHaveBeenCalled();
    });
    unmount();
  });

  it('should get handle menu items without route', () => {
    const localStore = mockStore({
      ...initialState,
      user: {
        user: { country: null }
      },
      common: {
        ...initialState.common,
        sideMenu: {
          list: {
            BY_REGION_DETAILS: [
              {
                name: 'DISTRICT_SUMMARY',
                order: 1,
                displayName: 'County',
                disabled: true
              }
            ]
          }
        }
      }
    });
    sessionStorage.setItem(APPCONSTANTS.COUNTRY_ID, '1');
    const { unmount, getByTestId } = renderComponent(localStore, '/district/2/3', PROTECTED_ROUTES.districtSummary);
    expect(getByTestId('side-menu-component')).toBeInTheDocument();
    expect(sessionStorage.getItem(APPCONSTANTS.COUNTRY_ID)).toBe('1');
    unmount();
  });
});
