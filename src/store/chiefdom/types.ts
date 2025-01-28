import { ITimezone } from '../user/types';
import * as ACTION_TYPES from './actionTypes';

export interface IChiefdom {
  name: string;
  _id: string;
  tenant_id: string;
}

export interface IChiefdomSummary {
  id: string;
  name: string;
  healthFacilityCount: number;
  groupCount: number;
  tenantId: string;
}

export interface IChiefdomList {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  district: string;
  account: { name: string };
  districtName: string;
}

export interface IChiefdomState {
  chiefdom?: IChiefdom;
  chiefdomList: IChiefdomList[];
  listTotal: number;
  chiefdomDetail: IChiefdomDetail;
  admins: IChiefdomAdmin[];
  chiefdomDashboardList: IChiefdomSummary[];
  total: number;
  error?: string | null | Error;
  loading: boolean;
  loadingMore: boolean;
  chiefdomAdmins: IChiefdomAdmin[];
  dropdownChiefdomList: IChiefdomList[];
  dropdownChiefdomListLoading: boolean;
}

export interface IChiefdomAdmin {
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

export interface IChiefdomDetail {
  id: string;
  name: string;
  tenantId: string;
  countryId: string;
  districtName: string;
  district: { id: string; name: string; tenantId?: string };
}

export interface IFetchChiefdomDashboardListSuccessPayload {
  chiefdomDashboardList: IChiefdomSummary[];
  total: number;
  isLoadMore?: boolean;
}

export interface IChiefdomAdminFormvalue {
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

export type IChiefdomAdminApiData = IChiefdomAdminFormvalue;

export interface IChiefdomFormData {
  id?: string;
  name: string;
  districtId: number;
  countryId: number;
  parentOrganizationId: number;
  tenantId: string;
  users: IChiefdomAdminFormvalue[];
}

export interface IFetchChiefdomDashboardListRequest {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST;
  isLoadMore?: boolean;
  skip: number;
  limit: number | null;
  search?: string;
  successCb?: (payload: IFetchChiefdomDashboardListSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchChiefdomDashboardListSuccess {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_SUCCESS;
  payload: IFetchChiefdomDashboardListSuccessPayload;
}

export interface IFetchChiefdomDashboardListFailure {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_FAILURE;
  error: Error;
}

export interface IFetchChiefdomDetailReqPayload {
  tenantId: string;
  id: string;
  searchTerm?: string;
  countryId?: number | null;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchChiefdomDetailReq {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_REQUEST;
  payload: IFetchChiefdomDetailReqPayload;
}

export interface IFetchChiefdomDetailSuccessPayload {
  chiefdomDetail: IChiefdomDetail;
  chiefdomAdmins: IChiefdomAdmin[];
}

export interface IFetchChiefdomDetailSuccess {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_SUCCESS;
  payload: IFetchChiefdomDetailSuccessPayload;
}
export interface IFetchChiefdomDetailFail {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_FAILURE;
  error: Error;
}

export interface ISearchChiefdomAdminSuccess {
  type: typeof ACTION_TYPES.SEARCH_CHIEFDOM_USER_SUCCESS;
  payload: IChiefdomAdmin[];
}

export interface IFetchChiefdomListSuccessPayload {
  chiefdomList: IChiefdomList[];
  total: number;
}

export interface IFetchChiefdomListRequest {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST;
  tenantId: string;
  skip?: number;
  limit?: number | null;
  search?: string;
  failureCb?: (error: Error) => void;
}

export interface IFetchChiefdomListSuccess {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS;
  payload: IFetchChiefdomListSuccessPayload;
}

export interface IFetchChiefdomListFailure {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_LIST_FAILURE;
  error: Error;
}

export interface ICreateChiefdomRequest {
  type: typeof ACTION_TYPES.CREATE_CHIEFDOM_REQUEST;
  payload: IChiefdomFormData;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface ICreateChiefdomSuccess {
  type: typeof ACTION_TYPES.CREATE_CHIEFDOM_SUCCESS;
}

export interface ICreateChiefdomFailure {
  type: typeof ACTION_TYPES.CREATE_CHIEFDOM_FAILURE;
}

export interface IUpdateChiefdomRequest {
  type: typeof ACTION_TYPES.UPDATE_CHIEFDOM_REQUEST;
  payload: Omit<IChiefdomFormData, 'users' | 'parentOrganizationId'>;
  isSuccessPayloadNeeded?: boolean;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IUpdateChiefdomSuccess {
  type: typeof ACTION_TYPES.UPDATE_CHIEFDOM_SUCCESS;
  payload?: Partial<IChiefdomDetail>;
}

export interface IUpdateChiefdomFailure {
  type: typeof ACTION_TYPES.UPDATE_CHIEFDOM_FAILURE;
}

export interface ICreateChiefdomAdminRequest {
  type: typeof ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_REQUEST;
  payload: IChiefdomAdminFormvalue;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface ICreateChiefdomAdminSuccess {
  type: typeof ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_SUCCESS;
}

export interface ICreateChiefdomAdminFailure {
  type: typeof ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_FAILURE;
}

export interface IUpdateChiefdomAdminRequest {
  type: typeof ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_REQUEST;
  payload: IChiefdomAdminFormvalue;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IUpdateChiefdomAdminSuccess {
  type: typeof ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_SUCCESS;
}

export interface IUpdateChiefdomAdminFailure {
  type: typeof ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_FAILURE;
}

export interface IDeleteChiefdomAdminRequest {
  type: typeof ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_REQUEST;
  payload: { tenantId: string; id: string };
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IDeleteChiefdomAdminSuccess {
  type: typeof ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_SUCCESS;
}

export interface IDeleteChiefdomAdminFailure {
  type: typeof ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_FAILURE;
}

export interface IFetchChiefdomByIdRequest {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_REQUEST;
  payload: { tenantId: string; id: string };
  successCb?: (payload: IChiefdomDetail) => void;
  failureCb?: (e: Error) => void;
}

export interface IFetchChiefdomByIdSuccess {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_SUCCESS;
}

export interface IFetchChiefdomByIdFailure {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_FAILURE;
}

export interface IFetchRegReqPayload {
  tenantId: string;
  _id: string;
  searchParams?: string;
  failureCb: (error: Error) => void;
}

export interface IFetchChiefdomAdminsSuccessPayload {
  chiefdomAdmins: IChiefdomAdmin[];
  total: number;
}

export interface IFetchChiefdomAdminsRequest {
  searchTerm?: string;
  roleNames: string[];
  tenantId: string;
  countryId?: number;
  appTypes?: string[];
}

export interface IClearChiefdomDetail {
  type: typeof ACTION_TYPES.CLEAR_CHIEFDOM_DETAIL;
}

export interface ISetChiefdomDetails {
  type: typeof ACTION_TYPES.SET_CHIEFDOM_DETAILS;
  data?: Partial<IChiefdomDetail>;
}

export interface IClearChiefdomList {
  type: typeof ACTION_TYPES.CLEAR_CHIEFDOM_LIST;
}

export interface IClearChiefdomAdminList {
  type: typeof ACTION_TYPES.CLEAR_CHIEFDOM_ADMIN_LIST;
}

export interface IChiefdomDropdownRequest {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST;
  tenantId: string;
}

export interface IChiefdomDropdownSuccessPayload {
  total: number;
  chiefdomList: IChiefdomList[];
  limit: number | null;
}
export interface IChiefdomDropdownSuccess {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_SUCCESS;
  payload: IChiefdomDropdownSuccessPayload;
}

export interface IChiefdomDropdownFailure {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_FAIL;
  error: Error;
}

export interface IClearOUDropdown {
  type: typeof ACTION_TYPES.CLEAR_DROPDOWN_VALUES;
}

export type ChiefdomActions =
  | IFetchChiefdomDashboardListRequest
  | IFetchChiefdomDashboardListSuccess
  | IFetchChiefdomDashboardListFailure
  | IFetchChiefdomDetailReq
  | IFetchChiefdomDetailSuccess
  | IFetchChiefdomDetailFail
  | ISearchChiefdomAdminSuccess
  | IFetchChiefdomListRequest
  | IFetchChiefdomListSuccess
  | IFetchChiefdomListFailure
  | ICreateChiefdomRequest
  | ICreateChiefdomSuccess
  | ICreateChiefdomFailure
  | IUpdateChiefdomRequest
  | IUpdateChiefdomSuccess
  | IUpdateChiefdomFailure
  | ICreateChiefdomAdminRequest
  | ICreateChiefdomAdminSuccess
  | ICreateChiefdomAdminFailure
  | IUpdateChiefdomAdminRequest
  | IUpdateChiefdomAdminSuccess
  | IUpdateChiefdomAdminFailure
  | IDeleteChiefdomAdminRequest
  | IDeleteChiefdomAdminSuccess
  | IDeleteChiefdomAdminFailure
  | IFetchChiefdomByIdRequest
  | IFetchChiefdomByIdSuccess
  | IFetchChiefdomByIdFailure
  | IClearChiefdomDetail
  | ISetChiefdomDetails
  | IClearChiefdomList
  | IClearChiefdomAdminList
  | IChiefdomDropdownRequest
  | IChiefdomDropdownSuccess
  | IChiefdomDropdownFailure
  | IClearOUDropdown;
