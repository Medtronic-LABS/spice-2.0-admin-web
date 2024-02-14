import { ISelectOption } from '../../components/formFields/SelectInput';
import APPCONSTANTS from '../../constants/appConstants';
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
  timezone: ITimezone;
  isAdded?: boolean;
  redRisk?: boolean;
  isUpdated?: boolean;
  roleName?: string | ISelectOption;
  countryCode?: string;
  village?: string;
  subCounty?: string;
}

export interface IUpdateUserDetail extends Omit<IUserDetail, 'timezone'> {
  timezone: string;
  cultureId?: number;
}

export interface IEditUserDetail extends IUserDetail {
  country?: ICountry;
}

export interface ICountry {
  id?: string;
  countryCode?: string;
  name?: string;
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
  timezoneList: ITimezone[];
  errorMessage: string;
  showLoader: boolean;
  countryList: ICountryCode[];
  token: string;
  lockedUsers?: ILockedUsers[];
  totalLockedUsers?: number;
  userTenantId: string;
  cultureList?: ICulture[];
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
export interface IFetchUserRolesRequest {
  type: typeof USER_TYPES.FETCH_USER_ROLES_REQUEST;
  successCb?: (payload: IGroupRoles) => void;
  failureCb?: (error: Error) => void;
}
interface IRoles {
  id: number;
  name: string;
  level: number;
  suiteAccessName: string;
  displayName: string;
  groupName: string;
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

export interface ILockedUsers {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IFetchLockedUsersPayload {
  lockedUsers: ILockedUsers[];
  totalCount: number;
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
  | IRemoveToken
  | IFetchUserRolesRequest
  | IFetchUserRolesSuccess
  | IFetchUserRolesFailure;
