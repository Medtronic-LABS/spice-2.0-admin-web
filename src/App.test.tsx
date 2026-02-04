import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from './App';

const mockStore = configureStore();

// Mock react-leaflet to avoid ES module issues
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  useMap: () => ({
    setView: jest.fn(),
    getCenter: () => ({ lat: 0, lng: 0 })
  }),
  useMapEvent: jest.fn(),
  useMapEvents: jest.fn()
}));

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
  ReactComponent: () => <div>Logo</div>
}));

jest.mock('./components/header/Header', () => () => <div data-testid='header'>Mock Header</div>);

jest.mock('./hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    isCommunity: false,
    appTypes: []
  })
}));

jest.mock('./containers/terms/TermsAndConditions', () => () => <div data-testid='terms-and-conditions'>Terms and Conditions</div>);

jest.mock('./components/errorBoundary/ErrorBoundary', () => ({ children }: any) => <div data-testid='error-boundary'>{children}</div>);

jest.mock('./components/breadcrumb/Breadcrumb', () => () => <div data-testid='breadcrumb'>Breadcrumb</div>);

describe('App Component', () => {
  beforeAll(() => {
    process.env.REACT_APP_GA_TRACKING_ID = 'G-12345ABCDE';
  });

  const initialState = {
    user: {
      isLoggedIn: true
    },
    region: {
      regions: [],
      total: 0,
      loading: false,
      loadingMore: false,
      error: null,
      detail: {
        id: '',
        tenantId: '',
        name: '',
        list: [],
        appTypes: [],
        total: 0
      },
      isClientRegistryEnabled: undefined,
      file: {},
      uploading: false,
      downloading: false
    },
    district: {
      district: {
        name: '',
        id: '',
        tenantId: '',
        maxNoOfUsers: '',
        users: [],
        updatedAt: '',
        country: {
          countryCode: '',
          tenantId: '',
          id: ''
        }
      },
      districtList: [],
      allDistricts: [],
      districtOptions: [],
      admins: [],
      total: 0,
      loading: false,
      dashboardList: [],
      clinicalWorkflows: [],
      clinicalWorkflowsCount: 0,
      loadingMore: false,
      loadingOptions: false,
      error: null
    },
    common: {
      labelName: {
        region: {
          s: 'Region',
          p: 'Regions'
        },
        healthFacility: {
          s: 'Health Facility',
          p: 'Health Facilities'
        },
        district: {
          s: 'County',
          p: 'Counties'
        },
        chiefdom: { s: 'Sub County', p: 'Sub Counties' }
      }
    }
  };

  const store = mockStore(initialState);

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
        },
        region: {
          ...initialState.region
        },
        district: {
          ...initialState.district
        },
        common: {
          ...initialState.common
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
