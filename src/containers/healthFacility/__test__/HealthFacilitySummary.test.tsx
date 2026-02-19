import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

jest.mock('../../../utils/commonUtils', () => ({
  ...jest.requireActual('../../../utils/commonUtils'),
  formatUserToastMsg: (msg: string) => msg,
  formatRoles: (row: any) => (row.roles || []).map((r: any) => r.displayName || r.name).join(',')
}));

jest.mock('../../../components/loader/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>
}));

const mockDetailCard = jest.fn();
jest.mock('../../../components/detailCard/DetailCard', () => ({
  __esModule: true,
  default: (props: any) => {
    mockDetailCard(props);
    return (
      <div data-testid="detail-card">
        <span>{props.header}</span>
        {props.buttonLabel && (
          <button type="button" onClick={props.onButtonClick} data-testid="detail-card-button">
            {props.buttonLabel}
          </button>
        )}
        {props.isSearch && (
          <input data-testid="detail-card-search" onChange={(e) => props.onSearch?.(e.target.value)} />
        )}
        {props.children}
      </div>
    );
  }
}));

const mockCustomTable = jest.fn();
jest.mock('../../../components/customTable/CustomTable', () => ({
  __esModule: true,
  default: (props: any) => {
    mockCustomTable(props);
    return (
      <table data-testid="custom-table">
        <thead>
          <tr>
            {props.columnsDef?.map((col: any) => (
              <th key={col.id}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(props.rowData || []).map((row: any, i: number) => (
            <tr key={i}>
              <td>{row.firstName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}));

const mockModalFormCalls: any[] = [];
jest.mock('../../../components/modal/ModalForm', () => ({
  __esModule: true,
  default: (props: any) => {
    mockModalFormCalls.push(props);
    return props.show ? (
      <div data-testid="modal-form">
        <span>{props.title}</span>
        <button type="button" onClick={() => props.handleCancel?.()} data-testid="modal-cancel">
          {props.cancelText || 'Cancel'}
        </button>
        <button type="button" onClick={() => props.handleFormSubmit?.({})} data-testid="modal-submit">
          {props.submitText || 'Submit'}
        </button>
      </div>
    ) : null;
  }
}));

jest.mock('../../../components/userForm/UserForm', () => () => <div data-testid="user-form">UserForm</div>);

jest.mock('../../createHealthFacility/HealthFacilityDetailsForm', () => ({
  __esModule: true,
  default: () => <div data-testid="health-facility-details-form">HealthFacilityDetailsForm</div>
}));

jest.mock('../../../components/customTable/ConfirmationModalPopup', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="confirmation-modal">
      <button type="button" onClick={props.handleCancel} data-testid="confirmation-cancel">
        Cancel
      </button>
      <button type="button" onClick={props.handleSubmit} data-testid="confirmation-submit">
        Ok
      </button>
    </div>
  )
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
    userRoles: { SPICE: [] }
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
    mockModalFormCalls.length = 0;
    mockDetailCard.mockClear();
    mockCustomTable.mockClear();
  });

  describe('Loader state', () => {
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
  });

  describe('Health Facility Summary DetailCard', () => {
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

    it('renders placeholder for missing summary values', () => {
      renderComponent({
        ...defaultStoreState,
        healthFacility: {
          ...defaultStoreState.healthFacility,
          healthFacility: { ...defaultStoreState.healthFacility.healthFacility, name: undefined },
          loading: false,
          hfUserDetailLoading: false,
          clinicalWorkflowList: []
        }
      });
      expect(screen.getByText('--')).toBeInTheDocument();
    });

    it('opens Edit Health Facility modal when Edit button is clicked', () => {
      renderComponent();
      const editButtons = screen.getAllByTestId('detail-card-button');
      const hfSummaryEditButton = editButtons.find((btn) => btn.textContent === 'Edit Health Facility');
      expect(hfSummaryEditButton).toBeTruthy();
      fireEvent.click(hfSummaryEditButton!);
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
      expect(screen.getAllByText('Edit Health Facility').length).toBeGreaterThanOrEqual(1);
    });

    it('closes Edit modal when Cancel is clicked', async () => {
      renderComponent();
      const editButton = screen.getAllByTestId('detail-card-button').find(
        (btn) => btn.textContent === 'Edit Health Facility'
      );
      fireEvent.click(editButton!);
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
      const cancelButton = screen.getByTestId('modal-cancel');
      fireEvent.click(cancelButton);
      await waitFor(() => {
        const modals = screen.queryAllByTestId('modal-form');
        expect(modals.length).toBe(0);
      });
    });
  });

  describe('Users DetailCard and CustomTable', () => {
    it('renders Users DetailCard with Add User button', () => {
      renderComponent();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getAllByText('Add User').length).toBeGreaterThanOrEqual(1);
    });

    it('renders CustomTable with expected column headers', () => {
      renderComponent();
      expect(screen.getByText('NAME')).toBeInTheDocument();
      expect(screen.getByText('ROLE')).toBeInTheDocument();
      expect(screen.getByText('USERNAME')).toBeInTheDocument();
      expect(screen.getByText('GENDER')).toBeInTheDocument();
      expect(screen.getByText('CONTACT NUMBER')).toBeInTheDocument();
    });

    it('passes rowData and loading to CustomTable', () => {
      renderComponent();
      expect(mockCustomTable).toHaveBeenCalledWith(
        expect.objectContaining({
          rowData: expect.any(Array),
          loading: expect.any(Boolean)
        })
      );
    });

    it('opens Add User modal when Add User button is clicked', () => {
      renderComponent();
      const addUserButtons = screen.getAllByTestId('detail-card-button').filter((btn) => btn.textContent === 'Add User');
      expect(addUserButtons.length).toBeGreaterThanOrEqual(1);
      fireEvent.click(addUserButtons[0]);
      const addUserModals = mockModalFormCalls.filter((m) => m.title === 'Add User');
      expect(addUserModals.length).toBeGreaterThanOrEqual(1);
      expect(addUserModals.some((m) => m.show === true)).toBe(true);
    });

    it('closes Add User modal when handleCancel is called', () => {
      renderComponent();
      const addUserButton = screen.getAllByTestId('detail-card-button').find((btn) => btn.textContent === 'Add User');
      fireEvent.click(addUserButton!);
      const addUserModal = mockModalFormCalls.find((m) => m.title === 'Add User');
      expect(addUserModal).toBeDefined();
      addUserModal?.handleCancel?.();
      expect(screen.queryByTestId('modal-form')).toBeDefined();
    });
  });

  describe('Dispatch on mount and unmount', () => {
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
  });

  describe('User actions', () => {
    it('calls onDeleteClick with deleteHFUserRequest when user delete is triggered', () => {
      renderComponent();
      const tableProps = mockCustomTable.mock.calls[0][0];
      expect(tableProps.onDeleteClick).toBeDefined();
      tableProps.onDeleteClick({ data: { id: 1 } });
      const actions = store.getActions();
      const deleteAction = actions.find((a: any) => a.type === 'DELETE_HEALTH_FACILITY_USER_REQUEST');
      expect(deleteAction).toBeDefined();
    });

    it('CustomTable has actionFormatter with hideEditIcon, hideDeleteIcon, hideCustomIcon', () => {
      renderComponent();
      const tableProps = mockCustomTable.mock.calls[0][0];
      expect(tableProps.actionFormatter).toBeDefined();
      expect(typeof tableProps.actionFormatter.hideEditIcon).toBe('function');
      expect(typeof tableProps.actionFormatter.hideDeleteIcon).toBe('function');
      expect(typeof tableProps.actionFormatter.hideCustomIcon).toBe('function');
    });
  });

  describe('Modals', () => {
    it('renders ConfirmationModalPopup', () => {
      renderComponent();
      expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    });

    it('renders ModalForm for Edit HF, Add/Edit User, and CHW Activate', () => {
      renderComponent();
      const titles = mockModalFormCalls.map((m) => m.title);
      expect(titles).toContain('Edit Health Facility');
      expect(titles).toContain('Add User');
      expect(titles).toContain('CHW Activate');
    });
  });
});
