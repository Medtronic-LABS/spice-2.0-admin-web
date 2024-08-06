import { IRoles, ITimezone } from '../user/types';
import * as ACTION_TYPES from './actionTypes';

export interface ISubCounty {
  name: string;
  _id: string;
  tenant_id: string;
}

export interface ISubCountySummary {
  id: string;
  name: string;
  siteCount: number;
  groupCount: number;
  tenantId: string;
}

export interface ISubCountyList {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  county: string;
  account: { name: string };
  countyName: string;
}

export interface ISubCountyState {
  subCounty?: ISubCounty;
  subCountyList: ISubCountyList[];
  listTotal: number;
  subCountyDetail: ISubCountyDetail;
  admins: ISubCountyAdmin[];
  subCountyDashboardList: ISubCountySummary[];
  total: number;
  error?: string | null | Error;
  loading: boolean;
  loadingMore: boolean;
  subCountyAdmins: ISubCountyAdmin[];
  dropdownSubCountyList: ISubCountyList[];
  dropdownSubCountyListLoading: boolean;
}

export interface ISubCountyAdmin {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  countryCode: string;
  phoneNumber: string;
  username: string;
  timezone: ITimezone;
  country?: string;
  model_org_Name: string;
  organizationName?: string;
}

export interface ISubCountyDetail {
  id: string;
  name: string;
  tenantId: string;
  countryId: string;
  countyName: string;
  account: { id: string; name: string; tenantId?: string };
}

export interface IFetchSubCountyDashboardListSuccessPayload {
  subCountyDashboardList: ISubCountySummary[];
  total: number;
  isLoadMore?: boolean;
}

export interface ISubCountyAdminFormvalue {
  id?: string;
  email?: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  timezone: { id: number };
  gender: string;
  tenantId?: string;
  country?: { id: number };
  countryCode: string;
  roleIds?: number[];
}

export type IOuAdminApiData = ISubCountyAdminFormvalue;

export interface ISubCountyFormData {
  id?: string;
  name: string;
  countyId: number;
  countryId: number;
  parentOrganizationId: number;
  tenantId: string;
  users: ISubCountyAdminFormvalue[];
}

export interface IFetchSubCountyDashboardListRequest {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_REQUEST;
  isLoadMore?: boolean;
  skip: number;
  limit: number | null;
  search?: string;
  successCb?: (payload: IFetchSubCountyDashboardListSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchSubCountyDashboardListSuccess {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_SUCCESS;
  payload: IFetchSubCountyDashboardListSuccessPayload;
}

export interface IFetchSubCountyDashboardListFailure {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_FAILURE;
  error: Error;
}

export interface IFetchSubCountyDetailReqPayload {
  tenantId: string;
  id: string;
  searchTerm?: string;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchSubCountyDetailReq {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_REQUEST;
  payload: IFetchSubCountyDetailReqPayload;
}

export interface IFetchSubCountyDetailSuccessPayload {
  subCountyDetail: ISubCountyDetail;
  subCountyAdmins: ISubCountyAdmin[];
}

export interface IFetchSubCountyDetailSuccess {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_SUCCESS;
  payload: IFetchSubCountyDetailSuccessPayload;
}
export interface IFetchSubCountyDetailFail {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_FAILURE;
  error: Error;
}

export interface ISearchSubCountyAdminSuccess {
  type: typeof ACTION_TYPES.SEARCH_SUB_COUNTY_USER_SUCCESS;
  payload: ISubCountyAdmin[];
}

export interface IFetchSubCountyListSuccessPayload {
  subCountyList: ISubCountyList[];
  total: number;
}

export interface IFetchSubCountyListRequest {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_LIST_REQUEST;
  tenantId: string;
  skip?: number;
  limit?: number | null;
  search?: string;
  failureCb?: (error: Error) => void;
}

export interface IFetchSubCountyListSuccess {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_LIST_SUCCESS;
  payload: IFetchSubCountyListSuccessPayload;
}

export interface IFetchSubCountyListFailure {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_LIST_FAILURE;
  error: Error;
}

export interface ICreateSubCountyRequest {
  type: typeof ACTION_TYPES.CREATE_SUB_COUNTY_REQUEST;
  payload: ISubCountyFormData;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface ICreateSubCountySuccess {
  type: typeof ACTION_TYPES.CREATE_SUB_COUNTY_SUCCESS;
}

export interface ICreateSubCountyFailure {
  type: typeof ACTION_TYPES.CREATE_SUB_COUNTY_FAILURE;
}

export interface IUpdateSubCountyRequest {
  type: typeof ACTION_TYPES.UPDATE_SUB_COUNTY_REQUEST;
  payload: Omit<ISubCountyFormData, 'users' | 'parentOrganizationId'>;
  isSuccessPayloadNeeded?: boolean;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IUpdateSubCountySuccess {
  type: typeof ACTION_TYPES.UPDATE_SUB_COUNTY_SUCCESS;
  payload?: Partial<ISubCountyDetail>;
}

export interface IUpdateSubCountyFailure {
  type: typeof ACTION_TYPES.UPDATE_SUB_COUNTY_FAILURE;
}

export interface ICreateSubCountyAdminRequest {
  type: typeof ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_REQUEST;
  payload: ISubCountyAdminFormvalue;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface ICreateSubCountyAdminSuccess {
  type: typeof ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_SUCCESS;
}

export interface ICreateSubCountyAdminFailure {
  type: typeof ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_FAILURE;
}

export interface IUpdateSubCountyAdminRequest {
  type: typeof ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_REQUEST;
  payload: ISubCountyAdminFormvalue;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IUpdateSubCountyAdminSuccess {
  type: typeof ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_SUCCESS;
}

export interface IUpdateSubCountyAdminFailure {
  type: typeof ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_FAILURE;
}

export interface IDeleteSubCountyAdminRequest {
  type: typeof ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_REQUEST;
  payload: { tenantId: string; id: string };
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IDeleteSubCountyAdminSuccess {
  type: typeof ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_SUCCESS;
}

export interface IDeleteSubCountyAdminFailure {
  type: typeof ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_FAILURE;
}

export interface IFetchSubCountyByIdRequest {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_REQUEST;
  payload: { tenantId: string; id: string };
  successCb?: (payload: ISubCountyDetail) => void;
  failureCb?: (e: Error) => void;
}

export interface IFetchSubCountyByIdSuccess {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_SUCCESS;
}

export interface IFetchSubCountyByIdFailure {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_FAILURE;
}

export interface IFetchRegReqPayload {
  tenantId: string;
  _id: string;
  searchParams?: string;
  failureCb: (error: Error) => void;
}

export interface IFetchSubCountyAdminsSuccessPayload {
  subCountyAdmins: ISubCountyAdmin[];
  total: number;
}

export interface IFetchSubCountyAdminsRequest {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_ADMIN_LIST_REQUEST;
  payload: {
    skip?: number;
    userType?: string;
    limit?: number | null;
    searchTerm?: string;
    tenantId: string;
  };
  successCb?: (payload: IFetchSubCountyAdminsSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchSubCountyAdminsSuccess {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_ADMIN_LIST_SUCCESS;
  payload: IFetchSubCountyAdminsSuccessPayload;
}

export interface IFetchSubCountyAdminsFailure {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_ADMIN_LIST_FAILURE;
  error: Error;
}

export interface IClearSubCountyDetail {
  type: typeof ACTION_TYPES.CLEAR_SUB_COUNTY_DETAIL;
}

export interface ISetSubCountyDetails {
  type: typeof ACTION_TYPES.SET_SUB_COUNTY_DETAILS;
  data?: Partial<ISubCountyDetail>;
}

export interface IClearSubCountyList {
  type: typeof ACTION_TYPES.CLEAR_SUB_COUNTY_LIST;
}

export interface IClearSubCountyAdminList {
  type: typeof ACTION_TYPES.CLEAR_SUB_COUNTY_ADMIN_LIST;
}

export interface ISubCountyDropdownRequest {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_REQUEST;
  tenantId: string;
}

export interface ISubCountyDropdownSuccessPayload {
  total: number;
  subCountyList: ISubCountyList[];
  limit: number | null;
}
export interface ISubCountyDropdownSuccess {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_SUCCESS;
  payload: ISubCountyDropdownSuccessPayload;
}

export interface ISubCountyDropdownFailure {
  type: typeof ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_FAIL;
  error: Error;
}

export interface IClearOUDropdown {
  type: typeof ACTION_TYPES.CLEAR_DROPDOWN_VALUES;
}

export type SubCountyActions =
  | IFetchSubCountyDashboardListRequest
  | IFetchSubCountyDashboardListSuccess
  | IFetchSubCountyDashboardListFailure
  | IFetchSubCountyDetailReq
  | IFetchSubCountyDetailSuccess
  | IFetchSubCountyDetailFail
  | ISearchSubCountyAdminSuccess
  | IFetchSubCountyListRequest
  | IFetchSubCountyListSuccess
  | IFetchSubCountyListFailure
  | ICreateSubCountyRequest
  | ICreateSubCountySuccess
  | ICreateSubCountyFailure
  | IUpdateSubCountyRequest
  | IUpdateSubCountySuccess
  | IUpdateSubCountyFailure
  | ICreateSubCountyAdminRequest
  | ICreateSubCountyAdminSuccess
  | ICreateSubCountyAdminFailure
  | IUpdateSubCountyAdminRequest
  | IUpdateSubCountyAdminSuccess
  | IUpdateSubCountyAdminFailure
  | IDeleteSubCountyAdminRequest
  | IDeleteSubCountyAdminSuccess
  | IDeleteSubCountyAdminFailure
  | IFetchSubCountyByIdRequest
  | IFetchSubCountyByIdSuccess
  | IFetchSubCountyByIdFailure
  | IFetchSubCountyAdminsRequest
  | IFetchSubCountyAdminsSuccess
  | IFetchSubCountyAdminsFailure
  | IClearSubCountyDetail
  | ISetSubCountyDetails
  | IClearSubCountyList
  | IClearSubCountyAdminList
  | ISubCountyDropdownRequest
  | ISubCountyDropdownSuccess
  | ISubCountyDropdownFailure
  | IClearOUDropdown;
