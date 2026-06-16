import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import UserForm from '../UserForm';
import { clearBranchesByUnion } from '../../../store/branch/actions';
import APPCONSTANTS from '../../../constants/appConstants';
import { chcpRole, heRole, nurseRole } from '../../../constants/roleConstants';

const mockStore = configureStore([]);

jest.mock('../../../routes', () => ({
  REGION_ADMIN: 'REGION_ADMIN',
  REPORT_ADMIN: 'REPORT_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPER_USER: 'SUPER_USER'
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ tenantId: '1', healthFacilityId: undefined }),
  useLocation: () => ({ pathname: '/region/1' })
}));

jest.mock('../../../hooks/appTypeBasedConfigs', () => ({
  __esModule: true,
  default: () => ({
    isCommunity: false,
    appTypes: [],
    district: { s: 'County', p: 'Counties' },
    healthFacility: { s: 'Health Facility', p: 'Health Facilities' },
    user: {
      culture: { available: false },
      designation: { available: false },
      community: { available: false }
    },
    userList: { filters: { available: false } },
    GENDER_OPTIONS: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ]
  })
}));

const mockGetSuiteAccessList = jest.fn(() => [{ groupName: 'SPICE', label: 'SPICE' }]);
const mockGetSpiceGroupName = jest.fn((suiteAccess: any[]) => suiteAccess?.[0] || { groupName: 'SPICE' });
const mockFormUserData = jest.fn((data: any) => data || {});
const mockIsCHPCHWSelected = jest.fn(() => false);
const mockIsRoleExists = jest.fn(() => false);
const mockRoleBasedAppTypes = jest.fn(() => []);
const mockRoleChange = jest.fn();
const mockGetRoleOptions = jest.fn();
let mockRoleOptionsFn: ((args: any) => void) | undefined;

jest.mock('../userFormUtils', () => {
  const actual = jest.requireActual('../userFormUtils');
  return {
    __esModule: true,
    default: () => ({
      isCHPCHWSelected: mockIsCHPCHWSelected,
      isRoleExists: mockIsRoleExists,
      siteRolesChange: jest.fn(),
      getSuiteAccessList: mockGetSuiteAccessList,
      isHFAdminSelected: false,
      getSpiceGroupName: mockGetSpiceGroupName,
      formUserData: mockFormUserData,
      roleBasedAppTypes: mockRoleBasedAppTypes
    }),
    filterRolesByAppTypeFn: (roles: any) => roles || {},
    isVillageBasedRoleSelection: jest.fn(() => false),
    getHfFilteredByRole: actual.getHfFilteredByRole,
    getSpiceRoleOptionsForHF: actual.getSpiceRoleOptionsForHF
  };
});

jest.mock('../../../hooks/roleHook', () => ({
  useRoleMeta: () => ({
    roleChange: mockRoleChange
  })
}));

jest.mock('../../../hooks/roleOptionsHook', () => ({
  useRoleOptions: ({ roleOptionsFn }: any) => {
    mockRoleOptionsFn = roleOptionsFn;
    return {
      getRoleOptions: mockGetRoleOptions
    };
  }
}));

jest.mock('../../../assets/images/bin.svg', () => ({ ReactComponent: () => <span data-testid='bin-icon' /> }));
jest.mock('../../../assets/images/plus_blue.svg', () => ({ ReactComponent: () => <span data-testid='plus-icon' /> }));
jest.mock('../../../assets/images/reset.svg', () => ({ ReactComponent: () => <span data-testid='reset-icon' /> }));

jest.mock('../../formFields/TextInput', () => {
  const ReactLib = require('react');
  return {
    __esModule: true,
    default: (props: any) => {
      const { errorLabel, ...inputProps } = props;
      return ReactLib.createElement(
        'div',
        { 'data-testid': 'text-input' },
        ReactLib.createElement('label', null, props.label),
        ReactLib.createElement('input', {
          'data-testid': `input-${(props.label || '').replace(/\s/g, '-')}`,
          ...inputProps
        })
      );
    }
  };
});

jest.mock('../../formFields/EmailField', () => {
  const ReactLib = require('react');
  return {
    __esModule: true,
    default: ReactLib.forwardRef((props: any, ref: any) =>
      ReactLib.createElement('div', { 'data-testid': 'email-field' },
        ReactLib.createElement('label', null, 'Email'),
        ReactLib.createElement('input', { 'data-testid': 'email-input', ref, ...props })
      )
    )
  };
});

jest.mock('../../formFields/UsernameField', () => {
  const ReactLib = require('react');
  return {
    __esModule: true,
    default: ReactLib.forwardRef((props: any, ref: any) =>
      ReactLib.createElement('div', { 'data-testid': 'username-field' },
        ReactLib.createElement('label', null, 'Username'),
        ReactLib.createElement('input', { 'data-testid': 'username-input', ref, ...props })
      )
    )
  };
});

const mockPhoneNumberCalls: any[] = [];
jest.mock('../../formFields/PhoneNumber', () => ({
  __esModule: true,
  default: (props: any) => {
    mockPhoneNumberCalls.push(props);
    return <div data-testid='phone-number-field'>Phone Number</div>;
  }
}));

jest.mock('../../formFields/Radio', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid='radio-group'>
      <label>{props.fieldLabel}</label>
      {(props.options || []).map((opt: any) => (
        <label key={opt.value}>
          <input type='radio' value={opt.value} name={props.name} />
          {opt.label}
        </label>
      ))}
    </div>
  )
}));

const mockSelectInputCalls: any[] = [];
jest.mock('../../formFields/SelectInput', () => ({
  __esModule: true,
  default: (props: any) => {
    mockSelectInputCalls.push(props);
    return (
    <div data-testid='select-input'>
      <label>{props.label}</label>
      {typeof props.onChange === 'function' && (
        <button
          type='button'
          data-testid={`select-trigger-${(props.label || '').replace(/\s/g, '-')}`}
          onClick={() => props.onChange({ id: 101, tenantId: 202, name: 'HF A' })}
        >
          trigger-change
        </button>
      )}
    </div>
    );
  }
}));

const mockMultiSelectCalls: any[] = [];
jest.mock('../../multiSelect/MultiSelect', () => ({
  __esModule: true,
  default: (props: any) => {
    mockMultiSelectCalls.push(props);
    return (
    <div data-testid='multi-select'>
      <label>{props.label}</label>
      {props.label === 'SPICE Role' && typeof props.onChange === 'function' && (
        <>
          <button
            type='button'
            data-testid='spice-role-change-trigger-chcp'
            onClick={() =>
              props.onChange([{ id: 2, name: 'CHCP', displayName: 'CHCP', groupName: 'SPICE' }], 0)
            }
          >
            trigger-chcp
          </button>
          <button
            type='button'
            data-testid='spice-role-change-trigger-he'
            onClick={() =>
              props.onChange([{ id: 3, name: 'HE', displayName: 'HE', groupName: 'SPICE' }], 0)
            }
          >
            trigger-he
          </button>
          <button
            type='button'
            data-testid='spice-role-change-trigger-nurse'
            onClick={() =>
              props.onChange([{ id: 2, name: 'NURSE', displayName: 'Nurse', groupName: 'SPICE' }], 0)
            }
          >
            trigger-nurse
          </button>
        </>
      )}
    </div>
    );
  }
}));

jest.mock('../userConditionalFields/AdminFields', () => ({
  SiteUserForm: () => <div data-testid='site-user-form'>SiteUserForm</div>
}));

jest.mock('../userConditionalFields/DynamicCHForm', () => ({
  DynamicCHForm: (props: any) => {
    mockDynamicCHFormCalls.push(props);
    return <div data-testid='dynamic-ch-form'>DynamicCHForm</div>;
  }
}));

const mockDynamicCHFormCalls: any[] = [];
const mockBranchTaggingFieldsCalls: any[] = [];
jest.mock('../userConditionalFields/BranchTaggingFields', () => ({
  __esModule: true,
  default: (props: any) => {
    mockBranchTaggingFieldsCalls.push(props);
    return <div data-testid='branch-tagging-fields'>BranchTaggingFields</div>;
  }
}));

const mockDistrictChiefdomVillageFieldsCalls: any[] = [];
jest.mock('../userConditionalFields/DistrictChiefdomVillageFields', () => ({
  __esModule: true,
  default: (props: any) => {
    mockDistrictChiefdomVillageFieldsCalls.push(props);
    return <div data-testid='district-chiefdom-village-fields'>DistrictChiefdomVillageFields</div>;
  }
}));

const mockAssignSSUsersSectionCalls: any[] = [];
jest.mock('../AssignSSUsersSection', () => ({
  __esModule: true,
  default: (props: any) => {
    mockAssignSSUsersSectionCalls.push(props);
    return <div data-testid='assign-ss-users-section'>AssignSSUsersSection</div>;
  }
}));

jest.mock('../../../utils/toastCenter', () => ({
  __esModule: true,
  default: { error: jest.fn(), success: jest.fn() },
  getErrorToastArgs: jest.fn(() => [])
}));

const defaultStoreState = {
  user: {
    user: { role: 'SUPER_ADMIN', country: { id: 1 } },
    userRoles: { SPICE: [{ id: 1, name: 'Admin', groupName: 'SPICE', displayName: 'Admin', appTypes: ['web'] }] },
    isRolesLoading: false
  },
  healthFacility: {
    healthFacilityList: [],
    peerSupervisorList: { list: [] },
    villagesFromHFList: { list: [] },
    countryList: []
  },
  district: { districtList: [], districtLoading: false },
  chiefdom: { chiefdomList: [], chiefdomLoading: false },
  culture: { cultureList: [] },
  common: { communityList: [] },
  designation: { designationList: [] },
  country: { countryList: [] }
};

const defaultProps = {
  form: {} as any,
  countryId: 1,
  hfTenantId: 1,
  appTypes: [],
  userFormParams: {
    isHF: false,
    isHFCreate: false,
    isEdit: false,
    isProfile: false,
    isFromAdminList: false,
    isAdminForm: false
  }
};

const renderUserForm = (
  props: any = {},
  storeState: any = defaultStoreState,
  formInitialValues: any = undefined
) => {
  const store = mockStore(storeState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Form onSubmit={jest.fn()} mutators={{ ...arrayMutators }} initialValues={formInitialValues}>
          {({ form }) => <UserForm {...defaultProps} form={form} {...props} />}
        </Form>
      </MemoryRouter>
    </Provider>
  );
};

describe('UserForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAssignSSUsersSectionCalls.length = 0;
    mockDynamicCHFormCalls.length = 0;
    mockBranchTaggingFieldsCalls.length = 0;
    mockDistrictChiefdomVillageFieldsCalls.length = 0;
    mockMultiSelectCalls.length = 0;
    mockSelectInputCalls.length = 0;
    mockGetSuiteAccessList.mockReturnValue([{ groupName: 'SPICE', label: 'SPICE' }]);
    mockGetSpiceGroupName.mockImplementation((suiteAccess: any[]) => suiteAccess?.[0] || { groupName: 'SPICE' });
    mockFormUserData.mockImplementation((data: any) => data || {});
    mockGetRoleOptions.mockImplementation(() => {
      mockRoleOptionsFn?.({
        spiceRoleOptions: [
          { id: 1, name: 'CHCP', displayName: 'CHCP', groupName: 'SPICE', appTypes: ['web'] },
          { id: 2, name: nurseRole, displayName: 'Nurse', groupName: 'SPICE', appTypes: ['web'] }
        ],
        reportRoleOptions: [],
        insightRoleOptions: []
      });
    });
  });

  describe('Component rendering', () => {
    it('renders without crashing', () => {
      renderUserForm();
      expect(screen.getByTestId('assign-ss-users-section')).toBeInTheDocument();
    });

    it('renders AssignSSUsersSection', () => {
      renderUserForm();
      expect(screen.getByText('AssignSSUsersSection')).toBeInTheDocument();
    });

    it('renders First Name and Last Name fields', () => {
      renderUserForm();
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
    });

    it('renders Username and Email fields', () => {
      renderUserForm();
      expect(screen.getByTestId('username-field')).toBeInTheDocument();
      expect(screen.getByTestId('email-field')).toBeInTheDocument();
    });

    it('renders Gender radio group', () => {
      renderUserForm();
      expect(screen.getByText('Gender')).toBeInTheDocument();
    });

    it('renders Suite Access when not isPeerSupervisor', () => {
      renderUserForm({ isPeerSupervisor: false });
      expect(screen.getByText('Suite Access')).toBeInTheDocument();
    });

    it('does not render Suite Access when isPeerSupervisor is true', () => {
      renderUserForm({ isPeerSupervisor: true });
      expect(screen.queryByText('Suite Access')).not.toBeInTheDocument();
    });

    it('renders SiteUserForm and DynamicCHForm', () => {
      renderUserForm();
      expect(screen.getByTestId('site-user-form')).toBeInTheDocument();
      expect(screen.getByTestId('dynamic-ch-form')).toBeInTheDocument();
    });

    it('passes spiceRoleList to DynamicCHForm', () => {
      renderUserForm();
      expect(mockDynamicCHFormCalls.length).toBeGreaterThanOrEqual(1);
      expect(mockDynamicCHFormCalls[mockDynamicCHFormCalls.length - 1]).toHaveProperty('spiceRoleList');
    });

    it('passes spiceRoleList with CHCP to DynamicCHForm when CHCP is default-selected', async () => {
      const storeWithChcpRole = {
        ...defaultStoreState,
        user: {
          ...defaultStoreState.user,
          userRoles: {
            SPICE: [
              { id: 1, name: 'Admin', groupName: 'SPICE', displayName: 'Admin', appTypes: ['web'] },
              { id: 2, name: chcpRole, groupName: 'SPICE', displayName: 'CHCP', appTypes: ['web'] }
            ]
          }
        }
      };
      renderUserForm(
        {
          userFormParams: { ...defaultProps.userFormParams, isAdminForm: true },
          defaultSelectedRole: chcpRole
        },
        storeWithChcpRole
      );
      await waitFor(() => {
        const lastCall = mockDynamicCHFormCalls[mockDynamicCHFormCalls.length - 1];
        expect(lastCall.spiceRoleList).toEqual(
          expect.arrayContaining([expect.objectContaining({ name: chcpRole })])
        );
      });
    });

    it('passes BranchTaggingFields props even when Shastiya Kormi role is not selected', () => {
      const initialValues = {
        users: [{ role: [{ name: 'OTHER_ROLE', id: 1 }], suiteAccess: [{ groupName: 'SPICE' }] }]
      };
      renderUserForm({}, defaultStoreState, initialValues);
      expect(screen.getByTestId('branch-tagging-fields')).toBeInTheDocument();
      expect(mockBranchTaggingFieldsCalls.length).toBeGreaterThanOrEqual(1);
    });

    it(
      'renders BranchTaggingFields with expected props when Shastiya Kormi is default-selected (isAdminForm)',
      async () => {
      const storeWithShastiyaKormi = {
        ...defaultStoreState,
        user: {
          ...defaultStoreState.user,
          userRoles: {
            SPICE: [
              { id: 1, name: 'Admin', groupName: 'SPICE', displayName: 'Admin', appTypes: ['web'] },
              { id: 2, name: 'SHASTIYA_KORMI', groupName: 'SPICE', displayName: 'Shastiya Kormi', appTypes: ['web'] }
            ]
          }
        }
      };
      renderUserForm(
        {
          userFormParams: { ...defaultProps.userFormParams, isAdminForm: true },
          defaultSelectedRole: 'SHASTIYA_KORMI'
        },
        storeWithShastiyaKormi
      );
      await waitFor(
        () => {
          expect(mockBranchTaggingFieldsCalls.length).toBeGreaterThanOrEqual(1);
        },
        { timeout: 3000 }
      );
      const lastCall = mockBranchTaggingFieldsCalls[mockBranchTaggingFieldsCalls.length - 1];
      expect(lastCall).toHaveProperty('name');
      expect(lastCall).toHaveProperty('isError');
      expect(lastCall).toHaveProperty('isHFCreate');
      expect(lastCall).toHaveProperty('index');
    });

    it('passes DistrictChiefdomVillageFields props even when PO role is not selected', () => {
      const initialValues = {
        users: [{ role: [{ name: 'OTHER_ROLE', id: 1 }], suiteAccess: [{ groupName: 'SPICE' }] }]
      };
      renderUserForm({}, defaultStoreState, initialValues);
      expect(screen.getByTestId('district-chiefdom-village-fields')).toBeInTheDocument();
      expect(mockDistrictChiefdomVillageFieldsCalls.length).toBeGreaterThanOrEqual(1);
    });

    it(
      'renders DistrictChiefdomVillageFields with expected props when PO is default-selected (isAdminForm)',
      async () => {
      const storeWithPo = {
        ...defaultStoreState,
        user: {
          ...defaultStoreState.user,
          userRoles: {
            SPICE: [
              { id: 1, name: 'Admin', groupName: 'SPICE', displayName: 'Admin', appTypes: ['web'] },
              { id: 2, name: 'PO', groupName: 'SPICE', displayName: 'PO', appTypes: ['web'] }
            ]
          }
        }
      };
      renderUserForm(
        {
          userFormParams: { ...defaultProps.userFormParams, isAdminForm: true },
          defaultSelectedRole: 'PO'
        },
        storeWithPo
      );
      await waitFor(
        () => {
          expect(mockDistrictChiefdomVillageFieldsCalls.length).toBeGreaterThanOrEqual(1);
        },
        { timeout: 3000 }
      );
      const lastCall = mockDistrictChiefdomVillageFieldsCalls[mockDistrictChiefdomVillageFieldsCalls.length - 1];
      expect(lastCall).toHaveProperty('name');
      expect(lastCall).toHaveProperty('isError');
      expect(lastCall).toHaveProperty('isHFCreate');
      expect(lastCall).toHaveProperty('index');
      expect(lastCall).toHaveProperty('form');
      }
    );

    it('renders DistrictChiefdomVillageFields with expected props when HE is default-selected (isAdminForm)',
      async () => {
      const storeWithHe = {
        ...defaultStoreState,
        user: {
          ...defaultStoreState.user,
          userRoles: {
            SPICE: [
              { id: 1, name: 'Admin', groupName: 'SPICE', displayName: 'Admin', appTypes: ['web'] },
              { id: 2, name: heRole, groupName: 'SPICE', displayName: 'HE', appTypes: ['web'] }
            ]
          }
        }
      };
      renderUserForm(
        {
          userFormParams: { ...defaultProps.userFormParams, isAdminForm: true },
          defaultSelectedRole: heRole
        },
        storeWithHe
      );
      await waitFor(() => {
        expect(mockDistrictChiefdomVillageFieldsCalls.length).toBeGreaterThanOrEqual(1);
      });
      const lastCall = mockDistrictChiefdomVillageFieldsCalls[mockDistrictChiefdomVillageFieldsCalls.length - 1];
      expect(lastCall).toHaveProperty('name');
      expect(lastCall).toHaveProperty('isError');
      expect(lastCall).toHaveProperty('isHFCreate');
      expect(lastCall).toHaveProperty('index');
      expect(lastCall).toHaveProperty('form');
    });

    it('passes DistrictChiefdomVillageFields base props when FO is default-selected', async () => {
      const storeWithFo = {
        ...defaultStoreState,
        user: {
          ...defaultStoreState.user,
          userRoles: {
            SPICE: [
              { id: 1, name: 'Admin', groupName: 'SPICE', displayName: 'Admin', appTypes: ['web'] },
              { id: 2, name: 'FO', groupName: 'SPICE', displayName: 'FO', appTypes: ['web'] }
            ]
          }
        }
      };
      renderUserForm(
        {
          userFormParams: { ...defaultProps.userFormParams, isAdminForm: true },
          defaultSelectedRole: 'FO'
        },
        storeWithFo
      );
      await waitFor(() => {
        expect(mockDistrictChiefdomVillageFieldsCalls.length).toBeGreaterThanOrEqual(1);
      });
      const lastCall = mockDistrictChiefdomVillageFieldsCalls[mockDistrictChiefdomVillageFieldsCalls.length - 1];
      expect(lastCall).toHaveProperty('index');
      expect(lastCall).toHaveProperty('form');
    });

    it('renders Phone Number field', () => {
      renderUserForm();
      expect(screen.getByText('Phone Number')).toBeInTheDocument();
    });
  });

  describe('Add / Remove user actions', () => {
    it('renders Add Another Admin when disableOptions is false and not isHF', () => {
      renderUserForm({ disableOptions: false });
      expect(screen.getByText('Add Another Admin')).toBeInTheDocument();
    });

    it('renders Add Another User when disableOptions is false and isHF', () => {
      renderUserForm({
        disableOptions: false,
        userFormParams: { ...defaultProps.userFormParams, isHF: true }
      });
      expect(screen.getByText('Add Another User')).toBeInTheDocument();
    });

    it('does not render Add/Remove/Reset when disableOptions is true', () => {
      renderUserForm({ disableOptions: true });
      expect(screen.queryByText('Add Another Admin')).not.toBeInTheDocument();
      expect(screen.queryByText('Remove User')).not.toBeInTheDocument();
      expect(screen.queryByText('Reset Fields')).not.toBeInTheDocument();
    });

    it('renders Reset Fields and Add Another can be clicked when disableOptions is false', () => {
      renderUserForm({ disableOptions: false });
      expect(screen.getByText('Reset Fields')).toBeInTheDocument();
      const addLink = screen.getByText('Add Another Admin');
      expect(() => fireEvent.click(addLink)).not.toThrow();
      expect(screen.getAllByText('Reset Fields').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Icons', () => {
    it('renders Add Another action when disableOptions is false', () => {
      renderUserForm({ disableOptions: false });
      expect(screen.getByText('Add Another Admin')).toBeInTheDocument();
    });

    it('renders reset icon when disableOptions is false', () => {
      renderUserForm({ disableOptions: false });
      const resetIcons = screen.getAllByTestId('reset-icon');
      expect(resetIcons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edit mode', () => {
    it('renders with initialEditValue in edit mode', () => {
      const initialEditValue = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        roles: [],
        organizations: [],
        villages: []
      };
      renderUserForm({
        isEdit: true,
        initialEditValue,
        userFormParams: { ...defaultProps.userFormParams, isEdit: true }
      });
      expect(screen.getByTestId('assign-ss-users-section')).toBeInTheDocument();
    });

    it('dispatches clearBranchesByUnion when assigned health facility changes', async () => {
      const store = mockStore(defaultStoreState);
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Form onSubmit={jest.fn()} mutators={{ ...arrayMutators }}>
              {({ form }) => (
                <UserForm
                  {...defaultProps}
                  form={form}
                  isPeerSupervisor={true}
                  userFormParams={{ ...defaultProps.userFormParams, isEdit: true }}
                  isEdit={true}
                />
              )}
            </Form>
          </MemoryRouter>
        </Provider>
      );

      fireEvent.click(screen.getByTestId('select-trigger-Assigned-Health-Facility'));

      await waitFor(() => {
        expect(store.getActions()).toEqual(expect.arrayContaining([expect.objectContaining(clearBranchesByUnion())]));
      });
    });

    it.each([
      { roleName: 'PO' },
      { roleName: 'FO' },
      { roleName: chcpRole }
    ])(
      'renders assigned health facility selector and dispatches clearBranchesByUnion when %s user changes it',
      async ({ roleName }) => {
        const storeStateWithRole = {
          ...defaultStoreState,
          user: {
            ...defaultStoreState.user,
            userRoles: {
              SPICE: [
                { id: 1, name: 'Admin', groupName: 'SPICE', displayName: 'Admin', appTypes: ['web'] },
                { id: 2, name: roleName, groupName: 'SPICE', displayName: roleName, appTypes: ['web'] }
              ]
            }
          }
        };
        const initialValues = {
          users: [
            {
              role: [{ id: 2, name: roleName }],
              suiteAccess: [{ groupName: 'SPICE', label: 'SPICE' }]
            }
          ]
        };
        const store = mockStore(storeStateWithRole);

        render(
          <Provider store={store}>
            <MemoryRouter>
              <Form onSubmit={jest.fn()} mutators={{ ...arrayMutators }} initialValues={initialValues}>
                {({ form }) => (
                  <UserForm
                    {...defaultProps}
                    form={form}
                    userFormParams={{ ...defaultProps.userFormParams, isAdminForm: true }}
                    defaultSelectedRole={roleName}
                  />
                )}
              </Form>
            </MemoryRouter>
          </Provider>
        );

        expect(screen.getByText('Assigned Health Facility')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('select-trigger-Assigned-Health-Facility'));

        await waitFor(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining([expect.objectContaining(clearBranchesByUnion())])
          );
        });
      }
    );
  });

  describe('AssignSSUsersSection', () => {
    it('renders AssignSSUsersSection with isEdit prop from UserForm', () => {
      renderUserForm({ isEdit: true });
      expect(screen.getByTestId('assign-ss-users-section')).toBeInTheDocument();
      expect(mockAssignSSUsersSectionCalls[mockAssignSSUsersSectionCalls.length - 1]).toHaveProperty('isEdit', true);
    });
  });

  describe('PhoneNumberField', () => {
    it('passes required={true} to PhoneNumberField when rendering user form', () => {
      mockPhoneNumberCalls.length = 0;
      renderUserForm();
      const phoneNumberWithRequired = mockPhoneNumberCalls.find((c: any) => c.required === true);
      expect(phoneNumberWithRequired).toBeDefined();
    });
  });

  describe('CHCP role behavior', () => {
    const storeWithChcpRole = {
      ...defaultStoreState,
      user: {
        ...defaultStoreState.user,
        userRoles: {
          SPICE: [
            { id: 1, name: 'Admin', groupName: 'SPICE', displayName: 'Admin', appTypes: ['web'] },
            { id: 2, name: chcpRole, groupName: 'SPICE', displayName: 'CHCP', appTypes: ['web'] }
          ]
        }
      }
    };

    it('does not render Assigned Health Facility when isHF is true and CHCP is selected', () => {
      const initialValues = {
        users: [
          {
            role: [{ id: 2, name: chcpRole }],
            suiteAccess: [{ groupName: 'SPICE', label: 'SPICE' }]
          }
        ]
      };
      renderUserForm(
        {
          userFormParams: { ...defaultProps.userFormParams, isHF: true, isAdminForm: true },
          defaultSelectedRole: chcpRole
        },
        storeWithChcpRole,
        initialValues
      );
      expect(screen.queryByText('Assigned Health Facility')).not.toBeInTheDocument();
    });

    it('renders Assigned Health Facility when CHCP is selected on admin form and isHF is false', async () => {
      const initialValues = {
        users: [
          {
            role: [{ id: 2, name: chcpRole }],
            suiteAccess: [{ groupName: 'SPICE', label: 'SPICE' }]
          }
        ]
      };
      renderUserForm(
        {
          userFormParams: { ...defaultProps.userFormParams, isAdminForm: true, isHF: false },
          defaultSelectedRole: chcpRole
        },
        storeWithChcpRole,
        initialValues
      );
      await waitFor(() => {
        expect(screen.getByText('Assigned Health Facility')).toBeInTheDocument();
      });
    });

    it('calls roleChange when SPICE role is updated for site user', async () => {
      mockRoleChange.mockClear();
      renderUserForm(
        {
          isSiteUser: true,
          data: [
            {
              suiteAccess: [{ groupName: 'SPICE', label: 'SPICE', id: 'SPICE' }],
              role: [],
              roles: [],
              reportRoles: [],
              insightRoles: []
            }
          ]
        },
        storeWithChcpRole
      );

      await waitFor(() => {
        expect(screen.getByTestId('spice-role-change-trigger-chcp')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('spice-role-change-trigger-chcp'));

      await waitFor(() => {
        expect(mockRoleChange).toHaveBeenCalledWith(
          expect.objectContaining({
            index: 0,
            allRoles: expect.arrayContaining([expect.objectContaining({ name: chcpRole })])
          })
        );
      });
    });

    it('calls roleChange on mount when isHFCreate is true', async () => {
      mockRoleChange.mockClear();
      renderUserForm({
        userFormParams: { ...defaultProps.userFormParams, isHFCreate: true, isHF: true }
      });
      await waitFor(() => {
        expect(mockRoleChange).toHaveBeenCalled();
      });
    });

    it('passes DistrictChiefdomVillageFields base props when CHCP is selected (not PO-specific flow)', () => {
      const initialValues = {
        users: [
          {
            role: [{ id: 2, name: chcpRole }],
            suiteAccess: [{ groupName: 'SPICE', label: 'SPICE' }]
          }
        ]
      };
      renderUserForm({}, defaultStoreState, initialValues);
      expect(screen.getByTestId('district-chiefdom-village-fields')).toBeInTheDocument();
      expect(mockDistrictChiefdomVillageFieldsCalls.length).toBeGreaterThanOrEqual(1);
      const lastCall = mockDistrictChiefdomVillageFieldsCalls[mockDistrictChiefdomVillageFieldsCalls.length - 1];
      expect(lastCall).toHaveProperty('index');
      expect(lastCall).toHaveProperty('form');
    });
  });

  describe('HE role behavior', () => {
    const storeWithHeRole = {
      ...defaultStoreState,
      user: {
        ...defaultStoreState.user,
        userRoles: {
          SPICE: [
            { id: 1, name: 'Admin', groupName: 'SPICE', displayName: 'Admin', appTypes: ['web'] },
            { id: 2, name: heRole, groupName: 'SPICE', displayName: 'HE', appTypes: ['web'] }
          ]
        }
      }
    };

    it('passes spiceRoleList with HE to DynamicCHForm when HE is default-selected', async () => {
      renderUserForm(
        {
          userFormParams: { ...defaultProps.userFormParams, isAdminForm: true },
          defaultSelectedRole: heRole
        },
        storeWithHeRole
      );
      await waitFor(() => {
        const lastCall = mockDynamicCHFormCalls[mockDynamicCHFormCalls.length - 1];
        expect(lastCall.spiceRoleList).toEqual(
          expect.arrayContaining([expect.objectContaining({ name: heRole })])
        );
      });
    });

    it('passes DistrictChiefdomVillageFields when HE role is in form values', () => {
      const initialValues = {
        users: [
          {
            role: [{ id: 2, name: heRole }],
            suiteAccess: [{ groupName: 'SPICE', label: 'SPICE' }]
          }
        ]
      };
      renderUserForm({}, defaultStoreState, initialValues);
      expect(screen.getByTestId('district-chiefdom-village-fields')).toBeInTheDocument();
      expect(mockDistrictChiefdomVillageFieldsCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('calls roleChange when SPICE role is updated to HE for site user', async () => {
      mockRoleChange.mockClear();
      renderUserForm(
        {
          isSiteUser: true,
          data: [
            {
              suiteAccess: [{ groupName: 'SPICE', label: 'SPICE', id: 'SPICE' }],
              role: [],
              roles: [],
              reportRoles: [],
              insightRoles: []
            }
          ]
        },
        storeWithHeRole
      );

      await waitFor(() => {
        expect(screen.getByTestId('spice-role-change-trigger-he')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('spice-role-change-trigger-he'));

      await waitFor(() => {
        expect(mockRoleChange).toHaveBeenCalledWith(
          expect.objectContaining({
            index: 0,
            allRoles: expect.arrayContaining([expect.objectContaining({ name: heRole })])
          })
        );
      });
    });
  });

  describe('Nurse and CHCP role health facility type behavior', () => {
    const getSpiceRoleOptions = () =>
      mockMultiSelectCalls.filter((call) => call.label === 'SPICE Role').at(-1)?.options || [];

    const siteUserFormData = [
      {
        suiteAccess: [{ groupName: 'SPICE', label: 'SPICE', id: 'SPICE' }],
        role: [],
        roles: [],
        reportRoles: [],
        insightRoles: []
      }
    ];

    const storeWithNurseRole = {
      ...defaultStoreState,
      user: {
        ...defaultStoreState.user,
        userRoles: {
          SPICE: [
            { id: 1, name: 'CHCP', groupName: 'SPICE', displayName: 'CHCP', appTypes: ['web'] },
            { id: 2, name: nurseRole, groupName: 'SPICE', displayName: 'Nurse', appTypes: ['web'] }
          ]
        }
      },
      healthFacility: {
        ...defaultStoreState.healthFacility,
        healthFacilityList: [
          { id: 1, name: 'Upazila HF', type: APPCONSTANTS.UPAZILA_HEALTH_COMPLEX, tenantId: 1 },
          { id: 2, name: 'Community Clinic HF', type: APPCONSTANTS.COMMUNITY_CLINIC, tenantId: 2 },
          { id: 3, name: 'Community HF', type: 'Community Health Centre', tenantId: 3 }
        ]
      }
    };

    it('excludes Nurse and CHCP from SPICE role options when isHF and health facility type matches neither', async () => {
      renderUserForm(
        {
          isSiteUser: true,
          data: siteUserFormData,
          userFormParams: {
            ...defaultProps.userFormParams,
            isHF: true,
            healthFacilityType: 'Community Health Centre'
          }
        },
        storeWithNurseRole
      );

      await waitFor(() => {
        const options = getSpiceRoleOptions();
        expect(options.map((role: any) => role.name)).toEqual([]);
      });
    });

    it('includes only Nurse in SPICE role options when isHF and health facility type is Upazila Health Complex', async () => {
      renderUserForm(
        {
          isSiteUser: true,
          data: siteUserFormData,
          userFormParams: {
            ...defaultProps.userFormParams,
            isHF: true,
            healthFacilityType: APPCONSTANTS.UPAZILA_HEALTH_COMPLEX
          }
        },
        storeWithNurseRole
      );

      await waitFor(() => {
        const options = getSpiceRoleOptions();
        expect(options.map((role: any) => role.name)).toEqual([nurseRole]);
      });
    });

    it('includes only CHCP in SPICE role options when isHF and health facility type is Community Clinic', async () => {
      renderUserForm(
        {
          isSiteUser: true,
          data: siteUserFormData,
          userFormParams: {
            ...defaultProps.userFormParams,
            isHF: true,
            healthFacilityType: APPCONSTANTS.COMMUNITY_CLINIC
          }
        },
        storeWithNurseRole
      );

      await waitFor(() => {
        const options = getSpiceRoleOptions();
        expect(options.map((role: any) => role.name)).toEqual([chcpRole]);
      });
    });

    const getAssignedHfOptions = () =>
      mockSelectInputCalls.filter((call) => call.label === 'Assigned Health Facility').at(-1)?.options || [];

    it('filters assigned health facility options to Upazila Health Complex when Nurse is selected', async () => {
      renderUserForm(
        {
          isSiteUser: true,
          isEdit: true,
          initialEditValue: {
            suiteAccess: [{ groupName: 'SPICE', label: 'SPICE' }],
            role: [],
            roles: [],
            reportRoles: [],
            insightRoles: [],
            organizations: [],
            villages: []
          },
          userFormParams: { ...defaultProps.userFormParams, isHF: false }
        },
        storeWithNurseRole
      );

      await waitFor(() => {
        expect(screen.getByText('Assigned Health Facility')).toBeInTheDocument();
      });

      await waitFor(() => {
        const options = getAssignedHfOptions();
        expect(options).toHaveLength(3);
        expect(options.map((hf: { type: string }) => hf.type)).toEqual(
          expect.arrayContaining([
            APPCONSTANTS.UPAZILA_HEALTH_COMPLEX,
            APPCONSTANTS.COMMUNITY_CLINIC,
            'Community Health Centre'
          ])
        );
      });

      fireEvent.click(screen.getByTestId('spice-role-change-trigger-nurse'));

      await waitFor(() => {
        const options = getAssignedHfOptions();
        expect(options).toHaveLength(1);
        expect(options[0]).toMatchObject({
          name: 'Upazila HF',
          type: APPCONSTANTS.UPAZILA_HEALTH_COMPLEX
        });
      });
    });

    it('filters assigned health facility options to Community Clinic when CHCP is selected', async () => {
      renderUserForm(
        {
          isSiteUser: true,
          isEdit: true,
          initialEditValue: {
            suiteAccess: [{ groupName: 'SPICE', label: 'SPICE' }],
            role: [],
            roles: [],
            reportRoles: [],
            insightRoles: [],
            organizations: [],
            villages: []
          },
          userFormParams: { ...defaultProps.userFormParams, isHF: false }
        },
        storeWithNurseRole
      );

      await waitFor(() => {
        expect(screen.getByText('Assigned Health Facility')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('spice-role-change-trigger-chcp'));

      await waitFor(() => {
        const options = getAssignedHfOptions();
        expect(options).toHaveLength(1);
        expect(options[0]).toMatchObject({
          name: 'Community Clinic HF',
          type: APPCONSTANTS.COMMUNITY_CLINIC
        });
      });
    });
  });

  describe('userFormParams', () => {
    it('renders when isHFCreate is true', () => {
      renderUserForm({
        userFormParams: { ...defaultProps.userFormParams, isHFCreate: true }
      });
      expect(screen.getByText('First Name')).toBeInTheDocument();
    });

    it('does not render action buttons (Add Another User, Remove User, Reset Fields) when isHFCreate is true', () => {
      renderUserForm({
        disableOptions: false,
        userFormParams: { ...defaultProps.userFormParams, isHFCreate: true, isHF: true }
      });
      expect(screen.queryByText('Add Another User')).not.toBeInTheDocument();
      expect(screen.queryByText('Remove User')).not.toBeInTheDocument();
      expect(screen.queryByText('Reset Fields')).not.toBeInTheDocument();
    });

    it('renders when isAdminForm is true', () => {
      renderUserForm({
        userFormParams: { ...defaultProps.userFormParams, isAdminForm: true },
        defaultSelectedRole: 'ADMIN'
      });
      expect(screen.getByText('Suite Access')).toBeInTheDocument();
    });
  });
});
