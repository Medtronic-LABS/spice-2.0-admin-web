import userReducer from '../reducer';
import * as USERTYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/userDataConstants';

describe('userReducer', () => {
  it('should handle LOGIN_REQUEST', () => {
    const initialState: any = {
      loggingIn: false
    };
    const action: any = {
      type: USERTYPES.LOGIN_REQUEST
    };
    const expectedState = {
      loggingIn: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle LOGIN_SUCCESS', () => {
    const initialState: any = {
      loggingIn: true,
      isLoggedIn: false,
      user: {}
    };
    const action: any = {
      type: USERTYPES.LOGIN_SUCCESS,
      payload: { userId: '123', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
    };
    const expectedState = {
      loggingIn: false,
      isLoggedIn: true,
      error: null,
      user: {
        userId: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle LOGIN_FAILURE', () => {
    const initialState: any = {
      loggingIn: true,
      isLoggedIn: true,
      user: { userId: '123', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
    };
    const action: any = {
      type: USERTYPES.LOGIN_FAILURE,
      payload: { error: 'Login failed' }
    };
    const expectedState = {
      loggingIn: false,
      isLoggedIn: false,
      user: {
        appTypes: [],
        countryId: undefined,
        isTermsConditionsLoading: false,
        termsAndConditions: {},
        email: '',
        firstName: '',
        lastName: '',
        userId: '',
        role: 'SUPER_ADMIN',
        roleDetail: {},
        suiteAccess: [],
        tenantId: '',
        formDataId: '',
        country: {}
      },
      error: 'Login failed'
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle LOGOUT_REQUEST', () => {
    const initialState: any = {
      loggingOut: false
    };
    const action: any = {
      type: USERTYPES.LOGOUT_REQUEST
    };
    const expectedState = {
      loggingOut: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle LOGOUT_SUCCESS', () => {
    const initialState: any = {
      isLoggedIn: true,
      loggingOut: true
    };
    const action: any = {
      type: USERTYPES.LOGOUT_SUCCESS
    };
    const expectedState = {
      isLoggedIn: false,
      loggingOut: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle LOGOUT_FAILURE', () => {
    const initialState: any = {
      isLoggedIn: true,
      loggingOut: true
    };
    const action: any = {
      type: USERTYPES.LOGOUT_FAILURE
    };
    const expectedState = {
      isLoggedIn: false,
      loggingOut: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_TIMEZONE_LIST_SUCCESS', () => {
    const initialState: any = {
      timezoneList: []
    };
    const action: any = {
      type: USERTYPES.FETCH_TIMEZONE_LIST_SUCCESS,
      payload: ['Timezone 1', 'Timezone 2']
    };
    const expectedState = {
      timezoneList: ['Timezone 1', 'Timezone 2']
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LOGGED_IN_USER_REQUEST', () => {
    const initialState: any = {
      initializing: false
    };
    const action: any = {
      type: USERTYPES.FETCH_LOGGED_IN_USER_REQUEST
    };
    const expectedState = {
      initializing: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LOGGED_IN_USER_SUCCESS', () => {
    const initialState: any = {
      initializing: true,
      user: {}
    };
    const action: any = {
      type: USERTYPES.FETCH_LOGGED_IN_USER_SUCCESS,
      payload: { email: 'test@example.com', firstName: 'John', lastName: 'Doe' }
    };
    const expectedState = {
      initializing: false,
      loggingIn: false,
      isLoggedIn: true,
      user: { email: 'test@example.com', firstName: 'John', lastName: 'Doe' }
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LOGGED_IN_USER_FAILURE', () => {
    const initialState: any = {
      initializing: true
    };
    const action: any = {
      type: USERTYPES.FETCH_LOGGED_IN_USER_FAILURE
    };
    const expectedState = {
      initializing: false,
      isLoggedIn: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_USER_ROLES_REQUEST', () => {
    const initialState: any = {
      isRolesLoading: false
    };
    const action: any = {
      type: USERTYPES.FETCH_USER_ROLES_REQUEST
    };
    const expectedState = {
      isRolesLoading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  const userRoles = MOCK_DATA_CONSTANTS.USER_ROLES_RESPONSE_PAYLOAD.data.entity;

  it('should handle FETCH_USER_ROLES_SUCCESS', () => {
    const initialState: any = {
      isRolesLoading: true
    };
    const action: any = {
      type: USERTYPES.FETCH_USER_ROLES_SUCCESS,
      payload: userRoles
    };
    const expectedState = {
      isRolesLoading: false,
      userRoles
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_USER_ROLES_FAILURE', () => {
    const initialState: any = {
      isRolesLoading: true
    };
    const action: any = {
      type: USERTYPES.FETCH_USER_ROLES_FAILURE
    };
    const expectedState = {
      isRolesLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SESSION_TIMEDOUT', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.SESSION_TIMEDOUT,
      message: 'Session has timed out'
    };
    const expectedState = {
      isLoggedIn: false,
      errorMessage: 'Session has timed out'
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle ADD_USER_TENANT_ID', () => {
    const initialState: any = {
      userTenantId: 'tenant1'
    };
    const action: any = {
      type: USERTYPES.ADD_USER_TENANT_ID,
      payload: 'tenant1'
    };
    const expectedState = {
      userTenantId: 'tenant1'
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle REMOVE_USER_TENANT_ID', () => {
    const initialState: any = {
      userTenantId: 'tenant1'
    };
    const action: any = {
      type: USERTYPES.REMOVE_USER_TENANT_ID
    };
    const expectedState = {
      userTenantId: ''
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_PASSWORD_REQUEST', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.CHANGE_PASSWORD_REQUEST,
      message: 'Session has timed out'
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_PASSWORD_FAILURE', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.CHANGE_PASSWORD_FAILURE
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_PASSWORD_SUCCESS', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.CHANGE_PASSWORD_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle CHANGE_OWN_PASSWORD_FAILURE', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.CHANGE_OWN_PASSWORD_FAILURE
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle CHANGE_OWN_PASSWORD_SUCCESS', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.CHANGE_OWN_PASSWORD_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle USER_FORGOT_PASSWORD_SUCCESS', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.USER_FORGOT_PASSWORD_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle USER_FORGOT_PASSWORD_FAILURE', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.USER_FORGOT_PASSWORD_FAILURE
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_USER_BY_ID_SUCCESS', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null,
      user: {
        userId: 1
      }
    };
    const action: any = {
      type: USERTYPES.FETCH_USER_BY_ID_SUCCESS,
      data: {
        userId: 1
      }
    };
    const expectedState = {
      ...initialState,
      user: { ...initialState.user, ...action.data }
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_USER_BY_ID_SUCCESS Different UserId', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null,
      user: {
        userId: 1
      }
    };
    const action: any = {
      type: USERTYPES.FETCH_USER_BY_ID_SUCCESS,
      data: {
        userId: 2
      }
    };
    const expectedState = {
      ...initialState
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle RESET_PASSWORD_REQUEST', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.RESET_PASSWORD_REQUEST
    };
    const expectedState = {
      ...initialState,
      isResetPasswordLoading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle GET_USERNAME_FOR_PASSWORD_RESET', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.GET_USERNAME_FOR_PASSWORD_RESET
    };
    const expectedState = {
      ...initialState,
      isResetPasswordLoading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_PASSWORD_REQUEST', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.CHANGE_PASSWORD_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle CHANGE_OWN_PASSWORD_REQUEST', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.CHANGE_OWN_PASSWORD_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle USER_FORGOT_PASSWORD_REQUEST', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.USER_FORGOT_PASSWORD_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle GET_USERNAME_FOR_PASSWORD_RESET_SUCCESS', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.GET_USERNAME_FOR_PASSWORD_RESET_SUCCESS
    };
    const expectedState = {
      ...initialState,
      isResetPasswordLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle GET_USERNAME_FOR_PASSWORD_RESET_FAIL', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.GET_USERNAME_FOR_PASSWORD_RESET_FAIL
    };
    const expectedState = {
      ...initialState,
      isResetPasswordLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle RESET_PASSWORD_FAILURE', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.RESET_PASSWORD_FAILURE
    };
    const expectedState = {
      ...initialState,
      isResetPasswordLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle RESET_PASSWORD_SUCCESS', () => {
    const initialState: any = {
      isLoggedIn: true,
      errorMessage: null
    };
    const action: any = {
      type: USERTYPES.RESET_PASSWORD_SUCCESS
    };
    const expectedState = {
      ...initialState,
      isResetPasswordLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_APP_TYPE', () => {
    const initialState: any = {
      user: {
        appTypes: []
      }
    };
    const action: any = {
      type: USERTYPES.SET_APP_TYPE,
      payload: ['APP_TYPE_1', 'APP_TYPE_2']
    };
    const expectedState = {
      user: {
        appTypes: ['APP_TYPE_1', 'APP_TYPE_2']
      }
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTRY_LIST_SUCCESS', () => {
    const initialState: any = {
      countryList: []
    };
    const action: any = {
      type: USERTYPES.FETCH_COUNTRY_LIST_SUCCESS,
      payload: ['COUNTRY_1', 'COUNTRY_2']
    };
    const expectedState = {
      countryList: ['COUNTRY_1', 'COUNTRY_2']
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CULTURE_LIST_SUCCESS', () => {
    const initialState: any = {
      cultureList: [],
      cultureListLoading: false
    };
    const action: any = {
      type: USERTYPES.FETCH_CULTURE_LIST_SUCCESS,
      payload: ['CULTURE_1', 'CULTURE_2']
    };
    const expectedState = {
      cultureList: ['CULTURE_1', 'CULTURE_2'],
      cultureListLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COMMUNITY_LIST_REQUEST', () => {
    const initialState: any = {
      communityListLoading: false,
      communityList: []
    };
    const action: any = {
      type: USERTYPES.FETCH_COMMUNITY_LIST_REQUEST,
      payload: []
    };
    const expectedState = {
      communityListLoading: true,
      communityList: []
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COMMUNITY_LIST_SUCCESS', () => {
    const initialState: any = {
      communityList: [],
      communityListLoading: false
    };
    const action: any = {
      type: USERTYPES.FETCH_COMMUNITY_LIST_SUCCESS,
      payload: { entityList: ['COMMUNITY_1', 'COMMUNITY_2'] }
    };
    const expectedState = {
      communityList: ['COMMUNITY_1', 'COMMUNITY_2'],
      communityListLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_PASSWORD_REQUEST', () => {
    const initialState: any = {
      loading: false
    };
    const action: any = {
      type: USERTYPES.UPDATE_PASSWORD_REQUEST
    };
    const expectedState = {
      loading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_PASSWORD_REQUEST', () => {
    const initialState: any = {
      loading: false
    };
    const action: any = {
      type: USERTYPES.CREATE_PASSWORD_REQUEST
    };
    const expectedState = {
      loading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UNLOCK_USERS_REQUEST', () => {
    const initialState: any = {
      loading: false
    };
    const action: any = {
      type: USERTYPES.UNLOCK_USERS_REQUEST
    };
    const expectedState = {
      loading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LOCKED_USERS_REQUEST', () => {
    const initialState: any = {
      isLockedUserLoading: false
    };
    const action: any = {
      type: USERTYPES.FETCH_LOCKED_USERS_REQUEST
    };
    const expectedState = {
      isLockedUserLoading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LOCKED_USERS_SUCCESS', () => {
    const initialState: any = {
      isLockedUserLoading: true
    };
    const action: any = {
      type: USERTYPES.FETCH_LOCKED_USERS_SUCCESS,
      payload: { lockedUsers: ['LOCKED_USER_1', 'LOCKED_USER_2'], totalCount: 2 }
    };
    const expectedState = {
      isLockedUserLoading: false,
      lockedUsers: ['LOCKED_USER_1', 'LOCKED_USER_2'],
      totalLockedUsers: 2
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UNLOCK_USERS_SUCCESS', () => {
    const initialState: any = {
      loading: true,
      showLoader: false
    };
    const action: any = {
      type: USERTYPES.UNLOCK_USERS_SUCCESS
    };
    const expectedState = {
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UNLOCK_USERS_FAILURE', () => {
    const initialState: any = {
      loading: true,
      showLoader: false
    };
    const action: any = {
      type: USERTYPES.UNLOCK_USERS_FAILURE
    };
    const expectedState = {
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CHANGE_PASSWORD_FAIL', () => {
    const initialState: any = {
      loading: true,
      showLoader: false
    };
    const action: any = {
      type: USERTYPES.CHANGE_PASSWORD_FAIL
    };
    const expectedState = {
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_PASSWORD_FAIL', () => {
    const initialState: any = {
      loading: true,
      showLoader: false
    };
    const action: any = {
      type: USERTYPES.UPDATE_PASSWORD_FAIL
    };
    const expectedState = {
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_PASSWORD_SUCCESS', () => {
    const initialState: any = {
      loading: true,
      showLoader: false
    };
    const action: any = {
      type: USERTYPES.UPDATE_PASSWORD_SUCCESS
    };
    const expectedState = {
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_PASSWORD_SUCCESS', () => {
    const initialState: any = {
      loading: true,
      showLoader: false
    };
    const action: any = {
      type: USERTYPES.CREATE_PASSWORD_SUCCESS
    };
    const expectedState = {
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_PASSWORD_FAIL', () => {
    const initialState: any = {
      loading: true,
      showLoader: false
    };
    const action: any = {
      type: USERTYPES.CREATE_PASSWORD_FAIL
    };
    const expectedState = {
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LOCKED_USERS_FAILURE', () => {
    const initialState: any = {
      loading: true,
      showLoader: false
    };
    const action: any = {
      type: USERTYPES.FETCH_LOCKED_USERS_FAILURE
    };
    const expectedState = {
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_USER_BY_EMAIL', () => {
    const initialState: any = {
      loading: true,
      showLoader: false
    };
    const action: any = {
      type: USERTYPES.FETCH_USER_BY_EMAIL
    };
    const expectedState = {
      loading: false,
      showLoader: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_USER_BY_EMAIL_SUCCESS', () => {
    const initialState: any = {
      showLoader: true
    };
    const action: any = {
      type: USERTYPES.FETCH_USER_BY_EMAIL_SUCCESS
    };
    const expectedState = {
      showLoader: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_USER_BY_EMAIL_FAIL', () => {
    const initialState: any = {
      showLoader: true
    };
    const action: any = {
      type: USERTYPES.FETCH_USER_BY_EMAIL_FAIL
    };
    const expectedState = {
      showLoader: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CULTURE_LIST_REQUEST', () => {
    const initialState: any = {
      cultureListLoading: false
    };
    const action: any = {
      type: USERTYPES.FETCH_CULTURE_LIST_REQUEST
    };
    const expectedState = {
      cultureListLoading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DESIGNATION_LIST_REQUEST', () => {
    const initialState: any = {
      designationListLoading: false
    };
    const action: any = {
      type: USERTYPES.FETCH_DESIGNATION_LIST_REQUEST
    };
    const expectedState = {
      designationListLoading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DESIGNATION_LIST_SUCCESS', () => {
    const initialState: any = {
      designationListLoading: true,
      designationList: []
    };
    const action: any = {
      type: USERTYPES.FETCH_DESIGNATION_LIST_SUCCESS,
      payload: { designationList: ['DESIGNATION_1', 'DESIGNATION_2'] }
    };
    const expectedState = {
      designationList: ['DESIGNATION_1', 'DESIGNATION_2'],
      designationListLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DESIGNATION_LIST_FAILURE', () => {
    const initialState: any = {
      designationListLoading: true
    };
    const action: any = {
      type: USERTYPES.FETCH_DESIGNATION_LIST_FAILURE
    };
    const expectedState = {
      designationListLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_DESIGNATION_LIST', () => {
    const initialState: any = {
      designationList: ['DESIGNATION_1', 'DESIGNATION_2']
    };
    const action: any = {
      type: USERTYPES.CLEAR_DESIGNATION_LIST
    };
    const expectedState = {
      designationList: [],
      designationListLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle REMOVE_TOKEN', () => {
    const initialState: any = {};
    const action: any = {
      type: USERTYPES.REMOVE_TOKEN
    };
    const expectedState = {
      token: ''
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_APP_TYPE', () => {
    const initialState: any = {
      user: { appTypes: ['COMMUNITY', 'NON_COMMUNITY'] }
    };
    const action: any = {
      type: USERTYPES.CLEAR_APP_TYPE
    };
    const expectedState = {
      user: { appTypes: [] }
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_TERMS_CONDITIONS_REQUEST', () => {
    const initialState: any = {
      isTermsConditionsLoading: false
    };
    const action: any = {
      type: USERTYPES.FETCH_TERMS_CONDITIONS_REQUEST
    };
    const expectedState = {
      isTermsConditionsLoading: true
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_TERMS_CONDITIONS_SUCCESS', () => {
    const initialState: any = {
      isTermsConditionsLoading: true,
      termsAndConditions: null
    };
    const action: any = {
      type: USERTYPES.FETCH_TERMS_CONDITIONS_SUCCESS,
      payload: { id: 1, content: 'test' }
    };
    const expectedState = {
      isTermsConditionsLoading: false,
      termsAndConditions: { id: 1, content: 'test' }
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_TERMS_CONDITIONS_FAILURE', () => {
    const initialState: any = {
      isTermsConditionsLoading: true
    };
    const action: any = {
      type: USERTYPES.FETCH_TERMS_CONDITIONS_FAILURE
    };
    const expectedState = {
      isTermsConditionsLoading: false
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
});
