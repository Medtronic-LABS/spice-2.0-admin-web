import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import UserForm from '../UserForm';
import { clearBranchesByUnion } from '../../../store/branch/actions';

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

jest.mock('../userFormUtils', () => ({
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
  filterRolesByAppTypeFn: (roles: any) => roles || {}
}));

jest.mock('../../../hooks/roleHook', () => ({
  useRoleMeta: () => ({
    roleChange: mockRoleChange
  })
}));

jest.mock('../../../hooks/roleOptionsHook', () => ({
  useRoleOptions: () => ({
    getRoleOptions: mockGetRoleOptions
  })
}));

jest.mock('../../assets/images/bin.svg', () => ({ ReactComponent: () => <span data-testid="bin-icon" /> }));
jest.mock('../../assets/images/plus_blue.svg', () => ({ ReactComponent: () => <span data-testid="plus-icon" /> }));
jest.mock('../../assets/images/reset.svg', () => ({ ReactComponent: () => <span data-testid="reset-icon" /> }));

jest.mock('../../formFields/TextInput', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => {
      const { errorLabel, ...inputProps } = props;
      return React.createElement(
        'div',
        { 'data-testid': 'text-input' },
        React.createElement('label', null, props.label),
        React.createElement('input', {
          'data-testid': `input-${(props.label || '').replace(/\s/g, '-')}`,
          ...inputProps
        })
      );
    }
  };
});

jest.mock('../../formFields/EmailField', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props: any, ref: any) =>
      React.createElement('div', { 'data-testid': 'email-field' },
        React.createElement('label', null, 'Email'),
        React.createElement('input', { 'data-testid': 'email-input', ref, ...props })
      )
    )
  };
});

jest.mock('../../formFields/UsernameField', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props: any, ref: any) =>
      React.createElement('div', { 'data-testid': 'username-field' },
        React.createElement('label', null, 'Username'),
        React.createElement('input', { 'data-testid': 'username-input', ref, ...props })
      )
    )
  };
});

const mockPhoneNumberCalls: any[] = [];
jest.mock('../../formFields/PhoneNumber', () => ({
  __esModule: true,
  default: (props: any) => {
    mockPhoneNumberCalls.push(props);
    return <div data-testid="phone-number-field">Phone Number</div>;
  }
}));

jest.mock('../../formFields/Radio', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="radio-group">
      <label>{props.fieldLabel}</label>
      {(props.options || []).map((opt: any) => (
        <label key={opt.value}>
          <input type="radio" value={opt.value} name={props.name} />
          {opt.label}
        </label>
      ))}
    </div>
  )
}));

jest.mock('../../formFields/SelectInput', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="select-input">
      <label>{props.label}</label>
      {typeof props.onChange === 'function' && (
        <button
          type="button"
          data-testid={`select-trigger-${(props.label || '').replace(/\s/g, '-')}`}
          onClick={() => props.onChange({ id: 101, tenantId: 202, name: 'HF A' })}
        >
          trigger-change
        </button>
      )}
    </div>
  )
}));

jest.mock('../../multiSelect/MultiSelect', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="multi-select">
      <label>{props.label}</label>
    </div>
  )
}));

jest.mock('../userConditionalFields/AdminFields', () => ({
  SiteUserForm: () => <div data-testid="site-user-form">SiteUserForm</div>
}));

jest.mock('../userConditionalFields/DynamicCHForm', () => ({
  DynamicCHForm: (props: any) => {
    mockDynamicCHFormCalls.push(props);
    return <div data-testid="dynamic-ch-form">DynamicCHForm</div>;
  }
}));

const mockDynamicCHFormCalls: any[] = [];
const mockBranchTaggingFieldsCalls: any[] = [];
jest.mock('../userConditionalFields/BranchTaggingFields', () => ({
  __esModule: true,
  default: (props: any) => {
    mockBranchTaggingFieldsCalls.push(props);
    return <div data-testid="branch-tagging-fields">BranchTaggingFields</div>;
  }
}));

const mockAssignSSUsersSectionCalls: any[] = [];
jest.mock('../AssignSSUsersSection', () => ({
  __esModule: true,
  default: (props: any) => {
    mockAssignSSUsersSectionCalls.push(props);
    return <div data-testid="assign-ss-users-section">AssignSSUsersSection</div>;
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
        <Form onSubmit={() => {}} mutators={{ ...arrayMutators }} initialValues={formInitialValues}>
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
    mockGetSuiteAccessList.mockReturnValue([{ groupName: 'SPICE', label: 'SPICE' }]);
    mockGetSpiceGroupName.mockImplementation((suiteAccess: any[]) => suiteAccess?.[0] || { groupName: 'SPICE' });
    mockFormUserData.mockImplementation((data: any) => data || {});
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

    it('does not render BranchTaggingFields when Shastiya Kormi role is not selected', () => {
      const initialValues = {
        users: [{ role: [{ name: 'OTHER_ROLE', id: 1 }], suiteAccess: [{ groupName: 'SPICE' }] }]
      };
      renderUserForm({}, defaultStoreState, initialValues);
      expect(screen.queryByTestId('branch-tagging-fields')).not.toBeInTheDocument();
      expect(mockBranchTaggingFieldsCalls.length).toBe(0);
    });

    it('renders BranchTaggingFields with expected props when Shastiya Kormi is default-selected (isAdminForm)', async () => {
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
            <Form onSubmit={() => {}} mutators={{ ...arrayMutators }}>
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
  });

  describe('AssignSSUsersSection', () => {
    it('renders AssignSSUsersSection with no isEdit prop (section manages its own state)', () => {
      renderUserForm({ isEdit: true });
      expect(screen.getByTestId('assign-ss-users-section')).toBeInTheDocument();
      expect(mockAssignSSUsersSectionCalls[mockAssignSSUsersSectionCalls.length - 1]).not.toHaveProperty('isEdit');
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
