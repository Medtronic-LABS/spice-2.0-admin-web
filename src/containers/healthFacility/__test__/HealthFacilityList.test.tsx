import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router, MemoryRouter, Route } from 'react-router-dom';
import HealthFacilityList from '../HealthFacilityList';
import * as healthFacilityActions from '../../../store/healthFacility/actions';
import { mockHealthFacilityList } from '../../../tests/mockData/healthFacilityConstants';
import { PROTECTED_ROUTES } from '../../../constants/route';
import { FETCH_HEALTH_FACILITY_LIST_REQUEST } from '../../../store/healthFacility/actionTypes';
import { FETCH_DISTRICT_LIST_REQUEST } from '../../../store/district/actionTypes';
import * as districtActions from '../../../store/district/actions';

// Mock store setup
const mockStore = configureStore([]);
let store: any;

const mockHistoryPush = jest.fn();

// Mock react-leaflet to avoid ES module issues
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  useMap: () => ({ setView: jest.fn(), getCenter: () => ({ lat: 0, lng: 0 }) }),
  useMapEvent: jest.fn(),
  useMapEvents: jest.fn()
}));
jest.mock('leaflet/dist/leaflet.css', () => ({}));

jest.mock('../../../assets/images/edit.svg', () => ({
  ReactComponent: () => <svg data-testid="edit-icon" />
}));
jest.mock('../../../components/userForm/UserForm', () => () => {
  return <div data-testid="mock-userForm">userForm</div>;
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));
jest.mock('../../../hooks/useCountryId', () => () => 1);
let mockIsCommunity = false;
jest.mock('../../../hooks/appTypeBasedConfigs', () => () => ({
  isCommunity: mockIsCommunity,
  appTypes: [],
  district: { s: 'County', p: 'Counties' },
  chiefdom: { s: 'Sub County', p: 'Sub Counties' },
  healthFacility: { s: 'Health Facility', p: 'Health Facilities' },
  filterComponent: { filterIcon: { available: true } }
}));
jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: () => ({
    listParams: { page: 1, rowsPerPage: 10, searchTerm: '' },
    handleSearch: jest.fn(),
    handlePage: jest.fn()
  })
}));

describe('HealthFacilityList Component', () => {
  beforeEach(() => {
    mockHistoryPush.mockClear();
    store = mockStore({
      healthFacility: {
        healthFacilityList: [],
        hfTotal: 0,
        loading: false,
        hfTypes: [],
        chiefdomList: []
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          country: { id: 1, appTypes: [] },
          appTypes: []
        }
      },
      district: {
        districtList: []
      },
      common: {
        labelName: null
      }
    });
  });
  test('fetches health facility list on load', () => {
    const fetchHFListRequestSpy = jest.spyOn(healthFacilityActions, 'fetchHFListRequest');

    render(
      <Provider store={store}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    expect(fetchHFListRequestSpy).toHaveBeenCalled();
  });

  test('should call edit and show success message on successful deletion', async () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: mockHealthFacilityList,
        hfTotal: mockHealthFacilityList?.length ?? 0,
        loading: false,
        hfTypes: [],
        chiefdomList: []
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          country: { id: 1, appTypes: [] },
          appTypes: []
        }
      },
      district: { districtList: [] },
      common: {
        labelName: null
      }
    });

    const { getAllByTestId } = render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );
    const [editButton] = getAllByTestId('edit-icon');
    await waitFor(() => {
      fireEvent.click(editButton);
    });

    expect(screen.getByText('Health Facility')).toBeInTheDocument();
    // Clean up mock implementations
    jest.clearAllMocks();
  });
  it('navigates to the correct route on row click when row is active', () => {
    const listWithActiveRow = mockHealthFacilityList.map((item, i) => ({
      ...item,
      active: true
    }));
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: listWithActiveRow,
        hfTotal: listWithActiveRow.length,
        loading: false,
        hfTypes: [],
        chiefdomList: []
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          country: { id: 1, appTypes: [] },
          appTypes: []
        }
      },
      district: { districtList: [] },
      common: { labelName: null }
    });
    const firstRow = listWithActiveRow[0];
    const expectedRoute = PROTECTED_ROUTES.healthFacilitySummary
      .replace(':healthFacilityId', String(firstRow.id))
      .replace(':tenantId', String(firstRow.tenantId));

    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    const row = screen.getByTestId(`row-${firstRow.id}`);
    fireEvent.click(row);

    expect(mockHistoryPush).toHaveBeenCalledWith(expectedRoute);
  });
  it('dispatches fetchHFListRequest with failureCb in payload', () => {
    const fetchHFListRequestSpy = jest.spyOn(healthFacilityActions, 'fetchHFListRequest');

    render(
      <Provider store={store}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    expect(fetchHFListRequestSpy).toHaveBeenCalled();
    const lastCall = fetchHFListRequestSpy.mock.calls[fetchHFListRequestSpy.mock.calls.length - 1];
    const payload = lastCall[0];
    expect(payload).toHaveProperty('failureCb');
    expect(typeof payload.failureCb).toBe('function');
  });
  it('renders the Loader when loading is true', () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: [],
        hfTotal: 0,
        loading: true,
        hfTypes: [],
        chiefdomList: []
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          country: { id: 1, appTypes: [] },
          appTypes: []
        }
      },
      district: { districtList: [] },
      common: {
        labelName: null
      }
    });

    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('does not render the Loader when loading is false', () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: mockHealthFacilityList,
        hfTotal: mockHealthFacilityList?.length ?? 0,
        loading: false,
        hfTypes: [],
        chiefdomList: []
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          country: { id: 1, appTypes: [] },
          appTypes: []
        }
      },
      district: { districtList: [] },
      common: {
        labelName: null
      }
    });

    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );
    expect(screen.queryByTestId('loader')).toBeNull(); // Asserts Loader is not in the DOM
  });
  it('should create health facility', async () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: mockHealthFacilityList,
        hfTotal: mockHealthFacilityList?.length ?? 0,
        loading: false,
        hfTypes: [],
        chiefdomList: []
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          country: { id: 1, appTypes: [] },
          appTypes: []
        }
      },
      district: { districtList: [] },
      common: {
        labelName: null
      }
    });
    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    const createButton = screen.getByTestId('detail-card-button');
    fireEvent.click(createButton);
  });

  it('dispatches fetchHFTypesRequest when hfTypesList is empty on mount', () => {
    const fetchHFTypesRequestSpy = jest.spyOn(healthFacilityActions, 'fetchHFTypesRequest');

    render(
      <Provider store={store}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    expect(fetchHFTypesRequestSpy).toHaveBeenCalledWith({});
  });

  it('dispatches fetchDistrictListRequest when districtList is empty on mount', () => {
    render(
      <Provider store={store}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions.some((a: { type: string }) => a.type === FETCH_DISTRICT_LIST_REQUEST)).toBe(true);
  });

  it('dispatches clearHFList and clearDistrictList on unmount', () => {
    const clearHFListSpy = jest.spyOn(healthFacilityActions, 'clearHFList');
    const clearDistrictListSpy = jest.spyOn(districtActions, 'clearDistrictList');

    const { unmount } = render(
      <Provider store={store}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    unmount();

    expect(clearHFListSpy).toHaveBeenCalled();
    expect(clearDistrictListSpy).toHaveBeenCalled();
  });

  it('navigates to create health facility route when Add is clicked with region params', () => {
    mockHistoryPush.mockClear();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1/2/health-facility']}>
          <Route path="/region/:regionId/:tenantId/health-facility">
            <HealthFacilityList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const createButton = screen.getByTestId('detail-card-button');
    fireEvent.click(createButton);

    const expectedPath = PROTECTED_ROUTES.createHealthFacilityByRegion
      .replace(':tenantId', '2')
      .replace(/:regionId/, '1');
    expect(mockHistoryPush).toHaveBeenCalledWith(expectedPath);
  });

  it('opens deactivate confirmation modal when active toggle is clicked on active facility', async () => {
    mockIsCommunity = true;
    const listWithActiveRow = mockHealthFacilityList.map((item) => ({ ...item, active: true }));
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: listWithActiveRow,
        hfTotal: listWithActiveRow.length,
        loading: false,
        hfTypes: [],
        chiefdomList: []
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          country: { id: 1, appTypes: [] },
          appTypes: []
        }
      },
      district: { districtList: [] },
      common: { labelName: null }
    });

    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    const activeCheckbox = checkboxes.find((el) => (el as HTMLInputElement).checked);
    if (activeCheckbox) {
      fireEvent.click(activeCheckbox);
    }

    await waitFor(() => {
      expect(screen.getByText('Deactivate Health Facility')).toBeInTheDocument();
    });
    mockIsCommunity = false;
  });

  it('renders table with expected column headers', () => {
    const localStore = mockStore({
      healthFacility: {
        healthFacilityList: mockHealthFacilityList,
        hfTotal: mockHealthFacilityList.length,
        loading: false,
        hfTypes: [],
        chiefdomList: []
      },
      user: {
        user: {
          role: 'SUPER_ADMIN',
          country: { id: 1, appTypes: [] },
          appTypes: []
        }
      },
      district: { districtList: [] },
      common: { labelName: null }
    });

    render(
      <Provider store={localStore}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /type/i })).toBeInTheDocument();
  });

  it('renders DetailCard with Add button and search', () => {
    render(
      <Provider store={store}>
        <Router>
          <HealthFacilityList />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('detail-card-button')).toBeInTheDocument();
    expect(screen.getByText('Health Facility')).toBeInTheDocument();
  });
});
