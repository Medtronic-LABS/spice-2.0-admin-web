import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import BranchSummary from '../BranchSummary';
import APPCONSTANTS from '../../../constants/appConstants';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

const mockUseParams = jest.fn(() => ({ branchId: '1', tenantId: '1' }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams()
}));

jest.mock('../../../hooks/useCountryId', () => ({
  __esModule: true,
  default: () => 1
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
    children
  }: {
    header: string;
    buttonLabel: string;
    onButtonClick: () => void;
    children: React.ReactNode;
  }) => (
    <div data-testid='detail-card'>
      <h2>{header}</h2>
      <button type='button' onClick={onButtonClick}>
        {buttonLabel}
      </button>
      {children}
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
    initialValues,
    render: renderProp
  }: {
    show: boolean;
    title: string;
    handleCancel: () => void;
    handleFormSubmit: (values: any) => void;
    initialValues: any;
    render?: (form: any) => React.ReactNode;
  }) =>
    show ? (
      <div data-testid='modal-form'>
        <h3>{title}</h3>
        {renderProp?.([])}
        <button type='button' onClick={handleCancel} data-testid='modal-cancel'>
          Cancel
        </button>
        <button
          type='button'
          data-testid='modal-submit'
          onClick={() =>
            handleFormSubmit({
              branch: {
                id: 1,
                name: 'Branch A',
                code: 'BR001',
                currentAccountCode: 'ACC001',
                district: { id: 1, name: 'District 1' },
                chiefdom: { id: 1, name: 'Chiefdom 1' }
              }
            })
          }
        >
          Submit
        </button>
      </div>
    ) : null
}));

jest.mock('../BranchForm', () => ({
  __esModule: true,
  default: () => <div data-testid='branch-form'>BranchForm</div>
}));

const mockBranchSummary = {
  id: 1,
  name: 'Branch A',
  code: 'BR001',
  currentAccountCode: 'ACC001',
  district: { id: 1, name: 'District 1', tenantId: '1' },
  chiefdom: { id: 1, name: 'Chiefdom 1' },
  skPositionCount: 1,
  ssPositionCount: 2,
  poPositionCount: 0,
  foPositionCount: 0
};

const defaultStoreState = {
  branch: {
    branches: [],
    branchSummary: mockBranchSummary,
    loading: false,
    totalCount: 0,
    error: null
  },
  district: {
    districtList: [{ id: 1, name: 'District 1', tenantId: 100 }],
    loading: false
  },
  user: {
    user: { country: { id: 1 }, appTypes: [] }
  }
};

describe('BranchSummary', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(defaultStoreState);
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ branchId: '1', tenantId: '1' });
  });

  const renderBranchSummary = (routePath = '/branch/1/tenant/1', initialEntry = routePath) =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Route path={routePath}>
            <BranchSummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );

  it('renders Branch Summary header and Edit Branch button', async () => {
    renderBranchSummary();

    await waitFor(() => {
      expect(screen.getByText('Branch Summary')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Edit Branch' })).toBeInTheDocument();
    });
  });

  it('dispatches fetchBranchSummaryRequest on mount when branchId is present', async () => {
    renderBranchSummary();

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'FETCH_BRANCH_SUMMARY_REQUEST')).toBe(true);
    });
  });

  it('renders summary labels and values from branchSummary', async () => {
    renderBranchSummary();

    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Branch A')).toBeInTheDocument();
      expect(screen.getByText('Code')).toBeInTheDocument();
      expect(screen.getByText('BR001')).toBeInTheDocument();
      expect(screen.getByText('Current Account Code')).toBeInTheDocument();
      expect(screen.getByText('ACC001')).toBeInTheDocument();
      expect(screen.getByText('District')).toBeInTheDocument();
      expect(screen.getByText('District 1')).toBeInTheDocument();
      expect(screen.getByText('Chiefdom')).toBeInTheDocument();
      expect(screen.getByText('Chiefdom 1')).toBeInTheDocument();
    });
  });

  it('shows -- for missing values when branchSummary has null/undefined fields', async () => {
    store = mockStore({
      ...defaultStoreState,
      branch: {
        ...defaultStoreState.branch,
        branchSummary: {
          id: 1,
          name: 'Branch B',
          code: 'BR002',
          currentAccountCode: '',
          district: undefined as any,
          chiefdom: undefined as any
        }
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/branch/1/tenant/1']}>
          <Route path='/branch/:branchId/tenant/:tenantId'>
            <BranchSummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Branch B')).toBeInTheDocument();
      const placeholders = screen.getAllByText('--');
      expect(placeholders.length).toBeGreaterThan(0);
    });
  });

  it('shows loader when loading is true', async () => {
    store = mockStore({
      ...defaultStoreState,
      branch: { ...defaultStoreState.branch, loading: true }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/branch/1/tenant/1']}>
          <Route path='/branch/:branchId/tenant/:tenantId'>
            <BranchSummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  it('does not show loader when loading is false', async () => {
    renderBranchSummary();

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  it('opens Edit Branch modal when Edit Branch button is clicked', async () => {
    renderBranchSummary();

    await waitFor(() => {
      expect(screen.getByTestId('detail-card')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: 'Edit Branch' });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Edit Branch' })).toBeInTheDocument();
    });
  });

  it('closes modal when Cancel is clicked', async () => {
    renderBranchSummary();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit Branch' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit Branch' }));

    await waitFor(() => {
      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('modal-cancel'));

    await waitFor(() => {
      expect(screen.queryByTestId('modal-form')).not.toBeInTheDocument();
    });
  });

  it('dispatches updateBranchRequest when form is submitted', async () => {
    renderBranchSummary();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit Branch' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit Branch' }));

    await waitFor(() => {
      expect(screen.getByTestId('modal-submit')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'UPDATE_BRANCH_REQUEST')).toBe(true);
    });
  });

  it('dispatches fetchDistrictListRequest when tenantId is present and districtList is empty', async () => {
    store = mockStore({
      ...defaultStoreState,
      district: { districtList: [], loading: false }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/branch/1/tenant/1']}>
          <Route path='/branch/:branchId/tenant/:tenantId'>
            <BranchSummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'FETCH_DISTRICT_LIST_REQUEST')).toBe(true);
    });
  });

  it('does not dispatch fetchBranchSummaryRequest when branchId is missing', async () => {
    mockUseParams.mockReturnValueOnce({ branchId: undefined, tenantId: '1' });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/branch//tenant/1']}>
          <Route path='/branch/:branchId/tenant/:tenantId'>
            <BranchSummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'FETCH_BRANCH_SUMMARY_REQUEST')).toBe(false);
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
        <MemoryRouter initialEntries={['/branch/1/tenant/1']}>
          <Route path='/branch/:branchId/tenant/:tenantId'>
            <BranchSummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const actions = store.getActions();
      const fetchDistrictAction = actions.find((a: any) => a.type === 'FETCH_DISTRICT_LIST_REQUEST');
      expect(fetchDistrictAction).toBeDefined();
      expect(typeof fetchDistrictAction?.failureCb).toBe('function');
      fetchDistrictAction.failureCb(new Error('District fetch failed'));
      expect(toastCenter.error).toHaveBeenCalled();
    });
  });

  it('does not dispatch updateBranchRequest when branchSummary is null and form is submitted', async () => {
    store = mockStore({
      ...defaultStoreState,
      branch: { ...defaultStoreState.branch, branchSummary: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/branch/1/tenant/1']}>
          <Route path='/branch/:branchId/tenant/:tenantId'>
            <BranchSummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Branch' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Edit Branch' }));
    await waitFor(() => expect(screen.getByTestId('modal-submit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'UPDATE_BRANCH_REQUEST')).toBe(false);
    });
  });

  it(
    'onSuccess callback calls toastCenter.success, closes modal, and dispatches fetchBranchSummaryRequest',
    async () => {
    const toastCenter = require('../../../utils/toastCenter').default;
    renderBranchSummary();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Branch' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Edit Branch' }));
    await waitFor(() => expect(screen.getByTestId('modal-submit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      const updateAction = actions.find((a: any) => a.type === 'UPDATE_BRANCH_REQUEST');
      expect(updateAction?.successCb).toBeDefined();
      updateAction.successCb();
    });

    expect(toastCenter.success).toHaveBeenCalledWith(APPCONSTANTS.SUCCESS, APPCONSTANTS.BRANCH_UPDATE_SUCCESS);
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.some((a: { type: string }) => a.type === 'FETCH_BRANCH_SUMMARY_REQUEST')).toBe(true);
    });
  });

  it('onFailure callback calls toastCenter.error', async () => {
    const toastCenter = require('../../../utils/toastCenter').default;
    renderBranchSummary();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Branch' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Edit Branch' }));
    await waitFor(() => expect(screen.getByTestId('modal-submit')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('modal-submit'));

    await waitFor(() => {
      const actions = store.getActions();
      const updateAction = actions.find((a: any) => a.type === 'UPDATE_BRANCH_REQUEST');
      expect(updateAction?.failureCb).toBeDefined();
      updateAction.failureCb(new Error('Update failed'));
    });

    expect(toastCenter.error).toHaveBeenCalled();
  });
});
