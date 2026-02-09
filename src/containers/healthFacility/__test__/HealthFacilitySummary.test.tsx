import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import HealthFacilitySummary from '../HealthFacilitySummary';
import * as healthFacilityActions from '../../../store/healthFacility/actions';

const mockStore = configureStore([]);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    healthFacilityId: '1',
    tenantId: '1',
    districtId: undefined,
    chiefdomId: undefined
  })
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => () => ({
  isCommunity: false,
  appTypes: [],
  district: { s: 'County', p: 'Counties' },
  chiefdom: { s: 'Sub County', p: 'Sub Counties' },
  village: { s: 'Village', p: 'Villages' },
  healthFacility: { s: 'Health Facility', p: 'Health Facilities' },
  userList: { activeToogle: { available: true } }
}));

jest.mock('../../../hooks/tablePagination', () => {
  const listParams = { page: 1, rowsPerPage: 10, searchTerm: '' };
  return {
    useTablePaginationHook: () => ({
      listParams,
      handleSearch: jest.fn(),
      handlePage: jest.fn()
    })
  };
});

jest.mock('../../../global/sessionStorageServices', () => ({
  getItem: jest.fn(() => '1')
}));

jest.mock('../../../utils/toastCenter', () => ({
  __esModule: true,
  default: { error: jest.fn(), success: jest.fn(), info: jest.fn() },
  getErrorToastArgs: jest.fn(() => [])
}));

jest.mock('../../../components/loader/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>
}));

jest.mock('../../../components/detailCard/DetailCard', () => ({
  __esModule: true,
  default: ({ header, buttonLabel, onButtonClick, children, onSearch, isSearch }: any) => (
    <div data-testid="detail-card">
      <span>{header}</span>
      {buttonLabel && (
        <button type="button" onClick={onButtonClick} data-testid="detail-card-button">
          {buttonLabel}
        </button>
      )}
      {isSearch && <input data-testid="detail-card-search" onChange={(e) => onSearch?.(e.target.value)} />}
      {children}
    </div>
  )
}));

jest.mock('../../../components/customTable/CustomTable', () => ({
  __esModule: true,
  default: ({ columnsDef, rowData }: any) => (
    <table data-testid="custom-table">
      <thead>
        <tr>
          {columnsDef?.map((col: any) => (
            <th key={col.id}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(rowData || []).map((row: any, i: number) => (
          <tr key={i}>
            <td>{row.firstName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}));

jest.mock('../../../components/modal/ModalForm', () => ({
  __esModule: true,
  default: ({ show, title, handleCancel }: any) =>
    show ? (
      <div data-testid="modal-form">
        <span>{title}</span>
        <button type="button" onClick={handleCancel} data-testid="modal-cancel">
          Cancel
        </button>
      </div>
    ) : null
}));

jest.mock('../../../components/userForm/UserForm', () => () => <div data-testid="user-form">UserForm</div>);

jest.mock('../../createHealthFacility/HealthFacilityDetailsForm', () => ({
  __esModule: true,
  default: () => <div data-testid="health-facility-details-form">HealthFacilityDetailsForm</div>
}));

jest.mock('../../../components/customTable/ConfirmationModalPopup', () => ({
  __esModule: true,
  default: () => <div data-testid="confirmation-modal">ConfirmationModalPopup</div>
}));

const defaultStoreState = {
  healthFacility: {
    healthFacility: {
      id: 1,
      name: 'Test HF',
      type: 'Type A',
      district: { name: 'District 1' },
      chiefdom: { name: 'Chiefdom 1' },
      address: 'Address 1',
      cityName: 'City 1',
      latitude: '0',
      longitude: '0',
      postalCode: '123',
      language: 'English',
      linkedVillages: [],
      clinicalWorkflows: [],
      customizedWorkflows: [],
      peerSupervisors: []
    },
    loading: false,
    hfUserDetailLoading: false,
    clinicalWorkflowList: []
  },
  user: {
    user: {
      role: 'SUPER_ADMIN',
      country: { id: 1 }
    },
    userRoles: {}
  }
};

describe('HealthFacilitySummary', () => {
  let store: ReturnType<typeof mockStore>;

  const renderComponent = (state: Record<string, unknown> = defaultStoreState) => {
    store = mockStore(state);
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <HealthFacilitySummary />
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Loader when loading is true', () => {
    renderComponent({
      ...defaultStoreState,
      healthFacility: {
        ...defaultStoreState.healthFacility,
        healthFacility: defaultStoreState.healthFacility.healthFacility,
        loading: true,
        hfUserDetailLoading: false,
        clinicalWorkflowList: []
      }
    });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders Loader when hfUserDetailLoading is true', () => {
    renderComponent({
      ...defaultStoreState,
      healthFacility: {
        ...defaultStoreState.healthFacility,
        healthFacility: defaultStoreState.healthFacility.healthFacility,
        loading: false,
        hfUserDetailLoading: true,
        clinicalWorkflowList: []
      }
    });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('does not render Loader when loading and hfUserDetailLoading are false', () => {
    renderComponent();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('renders Health Facility Summary DetailCard with header and Edit button', () => {
    renderComponent();
    expect(screen.getByText('Health Facility Summary')).toBeInTheDocument();
    expect(screen.getByText('Edit Health Facility')).toBeInTheDocument();
  });

  it('renders summary labels from health facility data', () => {
    renderComponent();
    expect(screen.getByText('Health Facility Name')).toBeInTheDocument();
    expect(screen.getByText('Health Facility Type')).toBeInTheDocument();
    expect(screen.getByText('County')).toBeInTheDocument();
    expect(screen.getByText('Sub County')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Village')).toBeInTheDocument();
    expect(screen.getByText('Latitude')).toBeInTheDocument();
    expect(screen.getByText('Longitude')).toBeInTheDocument();
    expect(screen.getByText('Facility ID (Postal Code)')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Linked Villages')).toBeInTheDocument();
  });

  it('renders summary values when health facility has data', () => {
    renderComponent();
    expect(screen.getByText('Test HF')).toBeInTheDocument();
    expect(screen.getByText('District 1')).toBeInTheDocument();
    expect(screen.getByText('Chiefdom 1')).toBeInTheDocument();
  });

  it('renders Users DetailCard with Add User button', () => {
    renderComponent();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getAllByText('Add User').length).toBeGreaterThanOrEqual(1);
  });

  it('dispatches fetchHFSummaryRequest on mount', () => {
    const fetchSpy = jest.spyOn(healthFacilityActions, 'fetchHFSummaryRequest');
    renderComponent();
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('dispatches fetchHFUserListRequest on mount', () => {
    const fetchSpy = jest.spyOn(healthFacilityActions, 'fetchHFUserListRequest');
    renderComponent();
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('dispatches clearSupervisorList and clearVillageHFList on unmount', () => {
    const clearSupervisorSpy = jest.spyOn(healthFacilityActions, 'clearSupervisorList');
    const clearVillageSpy = jest.spyOn(healthFacilityActions, 'clearVillageHFList');
    const { unmount } = renderComponent();
    unmount();
    expect(clearSupervisorSpy).toHaveBeenCalled();
    expect(clearVillageSpy).toHaveBeenCalled();
  });

  it('renders CustomTable with expected column headers', () => {
    renderComponent();
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('ROLE')).toBeInTheDocument();
    expect(screen.getByText('EMAIL ID')).toBeInTheDocument();
    expect(screen.getByText('GENDER')).toBeInTheDocument();
    expect(screen.getByText('CONTACT NUMBER')).toBeInTheDocument();
  });

  it('opens Edit Health Facility modal when Edit button is clicked', () => {
    renderComponent();
    const editButtons = screen.getAllByTestId('detail-card-button');
    const hfSummaryEditButton = editButtons.find((btn) => btn.textContent === 'Edit Health Facility');
    expect(hfSummaryEditButton).toBeTruthy();
    fireEvent.click(hfSummaryEditButton!);
    expect(screen.getAllByText('Edit Health Facility').length).toBeGreaterThanOrEqual(2);
  });

  it('renders ConfirmationModalPopup', () => {
    renderComponent();
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
  });
});
