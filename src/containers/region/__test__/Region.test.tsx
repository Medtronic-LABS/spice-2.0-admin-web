import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import Region from '../Region';
import { mockRegionDetailList } from '../../../tests/mockData/regionDataConstants';
import APPCONSTANTS from '../../../constants/appConstants';

// Mock the action creators and toast utility
jest.mock('../../../store/region/actions', () => ({
  downloadFileRequest: jest.fn(),
  fetchCountryDetailReq: jest.fn(),
  regionDetailsRequest: jest.fn(),
  uploadFileRequest: jest.fn()
}));
jest.mock('../../../utils/toastCenter', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

// Define the initial state based on the store definition
const initialState = {
  region: {
    regions: [],
    total: 0,
    loading: false,
    loadingMore: false,
    error: null,
    detail: {
      id: '1',
      tenantId: '11',
      name: 'Kenya',
      list: mockRegionDetailList,
      appTypes: [],
      total: 0
    },
    isClientRegistryEnabled: undefined,
    file: {},
    uploading: false,
    downloading: false
  },
  user: {
    role: 'ADMIN'
  },
  common: {
    labelName: null
  }
};

// Create a function to return a configured mock store
const mockStore = configureStore([]);
const getMockStore = (stateOverrides: any) => mockStore({ ...initialState, ...stateOverrides });

// Helper function to render the component with necessary providers
const renderWithProviders = (ui: any, { store }: any) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

// Add mock for DragDropFiles component if it's used in Region
jest.mock('../../../components/dragDropFiles/DragDropFiles', () => ({
  __esModule: true,
  default: () => <div data-testid='drag-drop-files'>Mock DragDropFiles</div>
}));

jest.mock('../../../../assets/images/download.svg', () => ({
  default: () => <div data-testid='download-icon'>Mock Download Icon</div>
}));
jest.mock('../../../../assets/images/upload_blue.svg', () => ({
  default: () => <div data-testid='upload-icon'>Mock Upload Icon</div>
}));

describe('Region Component', () => {
  let store: any;
  beforeEach(() => {
    store = getMockStore({});
    store.dispatch = jest.fn();
  });

  it('renders loading indicator when loading', () => {
    store = getMockStore({ region: { ...initialState.region, loading: true } });
    const { getByTestId } = renderWithProviders(<Region />, { store });
    expect(getByTestId('loader')).toBeInTheDocument();
  });

  it('fetches region details on mount', () => {
    renderWithProviders(<Region />, { store });
    expect(screen.getByText('Region')).toBeInTheDocument();
  });
  it('fetches without region details on mount', () => {
    store = getMockStore({ region: { ...initialState.region, detail: { list: [] } } });
    const { getByTestId } = renderWithProviders(<Region />, { store });
    expect(getByTestId('drag-drop-files')).toBeInTheDocument();
  });
  it('readonly region details on mount', () => {
    store = getMockStore({ region: { ...initialState.region, user: { role: APPCONSTANTS.ROLES.REGION_ADMIN } } });
    const { getByTestId } = renderWithProviders(<Region />, { store });
    screen.debug(undefined, Infinity);
  });
});
