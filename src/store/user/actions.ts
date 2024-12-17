import * as USER_TYPES from './actionTypes';
import {
  ILoginRequest,
  ILoginSuccess,
  ILoginFailure,
  ILogoutRequest,
  ILogoutSuccess,
  ILogoutFailure,
  ILoginRequestPayload,
  IUser,
  IAddUserTenantId,
  IFetchUserRolesRequest,
  IFetchUserRolesSuccess,
  IFetchUserByIdRequest,
  IFetchUserByIdSuccess,
  IFetchUserByIdFailure,
  IUpdateUserSuccess,
  IUpdateUserFailure,
  IChangePasswordReq,
  IChangePasswordSuccess,
  IChangePasswordFail,
  IChangeOwnPasswordReq,
  IChangeOwnPasswordSuccess,
  IChangeOwnPasswordFail,
  IForgotPasswordReq,
  IForgotPasswordSuccess,
  IForgotPasswordFailure,
  IResetPasswordReq,
  IResetPasswordSuccess,
  IResetPasswordFail,
  IGetUserNameReq,
  IGetUserNameSuccess,
  IGetUserNameFail,
  ICreatePasswordReq,
  ICreatePasswordSuccess,
  ICreatePasswordFail,
  IFetchUserByEmail,
  IFetchUserByEmailSuccess,
  IFetchUserByEmailFail,
  IRemoveUserTenantId,
  IFetchLockedUsersRequest,
  IFetchLockedUsersSuccess,
  IFetchLockedUsersFailure,
  IUnlockUsersRequest,
  IUnlockUsersSuccess,
  IUnlockUsersFailure,
  IUpdatePasswordReq,
  IUpdatePasswordSuccess,
  IUpdatePasswordFail,
  ILoginFailurePayload,
  IFetchTimezoneListSuccessPayload,
  IFetchCultureListSuccessPayload,
  IFetchLockedUsersPayload,
  IFetchCountryListSuccessPayload,
  ILoginSuccessPayload,
  IGroupRoles,
  IFetchCommunityListPayload,
  IFetchCommunityList,
  IRemoveToken,
  ISetAppType,
  ISetAppTypeSuccess,
  ISetAppTypeFailure,
  IFetchDesignationListPayload,
  IFetchDesignationList,
  ITermsAndConditions,
  IFetchTermsConditionsRequest,
  IFetchTermsConditionsSuccess,
  IFetchTermsConditionsFailure,
  IUpdateTermsConditionsRequest,
  IUpdateTermsConditionsSuccess,
  IUpdateTermsConditionsFailure
} from './types';

export const loginRequest = ({
  username,
  password,
  rememberMe,
  successCb,
  failureCb
}: ILoginRequestPayload): ILoginRequest => {
  return {
    type: USER_TYPES.LOGIN_REQUEST,
    username,
    password,
    rememberMe,
    successCb,
    failureCb
  };
};

export const loginSuccess = (payload: ILoginSuccessPayload): ILoginSuccess => ({
  type: USER_TYPES.LOGIN_SUCCESS,
  payload
});

export const loginFailure = (payload: ILoginFailurePayload): ILoginFailure => ({
  type: USER_TYPES.LOGIN_FAILURE,
  payload
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

export const removeToken = (): IRemoveToken => ({
  type: USER_TYPES.REMOVE_TOKEN
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

export const fetchUserByEmail = ({
  email,
  successCb,
  failureCb
}: Omit<IFetchUserByEmail, 'type'>): IFetchUserByEmail => ({
  type: USER_TYPES.FETCH_USER_BY_EMAIL,
  email,
  successCb,
  failureCb
});

export const fetchUserByEmailSuccess = (): IFetchUserByEmailSuccess => ({
  type: USER_TYPES.FETCH_USER_BY_EMAIL_SUCCESS
});

export const fetchUserByEmailFail = (): IFetchUserByEmailFail => ({
  type: USER_TYPES.FETCH_USER_BY_EMAIL_FAIL
});

export const fetchUserRolesAction = ({
  countryId,
  successCb,
  failureCb
}: {
  countryId: number | null;
  successCb?: (payload: IGroupRoles) => void;
  failureCb?: (error: Error) => void;
}): IFetchUserRolesRequest => {
  return {
    type: USER_TYPES.FETCH_USER_ROLES_REQUEST,
    countryId,
    successCb,
    failureCb
  };
};

export const fetchUserRolesActionSuccess = (payload: IGroupRoles): IFetchUserRolesSuccess => ({
  type: USER_TYPES.FETCH_USER_ROLES_SUCCESS,
  payload
});

export const fetchUserRolesActionFail = () => ({
  type: USER_TYPES.FETCH_USER_ROLES_FAILURE
});

export const fetchUserByIdReq = ({
  payload,
  successCb,
  failureCb
}: Omit<IFetchUserByIdRequest, 'type'>): IFetchUserByIdRequest => ({
  type: USER_TYPES.FETCH_USER_BY_ID_REQUEST,
  payload,
  successCb,
  failureCb
});

export const fetchUserByIdSuccess = (
  data: Omit<IUser, 'formDataId' | 'countryId' | 'role'>
): IFetchUserByIdSuccess => ({
  type: USER_TYPES.FETCH_USER_BY_ID_SUCCESS,
  data
});

export const fetchUserByIdFailure = (): IFetchUserByIdFailure => ({
  type: USER_TYPES.FETCH_USER_BY_ID_FAILURE
});

export const updateUserRequest = ({ payload, successCb, failureCb }: Omit<any, 'type'>): any => ({
  type: USER_TYPES.UPDATE_USER_REQUEST,
  payload,
  successCb,
  failureCb
});

export const updateUserSuccess = (): IUpdateUserSuccess => ({
  type: USER_TYPES.UPDATE_USER_SUCCESS
});

export const updateUserFailure = (): IUpdateUserFailure => ({
  type: USER_TYPES.UPDATE_USER_FAILURE
});

export const changePassword = (data: {
  userId: number;
  password: string;
  successCB: () => void;
  failureCb?: (error: Error) => void;
}): IChangePasswordReq => ({
  type: USER_TYPES.CHANGE_PASSWORD_REQUEST,
  data
});

export const changePasswordSuccess = (): IChangePasswordSuccess => ({
  type: USER_TYPES.CHANGE_PASSWORD_SUCCESS
});

export const changePasswordFail = (error: any): IChangePasswordFail => ({
  type: USER_TYPES.CHANGE_PASSWORD_FAILURE,
  error
});

export const changeOwnPassword = (data: {
  userId: number;
  oldPassword: string;
  newPassword: string;
  successCB: () => void;
  failureCB?: (error: Error) => void;
}): IChangeOwnPasswordReq => ({
  type: USER_TYPES.CHANGE_OWN_PASSWORD_REQUEST,
  data
});

export const changeOwnPasswordSuccess = (): IChangeOwnPasswordSuccess => ({
  type: USER_TYPES.CHANGE_OWN_PASSWORD_SUCCESS
});

export const changeOwnPasswordFail = (error: any): IChangeOwnPasswordFail => ({
  type: USER_TYPES.CHANGE_OWN_PASSWORD_FAILURE,
  error
});

export const forgotPasswordRequest = ({
  email,
  successCB
}: {
  email: string;
  successCB: () => void;
}): IForgotPasswordReq => ({
  type: USER_TYPES.USER_FORGOT_PASSWORD_REQUEST,
  email,
  successCB
});

export const forgotPasswordSuccess = (): IForgotPasswordSuccess => ({
  type: USER_TYPES.USER_FORGOT_PASSWORD_SUCCESS
});

export const forgotPasswordFail = (error: any): IForgotPasswordFailure => ({
  type: USER_TYPES.USER_FORGOT_PASSWORD_FAILURE,
  error
});

export const resetPassword = (data: {
  email: string;
  password: string;
  token: string;
  successCB: () => void;
  failureCb?: (error: Error) => void;
}): IResetPasswordReq => ({
  type: USER_TYPES.RESET_PASSWORD_REQUEST,
  data
});

export const resetPasswordSuccess = (): IResetPasswordSuccess => ({
  type: USER_TYPES.RESET_PASSWORD_SUCCESS
});

export const resetPasswordFail = (error: any): IResetPasswordFail => ({
  type: USER_TYPES.RESET_PASSWORD_FAILURE,
  error
});

export const getUserName = (
  token: string,
  successCB: () => void,
  failureCB?: (error: Error) => void
): IGetUserNameReq => ({
  type: USER_TYPES.GET_USERNAME_FOR_PASSWORD_RESET,
  token,
  successCB,
  failureCB
});

export const getUserNameSuccess = (): IGetUserNameSuccess => ({
  type: USER_TYPES.GET_USERNAME_FOR_PASSWORD_RESET_SUCCESS,
  response: {
    email: '',
    username: '',
    is_password_set: false
  }
});

export const getUserNameFail = (error: any): IGetUserNameFail => ({
  type: USER_TYPES.GET_USERNAME_FOR_PASSWORD_RESET_FAIL,
  error
});

export const updatePassword = (data: {
  user: string;
  oldPassword: string;
  newPassword: string;
  tenantId: string;
  successCB: () => void;
  failureCb?: (error: Error) => void;
}): IUpdatePasswordReq => ({
  type: USER_TYPES.UPDATE_PASSWORD_REQUEST,
  data
});

export const updatePasswordSuccess = (): IUpdatePasswordSuccess => ({
  type: USER_TYPES.UPDATE_PASSWORD_SUCCESS
});

export const updatePasswordFail = (error: any): IUpdatePasswordFail => ({
  type: USER_TYPES.UPDATE_PASSWORD_FAIL,
  error
});

export const createPasswordRequest = (
  data: { email: string; password: string },
  id: string,
  successCB: () => void
): ICreatePasswordReq => ({
  type: USER_TYPES.CREATE_PASSWORD_REQUEST,
  data,
  id,
  successCB
});

export const createPasswordSuccess = (): ICreatePasswordSuccess => ({
  type: USER_TYPES.CREATE_PASSWORD_SUCCESS
});

export const createpasswordFail = (error: ILoginFailurePayload): ICreatePasswordFail => ({
  type: USER_TYPES.CREATE_PASSWORD_FAIL,
  error
});

export const fetchTimezoneListRequest = () => ({
  type: USER_TYPES.FETCH_TIMEZONE_LIST_REQUEST
});

export const fetchCultureListRequest = () => ({
  type: USER_TYPES.FETCH_CULTURE_LIST_REQUEST
});

export const fetchCultureListSuccess = (payload: IFetchCultureListSuccessPayload) => ({
  type: USER_TYPES.FETCH_CULTURE_LIST_SUCCESS,
  payload
});

export const fetchCultureListFailure = () => ({
  type: USER_TYPES.FETCH_CULTURE_LIST_FAILURE
});
export const fetchCommunityListRequest = ({
  countryId,
  search,
  successCb,
  failureCb
}: {
  countryId: number;
  search?: string;
  successCb?: (payload: any) => void;
  failureCb?: (error: Error) => void;
}): IFetchCommunityList => ({
  type: USER_TYPES.FETCH_COMMUNITY_LIST_REQUEST,
  countryId,
  search,
  successCb,
  failureCb
});

export const fetchCommunityListSuccess = (payload: IFetchCommunityListPayload) => ({
  type: USER_TYPES.FETCH_COMMUNITY_LIST_SUCCESS,
  payload
});

export const fetchCommunityListFailure = () => ({
  type: USER_TYPES.FETCH_COMMUNITY_LIST_FAILURE
});

export const fetchDesignationListRequest = ({ countryId }: { countryId: number }): IFetchDesignationList => ({
  type: USER_TYPES.FETCH_DESIGNATION_LIST_REQUEST,
  countryId
});

export const fetchDesignationListSuccess = (payload: IFetchDesignationListPayload) => {
  return {
    type: USER_TYPES.FETCH_DESIGNATION_LIST_SUCCESS,
    payload
  };
};

export const fetchDesignationListFailure = () => ({
  type: USER_TYPES.FETCH_DESIGNATION_LIST_FAILURE
});

export const clearDesignationList = () => ({
  type: USER_TYPES.CLEAR_DESIGNATION_LIST
});

export const fetchTimezoneListSuccess = (payload: IFetchTimezoneListSuccessPayload) => ({
  type: USER_TYPES.FETCH_TIMEZONE_LIST_SUCCESS,
  payload
});

export const fetchTimezoneListFailure = () => ({
  type: USER_TYPES.FETCH_TIMEZONE_LIST_FAILURE
});

export const fetchCountryListRequest = () => ({
  type: USER_TYPES.FETCH_COUNTRY_LIST_REQUEST
});

export const fetchCountryListSuccess = (payload: IFetchCountryListSuccessPayload) => ({
  type: USER_TYPES.FETCH_COUNTRY_LIST_SUCCESS,
  payload
});

export const fetchCountryListFailure = () => ({
  type: USER_TYPES.FETCH_COUNTRY_LIST_FAILURE
});

export const fetchLockedUsersRequest = ({
  tenantId,
  skip,
  limit,
  search,
  role,
  successCb,
  failureCb
}: {
  tenantId?: string;
  skip: number;
  limit: number | null;
  search?: string;
  role?: string;
  successCb?: (payload: IFetchLockedUsersPayload) => void;
  failureCb?: (error: Error) => void;
}): IFetchLockedUsersRequest => ({
  type: USER_TYPES.FETCH_LOCKED_USERS_REQUEST,
  tenantId,
  skip,
  limit,
  search,
  role,
  successCb,
  failureCb
});

export const fetchLockedUsersSuccess = (payload: IFetchLockedUsersPayload): IFetchLockedUsersSuccess => ({
  type: USER_TYPES.FETCH_LOCKED_USERS_SUCCESS,
  payload
});

export const fetchLockedUsersFailure = (): IFetchLockedUsersFailure => ({
  type: USER_TYPES.FETCH_LOCKED_USERS_FAILURE
});

export const unlockUsersRequest = ({
  userId,
  successCb,
  failureCb
}: {
  userId: string;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IUnlockUsersRequest => ({
  type: USER_TYPES.UNLOCK_USERS_REQUEST,
  userId,
  successCb,
  failureCb
});

export const unlockUsersSuccess = (): IUnlockUsersSuccess => ({
  type: USER_TYPES.UNLOCK_USERS_SUCCESS
});

export const unlockUsersFailure = (): IUnlockUsersFailure => ({
  type: USER_TYPES.UNLOCK_USERS_FAILURE
});

export const setAppType = (appTypes: string[]): ISetAppType => ({
  type: USER_TYPES.SET_APP_TYPE,
  payload: appTypes
});
export const setAppTypeSuccess = (appTypes: string[]): ISetAppTypeSuccess => ({
  type: USER_TYPES.SET_APP_TYPE_SUCCESS,
  payload: appTypes
});
export const setAppTypeFailure = (error: Error): ISetAppTypeFailure => ({
  type: USER_TYPES.SET_APP_TYPE_FAILURE,
  error
});

export const clearAppType = () => ({
  type: USER_TYPES.CLEAR_APP_TYPE
});

export const fetchTermsAndConditionsRequest = ({
  countryId,
  successCB,
  failureCB
}: {
  countryId: number;
  successCB?: (data: ITermsAndConditions) => void;
  failureCB?: (error: Error) => void;
}): IFetchTermsConditionsRequest => ({
  type: USER_TYPES.FETCH_TERMS_CONDITIONS_REQUEST,
  countryId,
  successCB,
  failureCB
});
export const fetchTermsAndConditionsSuccess = (payload: ITermsAndConditions): IFetchTermsConditionsSuccess => ({
  type: USER_TYPES.FETCH_TERMS_CONDITIONS_SUCCESS,
  payload
});
export const fetchTermsAndConditionsFailure = (error: any): IFetchTermsConditionsFailure => ({
  type: USER_TYPES.FETCH_TERMS_CONDITIONS_FAILURE,
  error
});
export const updateTermsAndConditionsRequest = ({
  userId,
  isTermsAndConditionAccepted,
  successCB,
  failureCB
}: Omit<IUpdateTermsConditionsRequest, 'type'>): IUpdateTermsConditionsRequest => ({
  type: USER_TYPES.UPDATE_TERMS_CONDITIONS_REQUEST,
  userId,
  isTermsAndConditionAccepted,
  successCB,
  failureCB
});
export const updateTermsAndConditionsSuccess = (): IUpdateTermsConditionsSuccess => ({
  type: USER_TYPES.UPDATE_TERMS_CONDITIONS_SUCCESS
});
export const updateTermsAndConditionsFailure = (error: any): IUpdateTermsConditionsFailure => ({
  type: USER_TYPES.UPDATE_TERMS_CONDITIONS_FAILURE,
  error
});
