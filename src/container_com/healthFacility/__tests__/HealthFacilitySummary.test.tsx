import React, { act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import HealthFacilitySummary, { formatHealthFacility, formatHFUserData } from '../HealthFacilitySummary';
import { userDataSelector } from '../../../store/user/selectors';
import { getIsUploadingSelector, getLoadingSelector, getRegionDetailsSelector } from '../../../store/region/selectors';

const countryId = 1000;

const mockStore = configureStore([]);
// Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn()
}));
const mockFetchHFUserListRequest = jest.fn();
const mockFetchHFSummaryRequest = jest.fn();
const mockClearSupervisorList = jest.fn();
const mockClearVillageHFList = jest.fn();
jest.mock('../../../utils/toastCenter');
jest.mock('../../../components/modal/ModalForm', () => ({
  __esModule: true,
  default: ({ handleFormSubmit, initialValues, render }: any) => (
    <div data-testid='mock-modal-form'>
      <button onClick={() => handleFormSubmit(initialValues)}>Submit</button>
      {render()}
    </div>
  )
}));
jest.mock('../../../store/healthFacility/actions', () => ({
  fetchHFUserListRequest: (...args: any) => {
    mockFetchHFUserListRequest(...args);
    return { type: 'MOCK_FETCH_HF_USER_LIST' };
  },
  fetchHFSummaryRequest: (...args: any) => {
    mockFetchHFSummaryRequest(...args);
    return { type: 'MOCK_FETCH_HF_SUMMARY' };
  },
  clearSupervisorList: () => {
    mockClearSupervisorList();
    return { type: 'MOCK_CLEAR_SUPERVISOR_LIST' };
  },
  clearVillageHFList: () => {
    mockClearVillageHFList();
    return { type: 'MOCK_CLEAR_VILLAGE_HF_LIST' };
  }
}));
const mockUseEffect = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (...args: any) => mockUseEffect(...args),
  useState: jest.fn(() => [{}, jest.fn()]),
  useCallback: jest.fn((fn) => fn),
  useMemo: jest.fn((fn) => fn()),
  useRef: jest.fn(() => ({ current: { users: [{}] } }))
}));
jest.mock('../../../hooks/tablePagination', () => ({
  useTablePaginationHook: () => ({
    listParams: { page: 1, rowsPerPage: 10, searchTerm: '' },
    handleSearch: jest.fn(),
    handlePage: jest.fn()
  })
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ healthFacilityId: '1', hfTenantId: '2' })
}));
jest.mock('../../../components/modal/ModalForm', () => ({
  __esModule: true,
  default: () => null
}));

describe('HealthFacilitySummary', () => {
  let store: any;
  const mockHealthFacility = {
    id: 1,
    name: 'Test Facility',
    type: 'Hospital',
    cityName: 'Test City',
    language: 'English',
    clinicalWorkflows: [{ id: 1 }, { id: 2 }]
  };
  beforeEach(() => {
    const initialState = {
      healthFacility: {
        data: mockHealthFacility,
        editHFDetailsModal: {
          isOpen: true,
          data: mockHealthFacility
        },
        submittedData: { isNextClicked: false }
      },
      user: {
        userData: {
          country: { id: 1, name: 'Test Country' }
        }
      },
      region: {
        loading: false,
        isUploading: false,
        regionDetails: {
          list: [
            { id: 1, name: 'Region 1' },
            { id: 2, name: 'Region 2' }
          ],
          total: 2
        }
      }
    };
    store = mockStore(initialState);
    const { useSelector } = require('react-redux');

    useSelector.mockImplementation((selector: any) => {
      if (selector === userDataSelector) return initialState.user.userData;
      if (selector === getRegionDetailsSelector) return initialState.region.regionDetails;
      if (selector === getLoadingSelector) return initialState.region.loading;
      if (selector === getIsUploadingSelector) return initialState.region.isUploading;
    });
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  it('should render without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/health-facility/1/tenant/2']}>
          <Route path='/health-facility/:healthFacilityId/tenant/:hfTenantId'>
            <HealthFacilitySummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(getByText('Health Facility Summary')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
    // If the component renders without throwing an error, the test will pass
  });

  it('should call correct functions in useEffect', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/health-facility/1/tenant/2']}>
          <Route path='/health-facility/:healthFacilityId/tenant/:hfTenantId'>
            <HealthFacilitySummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    const effectFn = mockUseEffect.mock.calls[0][0];

    act(() => {
      effectFn();
    });

    // Check that the functions were called
    expect(mockFetchHFUserListRequest).toHaveBeenCalled();
    expect(mockFetchHFSummaryRequest).toHaveBeenCalled();

    const cleanupFn = effectFn();

    // Call the cleanup function
    act(() => {
      cleanupFn();
    });

    // Check that cleanup functions were called
    expect(mockClearSupervisorList).toHaveBeenCalled();
    expect(mockClearVillageHFList).toHaveBeenCalled();
  });

  it('should format health facility data correctly', () => {
    const mockHF = {
      id: 1,
      name: '  Test Health Facility  ',
      type: { name: 'Hospital' },
      phuFocalPersonName: 'John Doe',
      phuFocalPersonNumber: '1234567890',
      address: '123 Test St',
      district: 'Test District',
      chiefdom: { tenantId: 100 },
      city: { name: 'Test City' },
      latitude: 12.345,
      longitude: 67.89,
      postalCode: '12345',
      language: { name: 'English' },
      tenantId: 200,
      peerSupervisors: [{ id: 1 }, { id: 2 }],
      linkedVillages: [{ id: 3 }, { id: 4 }],
      workflows: [5, 6]
    };

    const countryId = 1000;

    const result = formatHealthFacility(mockHF, countryId);

    expect(result).toEqual({
      id: 1,
      name: 'Test Health Facility',
      type: 'Hospital',
      phuFocalPersonName: 'John Doe',
      phuFocalPersonNumber: '1234567890',
      address: '123 Test St',
      district: 'Test District',
      chiefdom: { tenantId: 100 },
      cityName: 'Test City',
      latitude: 12.345,
      longitude: 67.89,
      postalCode: '12345',
      country: { id: 1000 },
      language: 'English',
      parentTenantId: 100,
      tenantId: 200,
      linkedSupervisorIds: [1, 2],
      linkedVillageIds: [3, 4],
      clinicalWorkflowIds: [5, 6]
    });
  });

  it('should handle missing optional fields', () => {
    const mockHF = {
      id: 1,
      name: 'Test Health Facility',
      type: { name: 'Clinic' },
      city: { name: 'Test City' },
      language: { name: 'French' },
      tenantId: 200
    };

    const countryId = 2000;

    const result = formatHealthFacility(mockHF, countryId);

    expect(result).toEqual({
      id: 1,
      name: 'Test Health Facility',
      type: 'Clinic',
      phuFocalPersonName: undefined,
      phuFocalPersonNumber: undefined,
      address: undefined,
      district: undefined,
      chiefdom: undefined,
      cityName: 'Test City',
      latitude: undefined,
      longitude: undefined,
      postalCode: undefined,
      country: { id: 2000 },
      language: 'French',
      parentTenantId: undefined,
      tenantId: 200,
      linkedSupervisorIds: [],
      linkedVillageIds: [],
      clinicalWorkflowIds: undefined
    });
  });

  it('should handle string countryId', () => {
    const userData = [
      {
        id: '6',
        firstName: 'David',
        lastName: 'Wilson',
        country: { phoneNumberCode: '+1' },
        countryCode: '+44',
        roles: [{ id: 1 }]
      }
    ];
    const stringCountryId = '8000';

    const result = formatHFUserData(userData, stringCountryId);

    expect(result[0]).toEqual(
      expect.objectContaining({
        id: 6,
        firstName: 'David',
        lastName: 'Wilson',
        gender: undefined,
        username: undefined,
        phoneNumber: undefined,
        countryCode: '+1',
        country: { id: 8000 },
        tenantId: null,
        supervisorId: NaN, // Changed from NaN to undefined
        roleIds: [1],
        villageIds: [],
        supersetUserOrganizationIds: []
      })
    );
  });

  it('should handle check the tenenant in health facility ', () => {
    const userData = [
      {
        id: '6',
        firstName: 'David',
        lastName: 'Wilson',
        country: { phoneNumberCode: '+1' },
        countryCode: '+44',
        roles: [{ id: 1 }],
        healthFacility: { tenantId: '6000' },
        tenantId: 7000,
        organizations: [{ id: '8000' }]
      }
    ];
    const countryId = '8000';

    const result = formatHFUserData(userData, countryId, '9000');

    expect(result[0].tenantId).toBe(6000);
  });
  it('should handle check the tenenant ', () => {
    const userData = [
      {
        id: '6',
        firstName: 'David',
        lastName: 'Wilson',
        country: { phoneNumberCode: '+1' },
        countryCode: '+44',
        roles: [{ id: 1 }],
        tenantId: 7000,
        organizations: [{ id: '8000' }]
      }
    ];
    const countryId = '8000';

    const result = formatHFUserData(userData, countryId);

    expect(result[0].tenantId).toBe(7000);
  });

  it('should handle check the tenenant in organization', () => {
    const userData = [
      {
        id: '6',
        firstName: 'David',
        lastName: 'Wilson',
        country: { phoneNumberCode: '+1' },
        countryCode: '+44',
        roles: [{ id: 1 }],
        organizations: [{ id: '8000' }]
      }
    ];
    const countryId = '8000';
    const result = formatHFUserData(userData, countryId);
    expect(result[0].tenantId).toBe(8000);
  });
  it('should set tenantId to null when no valid source is available', () => {
    const userData = [
      {
        id: '5',
        firstName: 'Charlie',
        lastName: 'Brown',
        country: { phoneNumberCode: '+1' },
        countryCode: '+44',
        roles: [{ id: 1 }]
      }
    ];

    const result = formatHFUserData(userData, countryId);
    expect(result[0].tenantId).toBeNull();
  });
  it('should handle check the villages', () => {
    const userData = [
      {
        id: '6',
        firstName: 'David',
        lastName: 'Wilson',
        country: { phoneNumberCode: '+1' },
        countryCode: '+44',
        roles: [{ id: 1 }],
        organizations: [{ id: '8000' }],
        villages: [{ id: '9000' }]
      }
    ];
    const countryId = '8000';

    const result = formatHFUserData(userData, countryId);
    expect(result[0].villageIds).toEqual(['9000']);
  });

  it('should handle check the supersetUserOrganization', () => {
    const userData = [
      {
        id: '6',
        firstName: 'David',
        lastName: 'Wilson',
        country: { phoneNumberCode: '+1' },
        countryCode: '+44',
        roles: [{ id: 1 }],
        organizations: [{ id: '8000' }],
        villages: [{ id: '9000' }],
        supersetUserOrganization: [{ tenantId: 2000 }, { tenantId: 3000 }]
      }
    ];
    const countryId = '8000';

    const result = formatHFUserData(userData, countryId);

    expect(result[0].supersetUserOrganizationIds).toEqual([2000, 3000]);
  });
  it('should handle an empty array of supersetUserOrganization', () => {
    const userData = [
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        roles: [{ id: 1 }],
        organizations: [{ id: '8000' }],
        villages: [{ id: '9000' }],
        supersetUserOrganization: [],
        country: { phoneNumberCode: '+1' },
        countryCode: '+44'
      }
    ];

    const result = formatHFUserData(userData, countryId);
    expect(result[0].supersetUserOrganizationIds).toEqual([]);
  });
  it('should handle missing supersetUserOrganization', () => {
    const userData = [
      {
        id: '3',
        firstName: 'Bob',
        lastName: 'Smith',
        country: { phoneNumberCode: '+1' },
        countryCode: '+44',
        roles: [{ id: 1 }],
        organizations: [{ id: '8000' }],
        villages: [{ id: '9000' }]
      }
    ];

    const result = formatHFUserData(userData, countryId);
    expect(result[0].supersetUserOrganizationIds).toEqual([]);
  });

  it('should render ModalForm with correct props when editHFDetailsModal is open', () => {
    const mockDispatch = jest.fn();
    const useDispatchSpy = jest.spyOn(require('react-redux'), 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatch);
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/health-facility/1/tenant/2']}>
          <Route path='/health-facility/:healthFacilityId/tenant/:hfTenantId'>
            <HealthFacilitySummary />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const editButton = getByText('Edit Health Facility');
    fireEvent.click(editButton);

    expect(mockDispatch).toHaveBeenCalledWith();
  });
});
