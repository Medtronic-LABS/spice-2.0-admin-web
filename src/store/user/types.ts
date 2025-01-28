import { FormApi } from 'final-form';
import { ISelectOption } from '../../components/formFields/SelectInput';
import APPCONSTANTS from '../../constants/appConstants';
import ApiError from '../../global/ApiError';
import { IPeerSupervisor, IUserRole, IVillages } from '../healthFacility/types';
import * as USER_TYPES from './actionTypes';
import { IDisabledRoles } from '../../components/userForm/UserForm';

export type roleType = (typeof APPCONSTANTS.ROLES)[keyof typeof APPCONSTANTS.ROLES];

export interface IUserFormProps {
  form: FormApi<any>;
  initialEditValue?: any;
  disableOptions?: boolean;
  isEdit?: boolean;
  isRegionUser?: boolean;
  account?: { id: string; tenantId: string };
  isDropdownDisable?: boolean;
  entityName?: string;
  enableAutoPopulate?: boolean;
  appTypes?: string[];
  data?: any[];
  countryId?: number;
  hfTenantId?: number;
  autoFetchedDataState?: { autoFetchData: any[]; setAutoFetchData: React.Dispatch<React.SetStateAction<any[]>> };
  autoFetchedState?: { autoFetch: any[]; setAutoFetchState: React.Dispatch<React.SetStateAction<boolean[]>> };
  chwState?: { isCHAUser: boolean[]; setUserAsCHW: React.Dispatch<React.SetStateAction<boolean[]>> };
  disabledRolesState?: {
    disabledRoles: IDisabledRoles[];
    setDisabledRoles: React.Dispatch<React.SetStateAction<IDisabledRoles[]>>;
  };
  mandatoryRolesState?: {
    mandatoryRoles: IRoles[][];
    setMandatoryRoles: React.Dispatch<React.SetStateAction<IRoles[][]>>;
  };

  roleOptionsState?: React.MutableRefObject<IRoles[][]>;
  isSiteUser?: boolean;
  isAdminForm?: boolean;
  defaultSelectedRole?: string;
  parentOrgId?: string;
  ignoreTenantId?: string;
  fetchHFListForReports?: boolean;
  userFormParams?: {
    isRegionCreate?: boolean;
    isHF?: boolean;
    isHFCreate?: boolean;
    isProfile?: boolean;
    isFromAdminList?: boolean;
    isChiefdom?: boolean;
    isCreateChiefdom?: boolean;
    isCreateDistrict?: boolean;
    isReportOrInsightUser?: boolean;
    isReportSuperAdmin?: boolean;
    isAdminForm?: boolean;
  };
}

export interface IOrganizations {
  id: number;
  name: string;
  formName: string;
  parentOrganizationId: number;
}

export interface ITermsAndConditions {
  id: number;
  countryId: string;
  formInput: string;
}
export interface IFetchTermsConditionsRequest {
  type: typeof USER_TYPES.FETCH_TERMS_CONDITIONS_REQUEST;
  countryId: number;
  successCB?: (data: ITermsAndConditions) => void;
  failureCB?: (e: Error) => void;
}

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
  countryId: any;
  suiteAccess: string[];
  appTypes: string[];
  organizations?: IOrganizations[] | [];
  isTermsConditionsLoading?: boolean;
  termsAndConditions?: ITermsAndConditions;
}

export interface IPhoneNumberCode {
  phoneNumberCode: string;
  id: string;
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
  countryCode?: IPhoneNumberCode;
  villages?: IVillages[];
  supervisor?: IPeerSupervisor;
}

export interface IUpdateUserDetail
  extends Omit<IUserDetail, 'username' | 'email' | 'roles' | 'villages' | 'supervisor'> {}

export interface IUserDetails extends Omit<IUserDetail, 'timezone'> {
  timezone: string;
  cultureId?: number;
}
export interface IEditUserDetail extends IUserDetail {
  country?: ICountry;
}

export interface ICountry {
  id?: string;
  phoneNumberCode?: string;
  name?: string;
  tenantId?: number;
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

export interface ILogoutRequest {
  type: typeof USER_TYPES.LOGOUT_REQUEST;
}

export interface ILogoutSuccess {
  type: typeof USER_TYPES.LOGOUT_SUCCESS;
}

export interface ILogoutFailure {
  type: typeof USER_TYPES.LOGOUT_FAILURE;
}

export interface IRemoveToken {
  type: typeof USER_TYPES.REMOVE_TOKEN;
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
  countryId: number | null;
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
  tenantIds?: any[];
  appTypes: string[];
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

export interface IChangePasswordReq {
  type: typeof USER_TYPES.CHANGE_PASSWORD_REQUEST;
  data: {
    userId: number;
    password: string;
    successCB: () => void;
    failureCb?: (error: Error) => void;
  };
}

export interface IChangePasswordSuccess {
  type: typeof USER_TYPES.CHANGE_PASSWORD_SUCCESS;
}

export interface IChangePasswordFail {
  type: typeof USER_TYPES.CHANGE_PASSWORD_FAILURE;
  error: any;
}

export interface IChangeOwnPasswordReq {
  type: typeof USER_TYPES.CHANGE_OWN_PASSWORD_REQUEST;
  data: {
    userId: number;
    oldPassword: string;
    newPassword: string;
    successCB: () => void;
    failureCb?: (error: Error) => void;
  };
}

export interface IChangeOwnPasswordSuccess {
  type: typeof USER_TYPES.CHANGE_OWN_PASSWORD_SUCCESS;
}

export interface IChangeOwnPasswordFail {
  type: typeof USER_TYPES.CHANGE_OWN_PASSWORD_FAILURE;
  error: any;
}

export interface IForgotPasswordReq {
  type: typeof USER_TYPES.USER_FORGOT_PASSWORD_REQUEST;
  email: string;
  successCB: () => void;
}

export interface IForgotPasswordSuccess {
  type: typeof USER_TYPES.USER_FORGOT_PASSWORD_SUCCESS;
}

export interface IForgotPasswordFailure {
  type: typeof USER_TYPES.USER_FORGOT_PASSWORD_FAILURE;
  error: any;
}

export interface IResetPasswordReq {
  type: typeof USER_TYPES.RESET_PASSWORD_REQUEST;
  data: {
    email: string;
    password: string;
    token: string;
    successCB: () => void;
    failureCb?: (error: Error) => void;
  };
}

export interface IResetPasswordSuccess {
  type: typeof USER_TYPES.RESET_PASSWORD_SUCCESS;
}

export interface IResetPasswordFail {
  type: typeof USER_TYPES.RESET_PASSWORD_FAILURE;
  error: any;
}

export interface IGetUserNameReq {
  type: typeof USER_TYPES.GET_USERNAME_FOR_PASSWORD_RESET;
  token: string;
  successCB: () => void;
  failureCB?: (error: Error) => void;
}

export interface IGetUserNameSuccess {
  type: typeof USER_TYPES.GET_USERNAME_FOR_PASSWORD_RESET_SUCCESS;
}

export interface IGetUserNameFail {
  type: typeof USER_TYPES.GET_USERNAME_FOR_PASSWORD_RESET_FAIL;
  error: any;
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
  countryCode?: IPhoneNumberCode;
  village?: string;
}

// export interface IUpdateUserDetail extends Omit<IUserDetail, 'timezone'> {
//   timezone: string;
//   cultureId?: number;
// }

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
  isResetPasswordLoading: boolean;
  defaultRole: string[];
  userRoles: IGroupRoles;
  isRolesLoading: boolean;
  communityList: any[];
  islockedUsersLoading?: boolean;
  designationList: any[];
  isTermsConditionsLoading: boolean;
  termsAndConditions?: ITermsAndConditions;
}

export interface ILoginFailurePayload {
  error: string;
}

export interface ITimezone {
  id: string | number;
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
export interface IAddUserTenantId {
  type: typeof USER_TYPES.ADD_USER_TENANT_ID;
  payload: string;
}
export interface IRemoveUserTenantId {
  type: typeof USER_TYPES.REMOVE_USER_TENANT_ID;
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

export interface IForgotPasswordReq {
  type: typeof USER_TYPES.USER_FORGOT_PASSWORD_REQUEST;
  email: string;
  successCB: () => void;
}

export interface IForgotPasswordSuccess {
  type: typeof USER_TYPES.USER_FORGOT_PASSWORD_SUCCESS;
}

export interface IForgotPasswordFailure {
  type: typeof USER_TYPES.USER_FORGOT_PASSWORD_FAILURE;
  error: any;
}

export interface IResetPasswordReq {
  type: typeof USER_TYPES.RESET_PASSWORD_REQUEST;
  data: {
    email: string;
    password: string;
    token: string;
    successCB: () => void;
    failureCb?: (error: Error) => void;
  };
}

export interface IResetPasswordSuccess {
  type: typeof USER_TYPES.RESET_PASSWORD_SUCCESS;
}

export interface IResetPasswordFail {
  type: typeof USER_TYPES.RESET_PASSWORD_FAILURE;
  error: any;
}

export interface IChangePasswordFail {
  type: typeof USER_TYPES.CHANGE_PASSWORD_FAILURE;
  error: any;
}

export interface IUpdatePasswordReq {
  type: typeof USER_TYPES.UPDATE_PASSWORD_REQUEST;
  data: {
    user: string;
    oldPassword: string;
    newPassword: string;
    tenantId: string;
    successCB: () => void;
    failureCb?: (error: Error) => void;
  };
}

export interface IUpdatePasswordSuccess {
  type: typeof USER_TYPES.UPDATE_PASSWORD_SUCCESS;
}

export interface IUpdatePasswordFail {
  type: typeof USER_TYPES.UPDATE_PASSWORD_FAIL;
  error: any;
}
export interface ICreatePasswordReq {
  type: typeof USER_TYPES.CREATE_PASSWORD_REQUEST;
  data: { email: string; password: string };
  id: string;
  successCB: () => void;
}

export interface ICreatePasswordSuccess {
  type: typeof USER_TYPES.CREATE_PASSWORD_SUCCESS;
}

export interface ICreatePasswordFail {
  type: typeof USER_TYPES.CREATE_PASSWORD_FAIL;
  error: any;
}

export interface IGetUserNameReq {
  type: typeof USER_TYPES.GET_USERNAME_FOR_PASSWORD_RESET;
  token: string;
  successCB: () => void;
}

export interface IGetUserNameSuccess {
  type: typeof USER_TYPES.GET_USERNAME_FOR_PASSWORD_RESET_SUCCESS;
  response: { email: string; username: string; is_password_set: boolean };
}

export interface IGetUserNameFail {
  type: typeof USER_TYPES.GET_USERNAME_FOR_PASSWORD_RESET_FAIL;
  error: any;
}

export interface IFetchTimezoneListRequest {
  type: typeof USER_TYPES.FETCH_TIMEZONE_LIST_REQUEST;
}

export interface IFetchTimezoneListSuccess {
  type: typeof USER_TYPES.FETCH_TIMEZONE_LIST_SUCCESS;
  payload: IFetchTimezoneListSuccessPayload;
}

export interface IFetchTimezoneListFailure {
  type: typeof USER_TYPES.FETCH_TIMEZONE_LIST_FAILURE;
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

export interface ISessionTimeout {
  type: typeof USER_TYPES.SESSION_TIMEDOUT;
  message: string;
}

export interface IResetStore {
  type: typeof USER_TYPES.RESET_STORE;
}

export interface IFetchUserByEmail {
  type: typeof USER_TYPES.FETCH_USER_BY_EMAIL;
  email: string;
  parentOrgId?: string;
  successCb?: (data: IUser) => void;
  failureCb?: (error: ApiError) => void;
}

export interface IFetchUserByEmailSuccess {
  type: typeof USER_TYPES.FETCH_USER_BY_EMAIL_SUCCESS;
}

export interface IFetchUserByEmailFail {
  type: typeof USER_TYPES.FETCH_USER_BY_EMAIL_FAIL;
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

// export interface IUpdateUserRequest {
//   type: typeof USER_TYPES.UPDATE_USER_REQUEST;
//   payload: IEditUserDetail;
//   successCb?: () => void;
//   failureCb?: (e: Error) => void;
// }

export interface IUpdateUserSuccess {
  type: typeof USER_TYPES.UPDATE_USER_SUCCESS;
}

export interface IUpdateUserFailure {
  type: typeof USER_TYPES.UPDATE_USER_FAILURE;
}

export interface IFetchCultureListRequest {
  type: typeof USER_TYPES.FETCH_CULTURE_LIST_REQUEST;
}

export interface IFetchCommunityList {
  type: typeof USER_TYPES.FETCH_COMMUNITY_LIST_REQUEST;
}
export interface IFetchCultureListSuccess {
  type: typeof USER_TYPES.FETCH_CULTURE_LIST_SUCCESS;
  payload: IFetchCultureListSuccessPayload;
}

export interface IFetchCultureListFailure {
  type: typeof USER_TYPES.FETCH_CULTURE_LIST_FAILURE;
}

export interface IFetchCountryListRequest {
  type: typeof USER_TYPES.FETCH_COUNTRY_LIST_REQUEST;
}

export interface IFetchCountryListSuccess {
  type: typeof USER_TYPES.FETCH_COUNTRY_LIST_SUCCESS;
  payload: IFetchCountryListSuccessPayload;
}

export interface IFetchCountryListFailure {
  type: typeof USER_TYPES.FETCH_COUNTRY_LIST_FAILURE;
}

export interface ILockedUsers {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ICommunity {
  id: string;
  name: string;
}

export interface IFetchLockedUsersPayload {
  lockedUsers: ILockedUsers[];
  totalCount: number;
}

export interface IFetchCommunityListPayload {
  entityList: ICommunity[];
  totalCount: number;
}
export interface IFetchLockedUsersRequest {
  type: typeof USER_TYPES.FETCH_LOCKED_USERS_REQUEST;
  skip: number;
  limit: number | null;
  tenantId?: string;
  search?: string;
  role?: string;
  successCb?: (payload: IFetchLockedUsersPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchCommunityList {
  type: typeof USER_TYPES.FETCH_COMMUNITY_LIST_REQUEST;
  countryId: number;
  search?: string;
  successCb?: (payload: IFetchCommunityListPayload) => void;
  failureCb?: (error: Error) => void;
}
export interface IFetchLockedUsersSuccess {
  type: typeof USER_TYPES.FETCH_LOCKED_USERS_SUCCESS;
  payload: IFetchLockedUsersPayload;
}

export interface IFetchLockedUsersFailure {
  type: typeof USER_TYPES.FETCH_LOCKED_USERS_FAILURE;
}

export interface IUnlockUsersRequest {
  type: typeof USER_TYPES.UNLOCK_USERS_REQUEST;
  userId: string;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUnlockUsersSuccess {
  type: typeof USER_TYPES.UNLOCK_USERS_SUCCESS;
}

export interface IUnlockUsersFailure {
  type: typeof USER_TYPES.UNLOCK_USERS_FAILURE;
}

export interface IUnlockUsersRequest {
  type: typeof USER_TYPES.UNLOCK_USERS_REQUEST;
  userId: string;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUserPayload {
  id?: number;
  appTypes: string[];
  firstName: string;
  lastName: string;
  gender: string;
  username: string;
  phoneNumber: string;
  culture?: string;
  countryCode?: string;
  country?: any;
  tenantId?: number | null;
  supervisorId?: number | null;
  roleIds: number[];
  reportUserOrganizationIds: number[];
  insightUserOrganizationIds: number[];
  villageIds?: number[];
  village?: string;
  timezone: { id: number; name?: string };
  district?: string;
  chiefdom?: string;
  redRisk?: boolean;
  designation: { id: string; name: string } | null;
}
export interface ISetAppType {
  type: typeof USER_TYPES.SET_APP_TYPE;
  payload: string[];
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ISetAppTypeSuccess {
  type: typeof USER_TYPES.SET_APP_TYPE_SUCCESS;
  payload: string[];
}

export interface ISetAppTypeFailure {
  type: typeof USER_TYPES.SET_APP_TYPE_FAILURE;
  error: Error;
}

export interface IFetchDesignationList {
  type: typeof USER_TYPES.FETCH_DESIGNATION_LIST_REQUEST;
  countryId: number;
  successCb?: (payload: IFetchCommunityListPayload) => void;
  failureCb?: (error: Error) => void;
}
export interface IDesignationList {
  id: string;
  name: string;
}

export interface IFetchDesignationListPayload {
  designationList: IDesignationList[];
}

export interface IFetchTermsConditionsRequest {
  type: typeof USER_TYPES.FETCH_TERMS_CONDITIONS_REQUEST;
  countryId: number;
  successCB?: (data: ITermsAndConditions) => void;
  failureCB?: (e: Error) => void;
}
export interface IFetchTermsConditionsSuccess {
  type: typeof USER_TYPES.FETCH_TERMS_CONDITIONS_SUCCESS;
  payload: ITermsAndConditions;
}
export interface IFetchTermsConditionsFailure {
  type: typeof USER_TYPES.FETCH_TERMS_CONDITIONS_FAILURE;
  error: any;
}
export interface IUpdateTermsConditionsRequest {
  type: typeof USER_TYPES.UPDATE_TERMS_CONDITIONS_REQUEST;
  userId: number;
  isTermsAndConditionAccepted: boolean;
  successCB?: () => void;
  failureCB?: (e: Error) => void;
}
export interface IUpdateTermsConditionsSuccess {
  type: typeof USER_TYPES.UPDATE_TERMS_CONDITIONS_SUCCESS;
}
export interface IUpdateTermsConditionsFailure {
  type: typeof USER_TYPES.UPDATE_TERMS_CONDITIONS_FAILURE;
  error: any;
}

export type UserActions =
  | ILoginRequest
  | ILoginSuccess
  | ILoginFailure
  | ILogoutRequest
  | ILogoutSuccess
  | ILogoutFailure
  | ILoginRequestPayload
  | IFetchLoggedInUserRequest
  | IFetchLoggedInUserSuccess
  | IFetchLoggedInUserFailure
  | ISessionTimeout
  | IResetStore
  | IAddUserTenantId
  | IFetchUserRolesRequest
  | IFetchUserRolesSuccess
  | IFetchUserRolesFailure
  | IFetchUserByIdRequest
  | IFetchUserByIdSuccess
  | IFetchUserByIdFailure
  | IUpdateUserRequest
  | IUpdateUserSuccess
  | IUpdateUserFailure
  | IChangePasswordReq
  | IChangePasswordSuccess
  | IChangePasswordFail
  | IChangeOwnPasswordReq
  | IChangeOwnPasswordSuccess
  | IChangeOwnPasswordFail
  | IForgotPasswordReq
  | IForgotPasswordSuccess
  | IForgotPasswordFailure
  | IResetPasswordReq
  | IResetPasswordSuccess
  | IResetPasswordFail
  | IGetUserNameReq
  | IGetUserNameSuccess
  | IGetUserNameFail
  | ICreatePasswordReq
  | ICreatePasswordSuccess
  | ICreatePasswordFail
  | IFetchTimezoneListRequest
  | IFetchTimezoneListSuccess
  | IFetchTimezoneListFailure
  | IFetchUserByEmail
  | IFetchUserByEmailSuccess
  | IFetchUserByEmailFail
  | IFetchCultureListRequest
  | IFetchCultureListSuccess
  | IFetchCultureListFailure
  | IFetchCommunityList
  | IFetchCountryListRequest
  | IFetchCountryListSuccess
  | IFetchCountryListFailure
  | IRemoveUserTenantId
  | IFetchLockedUsersRequest
  | IFetchLockedUsersSuccess
  | IFetchLockedUsersFailure
  | IUnlockUsersRequest
  | IUnlockUsersSuccess
  | IUnlockUsersFailure
  | IUpdatePasswordReq
  | IUpdatePasswordSuccess
  | IUpdatePasswordFail
  | IFetchCultureListSuccessPayload
  | IFetchTimezoneListSuccessPayload
  | IFetchTimezoneListSuccessPayload
  | IFetchLockedUsersPayload
  | IFetchCountryListSuccessPayload
  | ILoginSuccessPayload
  | IGroupRoles
  | IRemoveToken
  | ISetAppType
  | ISetAppTypeSuccess
  | ISetAppTypeFailure
  | IFetchDesignationListPayload
  | IDesignationList
  | IFetchDesignationList
  | IFetchTermsConditionsRequest
  | IFetchTermsConditionsSuccess
  | IFetchTermsConditionsFailure
  | IUpdateTermsConditionsRequest
  | IUpdateTermsConditionsSuccess
  | IUpdateTermsConditionsFailure;
