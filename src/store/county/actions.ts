import * as COUNTY_TYPES from './actionTypes';
import {
  IFetchCountyListRequest,
  IFetchCountyListSuccess,
  IFetchCountyListFailure,
  IFetchCountyListSuccessPayload,
  ICreateCountyRequestPayload,
  ICreateCountyRequest,
  ICreateCountySuccess,
  ICreateCountyFailure,
  ICountyAdmin,
  IFetchCountyDetailReq,
  IFetchCountyDetailReqPayload,
  ISearchCountyAdminSuccess,
  ICounty,
  IFetchCountyDetailSuccess,
  IFetchCountyDetailFail,
  ICountyDashboardReq,
  IFetchDashboardCountyFail,
  IFetchDashboardCounty,
  IFetchDashboardCountySuccess,
  IFetchDashboardCountySuccessPayload,
  ICountyInfo,
  IUpdateCountyReq,
  IUpdateCountySuccess,
  IUpdateCountyFailure,
  ICreateCountyAdminReq,
  ICreateCountyAdminSuccess,
  ICreateCountyAdminFail,
  IUpdateCountyAdminReq,
  IUpdateCountyAdminSuccess,
  IUpdateCountyAdminFail,
  IDeleteCountyAdminPayload,
  IDeleteCountyAdminReq,
  IDeleteCountyAdminSuccess,
  IDeleteCountyAdminFail,
  IDeactivateCountyReq,
  IDeactivateCountySuccess,
  IDeactivateCountyFail,
  ICountyDeactivate,
  IFetchCountyOptionsRequest,
  IFetchCountyOptionsSuccess,
  IFetchCountyOptionsFailure,
  ICountyOption,
  IActivateCountyReq,
  IActivateCountySuccess,
  IActivateCountyFail,
  ISetCountyDetails,
  IClearCountyList,
  IClearCountyAdmin,
  IFetchClinicalWorkflowReq,
  IFetchClinicalWorkflowSuccess,
  IFetchClinicalWorkflowFailure,
  ICreateCountyWorkflowModule,
  ICreateCountyWorkflowModuleSuccess,
  ICreateCountyWorkflowModuleFail,
  IUpdateCountyWorkflowModule,
  IUpdateCountyWorkflowModuleSuccess,
  IUpdateCountyWorkflowModuleFail,
  IDeleteCountyWorkflowModule,
  IDeleteCountyWorkflowModuleSuccess,
  IDeleteCountyWorkflowModuleFail,
  IFetchClinicalWorkflowReqPayload,
  IFetchClinicalWorkflowSuccessPayload
} from './types';

export const fetchCountyListRequest = ({
  tenantId,
  isActive,
  skip,
  limit,
  search,
  successCb,
  failureCb
}: {
  tenantId: string;
  isActive: boolean;
  skip?: number;
  limit?: number | null;
  search?: string;
  successCb?: (payload: IFetchCountyListSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}): IFetchCountyListRequest => ({
  type: COUNTY_TYPES.FETCH_COUNTY_LIST_REQUEST,
  tenantId,
  isActive,
  skip,
  limit,
  search,
  successCb,
  failureCb
});

export const fetchCountyListSuccess = (payload: IFetchCountyListSuccessPayload): IFetchCountyListSuccess => ({
  type: COUNTY_TYPES.FETCH_COUNTY_LIST_SUCCESS,
  payload
});

export const fetchCountyListFailure = (error: Error): IFetchCountyListFailure => ({
  type: COUNTY_TYPES.FETCH_COUNTY_LIST_FAILURE,
  error
});

export const searchUserSuccess = (payload: ICountyAdmin[]): ISearchCountyAdminSuccess => ({
  type: COUNTY_TYPES.SEACRH_COUNTY_USER_SUCCESS,
  payload
});

export const fetchCountyListDetailReq = (payload: IFetchCountyDetailReqPayload): IFetchCountyDetailReq => ({
  type: COUNTY_TYPES.FETCH_COUNTY_DETAIL_REQUEST,
  payload
});

export const fetchCountyDetailSuccess = (payload: ICounty): IFetchCountyDetailSuccess => ({
  type: COUNTY_TYPES.FETCH_COUNTY_DETAIL_SUCCESS,
  payload
});

export const fetchCountyDetailFail = (error: Error): IFetchCountyDetailFail => ({
  type: COUNTY_TYPES.FETCH_COUNTY_DETAIL_FAILURE,
  error
});

export const createCountyRequest = ({
  data,
  successCb,
  failureCb
}: ICreateCountyRequestPayload): ICreateCountyRequest => ({
  type: COUNTY_TYPES.CREATE_COUNTY_REQUEST,
  data,
  successCb,
  failureCb
});

export const createCountySuccess = (): ICreateCountySuccess => ({
  type: COUNTY_TYPES.CREATE_COUNTY_SUCCESS
});

export const createCountyFailure = (error: Error): ICreateCountyFailure => ({
  type: COUNTY_TYPES.CREATE_COUNTY_FAILURE,
  error
});

export const fetchCountyDashboardList = (payload: ICountyDashboardReq): IFetchDashboardCounty => ({
  type: COUNTY_TYPES.FETCH_COUNTY_DASHBOARD_LIST_REQUEST,
  payload
});

export const fetchDashboardCountySuccess = (
  payload: IFetchDashboardCountySuccessPayload
): IFetchDashboardCountySuccess => ({
  type: COUNTY_TYPES.FETCH_COUNTY_DASHBOARD_LIST_SUCCESS,
  payload
});

export const fetchDashboardCountyFail = (error: Error): IFetchDashboardCountyFail => ({
  type: COUNTY_TYPES.FETCH_COUNTY_DASHBOARD_LIST_FAIL,
  error
});
export const updateCountyDetail = ({
  data,
  successCb,
  failureCb
}: {
  data: ICountyInfo;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IUpdateCountyReq => ({
  type: COUNTY_TYPES.UPDATE_COUNTY_DETAIL_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateCountyDetailSuccess = (data: ICountyInfo): IUpdateCountySuccess => ({
  type: COUNTY_TYPES.UPDATE_COUNTY_DETAIL_SUCCESS,
  data
});

export const updateCountyDetailFail = (error: Error): IUpdateCountyFailure => ({
  type: COUNTY_TYPES.UPDATE_COUNTY_DETAIL_FAIL,
  error
});

export const updateCountyAdmin = ({
  data,
  successCb,
  failureCb
}: {
  data: ICountyAdmin;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IUpdateCountyAdminReq => ({
  type: COUNTY_TYPES.UPDATE_COUNTY_ADMIN_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateCountyAdminSuccess = (): IUpdateCountyAdminSuccess => ({
  type: COUNTY_TYPES.UPDATE_COUNTY_ADMIN_SUCCESS
});

export const updateCountyAdminFail = (error: Error): IUpdateCountyAdminFail => ({
  type: COUNTY_TYPES.UPDATE_COUNTY_ADMIN_FAIL,
  error
});

export const createCountyAdmin = ({
  data,
  successCb,
  failureCb
}: {
  data: ICountyAdmin;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): ICreateCountyAdminReq => ({
  type: COUNTY_TYPES.CREATE_COUNTY_ADMIN_REQUEST,
  data,
  successCb,
  failureCb
});

export const createCountyAdminSuccess = (): ICreateCountyAdminSuccess => ({
  type: COUNTY_TYPES.CREATE_COUNTY_ADMIN_SUCCESS
});

export const createCountyAdminFail = (error: Error): ICreateCountyAdminFail => ({
  type: COUNTY_TYPES.CREATE_COUNTY_ADMIN_FAIL,
  error
});

export const deleteCountyAdmin = ({
  data,
  successCb,
  failureCb
}: {
  data: IDeleteCountyAdminPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IDeleteCountyAdminReq => ({
  type: COUNTY_TYPES.DELETE_COUNTY_ADMIN_REQUEST,
  data,
  successCb,
  failureCb
});

export const deleteCountyAdminSuccess = (): IDeleteCountyAdminSuccess => ({
  type: COUNTY_TYPES.DELETE_COUNTY_ADMIN_SUCCESS
});

export const deleteCountyAdminFail = (error: Error): IDeleteCountyAdminFail => ({
  type: COUNTY_TYPES.DELETE_COUNTY_ADMIN_FAIL,
  error
});

export const activateCountyReq = ({
  data,
  successCb,
  failureCb
}: Omit<IActivateCountyReq, 'type'>): IActivateCountyReq => ({
  type: COUNTY_TYPES.ACTIVATE_COUNTY_REQUEST,
  data,
  successCb,
  failureCb
});

export const activateCountySuccess = (): IActivateCountySuccess => ({
  type: COUNTY_TYPES.ACTIVATE_COUNTY_SUCCESS
});

export const activateCountyFail = (error: Error): IActivateCountyFail => ({
  type: COUNTY_TYPES.ACTIVATE_COUNTY_FAIL,
  error
});

export const removeDeactivatedCountyList = () => ({
  type: COUNTY_TYPES.REMOVE_DEACTIVATED_COUNTY_LIST
});

export const decactivateCountyReq = ({
  data,
  successCb,
  failureCb
}: {
  data: ICountyDeactivate;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IDeactivateCountyReq => ({
  type: COUNTY_TYPES.DEACTIVATE_COUNTY_REQUEST,
  data,
  successCb,
  failureCb
});

export const deactivateCountySuccess = (): IDeactivateCountySuccess => ({
  type: COUNTY_TYPES.DEACTIVATE_COUNTY_SUCCESS
});

export const deactivateCountyFail = (error: Error): IDeactivateCountyFail => ({
  type: COUNTY_TYPES.DEACTIVATE_COUNTY_FAIL,
  error
});

export const fetchCountyOptionsRequest = (tenantId: string): IFetchCountyOptionsRequest => ({
  type: COUNTY_TYPES.FETCH_COUNTY_OPTIONS_REQUEST,
  tenantId
});

export const fetchCountyOptionsSuccess = (payload: ICountyOption[]): IFetchCountyOptionsSuccess => ({
  type: COUNTY_TYPES.FETCH_COUNTY_OPTIONS_SUCCESS,
  payload
});

export const fetchCountyOptionsFailure = (): IFetchCountyOptionsFailure => ({
  type: COUNTY_TYPES.FETCH_COUNTY_OPTIONS_FAILURE
});

export const clearCountyDetails = () => ({
  type: COUNTY_TYPES.CLEAR_COUNTY_DETAILS
});

export const setCountyDetails = (data?: Partial<ICounty>): ISetCountyDetails => ({
  type: COUNTY_TYPES.SET_COUNTY_DETAILS,
  data
});

export const clearCountyList = (): IClearCountyList => ({
  type: COUNTY_TYPES.CLEAR_COUNTY_LIST
});

export const clearCountyAdmin = (): IClearCountyAdmin => ({
  type: COUNTY_TYPES.CLEAR_COUNTY_ADMIN
});

export const fetchClinicalWorkflow = (data: IFetchClinicalWorkflowReqPayload): IFetchClinicalWorkflowReq => ({
  type: COUNTY_TYPES.FETCH_CLINICAL_WORKFLOW_REQUEST,
  data
});

export const fetchClinicalWorkflowSuccess = (
  payload: IFetchClinicalWorkflowSuccessPayload
): IFetchClinicalWorkflowSuccess => ({
  type: COUNTY_TYPES.FETCH_CLINICAL_WORKFLOW_SUCCESS,
  payload
});

export const fetchClinicalWorkflowFailure = (): IFetchClinicalWorkflowFailure => ({
  type: COUNTY_TYPES.FETCH_CLINICAL_WORKFLOW_FAILURE
});

export const createCountyWorkflowModule = ({
  data,
  successCb,
  failureCb
}: Omit<ICreateCountyWorkflowModule, 'type'>): ICreateCountyWorkflowModule => ({
  type: COUNTY_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_REQUEST,
  data,
  successCb,
  failureCb
});

export const createCountyWorkflowModuleSuccess = (): ICreateCountyWorkflowModuleSuccess => ({
  type: COUNTY_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_SUCCESS
});

export const createCountyWorkflowModuleFailure = (error: Error): ICreateCountyWorkflowModuleFail => ({
  type: COUNTY_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_FAILURE,
  error
});

export const updateCountyWorkflowModule = ({
  data,
  successCb,
  failureCb
}: Omit<IUpdateCountyWorkflowModule, 'type'>): IUpdateCountyWorkflowModule => ({
  type: COUNTY_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateCountyWorkflowModuleSuccess = (): IUpdateCountyWorkflowModuleSuccess => ({
  type: COUNTY_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_SUCCESS
});

export const updateCountyWorkflowModuleFailure = (error: Error): IUpdateCountyWorkflowModuleFail => ({
  type: COUNTY_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_FAILURE,
  error
});

export const deleteCountyWorkflowModule = ({
  data,
  successCb,
  failureCb
}: Omit<IDeleteCountyWorkflowModule, 'type'>): IDeleteCountyWorkflowModule => ({
  type: COUNTY_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_REQUEST,
  data,
  successCb,
  failureCb
});

export const deleteCountyWorkflowModuleSuccess = (): IDeleteCountyWorkflowModuleSuccess => ({
  type: COUNTY_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_SUCCESS
});

export const deleteCountyWorkflowModuleFailure = (error: Error): IDeleteCountyWorkflowModuleFail => ({
  type: COUNTY_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_FAILURE,
  error
});

export const resetClinicalWorkflow = () => ({
  type: COUNTY_TYPES.RESET_CLINICAL_WORKFLOW_REQUEST
});
