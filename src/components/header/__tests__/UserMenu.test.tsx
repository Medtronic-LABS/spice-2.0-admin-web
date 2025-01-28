import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UserMenu from '../UserMenu';
import APPCONSTANTS, { APP_TYPE } from '../../../constants/appConstants';
import '@testing-library/jest-dom/extend-expect';
import { CHANGE_OWN_PASSWORD_REQUEST } from '../../../store/user/actionTypes';

const { ROLES, SUITE_ACCESS } = APPCONSTANTS;

jest.mock('../../../containers/authentication/ResetPasswordFields', () => ({
  generatePassword: jest.fn()
}));

const mockChildComponent = jest.fn();

jest.mock('../../../components/modal/ModalForm', () => (props: any) => {
  mockChildComponent(props);
  return props.show ? (
    <form data-testid='mock-modal-form'>
      <div>
        <div data-testid='mock-modal-form-header'>Change Password Modal Title</div>
        <div data-testid='mock-reset-password-fields'>Mock ResetPasswordFields</div>
        <button data-testid='mock-cancel-button'>Cancel</button>
        <button data-testid='mock-submit-button'>Submit</button>
      </div>
    </form>
  ) : null;
});

const mockStore = configureStore();

const initialState = {
  user: {
    user: {
      email: 'test@example.com',
      userId: '123',
      suiteAccess: [SUITE_ACCESS.ADMIN],
      formDataId: '456',
      tenantId: '789',
      appTypes: [APP_TYPE.NON_COMMUNITY]
    }
  },
  common: {
    defaultValues: {
      region: {
        s: 'Region',
        p: 'Regions'
      },
      healthFacility: {
        s: 'Health Facility',
        p: 'Health Facilities'
      },
      district: {
        s: 'County',
        p: 'Counties'
      },
      chiefdom: { s: 'Sub County', p: 'Sub Counties' }
    }
  }
};

describe('UserMenu Component', () => {
  const districtSName = 'County';
  const chiefdomSName = 'Sub County';

  const store = mockStore(initialState);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all menu items for super admin role', () => {
    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserMenu role={ROLES.SUPER_ADMIN} />
        </BrowserRouter>
      </Provider>
    );
    expect(getByText('Deactivated Records')).toBeInTheDocument();
    expect(getByText('Locked Users')).toBeInTheDocument();
    expect(getByText('Legal Terms')).toBeInTheDocument();
    expect(getByText('My Profile')).toBeInTheDocument();
    expect(getByText('Change Password')).toBeInTheDocument();
    unmount();
  });

  test('renders all menu items for region admin role', () => {
    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserMenu role={ROLES.REGION_ADMIN} />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText('Region Details')).toBeInTheDocument();
    expect(getByText('Deactivated Records')).toBeInTheDocument();
    expect(getByText('Locked Users')).toBeInTheDocument();
    expect(getByText('Legal Terms')).toBeInTheDocument();
    expect(getByText('My Profile')).toBeInTheDocument();
    expect(getByText('Change Password')).toBeInTheDocument();
    unmount();
  });

  test('renders only permitted menu items for district admin role', () => {
    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserMenu role={ROLES.DISTRICT_ADMIN} />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText(`${districtSName} Details`)).toBeInTheDocument();
    expect(getByText('Locked Users')).toBeInTheDocument();
    expect(getByText('Legal Terms')).toBeInTheDocument();
    expect(getByText('My Profile')).toBeInTheDocument();
    expect(getByText('Change Password')).toBeInTheDocument();
    unmount();
  });

  test('renders only permitted menu items for chiefdom admin role', () => {
    const { getByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserMenu role={ROLES.CHIEFDOM_ADMIN} />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText(`${chiefdomSName} Details`)).toBeInTheDocument();
    expect(getByText('Locked Users')).toBeInTheDocument();
    expect(getByText('My Profile')).toBeInTheDocument();
    expect(getByText('Change Password')).toBeInTheDocument();
    unmount();
  });

  test('check opens password change modal', () => {
    const { getByText, queryByTestId, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserMenu role={ROLES.SUPER_ADMIN} />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(getByText('My Profile', { selector: 'div.dropdown-item' }));

    expect(queryByTestId('mock-modal-form')).not.toBeInTheDocument();

    fireEvent.click(getByText('Change Password', { selector: 'div.dropdown-item' }));

    expect(getByText('Mock ResetPasswordFields')).toBeInTheDocument();
    unmount();
  });

  test('does not render menu items when user does not have admin access', () => {
    const localStore = mockStore({
      user: {
        user: {
          ...initialState.user.user,
          suiteAccess: []
        }
      },
      common: {
        defaultValues: {
          ...initialState.common.defaultValues
        }
      }
    });
    const { queryByText, unmount } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <UserMenu role={ROLES.SUPER_ADMIN} />
        </BrowserRouter>
      </Provider>
    );

    expect(queryByText(`${districtSName} Details`)).not.toBeInTheDocument();
    expect(queryByText(`${chiefdomSName} Details`)).not.toBeInTheDocument();
    expect(queryByText('Region Details')).not.toBeInTheDocument();
    expect(queryByText('Deactivated Records')).not.toBeInTheDocument();
    expect(queryByText('Locked Users')).not.toBeInTheDocument();
    expect(queryByText('Legal Terms')).not.toBeInTheDocument();
    expect(queryByText('My Profile')).not.toBeInTheDocument();
    expect(queryByText('Change Password')).not.toBeInTheDocument();
    unmount();
  });

  test('should close the password modal when onModalCancel is called', () => {
    const { getByText, getByTestId, queryByText, unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserMenu role={ROLES.SUPER_ADMIN} />
        </BrowserRouter>
      </Provider>
    );

    const changePasswordLink = getByText('Change Password', { selector: 'div.dropdown-item' });
    fireEvent.click(changePasswordLink);

    expect(getByTestId('mock-modal-form-header')).toBeInTheDocument();

    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(queryByText('Change Password', { selector: 'h5.modal-title' })).not.toBeInTheDocument();
    unmount();
  });

  test('handles form submission for password change', async () => {
    const { unmount } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserMenu role={ROLES.SUPER_ADMIN} />
        </BrowserRouter>
      </Provider>
    );

    const oldPassword = 'oldPassword';
    const newPassword = 'newPassword';
    const mockCustomModal: any = mockChildComponent.mock.calls[0][0];

    mockCustomModal.handleFormSubmit({
      oldPassword,
      newPassword
    });
    waitFor(() => {
      expect(mockCustomModal.handleFormSubmit).toHaveBeenCalledWith({
        oldPassword,
        newPassword
      });
    });

    const actions = store.getActions();
    const mockChangePasswordType = actions.find((action) => action.type === CHANGE_OWN_PASSWORD_REQUEST);
    mockChangePasswordType.data.successCB('Success', 'Password changed successfully');
    mockChangePasswordType.data.failureCB({ message: 'error' });

    const successCBSpy = jest.spyOn(mockChangePasswordType.data, 'successCB');
    const failureCBSpy = jest.spyOn(mockChangePasswordType.data, 'failureCB');
    waitFor(() => {
      expect(successCBSpy).toHaveBeenCalled();
      expect(failureCBSpy).toHaveBeenCalled();
    });
    unmount();
  });

  test('should render user menu for community app type', () => {
    const localStore = mockStore({
      user: {
        user: {
          ...initialState.user.user,
          appTypes: [APP_TYPE.COMMUNITY]
        }
      },
      common: {
        defaultValues: {
          ...initialState.common.defaultValues
        }
      }
    });
    const { unmount, getByText } = render(
      <Provider store={localStore}>
        <BrowserRouter>
          <UserMenu role={ROLES.SUPER_ADMIN} />
        </BrowserRouter>
      </Provider>
    );
    expect(getByText('My Profile')).toBeInTheDocument();
    unmount();
  });
});
