import * as ACTION_TYPES from './actionTypes';
import { IRoles, ITimezone } from '../user/types';

export interface ICounty {
  id: string;
  users: ICountyAdmin[];
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
}
export interface ICountyDetail {
  id: string;
  users: ICountyAdmin[];
  name: string;
  country_code: string;
  maxNoOfUsers: string;
  tenantId: string;
  clinicalworkflow: number[];
  customizedworkflow: number[];
}

export interface ICountyOption {
  name: string;
  id: string;
  tenantId: string;
}

export interface IFetchCountyList {
  tenantId: string;
  skip?: number;
  limit?: number | null;
  searchTerm?: string;
  roleNames: string[];
}
export interface ICountyState {
  county: ICounty;
  loading: boolean;
  loadingOptions: boolean;
  countyList: ICounty[];
  countyOptions: ICountyOption[];
  admins: IAdminEditFormValues[];
  total: number;
  error: string | null | Error;
  dashboardList: IDashboardCounty[];
  clinicalWorkflows: IClinicalWorkflow[];
  clinicalWorkflowsCount: number;
  loadingMore: boolean;
}

export interface ICountyInfo {
  id: string;
  name: string;
  countryId?: number;
  tenantId: string;
}

export interface ICountyDeactivate {
  tenantId: number;
  status: string;
  reason: string;
}

export interface ICountyDeactivateFormValues extends Omit<ICountyDeactivate, 'status'> {
  status: { value: string };
}

export interface IFetchCountyListSuccessPayload {
  countyList: ICounty[];
  total: number;
}

export interface IFetchCountyAdminSuccessPayload {
  admins: IAdminEditFormValues[];
  total: number;
}
export interface IFetchCountyDetailSuccess {
  type: typeof ACTION_TYPES.FETCH_COUNTY_DETAIL_SUCCESS;
  payload: ICounty;
}

export interface IFetchCountyDetailFail {
  type: typeof ACTION_TYPES.FETCH_COUNTY_DETAIL_FAILURE;
  error: Error;
}

export interface ICountyPayload {
  name: string;
  tenantId: number;
  users: Array<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    gender: string;
    timezone: object;
    country: string;
  }>;
}

export interface IFetchCountyListRequest {
  type: typeof ACTION_TYPES.FETCH_COUNTY_LIST_REQUEST;
  isActive: boolean;
  skip?: number;
  limit?: number | null;
  tenantId?: string;
  search?: string;
  successCb?: (payload: IFetchCountyListSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchCountyListSuccess {
  type: typeof ACTION_TYPES.FETCH_COUNTY_LIST_SUCCESS;
  payload: IFetchCountyListSuccessPayload;
}

export interface IFetchCountyListFailure {
  type: typeof ACTION_TYPES.FETCH_COUNTY_LIST_FAILURE;
  error: Error;
}

export interface ICreateCountyRequest {
  type: typeof ACTION_TYPES.CREATE_COUNTY_REQUEST;
  data: ICountyPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateCountyRequestPayload {
  data: ICountyPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}
export interface ICreateCountySuccess {
  type: typeof ACTION_TYPES.CREATE_COUNTY_SUCCESS;
}
export interface ICreateCountyFailure {
  type: typeof ACTION_TYPES.CREATE_COUNTY_FAILURE;
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
}

export interface ICountyAdmin extends Omit<IAdminEditFormValues, 'timezone'> {
  timezone: string;
}

export interface IFetchCountyDetailReqPayload {
  tenantId: number | string;
  id: number | string;
  searchTerm?: string;
  successCb?: (data: ICountyDetail) => void;
  failureCb?: (error: Error) => void;
}
export interface IFetchCountyDetailReq {
  type: typeof ACTION_TYPES.FETCH_COUNTY_DETAIL_REQUEST;
  payload: IFetchCountyDetailReqPayload;
}
export interface ISearchCountyAdminSuccess {
  type: typeof ACTION_TYPES.SEACRH_COUNTY_USER_SUCCESS;
  payload: ICountyAdmin[];
}

export interface ICountyDashboardReq {
  skip: number;
  limit: number | null;
  searchTerm?: string;
  isLoadMore?: boolean;
  tenantId?: string;
  successCb?: () => void;
  failureCb?: (e: Error) => void;
}

export interface IFetchDashboardCounty {
  type: typeof ACTION_TYPES.FETCH_COUNTY_DASHBOARD_LIST_REQUEST;
  payload: ICountyDashboardReq;
}

export interface IDashboardCounty {
  id: string;
  name: string;
  ouCount: number;
  siteCount: number;
  tenantId: string;
}

export interface IFetchDashboardCountySuccessPayload {
  data: IDashboardCounty[];
  total: number;
  isLoadMore?: boolean;
}

export interface IFetchDashboardCountySuccess {
  type: typeof ACTION_TYPES.FETCH_COUNTY_DASHBOARD_LIST_SUCCESS;
  payload: IFetchDashboardCountySuccessPayload;
}

export interface IFetchDashboardCountyFail {
  type: typeof ACTION_TYPES.FETCH_COUNTY_DASHBOARD_LIST_FAIL;
  error: Error;
}
export interface IUpdateCountyReq {
  type: typeof ACTION_TYPES.UPDATE_COUNTY_DETAIL_REQUEST;
  data: ICountyInfo;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}
export interface IUpdateCountySuccess {
  type: typeof ACTION_TYPES.UPDATE_COUNTY_DETAIL_SUCCESS;
  data: ICountyInfo;
}

export interface IUpdateCountyFailure {
  type: typeof ACTION_TYPES.UPDATE_COUNTY_DETAIL_FAIL;
  error: Error;
}

export interface ICreateCountyAdminReq {
  type: typeof ACTION_TYPES.CREATE_COUNTY_ADMIN_REQUEST;
  data: ICountyAdmin;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateCountyAdminSuccess {
  type: typeof ACTION_TYPES.CREATE_COUNTY_ADMIN_SUCCESS;
}

export interface ICreateCountyAdminFail {
  type: typeof ACTION_TYPES.CREATE_COUNTY_ADMIN_FAIL;
  error: Error;
}

export interface IUpdateCountyAdminReq {
  type: typeof ACTION_TYPES.UPDATE_COUNTY_ADMIN_REQUEST;
  data: ICountyAdmin;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUpdateCountyAdminSuccess {
  type: typeof ACTION_TYPES.UPDATE_COUNTY_ADMIN_SUCCESS;
}

export interface IUpdateCountyAdminFail {
  type: typeof ACTION_TYPES.UPDATE_COUNTY_ADMIN_FAIL;
  error: Error;
}
export interface IDeleteCountyAdminPayload {
  id: string | number;
  tenantId: string | number;
}
export interface IDeleteCountyAdminReq {
  type: typeof ACTION_TYPES.DELETE_COUNTY_ADMIN_REQUEST;
  data: IDeleteCountyAdminPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IDeleteCountyAdminSuccess {
  type: typeof ACTION_TYPES.DELETE_COUNTY_ADMIN_SUCCESS;
}

export interface IDeleteCountyAdminFail {
  type: typeof ACTION_TYPES.DELETE_COUNTY_ADMIN_FAIL;
  error: Error;
}

export interface IActivateReqPayload {
  data: { tenant_id: string };
  successCb: () => void;
  failureCb: () => void;
}
export interface IActivateCountyReq {
  type: typeof ACTION_TYPES.ACTIVATE_COUNTY_REQUEST;
  data: { tenantId: number };
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IActivateCountySuccess {
  type: typeof ACTION_TYPES.ACTIVATE_COUNTY_SUCCESS;
}

export interface IActivateCountyFail {
  type: typeof ACTION_TYPES.ACTIVATE_COUNTY_FAIL;
  error: Error;
}

export interface IRemoveDeactivatedCountyList {
  type: typeof ACTION_TYPES.REMOVE_DEACTIVATED_COUNTY_LIST;
}
export interface IDeactivateReqPayload {
  data: ICountyDeactivate;
  successCb: () => void;
  failureCb: (e: Error) => void;
}
export interface IDeactivateCountyReq {
  type: typeof ACTION_TYPES.DEACTIVATE_COUNTY_REQUEST;
  data: ICountyDeactivate;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IDeactivateCountySuccess {
  type: typeof ACTION_TYPES.DEACTIVATE_COUNTY_SUCCESS;
}

export interface IDeactivateCountyFail {
  type: typeof ACTION_TYPES.DEACTIVATE_COUNTY_FAIL;
  error: Error;
}

export interface IFetchCountyOptionsRequest {
  type: typeof ACTION_TYPES.FETCH_COUNTY_OPTIONS_REQUEST;
  tenantId: string;
  skip?: number;
  limit?: number | null;
  searchTerm?: string;
}

export interface IFetchCountyOptionsPayload {
  tenantId: string;
  skip?: number;
  limit?: number | null;
  searchTerm?: string;
}

export interface IFetchCountyOptionsSuccess {
  type: typeof ACTION_TYPES.FETCH_COUNTY_OPTIONS_SUCCESS;
  payload: ICountyOption[];
}

export interface IFetchCountyOptionsFailure {
  type: typeof ACTION_TYPES.FETCH_COUNTY_OPTIONS_FAILURE;
}

export interface IClearCountyDetail {
  type: typeof ACTION_TYPES.CLEAR_COUNTY_DETAILS;
}

export interface ISetCountyDetails {
  type: typeof ACTION_TYPES.SET_COUNTY_DETAILS;
  data?: Partial<ICounty>;
}

export interface IClearCountyList {
  type: typeof ACTION_TYPES.CLEAR_COUNTY_LIST;
}

export interface IClearCountyAdmin {
  type: typeof ACTION_TYPES.CLEAR_COUNTY_ADMIN;
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

export interface IFetchClinicalWorkflowReqPayload {
  countryId: string;
  tenantId?: string;
  limit: number | null;
  skip: number;
  searchTerm: string;
}
export interface IFetchClinicalWorkflowReq {
  type: typeof ACTION_TYPES.FETCH_CLINICAL_WORKFLOW_REQUEST;
  data: IFetchClinicalWorkflowReqPayload;
}

export interface IFetchClinicalWorkflowSuccessPayload {
  data: IClinicalWorkflow[];
  total: number;
}
export interface IFetchClinicalWorkflowSuccess {
  type: typeof ACTION_TYPES.FETCH_CLINICAL_WORKFLOW_SUCCESS;
  payload: IFetchClinicalWorkflowSuccessPayload;
}

export interface IFetchClinicalWorkflowFailure {
  type: typeof ACTION_TYPES.FETCH_CLINICAL_WORKFLOW_FAILURE;
}

export interface ICountyWorkflowModuleReqPayload {
  name?: string;
  viewScreens?: string[];
  countryId?: string;
  tenantId: string;
  id?: string;
}
export interface IDeleteCountyWorkflowModuleReqPayload {
  id: string;
  tenantId: string;
}
export interface ICreateCountyWorkflowModule {
  type: typeof ACTION_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_REQUEST;
  data: ICountyWorkflowModuleReqPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateCountyWorkflowModuleSuccess {
  type: typeof ACTION_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_SUCCESS;
}

export interface ICreateCountyWorkflowModuleFail {
  type: typeof ACTION_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_FAILURE;
  error: Error;
}

export interface IUpdateCountyWorkflowModule {
  type: typeof ACTION_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_REQUEST;
  data: ICountyWorkflowModuleReqPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}
export interface IDeleteCountyWorkflowModule {
  type: typeof ACTION_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_REQUEST;
  data: IDeleteCountyWorkflowModuleReqPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUpdateCountyWorkflowModuleSuccess {
  type: typeof ACTION_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_SUCCESS;
}

export interface IUpdateCountyWorkflowModuleFail {
  type: typeof ACTION_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_FAILURE;
  error: Error;
}
export interface IDeleteCountyWorkflowModuleSuccess {
  type: typeof ACTION_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_SUCCESS;
}

export interface IDeleteCountyWorkflowModuleFail {
  type: typeof ACTION_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_FAILURE;
  error: Error;
}

export interface IResetCountyWorkFlowModule {
  type: typeof ACTION_TYPES.RESET_CLINICAL_WORKFLOW_REQUEST;
}

export type CountyActions =
  | IFetchCountyListRequest
  | IFetchCountyListSuccess
  | IFetchCountyListFailure
  | ICreateCountySuccess
  | ICreateCountyRequest
  | ICreateCountyFailure
  | IFetchCountyDetailReq
  | ISearchCountyAdminSuccess
  | IFetchCountyDetailSuccess
  | IFetchCountyDetailFail
  | IFetchDashboardCounty
  | IFetchDashboardCountySuccess
  | IFetchDashboardCountyFail
  | IUpdateCountyReq
  | IUpdateCountySuccess
  | IUpdateCountyFailure
  | ICreateCountyAdminReq
  | ICreateCountyAdminSuccess
  | ICreateCountyAdminFail
  | IUpdateCountyAdminReq
  | IUpdateCountyAdminSuccess
  | IUpdateCountyAdminFail
  | IDeleteCountyAdminReq
  | IDeleteCountyAdminSuccess
  | IDeleteCountyAdminFail
  | IActivateCountyReq
  | IActivateCountySuccess
  | IActivateCountyFail
  | IRemoveDeactivatedCountyList
  | IDeactivateCountyReq
  | IDeactivateCountySuccess
  | IDeactivateCountyFail
  | IFetchCountyOptionsRequest
  | IFetchCountyOptionsSuccess
  | IFetchCountyOptionsFailure
  | IClearCountyDetail
  | ISetCountyDetails
  | IClearCountyList
  | IClearCountyAdmin
  | IFetchClinicalWorkflowReq
  | IFetchClinicalWorkflowSuccess
  | IFetchClinicalWorkflowFailure
  | ICreateCountyWorkflowModule
  | ICreateCountyWorkflowModuleSuccess
  | ICreateCountyWorkflowModuleFail
  | IUpdateCountyWorkflowModule
  | IUpdateCountyWorkflowModuleSuccess
  | IUpdateCountyWorkflowModuleFail
  | IDeleteCountyWorkflowModule
  | IDeleteCountyWorkflowModuleSuccess
  | IDeleteCountyWorkflowModuleFail
  | IResetCountyWorkFlowModule;
