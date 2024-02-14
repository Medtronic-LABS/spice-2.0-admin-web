import * as USER_TYPES from './actionTypes';
import {
  ILoginSuccessPayload,
  ILoginFailurePayload,
  ILoginRequest,
  ILoginSuccess,
  ILoginFailure,
  ILogoutRequest,
  ILogoutSuccess,
  ILogoutFailure,
  ILoginRequestPayload,
  IUser,
  IAddToken,
  IRemoveToken,
  IAddUserTenantId,
  IRemoveUserTenantId,
  IFetchUserRolesSuccess,
  IGroupRoles,
  IFetchUserRolesRequest
} from './types';

export const loginRequest = ({
  username,
  password,
  rememberMe,
  successCb,
  failureCb
}: ILoginRequestPayload): ILoginRequest => ({
  type: USER_TYPES.LOGIN_REQUEST,
  username,
  password,
  rememberMe,
  successCb,
  failureCb
});

export const loginSuccess = (payload: ILoginSuccessPayload): ILoginSuccess => ({
  type: USER_TYPES.LOGIN_SUCCESS,
  payload
});

export const loginFailure = (payload: ILoginFailurePayload): ILoginFailure => ({
  type: USER_TYPES.LOGIN_FAILURE,
  payload
});

export const addToken = (payload: string): IAddToken => ({
  type: USER_TYPES.AUTH_TOKEN,
  payload
});
export const removeToken = (): IRemoveToken => ({
  type: USER_TYPES.REMOVE_TOKEN
});

export const logoutRequest = (): ILogoutRequest => ({
  type: USER_TYPES.LOGOUT_REQUEST
});

export const logoutSuccess = (): ILogoutSuccess => ({
  type: USER_TYPES.LOGOUT_SUCCESS
});

export const logoutFailure = (): ILogoutFailure => ({
  type: USER_TYPES.LOGOUT_FAILURE
});

export const addUserTenantID = (payload: string): IAddUserTenantId => ({
  type: USER_TYPES.ADD_USER_TENANT_ID,
  payload
});
export const removeUserTenantID = (): IRemoveUserTenantId => ({
  type: USER_TYPES.REMOVE_USER_TENANT_ID
});

export const sessionTimedout = (message: string) => ({
  type: USER_TYPES.SESSION_TIMEDOUT,
  message
});

export const resetStore = () => ({
  type: USER_TYPES.RESET_STORE
});

export const fetchLoggedInUser = () => ({
  type: USER_TYPES.FETCH_LOGGED_IN_USER_REQUEST
});

export const fetchLoggedInUserSuccess = (payload: IUser) => ({
  type: USER_TYPES.FETCH_LOGGED_IN_USER_SUCCESS,
  payload
});

export const fetchLoggedInUserFail = () => ({
  type: USER_TYPES.FETCH_LOGGED_IN_USER_FAILURE
});

export const fetchUserRolesAction = ({
  successCb,
  failureCb
}: {
  successCb?: (payload: IGroupRoles) => void;
  failureCb?: (error: Error) => void;
}): IFetchUserRolesRequest => ({
  type: USER_TYPES.FETCH_USER_ROLES_REQUEST,
  successCb,
  failureCb
});

export const fetchUserRolesActionSuccess = (payload: IGroupRoles): IFetchUserRolesSuccess => ({
  type: USER_TYPES.FETCH_USER_ROLES_SUCCESS,
  payload
});

export const fetchUserRolesActionFail = () => ({
  type: USER_TYPES.FETCH_USER_ROLES_FAILURE
});
