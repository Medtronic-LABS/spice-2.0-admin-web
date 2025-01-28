import * as userActions from '../actions';
import * as ACTION_TYPES from '../actionTypes';

describe('User actions', () => {
  it('loginRequest should create an action to request login', () => {
    const apiData = {
      username: 'test',
      password: 'test',
      rememberMe: false,
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.loginRequest(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.LOGIN_REQUEST, ...apiData });
  });

  it('removeToken should create an action to remove token', () => {
    const action = userActions.removeToken();
    expect(action).toEqual({ type: ACTION_TYPES.REMOVE_TOKEN });
  });

  it('fetchUserByEmail should create an action to fetch user by email', () => {
    const apiData = {
      email: 'test@test.com',
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.fetchUserByEmail(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_USER_BY_EMAIL, ...apiData });
  });

  it('fetchUserByEmailSuccess should create an action to fetch user by email success', () => {
    const action = userActions.fetchUserByEmailSuccess();
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_USER_BY_EMAIL_SUCCESS });
  });

  it('fetchUserByEmailFail should create an action to fetch user by email fail', () => {
    const action = userActions.fetchUserByEmailFail();
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_USER_BY_EMAIL_FAIL });
  });

  it('fetchUserRolesAction should create an action to fetch user roles', () => {
    const apiData = {
      countryId: 1,
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.fetchUserRolesAction(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_USER_ROLES_REQUEST, ...apiData });
  });

  it('fetchUserByIdReq should create an action to fetch user by id request', () => {
    const apiData = {
      payload: { id: '1' },
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.fetchUserByIdReq(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_USER_BY_ID_REQUEST, ...apiData });
  });

  it('updateUserRequest should create an action to update user request', () => {
    const apiData = {
      payload: { id: '1' },
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.updateUserRequest(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.UPDATE_USER_REQUEST, ...apiData });
  });

  it('changePassword should create an action to change password request', () => {
    const apiData = {
      userId: 1,
      password: 'test',
      successCB: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.changePassword(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.CHANGE_PASSWORD_REQUEST, data: apiData });
  });

  it('changeOwnPassword should create an action to change own password request', () => {
    const apiData = {
      userId: 1,
      oldPassword: 'test',
      newPassword: 'test',
      successCB: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.changeOwnPassword(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.CHANGE_OWN_PASSWORD_REQUEST, data: apiData });
  });

  it('resetPassword should create an action to reset password request', () => {
    const apiData = {
      email: 'test@test.com',
      password: 'test',
      token: 'test',
      successCB: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.resetPassword(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.RESET_PASSWORD_REQUEST, data: apiData });
  });

  it('updatePassword should create an action to update password request', () => {
    const apiData = {
      user: '1',
      oldPassword: 'test',
      newPassword: 'test',
      tenantId: '1',
      successCB: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.updatePassword(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.UPDATE_PASSWORD_REQUEST, data: apiData });
  });

  it('updatePasswordSuccess should create an action to update password success', () => {
    const action = userActions.updatePasswordSuccess();
    expect(action).toEqual({ type: ACTION_TYPES.UPDATE_PASSWORD_SUCCESS });
  });

  it('updateUserSuccess should create an action to update user success', () => {
    const action = userActions.updateUserSuccess();
    expect(action).toEqual({ type: ACTION_TYPES.UPDATE_USER_SUCCESS });
  });

  it('updatePasswordFail should create an action to update password fail', () => {
    const error = new Error('test');
    const action = userActions.updatePasswordFail(error);
    expect(action).toEqual({ type: ACTION_TYPES.UPDATE_PASSWORD_FAIL, error });
  });

  it('createPasswordRequest should create an action to create password request', () => {
    const apiData = {
      data: { email: 'test@test.com', password: 'test' },
      id: '1',
      successCB: jest.fn()
    };
    const action = userActions.createPasswordRequest(apiData.data, apiData.id, apiData.successCB);
    expect(action).toEqual({ type: ACTION_TYPES.CREATE_PASSWORD_REQUEST, ...apiData });
  });

  it('createPasswordSuccess should create an action to create password success', () => {
    const action = userActions.createPasswordSuccess();
    expect(action).toEqual({ type: ACTION_TYPES.CREATE_PASSWORD_SUCCESS });
  });

  it('createPasswordFail should create an action to create password fail', () => {
    const error = { error: 'test' };
    const action = userActions.createpasswordFail(error);
    expect(action).toEqual({ type: ACTION_TYPES.CREATE_PASSWORD_FAIL, error });
  });

  it('fetchTimezoneListRequest should create an action to fetch timezone list request', () => {
    const action = userActions.fetchTimezoneListRequest();
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_TIMEZONE_LIST_REQUEST });
  });

  it('fetchCultureListRequest should create an action to fetch culture list request', () => {
    const action = userActions.fetchCultureListRequest();
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_CULTURE_LIST_REQUEST });
  });

  it('fetchCultureListSuccess should create an action to fetch culture list success', () => {
    const payload = [{ id: 1, name: 'test' }];
    const action = userActions.fetchCultureListSuccess(payload);
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_CULTURE_LIST_SUCCESS, payload });
  });

  it('fetchCultureListFailure should create an action to fetch culture list failure', () => {
    const action = userActions.fetchCultureListFailure();
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_CULTURE_LIST_FAILURE });
  });

  it('fetchCommunityListRequest should create an action to fetch community list request', () => {
    const apiData = {
      countryId: 1,
      search: 'test',
      successCb: jest.fn(),
      failureCb: jest.fn()
    };
    const action = userActions.fetchCommunityListRequest(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_COMMUNITY_LIST_REQUEST, ...apiData });
  });

  it('fetchDesignationListRequest should create an action to fetch designation list request', () => {
    const apiData = {
      countryId: 1
    };
    const action = userActions.fetchDesignationListRequest(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_DESIGNATION_LIST_REQUEST, ...apiData });
  });

  it('clearDesignationList should create an action to clear designation list', () => {
    const action = userActions.clearDesignationList();
    expect(action).toEqual({ type: ACTION_TYPES.CLEAR_DESIGNATION_LIST });
  });

  it('fetchCountryListRequest should create an action to fetch country list request', () => {
    const action = userActions.fetchCountryListRequest();
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_COUNTRY_LIST_REQUEST });
  });

  it('fetchCountryListSuccess should create an action to fetch country list success', () => {
    const payload = [{ id: '1', countryCode: 'test' }];
    const action = userActions.fetchCountryListSuccess(payload);
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_COUNTRY_LIST_SUCCESS, payload });
  });

  it('fetchCountryListFailure should create an action to fetch country list failure', () => {
    const action = userActions.fetchCountryListFailure();
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_COUNTRY_LIST_FAILURE });
  });

  it('setAppType should create an action to set app type', () => {
    const payload = ['COMMUNITY', 'NON_COMMUNITY'];
    const action = userActions.setAppType(payload);
    expect(action).toEqual({ type: ACTION_TYPES.SET_APP_TYPE, payload });
  });

  it('setAppTypeSuccess should create an action to set app type success', () => {
    const payload = ['COMMUNITY', 'NON_COMMUNITY'];
    const action = userActions.setAppTypeSuccess(payload);
    expect(action).toEqual({ type: ACTION_TYPES.SET_APP_TYPE_SUCCESS, payload });
  });

  it('setAppTypeFailure should create an action to set app type failure', () => {
    const error = new Error('test');
    const action = userActions.setAppTypeFailure(error);
    expect(action).toEqual({ type: ACTION_TYPES.SET_APP_TYPE_FAILURE, error });
  });

  it('fetchTermsAndConditionsRequest should create an action to fetch terms and conditions request', () => {
    const apiData = {
      countryId: 1,
      successCB: jest.fn(),
      failureCB: jest.fn()
    };
    const action = userActions.fetchTermsAndConditionsRequest(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.FETCH_TERMS_CONDITIONS_REQUEST, ...apiData });
  });

  it('updateTermsAndConditionsRequest should create an action to update terms and conditions request', () => {
    const apiData = {
      userId: 1,
      isTermsAndConditionAccepted: true,
      successCB: jest.fn(),
      failureCB: jest.fn()
    };
    const action = userActions.updateTermsAndConditionsRequest(apiData);
    expect(action).toEqual({ type: ACTION_TYPES.UPDATE_TERMS_CONDITIONS_REQUEST, ...apiData });
  });
});
