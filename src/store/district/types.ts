import * as ACTION_TYPES from './actionTypes';
import { IRoles, ITimezone } from '../user/types';

export interface IDistrict {
  id: string;
  users: IDistrictAdmin[];
  name: string;
  maxNoOfUsers: string;
  tenantId: string;
  updatedAt?: string;
  clinicalWorkflow?: IClinicalWorkflow[] | string[];
  customizedWorkflow?: IClinicalWorkflow[] | string[];
  country?: {
    countryCode: string;
    tenantId?: string;
    id?: string;
  };
  countryId?: number;
}
export interface IDistrictDetail {
  id: string;
  users: IDistrictAdmin[];
  name: string;
  country_code: string;
  maxNoOfUsers: string;
  tenantId: string;
  clinicalworkflow: number[];
  customizedworkflow: number[];
}

export interface IDistrictOption {
  name: string;
  id: string;
  tenantId: string;
}

export interface IFetchDistrictList {
  tenantId: string;
  skip?: number;
  limit?: number | null;
  searchTerm?: string;
  roleNames: string[];
  countryId?: number;
  appTypes?: string[];
}
export interface IDistrictState {
  district: IDistrict;
  loading: boolean;
  loadingOptions: boolean;
  districtList: IDistrict[];
  districtOptions: IDistrictOption[];
  admins: IAdminEditFormValues[];
  total: number;
  error: string | null | Error;
  dashboardList: IDashboardDistrict[];
  clinicalWorkflows: IClinicalWorkflow[];
  clinicalWorkflowsCount: number;
  loadingMore: boolean;
}

export interface IDistrictInfo {
  id: string;
  name: string;
  countryId?: number;
  tenantId: string;
}

export interface IDistrictDeactivate {
  tenantId: number;
  status: string;
  reason: string;
}

export interface IDistrictDeactivateFormValues extends Omit<IDistrictDeactivate, 'status'> {
  status: { value: string };
}

export interface IFetchDistrictListSuccessPayload {
  districtList: IDistrict[];
  total: number;
}

export interface IFetchDistrictAdminSuccessPayload {
  admins: IAdminEditFormValues[];
  total: number;
}
export interface IFetchDistrictDetailSuccess {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_DETAIL_SUCCESS;
  payload: IDistrict;
}

export interface IFetchDistrictDetailFail {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_DETAIL_FAILURE;
  error: Error;
}

export interface IDistrictPayload {
  name: string;
  tenantId: number;
  users: Array<{
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    gender: string;
    timezone: object;
    country: string;
  }>;
}

export interface IFetchDistrictListRequest {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST;
  isActive: boolean;
  skip?: number;
  limit?: number | null;
  tenantId?: string | number;
  countryId: number;
  search?: string;
  successCb?: (payload: IFetchDistrictListSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchDistrictListSuccess {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_LIST_SUCCESS;
  payload: IFetchDistrictListSuccessPayload;
}

export interface IFetchDistrictListFailure {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_LIST_FAILURE;
  error: Error;
}

export interface ICreateDistrictRequest {
  type: typeof ACTION_TYPES.CREATE_DISTRICT_REQUEST;
  data: IDistrictPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateDistrictRequestPayload {
  data: IDistrictPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}
export interface ICreateDistrictSuccess {
  type: typeof ACTION_TYPES.CREATE_DISTRICT_SUCCESS;
}
export interface ICreateDistrictFailure {
  type: typeof ACTION_TYPES.CREATE_DISTRICT_FAILURE;
  error: Error;
}
export interface IAdminEditFormValues {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  gender: string;
  countryCode: string;
  timezone: ITimezone;
  country: { countryCode?: string; id?: string; phoneNumberCode?: string };
  tenantId?: string;
  roles: IRoles[];
  role?: IRoles[];
  suiteAccess?: Array<{ groupName: string; id: string }>;
}

export interface IDistrictAdmin extends Omit<IAdminEditFormValues, 'timezone'> {
  timezone: string;
}

export interface IFetchDistrictDetailReqPayload {
  tenantId: number | string;
  id: number | string;
  searchTerm?: string;
  countryId?: number;
  successCb?: (data: IDistrictDetail) => void;
  failureCb?: (error: Error) => void;
}
export interface IFetchDistrictDetailReq {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_DETAIL_REQUEST;
  payload: IFetchDistrictDetailReqPayload;
}
export interface ISearchDistrictAdminSuccess {
  type: typeof ACTION_TYPES.SEACRH_DISTRICT_USER_SUCCESS;
  payload: IDistrictAdmin[];
}

export interface IDistrictDashboardReq {
  skip: number;
  limit: number | null;
  searchTerm?: string;
  isLoadMore?: boolean;
  tenantId?: string;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IFetchDashboardDistrict {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_REQUEST;
  payload: IDistrictDashboardReq;
}

export interface IDashboardDistrict {
  id: string;
  name: string;
  chiefdomCount: number;
  healthFacilityCount: number;
  tenantId: string;
}

export interface IFetchDashboardDistrictSuccessPayload {
  data: IDashboardDistrict[];
  total: number;
  isLoadMore?: boolean;
}

export interface IFetchDashboardDistrictSuccess {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_SUCCESS;
  payload: IFetchDashboardDistrictSuccessPayload;
}

export interface IFetchDashboardDistrictFail {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_FAIL;
  error: Error;
}
export interface IUpdateDistrictReq {
  type: typeof ACTION_TYPES.UPDATE_DISTRICT_DETAIL_REQUEST;
  data: IDistrictInfo;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}
export interface IUpdateDistrictSuccess {
  type: typeof ACTION_TYPES.UPDATE_DISTRICT_DETAIL_SUCCESS;
  data: IDistrictInfo;
}

export interface IUpdateDistrictFailure {
  type: typeof ACTION_TYPES.UPDATE_DISTRICT_DETAIL_FAIL;
  error: Error;
}

export interface ICreateDistrictAdminReq {
  type: typeof ACTION_TYPES.CREATE_DISTRICT_ADMIN_REQUEST;
  data: IDistrictAdmin;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateDistrictAdminSuccess {
  type: typeof ACTION_TYPES.CREATE_DISTRICT_ADMIN_SUCCESS;
}

export interface ICreateDistrictAdminFail {
  type: typeof ACTION_TYPES.CREATE_DISTRICT_ADMIN_FAIL;
  error: Error;
}

export interface IUpdateDistrictAdminReq {
  type: typeof ACTION_TYPES.UPDATE_DISTRICT_ADMIN_REQUEST;
  data: IDistrictAdmin;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUpdateDistrictAdminSuccess {
  type: typeof ACTION_TYPES.UPDATE_DISTRICT_ADMIN_SUCCESS;
}

export interface IUpdateDistrictAdminFail {
  type: typeof ACTION_TYPES.UPDATE_DISTRICT_ADMIN_FAIL;
  error: Error;
}
export interface IDeleteDistrictAdminPayload {
  id: string | number;
  tenantId: string | number;
}
export interface IDeleteDistrictAdminReq {
  type: typeof ACTION_TYPES.DELETE_DISTRICT_ADMIN_REQUEST;
  data: IDeleteDistrictAdminPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IDeleteDistrictAdminSuccess {
  type: typeof ACTION_TYPES.DELETE_DISTRICT_ADMIN_SUCCESS;
}

export interface IDeleteDistrictAdminFail {
  type: typeof ACTION_TYPES.DELETE_DISTRICT_ADMIN_FAIL;
  error: Error;
}

export interface IActivateReqPayload {
  data: { tenant_id: string };
  successCb: () => void;
  failureCb: () => void;
}
export interface IActivateAccountReq {
  type: typeof ACTION_TYPES.ACTIVATE_ACCOUNT_REQUEST;
  data: { tenantId: number };
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IActivateDistrictSuccess {
  type: typeof ACTION_TYPES.ACTIVATE_ACCOUNT_SUCCESS;
}

export interface IActivateDistrictFail {
  type: typeof ACTION_TYPES.ACTIVATE_ACCOUNT_FAIL;
  error: Error;
}

export interface IRemoveDeactivatedAccountList {
  type: typeof ACTION_TYPES.REMOVE_DEACTIVATED_ACCOUNT_LIST;
}
export interface IDeactivateReqPayload {
  data: IDistrictDeactivate;
  successCb: () => void;
  failureCb: (e: Error) => void;
}
export interface IDeactivateDistrictReq {
  type: typeof ACTION_TYPES.DEACTIVATE_DISTRICT_REQUEST;
  data: IDistrictDeactivate;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IDeactivateDistrictSuccess {
  type: typeof ACTION_TYPES.DEACTIVATE_DISTRICT_SUCCESS;
}

export interface IDeactivateDistrictFail {
  type: typeof ACTION_TYPES.DEACTIVATE_DISTRICT_FAIL;
  error: Error;
}

export interface IFetchDistrictOptionsRequest {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_OPTIONS_REQUEST;
  tenantId: string;
  skip?: number;
  limit?: number | null;
  searchTerm?: string;
}

export interface IFetchDistrictOptionsPayload {
  tenantId: string;
  skip?: number;
  limit?: number | null;
  searchTerm?: string;
}

export interface IFetchDistrictOptionsSuccess {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_OPTIONS_SUCCESS;
  payload: IDistrictOption[];
}

export interface IFetchDistrictOptionsFailure {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_OPTIONS_FAILURE;
}

export interface IClearDistrictDetail {
  type: typeof ACTION_TYPES.CLEAR_DISTRICT_DETAILS;
}

export interface ISetDistrictDetails {
  type: typeof ACTION_TYPES.SET_DISTRICT_DETAILS;
  data?: Partial<IDistrict>;
}

export interface IClearDistrictList {
  type: typeof ACTION_TYPES.CLEAR_DISTRICT_LIST;
}

export interface IClearDistrictAdmin {
  type: typeof ACTION_TYPES.CLEAR_DISTRICT_ADMIN;
}

export interface IClinicalWorkflow {
  id: string;
  name: string;
  isActive?: boolean;
  default?: boolean;
  isDeleted?: boolean;
  coreType?: string;
  workflowId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  moduleType?: string;
  country?: string;
  tenantId?: string;
  viewScreens?: string[];
  workflow?: string;
}

export interface IWorkflowModuleReqPayload {
  name?: string;
  viewScreens?: string[];
  countryId?: string;
  tenantId: string;
  id?: string;
}

export type DistrictActions =
  | IFetchDistrictListRequest
  | IFetchDistrictListSuccess
  | IFetchDistrictListFailure
  | ICreateDistrictSuccess
  | ICreateDistrictRequest
  | ICreateDistrictFailure
  | IFetchDistrictDetailReq
  | ISearchDistrictAdminSuccess
  | IFetchDistrictDetailSuccess
  | IFetchDistrictDetailFail
  | IFetchDashboardDistrict
  | IFetchDashboardDistrictSuccess
  | IFetchDashboardDistrictFail
  | IUpdateDistrictReq
  | IUpdateDistrictSuccess
  | IUpdateDistrictFailure
  | ICreateDistrictAdminReq
  | ICreateDistrictAdminSuccess
  | ICreateDistrictAdminFail
  | IUpdateDistrictAdminReq
  | IUpdateDistrictAdminSuccess
  | IUpdateDistrictAdminFail
  | IDeleteDistrictAdminReq
  | IDeleteDistrictAdminSuccess
  | IDeleteDistrictAdminFail
  | IActivateAccountReq
  | IActivateDistrictSuccess
  | IActivateDistrictFail
  | IRemoveDeactivatedAccountList
  | IDeactivateDistrictReq
  | IDeactivateDistrictSuccess
  | IDeactivateDistrictFail
  | IFetchDistrictOptionsRequest
  | IFetchDistrictOptionsSuccess
  | IFetchDistrictOptionsFailure
  | IClearDistrictDetail
  | ISetDistrictDetails
  | IClearDistrictList
  | IClearDistrictAdmin;
