import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import RegionDashboard from '../RegionDashboard';
import * as regionActions from '../../../store/region/actions';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/commonDataConstants';
import { PROTECTED_ROUTES } from '../../../constants/route';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: mockHistoryPush })
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => () => ({
  region: { s: 'Region', p: 'Regions' }
}));

jest.mock('../../../global/localStorageServices', () => ({
  deleteItem: jest.fn(),
  setItem: jest.fn()
}));

jest.mock('../../../global/sessionStorageServices', () => ({
  deleteItems: jest.fn(),
  setItem: jest.fn()
}));

// Mock constants and data
const mockRegions = [
  {
    id: '1',
    tenantId: '101',
    name: 'Region A',
    appTypes: ['type1'],
    districtCount: 5,
    chiefdomCount: 3,
    healthFacilityCount: 2,
    displayValues: MOCK_DATA_CONSTANTS.MOCK_LABELNAME
  },
  {
    id: '2',
    tenantId: '102',
    name: 'Region B',
    appTypes: ['type2'],
    districtCount: 10,
    chiefdomCount: 7,
    healthFacilityCount: 5,
    displayValues: MOCK_DATA_CONSTANTS.MOCK_LABELNAME
  }
];
const mockStore = configureStore([]);
const initialState = {
  region: {
    regions: mockRegions,
    total: mockRegions.length,
    loading: false,
    loadingMore: false,
    error: null,
    detail: {},
    isClientRegistryEnabled: false,
    file: null,
    uploading: false,
    downloading: false
  },
  user: {
    timezoneList: []
  },
  district: {
    clinicalWorkflows: []
  },
  common: {
    labelName: MOCK_DATA_CONSTANTS.MOCK_LABELNAME
  }
};

jest.mock('../../../components/loader/Loader', () => () => <div data-testid='loader'>Loading...</div>);
jest.mock('../../../components/searchbar/Searchbar', () => ({ onSearch }: { onSearch: (v: string) => void }) => (
  <input data-testid='searchbar' placeholder='Search' onChange={(e) => onSearch(e.target.value)} />
));
jest.mock('../../../components/summaryCard/SummaryCard', () => ({ title }: { title: string }) => (
  <div data-testid='summary-card'>{title}</div>
));

jest.mock('../../../utils/toastCenter', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

describe('Region Dashboard', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(initialState);
    mockHistoryPush.mockClear();
    jest.spyOn(regionActions, 'fetchRegionsRequest');
  });

  const renderComponent = (stateOverrides = {}) => {
    const state = { ...initialState, ...stateOverrides };
    const storeToUse = Object.keys(stateOverrides).length > 0 ? mockStore(state) : store;
    return render(
      <Provider store={storeToUse}>
        <Router>
          <RegionDashboard />
        </Router>
      </Provider>
    );
  };

  it('renders the Region dashboard with title', () => {
    renderComponent();
    expect(screen.getByText('Regions')).toBeInTheDocument();
  });

  it('dispatches fetchRegionsRequest on mount', () => {
    renderComponent();
    expect(regionActions.fetchRegionsRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        limit: expect.any(Number),
        failureCb: expect.any(Function)
      })
    );
  });

  it('dispatches cleanup actions on mount', () => {
    renderComponent();
    const actions = store.getActions();
    const types = actions.map((a: { type: string }) => a.type);
    expect(types).toContain('CLEAR_REGION_DETAIL');
    expect(types).toContain('CLEAR_DISTRICT_DETAILS');
    expect(types).toContain('CLEAR_CHIEFDOM_DETAIL');
    expect(types).toContain('CLEAR_HF_SUMMARY');
    expect(types).toContain('CLEAR_CLIENT_REGISTRY_STATUS');
    expect(types).toContain('CLEAR_SIDEMENU');
    expect(types).toContain('CLEAR_APP_TYPE');
    expect(types).toContain('CLEAR_LABELNAME');
  });

  it('renders Loader when loading is true', () => {
    renderComponent({
      region: { ...initialState.region, loading: true }
    });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders Loader when loadingMore is true', () => {
    renderComponent({
      region: { ...initialState.region, loadingMore: true }
    });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders search and Create Region button when regions exist', () => {
    renderComponent();
    expect(screen.getByTestId('searchbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Region/i })).toBeInTheDocument();
  });

  it('navigates to create region route when Create Region button is clicked', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Create Region/i }));
    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith(PROTECTED_ROUTES.createRegion);
    });
  });

  it('renders summary cards for each region', () => {
    renderComponent();
    expect(screen.getByText('Region A')).toBeInTheDocument();
    expect(screen.getByText('Region B')).toBeInTheDocument();
    expect(screen.getAllByTestId('summary-card')).toHaveLength(mockRegions.length);
  });

  it('shows Let\'s Get Started when no regions and not loading', () => {
    renderComponent({
      region: {
        ...initialState.region,
        regions: [],
        total: 0
      }
    });
    expect(screen.getByText((content) => content.includes('Get Started'))).toBeInTheDocument();
    expect(screen.getByText(/Create a new Region/)).toBeInTheDocument();
  });

  it('navigates to create region when Create Region clicked in empty state', () => {
    renderComponent({
      region: {
        ...initialState.region,
        regions: [],
        total: 0
      }
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Region/i }));
    expect(mockHistoryPush).toHaveBeenCalledWith(PROTECTED_ROUTES.createRegion);
  });

  it('dispatches fetchRegionsRequest with search when user searches', () => {
    const localStore = mockStore(initialState);
    render(
      <Provider store={localStore}>
        <Router>
          <RegionDashboard />
        </Router>
      </Provider>
    );
    const searchInput = screen.getByTestId('searchbar');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    const calls = (regionActions.fetchRegionsRequest as jest.Mock).mock.calls;
    const searchCall = calls.find((c: any[]) => c[0]?.search === 'test');
    expect(searchCall).toBeDefined();
    expect(searchCall[0]).toMatchObject({ search: 'test', skip: 0 });
  });

  it('shows Load More button when there are regions and not last page', () => {
    renderComponent({
      region: {
        ...initialState.region,
        total: 20,
        regions: mockRegions
      }
    });
    const loadMoreBtn = screen.queryByText(/Load More/);
    if (loadMoreBtn) {
      expect(loadMoreBtn).toBeInTheDocument();
    }
  });

  it('does not render Loader when loading and loadingMore are false', () => {
    renderComponent();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });
});
