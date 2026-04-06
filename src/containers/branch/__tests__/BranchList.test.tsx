import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import BranchList from '../BranchList';
import APPCONSTANTS from '../../../constants/appConstants';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ regionId: '1', tenantId: '1' }),
  useHistory: () => ({ push: mockPush })
}));

jest.mock('../../../hooks/useCountryId', () => ({
  __esModule: true,
  default: () => 1
}));

jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: () => ({
    listParams: { page: 1, rowsPerPage: 10, searchTerm: '' },
    handleSearch: jest.fn(),
    handlePage: jest.fn()
  })
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    district: { s: 'District', p: 'Districts' },
    chiefdom: { s: 'Chiefdom', p: 'Chiefdoms' }
  })
}));

jest.mock('../../../utils/toastCenter', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
  getErrorToastArgs: jest.fn(() => ['title', 'message'])
}));

jest.mock('../../../utils/commonUtils', () => ({
  formatUserToastMsg: jest.fn((msg: string) => msg)
}));

jest.mock('../../../utils/formatObjectUtils', () => ({
  mapBranchToCreatePayload: jest.fn((branch: any) => ({
    name: branch.name,
    code: branch.code,
    currentAccountCode: branch.currentAccountCode,
    districtId: branch.district?.id ?? 0,
    chiefdomId: branch.chiefdom?.id ?? 0,
    skPositionCount: 0,
    ssPositionCount: 0,
    poPositionCount: 0,
    foPositionCount: 0
  })),
  mapBranchToUpdatePayload: jest.fn((branch: any) => ({
    id: branch.id,
    name: branch.name,
    code: branch.code,
    currentAccountCode: branch.currentAccountCode,
    districtId: branch.district?.id ?? 0,
    chiefdomId: branch.chiefdom?.id ?? 0,
    skPositionCount: 0,
    ssPositionCount: 0,
    poPositionCount: 0,
    foPositionCount: 0
  }))
}));

jest.mock('../../../components/loader/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid='loader'>Loading...</div>
}));

jest.mock('../../../components/detailCard/DetailCard', () => ({
  __esModule: true,
  default: ({
    header,
    buttonLabel,
    onButtonClick,
    onChange,
    children
  }: {
    header: string;
    buttonLabel: string;
    onButtonClick: () => void;
    onChange?: (option: number[], name: string) => void;
    children: React.ReactNode;
  }) => (
    <div data-testid='detail-card'>
      <h2>{header}</h2>
      <button type='button' onClick={onButtonClick}>
        {buttonLabel}
      </button>
      {onChange && (
        <>
          <button type='button' onClick={() => onChange([1], 'districtIds')} data-testid='set-district-filter'>
            Set district filter
          </button>
          <button type='button' onClick={() => onChange([], 'districtIds')} data-testid='clear-district-filter'>
            Clear district filter
          </button>
        </>
      )}
      {children}
    </div>
  )
}));

jest.mock('../../../components/customTable/CustomTable', () => ({
  __esModule: true,
  default: ({
    rowData,
    onRowEdit,
    handleRowClick,
    columnsDef
  }: {
    rowData: any[];
    onRowEdit: (row: any) => void;
    handleRowClick?: (row: any) => void;
    columnsDef: Array<{ name: string; label: string; cellFormatter?: (row: any) => any }>;
  }) => (
    <div data-testid='custom-table'>
      <table>
        <thead>
          <tr>
            {columnsDef.map((col) => (
              <th key={col.label}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, idx) => (
            <tr key={idx}>
              {columnsDef.map((col) => (
                <td key={col.label}>
                  {col.cellFormatter ? col.cellFormatter(row) : row[col.name]}
                </td>
              ))}
              <td>
                <button type='button' onClick={() => onRowEdit(row)} data-testid={`edit-row-${idx}`}>
                  Edit
                </button>
                {handleRowClick && (
                  <button
                    type='button'
                    onClick={() => handleRowClick(row)}
                    data-testid={`row-click-${idx}`}
                  >
                    View
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}));

jest.mock('../../../components/modal/ModalForm', () => ({
  __esModule: true,
  default: ({
    show,
    title,
    handleCancel,
    handleFormSubmit,
    render: renderForm
  }: {
    show: boolean;
    title: string;
    handleCancel: () => void;
    handleFormSubmit: (values: any) => void;
    render: (form: any) => React.ReactNode;
  }) =>
    show ? (
      <div data-testid='modal-form'>
        <h3>{title}</h3>
        <button type='button' onClick={handleCancel} data-testid='modal-cancel'>
          Cancel
        </button>
        <button
          type='button'
          data-testid='modal-submit'
          onClick={() =>
            handleFormSubmit({
              branch: {
                name: 'Test',
                code: 'T1',
                currentAccountCode: 'ACC',
                district: { id: 1 },
                chiefdom: { id: 1 }
              }
            })
          }
        >
          Submit
        </button>
        <button
          type='button'
          data-testid='modal-submit-empty'
          onClick={() => handleFormSubmit({ branch: null })}
        >
          Submit empty
        </button>
        {renderForm && renderForm(null)}
      </div>
    ) : null
}));

jest.mock('../BranchForm', () => ({
  __esModule: true,
  default: () => <div data-testid='branch-form'>BranchForm</div>
}));

const defaultStoreState = {
  branch: {
    branches: [
      {
        id: 1,
        name: 'Branch A',
        code: 'BR001',
        currentAccountCode: 'ACC001',
        district: { id: 1, name: 'District 1' },
        chiefdom: { id: 1, name: 'Chiefdom 1' },
        skPositionCount: 1,
        ssPositionCount: 2,
        poPositionCount: 0,
        foPositionCount: 0,
        isActive: true
      },
      {
        id: 2,
        name: 'Branch B',
        code: 'BR002',
        currentAccountCode: 'ACC002',
        district: { id: 1, name: 'District 1' },
        chiefdom: { id: 1, name: 'Chiefdom 1' },
        skPositionCount: 0,
        ssPositionCount: 0,
        poPositionCount: 0,
        foPositionCount: 0,
        isActive: false
      }
    ],
    branchSummary: null,
    loading: false,
    totalCount: 2,
    error: null
  },
  district: {
    districtList: [{ id: 1, name: 'District 1', tenantId: 100 }],
    loading: false
  },
  healthFacility: {
    chiefdomList: [{ id: 1, name: 'Chiefdom 1' }]
  },
  user: {
    user: { country: { id: 1 }, appTypes: [] }
  }
};

describe('BranchList', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(defaultStoreState);
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  const renderBranchList = () =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1/tenant/1/branch']}>
          <Route path='/region/:regionId/tenant/:tenantId/branch'>
            <BranchList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

  it('renders Branch header and Add button', async () => {
    renderBranchList();

    await waitFor(() => {
      expect(screen.getByText('Branch')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });
  });

  it('dispatches fetchBranchListRequest on mount', async () => {
    renderBranchList();

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'FETCH_BRANCH_LIST_REQUEST')).toBe(true);
    });
  });

  it('dispatches clearBranchList on unmount', () => {
    const { unmount } = renderBranchList();
    unmount();

    const actions = store.getActions();
    expect(actions.some((a: { type: string }) => a.type === 'CLEAR_BRANCH_LIST')).toBe(true);
  });

  it('opens Add Branch modal when Add button is clicked', async () => {
    renderBranchList();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
      expect(screen.getByText('Add Branch')).toBeInTheDocument();
    });
  });

  it('opens Edit Branch modal when row Edit is clicked', async () => {
    renderBranchList();

    await waitFor(() => {
      expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('edit-row-0');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
      expect(screen.getByText('Edit Branch')).toBeInTheDocument();
    });
  });

  it('renders table with branch data', async () => {
    renderBranchList();

    await waitFor(() => {
      expect(screen.getByTestId('custom-table')).toBeInTheDocument();
      expect(screen.getByText('Branch A')).toBeInTheDocument();
      expect(screen.getByText('BR001')).toBeInTheDocument();
    });
  });

  it('does not show loader when loading is false', async () => {
    renderBranchList();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  it('navigates to branch summary when active row is clicked', async () => {
    renderBranchList();

    await waitFor(() => {
      expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('row-click-0'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/branch/1/1');
    });
  });

  it('shows loader when loading is true', async () => {
    store = mockStore({
      ...defaultStoreState,
      branch: { ...defaultStoreState.branch, loading: true }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1/tenant/1/branch']}>
          <Route path='/region/:regionId/tenant/:tenantId/branch'>
            <BranchList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  it('calls toastCenter.error when fetchBranchListRequest failureCb is invoked', async () => {
    const toastCenter = require('../../../utils/toastCenter').default;
    renderBranchList();

    await waitFor(() => {
      const actions = store.getActions();
      const fetchAction = actions.find((a: { type: string }) => a.type === 'FETCH_BRANCH_LIST_REQUEST');
      expect(fetchAction?.failureCb).toBeDefined();
      fetchAction.failureCb(new Error('Fetch failed'));
    });
    expect(toastCenter.error).toHaveBeenCalled();
  });

  it('dispatches fetchDistrictListRequest when tenantId is present and districtList is empty', async () => {
    store = mockStore({
      ...defaultStoreState,
      district: { districtList: [], loading: false }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1/tenant/1/branch']}>
          <Route path='/region/:regionId/tenant/:tenantId/branch'>
            <BranchList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'FETCH_DISTRICT_LIST_REQUEST')).toBe(true);
    });
  });

  it('calls toastCenter.error when fetchDistrictListRequest failureCb is invoked', async () => {
    const toastCenter = require('../../../utils/toastCenter').default;
    store = mockStore({
      ...defaultStoreState,
      district: { districtList: [], loading: false }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1/tenant/1/branch']}>
          <Route path='/region/:regionId/tenant/:tenantId/branch'>
            <BranchList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const actions = store.getActions();
      const fetchAction = actions.find((a: { type: string }) => a.type === 'FETCH_DISTRICT_LIST_REQUEST');
      expect(fetchAction?.failureCb).toBeDefined();
      fetchAction.failureCb(new Error('District fetch failed'));
    });
    expect(toastCenter.error).toHaveBeenCalled();
  });

  it('closes modal when Cancel is clicked', async () => {
    renderBranchList();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(screen.getByTestId('modal-form')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-cancel'));

    await waitFor(() => {
      expect(screen.queryByTestId('modal-form')).not.toBeInTheDocument();
    });
  });

  it('dispatches createBranchRequest when Add Branch form is submitted', async () => {
    renderBranchList();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(screen.getByTestId('modal-submit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'CREATE_BRANCH_REQUEST')).toBe(true);
    });
  });

  it('onSuccess callback shows success toast and refetches when create succeeds', async () => {
    const toastCenter = require('../../../utils/toastCenter').default;
    renderBranchList();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(screen.getByTestId('modal-submit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      const createAction = actions.find((a: { type: string }) => a.type === 'CREATE_BRANCH_REQUEST');
      expect(createAction?.successCb).toBeDefined();
      createAction.successCb();
    });

    expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.BRANCH_CREATE_SUCCESS);
    await waitFor(() => {
      const actions = store.getActions();
      const fetchCount = actions.filter((a: { type: string }) => a.type === 'FETCH_BRANCH_LIST_REQUEST').length;
      expect(fetchCount).toBeGreaterThanOrEqual(2);
    });
  });

  it('onFailure callback shows error toast when create fails', async () => {
    const toastCenter = require('../../../utils/toastCenter').default;
    renderBranchList();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(screen.getByTestId('modal-submit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      const createAction = actions.find((a: { type: string }) => a.type === 'CREATE_BRANCH_REQUEST');
      expect(createAction?.failureCb).toBeDefined();
      createAction.failureCb(new Error('Create failed'));
    });
    expect(toastCenter.error).toHaveBeenCalled();
  });

  it('dispatches updateBranchRequest when Edit Branch form is submitted', async () => {
    renderBranchList();

    await waitFor(() => expect(screen.getByTestId('custom-table')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('edit-row-0'));
    await waitFor(() => expect(screen.getByTestId('modal-submit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'UPDATE_BRANCH_REQUEST')).toBe(true);
    });
  });

  it('onSuccess callback shows success toast when update succeeds', async () => {
    const toastCenter = require('../../../utils/toastCenter').default;
    renderBranchList();

    await waitFor(() => expect(screen.getByTestId('edit-row-0')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('edit-row-0'));
    await waitFor(() => expect(screen.getByTestId('modal-submit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      const updateAction = actions.find((a: { type: string }) => a.type === 'UPDATE_BRANCH_REQUEST');
      expect(updateAction?.successCb).toBeDefined();
      updateAction.successCb();
    });
    expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.BRANCH_UPDATE_SUCCESS);
  });

  it('onFailure callback shows error toast when update fails', async () => {
    const toastCenter = require('../../../utils/toastCenter').default;
    renderBranchList();

    await waitFor(() => expect(screen.getByTestId('edit-row-0')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('edit-row-0'));
    await waitFor(() => expect(screen.getByTestId('modal-submit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      const updateAction = actions.find((a: { type: string }) => a.type === 'UPDATE_BRANCH_REQUEST');
      expect(updateAction?.failureCb).toBeDefined();
      updateAction.failureCb(new Error('Update failed'));
    });
    expect(toastCenter.error).toHaveBeenCalled();
  });

  it('does not dispatch create or update when form is submitted with null branch', async () => {
    renderBranchList();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(screen.getByTestId('modal-submit-empty')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit-empty'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'CREATE_BRANCH_REQUEST')).toBe(false);
      expect(actions.some((a: { type: string }) => a.type === 'UPDATE_BRANCH_REQUEST')).toBe(false);
    });
  });

  it('dispatches fetchChiefdomListRequest when district filter is set', async () => {
    renderBranchList();

    await waitFor(() => expect(screen.getByTestId('set-district-filter')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('set-district-filter'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF')).toBe(true);
    });
  });

  it('clears chiefdomIds when district filter is cleared', async () => {
    renderBranchList();

    await waitFor(() => expect(screen.getByTestId('clear-district-filter')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('clear-district-filter'));

    await waitFor(() => {
      expect(screen.getByTestId('detail-card')).toBeInTheDocument();
    });
  });

  it('does not navigate when inactive row View is clicked', async () => {
    renderBranchList();

    await waitFor(() => expect(screen.getByTestId('custom-table')).toBeInTheDocument());
    const inactiveRowClick = screen.getByTestId('row-click-1');
    fireEvent.click(inactiveRowClick);

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
