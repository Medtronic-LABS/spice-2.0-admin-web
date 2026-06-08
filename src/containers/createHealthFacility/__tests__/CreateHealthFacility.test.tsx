import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import CreateHealthFacility, { filterAndExtractAppTypes } from '../CreateHealthFacility';
import { shastiyaKormiRole } from '../../../constants/roleConstants';
import APPCONSTANTS from '../../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../../constants/route';
import '@testing-library/jest-dom';
import { LegacyRoute as Route } from '../../../tests/routerTestUtils';

const mockStore = configureStore([]);
const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ regionId: '1', districtId: undefined, chiefdomId: undefined, tenantId: '1' })
}));

jest.mock('../../../utils/routerCompat', () => ({
  ...jest.requireActual('../../../utils/routerCompat'),
  useHistoryCompat: () => ({
    location: { pathname: '/', search: '', hash: '', state: null, key: 'create-health-facility' },
    push: mockPush,
    replace: jest.fn(),
    goBack: jest.fn()
  })
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    isCommunity: true,
    appTypes: ['COMMUNITY'],
    healthFacility: { s: 'Health Facility', p: 'Health Facilities' },
    hfCreate: {
      user: {
        optional: { available: true }
      }
    }
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

jest.mock('../../../utils/formatObjectUtils', () => {
  const actual = jest.requireActual('../../../utils/formatObjectUtils');
  return {
    ...actual,
    formatHealthFacility: jest.fn((data: any) => ({ ...data, clinicalWorkflowIds: [1], customizedWorkflowIds: [] })),
    getUserPayload: jest.fn(() => [{ firstName: 'Test', lastName: 'User' }])
  };
});

const mockUserFormValues: { users?: any[]; ssUsers?: any[] } = {};

jest.mock('../../../global/sessionStorageServices', () => ({
  getItem: jest.fn(() => '1')
}));

jest.mock('../../../store/healthFacility/actions', () => ({
  clearAllDependentData: jest.fn(() => ({ type: 'CLEAR_ALL_DEPENDENT_DATA' })),
  clearHFList: jest.fn(() => ({ type: 'CLEAR_HF_LIST' })),
  createHFRequest: jest.fn((payload: any) => ({ type: 'CREATE_HF_REQUEST', ...payload })),
  fetchSSPrefixRequest: jest.fn(() => ({ type: 'FETCH_SS_PREFIX_REQUEST' })),
  fetchWorkflowListRequest: jest.fn((payload: any) => ({ type: 'FETCH_WORKFLOW_LIST_REQUEST', ...payload }))
}));

jest.mock('../../../store/branch/actions', () => ({
  clearBranchesByUnion: jest.fn(() => ({ type: 'CLEAR_BRANCHES_BY_UNION' }))
}));

jest.mock('../../../components/loader/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid='loader'>Loading...</div>
}));

jest.mock('../../../components/formContainer/FormContainer', () => ({
  __esModule: true,
  default: ({ label, children, headerRender }: any) => (
    <div data-testid='form-container'>
      <span>{label}</span>
      {headerRender?.()}
      {children}
    </div>
  )
}));

jest.mock('../../../components/button/IconButton', () => ({
  __esModule: true,
  default: ({ label, handleClick }: any) => (
    <button type='button' onClick={handleClick} data-testid={`icon-btn-${label?.replace(/\s/g, '-')}`}>
      {label}
    </button>
  )
}));

jest.mock('../HealthFacilityDetailsForm', () => ({
  __esModule: true,
  default: () => <div data-testid='health-facility-details-form'>HealthFacilityDetailsForm</div>
}));

jest.mock('../../../containers/healthFacility/Workflows', () => ({
  __esModule: true,
  default: () => <div data-testid='workflows'>Workflows</div>
}));

jest.mock('../../../components/userForm/UserForm', () => {
  const mockReact = require('react');
  return {
    __esModule: true,
    default: ({ form }: { form?: { change: (field: string, value: unknown) => void } }) => {
      mockReact.useEffect(() => {
        if (mockUserFormValues.users) {
          form?.change('users', mockUserFormValues.users);
        }
        if (mockUserFormValues.ssUsers) {
          form?.change('ssUsers', mockUserFormValues.ssUsers);
        }
      }, [form]);
      return mockReact.createElement('div', { 'data-testid': 'user-form' }, 'UserForm');
    }
  };
});

jest.mock('../../../assets/images/info-grey.svg', () => ({ ReactComponent: () => null }));
jest.mock('../../../assets/images/avatar-o.svg', () => ({ ReactComponent: () => null }));
jest.mock('../../../assets/images/right-arrow.svg', () => ({ ReactComponent: () => null }));

const defaultStoreState = {
  healthFacility: {
    clinicalWorkflowList: [],
    clinicalWorkflowLoading: false,
    loading: false
  },
  user: {
    user: {
      country: { id: 1 },
      appTypes: ['COMMUNITY'],
      role: APPCONSTANTS.ROLES.SUPER_ADMIN
    },
    userRoles: { SPICE: [] }
  },
  branch: {
    branchSummary: null,
    branches: [],
    branchesByUnion: [],
    loading: false,
    totalCount: 0,
    error: null
  }
};

describe('filterAndExtractAppTypes', () => {
  it('returns unique app types from workflows matching selected ids', () => {
    const workflows = [
      { id: 1, appTypes: ['COMMUNITY', 'CFR'] },
      { id: 2, appTypes: ['COMMUNITY'] },
      { id: 3, appTypes: ['AF'] }
    ] as any[];
    expect(filterAndExtractAppTypes(workflows, [1, 2])).toEqual(['COMMUNITY', 'CFR']);
  });

  it('returns empty array when selectedIds is empty', () => {
    const workflows = [{ id: 1, appTypes: ['COMMUNITY'] }] as any[];
    expect(filterAndExtractAppTypes(workflows, [])).toEqual([]);
  });

  it('returns empty array when no workflows match', () => {
    const workflows = [{ id: 1, appTypes: ['COMMUNITY'] }] as any[];
    expect(filterAndExtractAppTypes(workflows, [99])).toEqual([]);
  });
});

describe('CreateHealthFacility', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(defaultStoreState);
    jest.clearAllMocks();
    mockPush.mockClear();
    mockUserFormValues.users = undefined;
    mockUserFormValues.ssUsers = undefined;
  });

  const createPath = PROTECTED_ROUTES.createHealthFacilityByRegion.replace(':regionId', '1').replace(':tenantId', '1');
  const renderCreateHealthFacility = (path = createPath) =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <Route path={PROTECTED_ROUTES.createHealthFacilityByRegion} exact={true} component={CreateHealthFacility} />
        </MemoryRouter>
      </Provider>
    );

  it('renders create site form', async () => {
    renderCreateHealthFacility();
    await waitFor(() => {
      expect(screen.getByTestId('create-site-form')).toBeInTheDocument();
    });
  });

  it('dispatches clearAllDependentData on mount', async () => {
    const { clearAllDependentData } = require('../../../store/healthFacility/actions');
    renderCreateHealthFacility();
    await waitFor(() => {
      expect(clearAllDependentData).toHaveBeenCalled();
    });
  });

  it('dispatches clearBranchesByUnion on mount', async () => {
    const { clearBranchesByUnion } = require('../../../store/branch/actions');
    renderCreateHealthFacility();
    await waitFor(() => {
      expect(clearBranchesByUnion).toHaveBeenCalled();
    });
  });

  it('dispatches fetchSSPrefixRequest on mount', async () => {
    const { fetchSSPrefixRequest } = require('../../../store/healthFacility/actions');
    renderCreateHealthFacility();
    await waitFor(() => {
      expect(fetchSSPrefixRequest).toHaveBeenCalled();
    });
  });

  it('renders details step with Health Facility Details label on page 1', async () => {
    renderCreateHealthFacility();
    await waitFor(() => {
      expect(screen.getByTestId('health-facility-details-form')).toBeInTheDocument();
      expect(screen.getByText('Health Facility Details')).toBeInTheDocument();
    });
  });

  it('shows Cancel button on details page', async () => {
    renderCreateHealthFacility();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  it('navigates to list when Cancel is clicked on details page', async () => {
    renderCreateHealthFacility();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        PROTECTED_ROUTES.healthFacilityByRegion.replace(':regionId', '1').replace(':tenantId', '1')
      );
    });
  });

  it('shows Next button on details page', async () => {
    renderCreateHealthFacility();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });
  });

  it('does not show loader when not loading', async () => {
    renderCreateHealthFacility();
    await waitFor(() => {
      expect(screen.getByTestId('create-site-form')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('shows loader when healthFacility loading is true', async () => {
    store = mockStore({
      ...defaultStoreState,
      healthFacility: { ...defaultStoreState.healthFacility, loading: true }
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[createPath]}>
          <Route path='/region/:regionId/:tenantId/health-facility/create' component={CreateHealthFacility} />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  it('shows loader when workflow loading is true', async () => {
    store = mockStore({
      ...defaultStoreState,
      healthFacility: { ...defaultStoreState.healthFacility, clinicalWorkflowLoading: true }
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[createPath]}>
          <Route path='/region/:regionId/:tenantId/health-facility/create' component={CreateHealthFacility} />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('shasthyaShebikas payload', () => {
    const ssUsersFixture = [
      {
        ssId: { id: 1, name: 'SS01' },
        name: 'SS User',
        phoneNumber: '+1234567890',
        subVillages: [{ id: 10 }]
      }
    ];

    const submitCreateHealthFacility = async () => {
      renderCreateHealthFacility();
      await waitFor(() => {
        expect(screen.getByTestId('create-site-form')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      await waitFor(() => {
        expect(screen.getByTestId('workflows')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('icon-btn-Add-User'));
      await waitFor(() => {
        expect(screen.getByTestId('user-form')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        const { createHFRequest } = require('../../../store/healthFacility/actions');
        expect(createHFRequest).toHaveBeenCalled();
      });
      const { createHFRequest } = require('../../../store/healthFacility/actions');
      return createHFRequest.mock.calls[createHFRequest.mock.calls.length - 1][0];
    };

    it('omits shasthyaShebikas for non-SK role', async () => {
      mockUserFormValues.users = [{ role: { name: 'CHW' } }];
      mockUserFormValues.ssUsers = ssUsersFixture;
      const payload = await submitCreateHealthFacility();
      expect(payload.data.users[0]).not.toHaveProperty('shasthyaShebikas');
    });

    it('includes shasthyaShebikas for SK role with SS data', async () => {
      mockUserFormValues.users = [{ role: { name: shastiyaKormiRole } }];
      mockUserFormValues.ssUsers = ssUsersFixture;
      const payload = await submitCreateHealthFacility();
      expect(payload.data.users[0].shasthyaShebikas).toEqual([
        {
          name: 'SS User',
          phoneNumber: '+1234567890',
          ssId: 'SS01',
          subVillageIds: ['10'],
          isActive: true
        }
      ]);
    });

    it('includes empty shasthyaShebikas for SK role when ssUsers is cleared', async () => {
      mockUserFormValues.users = [{ role: { name: shastiyaKormiRole } }];
      mockUserFormValues.ssUsers = [];
      const payload = await submitCreateHealthFacility();
      expect(payload.data.users[0].shasthyaShebikas).toEqual([]);
    });
  });
});
