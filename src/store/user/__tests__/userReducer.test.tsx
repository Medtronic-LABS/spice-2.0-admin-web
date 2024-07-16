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

  // it('should handle FETCH_TIMEZONE_LIST_SUCCESS', () => {
  //   const initialState: any = {
  //     timezoneList: []
  //   };
  //   const action: any = {
  //     type: USERTYPES.FETCH_TIMEZONE_LIST_SUCCESS,
  //     payload: ['Timezone 1', 'Timezone 2']
  //   };
  //   const expectedState = {
  //     timezoneList: ['Timezone 1', 'Timezone 2']
  //   };
  //   expect(userReducer(initialState, action)).toEqual(expectedState);
  // });

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
      isLoggedIn: false,
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

  it('should handle AUTH_TOKEN', () => {
    const initialState: any = {
      token: ''
    };
    const action: any = {
      type: USERTYPES.AUTH_TOKEN,
      payload: 'abcd1234'
    };
    const expectedState = {
      token: 'abcd1234'
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle REMOVE_TOKEN', () => {
    const initialState: any = {
      token: 'abcd1234'
    };
    const action: any = {
      type: USERTYPES.REMOVE_TOKEN
    };
    const expectedState = {
      token: ''
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
      userTenantId: 'tenant1'
    };
    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
});
