import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import BranchList from '../BranchList';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({ regionId: '1', tenantId: '1' })
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
  default: () => <div data-testid="loader">Loading...</div>
}));

jest.mock('../../../components/detailCard/DetailCard', () => ({
  __esModule: true,
  default: ({
    header,
    buttonLabel,
    onButtonClick,
    children
  }: {
    header: string;
    buttonLabel: string;
    onButtonClick: () => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="detail-card">
      <h2>{header}</h2>
      <button type="button" onClick={onButtonClick}>
        {buttonLabel}
      </button>
      {children}
    </div>
  )
}));

jest.mock('../../../components/customTable/CustomTable', () => ({
  __esModule: true,
  default: ({
    rowData,
    onRowEdit,
    columnsDef
  }: {
    rowData: any[];
    onRowEdit: (row: any) => void;
    columnsDef: { name: string; label: string; cellFormatter?: (row: any) => any }[];
  }) => (
    <div data-testid="custom-table">
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
                <button type="button" onClick={() => onRowEdit(row)} data-testid={`edit-row-${idx}`}>
                  Edit
                </button>
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
      <div data-testid="modal-form">
        <h3>{title}</h3>
        <button type="button" onClick={handleCancel} data-testid="modal-cancel">
          Cancel
        </button>
        <button
          type="button"
          data-testid="modal-submit"
          onClick={() => handleFormSubmit({ branch: { name: 'Test', code: 'T1', currentAccountCode: 'ACC', district: { id: 1 }, chiefdom: { id: 1 } } })}
        >
          Submit
        </button>
        {renderForm && renderForm(null)}
      </div>
    ) : null
}));

jest.mock('../BranchForm', () => ({
  __esModule: true,
  default: () => <div data-testid="branch-form">BranchForm</div>
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
        foPositionCount: 0
      }
    ],
    loading: false,
    totalCount: 1,
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
  });

  const renderBranchList = () =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1/tenant/1/branch']}>
          <Route path="/region/:regionId/tenant/:tenantId/branch">
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

  it('shows loader when loading is true', async () => {
    store = mockStore({
      ...defaultStoreState,
      branch: { ...defaultStoreState.branch, loading: true }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1/tenant/1/branch']}>
          <Route path="/region/:regionId/tenant/:tenantId/branch">
            <BranchList />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });
});
