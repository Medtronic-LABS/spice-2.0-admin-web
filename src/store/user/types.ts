import { ISelectOption } from '../../components/formFields/SelectInput';
import APPCONSTANTS from '../../constants/appConstants';
import ApiError from '../../global/ApiError';
import { IPeerSupervisor, IUserRole, IVillages } from '../healthFacility/types';
import * as USER_TYPES from './actionTypes';

export type roleType = (typeof APPCONSTANTS.ROLES)[keyof typeof APPCONSTANTS.ROLES];
export interface IUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: roleType;
  roleDetail: any;
  tenantId: string;
  formDataId: string;
  country: any;
  suiteAccess: string[];
}

export interface IUserDetail {
  id?: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  gender: string;
  phoneNumber: string;
  roles: IUserRole[];
  countryCode?: string;
  villages?: IVillages[];
  supervisor?: IPeerSupervisor;
}

export interface IUpdateUserDetail
  extends Omit<IUserDetail, 'username' | 'email' | 'roles' | 'villages' | 'supervisor'> {}

export interface IEditUserDetail extends IUserDetail {
  country?: ICountry;
}

export interface ICountry {
  id?: string;
  phoneNumberCode?: string;
  name?: string;
  tenantId?: number;
}

export interface IUserState {
  isLoggedIn: boolean;
  loggingIn: boolean;
  loggingOut: boolean;
  user: IUser;
  userRoles: IGroupRoles;
  isRolesLoading: boolean;
  error: string | null;
  loading: boolean;
  cultureListLoading?: boolean;
  initializing: boolean;
  isPasswordSet: boolean;
  email: string;
  errorMessage: string;
  showLoader: boolean;
  token: string;
  userTenantId: string;
}

export type ILoginSuccessPayload = IUser;

export interface ILoginFailurePayload {
  error: string;
}

export interface ILoginRequestPayload {
  username: string;
  password: string;
  rememberMe: boolean;
  successCb?: (payload: ILoginSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface ITimezone {
  id: string;
  description?: string;
}

export interface ICountryCode {
  id: string;
  countryCode: string;
}

export interface ICulture {
  id: number;
  name: string;
}

export type IFetchTimezoneListSuccessPayload = ITimezone[];

export type IFetchCountryListSuccessPayload = ICountryCode[];

export type IFetchCultureListSuccessPayload = ICulture[];

export interface ILoginRequest {
  type: typeof USER_TYPES.LOGIN_REQUEST;
  username: string;
  password: string;
  rememberMe: boolean;
  successCb?: (payload: ILoginSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface ILoginSuccess {
  type: typeof USER_TYPES.LOGIN_SUCCESS;
  payload: ILoginSuccessPayload;
}

export interface ILoginFailure {
  type: typeof USER_TYPES.LOGIN_FAILURE;
  payload: ILoginFailurePayload;
}

export interface IAddToken {
  type: typeof USER_TYPES.AUTH_TOKEN;
  payload: string;
}
export interface IRemoveToken {
  type: typeof USER_TYPES.REMOVE_TOKEN;
}
export interface ILogoutRequest {
  type: typeof USER_TYPES.LOGOUT_REQUEST;
}

export interface ILogoutSuccess {
  type: typeof USER_TYPES.LOGOUT_SUCCESS;
}

export interface ILogoutFailure {
  type: typeof USER_TYPES.LOGOUT_FAILURE;
}

export interface IFetchLoggedInUserRequest {
  type: typeof USER_TYPES.FETCH_LOGGED_IN_USER_REQUEST;
}

export interface IFetchLoggedInUserSuccess {
  type: typeof USER_TYPES.FETCH_LOGGED_IN_USER_SUCCESS;
  payload: IUser;
}

export interface IFetchLoggedInUserFailure {
  type: typeof USER_TYPES.FETCH_LOGGED_IN_USER_FAILURE;
}

export interface IFetchUserByEmail {
  type: typeof USER_TYPES.FETCH_USER_BY_EMAIL;
  email: string;
  successCb?: (data: IUser) => void;
  failureCb?: (error: ApiError) => void;
}

export interface IFetchUserByEmailSuccess {
  type: typeof USER_TYPES.FETCH_USER_BY_EMAIL_SUCCESS;
}

export interface IFetchUserByEmailFail {
  type: typeof USER_TYPES.FETCH_USER_BY_EMAIL_FAIL;
}
export interface IFetchUserRolesRequest {
  type: typeof USER_TYPES.FETCH_USER_ROLES_REQUEST;
  successCb?: (payload: IGroupRoles) => void;
  failureCb?: (error: Error) => void;
}
export interface IRoles {
  id: number;
  name: string;
  level?: number;
  suiteAccessName?: string;
  displayName?: string;
  groupName?: string;
}

export interface IGroupRoles {
  [key: string]: IRoles[];
}

export interface IFetchUserRolesSuccess {
  type: typeof USER_TYPES.FETCH_USER_ROLES_SUCCESS;
  payload: IGroupRoles;
}

export interface IFetchUserRolesFailure {
  type: typeof USER_TYPES.FETCH_USER_ROLES_FAILURE;
}

export interface IAddUserTenantId {
  type: typeof USER_TYPES.ADD_USER_TENANT_ID;
  payload: string;
}
export interface IRemoveUserTenantId {
  type: typeof USER_TYPES.REMOVE_USER_TENANT_ID;
}

export interface ISessionTimeout {
  type: typeof USER_TYPES.SESSION_TIMEDOUT;
  message: string;
}

export interface IResetStore {
  type: typeof USER_TYPES.RESET_STORE;
}

export interface IFetchUserByIdRequest {
  type: typeof USER_TYPES.FETCH_USER_BY_ID_REQUEST;
  payload: { id: string };
  successCb?: (payload: IEditUserDetail) => void;
  failureCb?: (e: Error) => void;
}

export interface IFetchUserByIdSuccess {
  type: typeof USER_TYPES.FETCH_USER_BY_ID_SUCCESS;
  data: Omit<IUser, 'formDataId' | 'countryId' | 'role'>;
}

export interface IFetchUserByIdFailure {
  type: typeof USER_TYPES.FETCH_USER_BY_ID_FAILURE;
}

export interface IUpdateUserRequest {
  type: typeof USER_TYPES.UPDATE_USER_REQUEST;
  payload: IUpdateUserDetail;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IUpdateUserSuccess {
  type: typeof USER_TYPES.UPDATE_USER_SUCCESS;
}

export interface IUpdateUserFailure {
  type: typeof USER_TYPES.UPDATE_USER_FAILURE;
}

export type UserActions =
  | ILoginRequest
  | ILoginSuccess
  | ILoginFailure
  | ILogoutRequest
  | ILogoutSuccess
  | ILogoutFailure
  | IFetchLoggedInUserRequest
  | IFetchLoggedInUserSuccess
  | IFetchLoggedInUserFailure
  | ISessionTimeout
  | IResetStore
  | IAddToken
  | IAddUserTenantId
  | IRemoveToken
  | IFetchUserRolesRequest
  | IFetchUserRolesSuccess
  | IFetchUserRolesFailure
  | IFetchUserByIdRequest
  | IFetchUserByIdSuccess
  | IFetchUserByIdFailure
  | IUpdateUserRequest
  | IUpdateUserSuccess
  | IUpdateUserFailure;
