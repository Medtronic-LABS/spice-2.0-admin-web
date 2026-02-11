import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom';
import Region from '../Region';
import { mockRegionDetailList } from '../../../tests/mockData/regionDataConstants';
import APPCONSTANTS from '../../../constants/appConstants';
import * as regionActions from '../../../store/region/actions';

// Mock the action creators to return plain objects (required by redux-mock-store)
jest.mock('../../../store/region/actions', () => ({
  downloadFileRequest: jest.fn((payload: any) => ({ type: 'DOWNLOAD_FILE_REQUEST', ...payload })),
  fetchCountryDetailReq: jest.fn((payload: any) => ({ type: 'FETCH_COUNTRY_DETAILS_REQUEST', ...payload })),
  regionDetailsRequest: jest.fn((payload: any) => ({ type: 'FETCH_REGION_DETAIL_REQUEST', ...payload })),
  uploadFileRequest: jest.fn((payload: any) => ({ type: 'UPLOAD_FILE_REQUEST', ...payload }))
}));
jest.mock('../../../utils/toastCenter', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ regionId: '1', tenantId: '2' })
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => () => ({
  isCommunity: false,
  region: { s: 'Region', p: 'Regions' },
  district: { s: 'County', p: 'Counties' },
  chiefdom: { s: 'Sub County', p: 'Sub Counties' },
  healthFacility: { s: 'Health Facility', p: 'Health Facilities' },
  village: { s: 'Village', p: 'Villages' },
  subVillage: { s: 'Subvillage', p: 'Subvillages' }
}));

jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: () => ({
    listParams: { page: 1, rowsPerPage: 10, searchTerm: '' },
    handleSearch: jest.fn(),
    handlePage: jest.fn()
  })
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
      total: mockRegionDetailList.length
    },
    isClientRegistryEnabled: undefined,
    file: {},
    uploading: false,
    downloading: false
  },
  user: {
    user: {
      role: 'ADMIN',
      appTypes: []
    }
  },
  common: {
    labelName: null
  }
};

// Create a function to return a configured mock store
const mockStore = configureStore([]);
const getMockStore = (stateOverrides: any) => mockStore({ ...initialState, ...stateOverrides });

// Helper function to render the component with necessary providers
const renderWithProviders = (ui: React.ReactElement, { store }: { store: any }) => {
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

jest.mock('../../../assets/images/download.svg', () => ({
  default: () => <div data-testid='download-icon'>Mock Download Icon</div>
}));
jest.mock('../../../assets/images/upload_blue.svg', () => ({
  default: () => <div data-testid='upload-icon'>Mock Upload Icon</div>
}));

describe('Region Component', () => {
  let store: any;
  beforeEach(() => {
    store = getMockStore({});
    store.dispatch = jest.fn();
    jest.clearAllMocks();
  });

  it('renders loading indicator when loading', () => {
    store = getMockStore({ region: { ...initialState.region, loading: true } });
    const { getByTestId } = renderWithProviders(<Region />, { store });
    expect(getByTestId('loader')).toBeInTheDocument();
  });

  it('renders Loader when uploading is true', () => {
    store = getMockStore({ region: { ...initialState.region, uploading: true } });
    const { getByTestId } = renderWithProviders(<Region />, { store });
    expect(getByTestId('loader')).toBeInTheDocument();
  });

  it('renders Loader when downloading is true', () => {
    store = getMockStore({ region: { ...initialState.region, downloading: true } });
    const { getByTestId } = renderWithProviders(<Region />, { store });
    expect(getByTestId('loader')).toBeInTheDocument();
  });

  it('fetches region details on mount', () => {
    renderWithProviders(<Region />, { store });
    expect(screen.getByText('Region')).toBeInTheDocument();
  });

  it('dispatches regionDetailsRequest when regionId is present on mount', () => {
    renderWithProviders(<Region />, { store });
    expect(regionActions.regionDetailsRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        countryId: 1,
        failureCb: expect.any(Function)
      })
    );
  });

  it('dispatches fetchCountryDetailReq when regionId and tenantId present and no regionDetailsId', () => {
    store = getMockStore({
      region: {
        ...initialState.region,
        detail: { ...initialState.region.detail, id: undefined }
      }
    });
    renderWithProviders(<Region />, { store });
    expect(regionActions.fetchCountryDetailReq).toHaveBeenCalledWith({
      id: '1',
      tenantId: '2'
    });
  });

  it('dispatches regionDetailsRequest with failureCb in payload', () => {
    renderWithProviders(<Region />, { store });
    const call = (regionActions.regionDetailsRequest as jest.Mock).mock.calls[0][0];
    expect(call).toHaveProperty('failureCb');
    expect(typeof call.failureCb).toBe('function');
  });

  it('fetches without region details on mount', () => {
    store = getMockStore({
      region: {
        ...initialState.region,
        detail: { ...initialState.region.detail, list: [], total: 0 }
      }
    });
    const { getByTestId } = renderWithProviders(<Region />, { store });
    expect(getByTestId('drag-drop-files')).toBeInTheDocument();
  });

  it('hides Download and Upload when user role is REGION_ADMIN (read-only)', () => {
    store = getMockStore({
      user: { user: { role: APPCONSTANTS.ROLES.REGION_ADMIN, appTypes: [] } }
    });
    renderWithProviders(<Region />, { store });
    expect(screen.queryByText('Download')).not.toBeInTheDocument();
    expect(screen.queryByText('Upload')).not.toBeInTheDocument();
  });

  it('dispatches downloadFileRequest when Download button is clicked', () => {
    renderWithProviders(<Region />, { store });
    const buttons = screen.getAllByTestId('detail-card-button');
    const downloadButton = buttons.find((btn) => btn.textContent?.includes('Download')) ?? buttons[1];
    fireEvent.click(downloadButton);
    expect(regionActions.downloadFileRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        countryId: 1,
        successCb: expect.any(Function),
        failureCb: expect.any(Function)
      })
    );
  });

  it('opens upload modal when Upload is clicked', async () => {
    renderWithProviders(<Region />, { store });
    const buttons = screen.getAllByTestId('detail-card-button');
    const uploadButton = buttons.find((btn) => btn.textContent?.includes('Upload')) ?? buttons[0];
    fireEvent.click(uploadButton);
    await waitFor(() => {
      expect(screen.getByText('Upload Region Data')).toBeInTheDocument();
    });
  });

  it('closes upload modal when close icon is clicked', async () => {
    renderWithProviders(<Region />, { store });
    const buttons = screen.getAllByTestId('detail-card-button');
    const uploadButton = buttons.find((btn) => btn.textContent?.includes('Upload')) ?? buttons[0];
    fireEvent.click(uploadButton);
    await waitFor(() => {
      expect(screen.getByText('Upload Region Data')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByAltText('close'));
    await waitFor(() => {
      expect(screen.queryByText('Upload Region Data')).not.toBeInTheDocument();
    });
  });

  it('renders table with expected column headers', () => {
    renderWithProviders(<Region />, { store });
    expect(screen.getByRole('columnheader', { name: 'County' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Sub County' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Village' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Subvillage' })).toBeInTheDocument();
  });

  it('does not render Loader when loading, uploading and downloading are false', () => {
    renderWithProviders(<Region />, { store });
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('shows Download Template button when region list is empty and user is not read-only', () => {
    store = getMockStore({
      region: {
        ...initialState.region,
        detail: { ...initialState.region.detail, list: [], total: 0 }
      }
    });
    renderWithProviders(<Region />, { store });
    expect(screen.getByText('Download Template')).toBeInTheDocument();
  });

  it('dispatches downloadFileRequest when Download Template button is clicked in empty state', () => {
    store = getMockStore({
      region: {
        ...initialState.region,
        detail: { ...initialState.region.detail, list: [], total: 0 }
      }
    });
    renderWithProviders(<Region />, { store });
    fireEvent.click(screen.getByText('Download Template'));
    expect(regionActions.downloadFileRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        countryId: 1,
        successCb: expect.any(Function),
        failureCb: expect.any(Function)
      })
    );
  });

  it('hides Download Template button when region list is empty and user role is REGION_ADMIN', () => {
    store = getMockStore({
      user: { user: { role: APPCONSTANTS.ROLES.REGION_ADMIN, appTypes: [] } },
      region: {
        ...initialState.region,
        detail: { ...initialState.region.detail, list: [], total: 0 }
      }
    });
    renderWithProviders(<Region />, { store });
    expect(screen.queryByText('Download Template')).not.toBeInTheDocument();
  });

  it('disables Download Template button when downloading is true', () => {
    store = getMockStore({
      region: {
        ...initialState.region,
        detail: { ...initialState.region.detail, list: [], total: 0 },
        downloading: true
      }
    });
    renderWithProviders(<Region />, { store });
    const downloadTemplateButton = screen.getByText('Download Template').closest('button');
    expect(downloadTemplateButton).toBeDisabled();
  });
});
