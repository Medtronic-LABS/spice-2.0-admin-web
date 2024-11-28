import * as DISTRICT_TYPES from './actionTypes';
import {
  IFetchDistrictListRequest,
  IFetchDistrictListSuccess,
  IFetchDistrictListFailure,
  IFetchDistrictListSuccessPayload,
  ICreateDistrictRequestPayload,
  ICreateDistrictRequest,
  ICreateDistrictSuccess,
  ICreateDistrictFailure,
  IDistrictAdmin,
  IFetchDistrictDetailReq,
  IFetchDistrictDetailReqPayload,
  ISearchDistrictAdminSuccess,
  IDistrict,
  IFetchDistrictDetailSuccess,
  IFetchDistrictDetailFail,
  IDistrictDashboardReq,
  IFetchDashboardDistrictFail,
  IFetchDashboardDistrict,
  IFetchDashboardDistrictSuccess,
  IFetchDashboardDistrictSuccessPayload,
  IDistrictInfo,
  IUpdateDistrictReq,
  IUpdateDistrictSuccess,
  IUpdateDistrictFailure,
  ICreateDistrictAdminReq,
  ICreateDistrictAdminSuccess,
  ICreateDistrictAdminFail,
  IUpdateDistrictAdminReq,
  IUpdateDistrictAdminSuccess,
  IUpdateDistrictAdminFail,
  IDeleteDistrictAdminPayload,
  IDeleteDistrictAdminReq,
  IDeleteDistrictAdminSuccess,
  IDeleteDistrictAdminFail,
  IDeactivateDistrictReq,
  IDeactivateDistrictSuccess,
  IDeactivateDistrictFail,
  IDistrictDeactivate,
  IFetchDistrictOptionsRequest,
  IFetchDistrictOptionsSuccess,
  IFetchDistrictOptionsFailure,
  IDistrictOption,
  IActivateAccountReq,
  IActivateDistrictSuccess,
  IActivateDistrictFail,
  ISetDistrictDetails,
  IClearDistrictList,
  IClearDistrictAdmin
} from './types';

export const fetchDistrictListRequest = ({
  countryId,
  tenantId,
  isActive,
  skip,
  limit,
  search,
  successCb,
  failureCb
}: Omit<IFetchDistrictListRequest, 'type'>): IFetchDistrictListRequest => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_LIST_REQUEST,
  countryId,
  tenantId,
  isActive,
  skip,
  limit,
  search,
  successCb,
  failureCb
});

export const fetchDistrictListSuccess = (payload: IFetchDistrictListSuccessPayload): IFetchDistrictListSuccess => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_LIST_SUCCESS,
  payload
});

export const fetchDistrictListFailure = (error: Error): IFetchDistrictListFailure => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_LIST_FAILURE,
  error
});

export const searchUserSuccess = (payload: IDistrictAdmin[]): ISearchDistrictAdminSuccess => ({
  type: DISTRICT_TYPES.SEACRH_DISTRICT_USER_SUCCESS,
  payload
});

export const fetchDistrictDetailReq = (payload: IFetchDistrictDetailReqPayload): IFetchDistrictDetailReq => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_DETAIL_REQUEST,
  payload
});

export const fetchDistrictDetailSuccess = (payload: IDistrict): IFetchDistrictDetailSuccess => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_DETAIL_SUCCESS,
  payload
});

export const fetchDistrictDetailFail = (error: Error): IFetchDistrictDetailFail => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_DETAIL_FAILURE,
  error
});

export const createDistrictRequest = ({
  data,
  successCb,
  failureCb
}: ICreateDistrictRequestPayload): ICreateDistrictRequest => ({
  type: DISTRICT_TYPES.CREATE_DISTRICT_REQUEST,
  data,
  successCb,
  failureCb
});

export const createDistrictSuccess = (): ICreateDistrictSuccess => ({
  type: DISTRICT_TYPES.CREATE_DISTRICT_SUCCESS
});

export const createDistrictFailure = (error: Error): ICreateDistrictFailure => ({
  type: DISTRICT_TYPES.CREATE_DISTRICT_FAILURE,
  error
});

export const fetchDistrictDashboardList = (payload: IDistrictDashboardReq): IFetchDashboardDistrict => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_REQUEST,
  payload
});

export const fetchDashboardDistrictSuccess = (
  payload: IFetchDashboardDistrictSuccessPayload
): IFetchDashboardDistrictSuccess => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_SUCCESS,
  payload
});

export const fetchDashboardDistrictFail = (error: Error): IFetchDashboardDistrictFail => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_FAIL,
  error
});
export const updateDistrictDetail = ({
  data,
  successCb,
  failureCb
}: {
  data: IDistrictInfo;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IUpdateDistrictReq => ({
  type: DISTRICT_TYPES.UPDATE_DISTRICT_DETAIL_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateDistrictDetailSuccess = (data: IDistrictInfo): IUpdateDistrictSuccess => ({
  type: DISTRICT_TYPES.UPDATE_DISTRICT_DETAIL_SUCCESS,
  data
});

export const updateDistrictDetailFail = (error: Error): IUpdateDistrictFailure => ({
  type: DISTRICT_TYPES.UPDATE_DISTRICT_DETAIL_FAIL,
  error
});

export const updateDistrictAdmin = ({
  data,
  successCb,
  failureCb
}: {
  data: IDistrictAdmin;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IUpdateDistrictAdminReq => ({
  type: DISTRICT_TYPES.UPDATE_DISTRICT_ADMIN_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateDistrictAdminSuccess = (): IUpdateDistrictAdminSuccess => ({
  type: DISTRICT_TYPES.UPDATE_DISTRICT_ADMIN_SUCCESS
});

export const updateDistrictAdminFail = (error: Error): IUpdateDistrictAdminFail => ({
  type: DISTRICT_TYPES.UPDATE_DISTRICT_ADMIN_FAIL,
  error
});

export const createDistrictAdmin = ({
  data,
  successCb,
  failureCb
}: {
  data: IDistrictAdmin;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): ICreateDistrictAdminReq => ({
  type: DISTRICT_TYPES.CREATE_DISTRICT_ADMIN_REQUEST,
  data,
  successCb,
  failureCb
});

export const createDistrictAdminSuccess = (): ICreateDistrictAdminSuccess => ({
  type: DISTRICT_TYPES.CREATE_DISTRICT_ADMIN_SUCCESS
});

export const createDistrictAdminFail = (error: Error): ICreateDistrictAdminFail => ({
  type: DISTRICT_TYPES.CREATE_DISTRICT_ADMIN_FAIL,
  error
});

export const deleteDistrictAdmin = ({
  data,
  successCb,
  failureCb
}: {
  data: IDeleteDistrictAdminPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IDeleteDistrictAdminReq => ({
  type: DISTRICT_TYPES.DELETE_DISTRICT_ADMIN_REQUEST,
  data,
  successCb,
  failureCb
});

export const deleteDistrictAdminSuccess = (): IDeleteDistrictAdminSuccess => ({
  type: DISTRICT_TYPES.DELETE_DISTRICT_ADMIN_SUCCESS
});

export const deleteDistrictAdminFail = (error: Error): IDeleteDistrictAdminFail => ({
  type: DISTRICT_TYPES.DELETE_DISTRICT_ADMIN_FAIL,
  error
});

export const activateAccountReq = ({
  data,
  successCb,
  failureCb
}: Omit<IActivateAccountReq, 'type'>): IActivateAccountReq => ({
  type: DISTRICT_TYPES.ACTIVATE_ACCOUNT_REQUEST,
  data,
  successCb,
  failureCb
});

export const activateAccountSuccess = (): IActivateDistrictSuccess => ({
  type: DISTRICT_TYPES.ACTIVATE_ACCOUNT_SUCCESS
});

export const activateAccountFail = (error: Error): IActivateDistrictFail => ({
  type: DISTRICT_TYPES.ACTIVATE_ACCOUNT_FAIL,
  error
});

export const removeDeactivatedAccountList = () => ({
  type: DISTRICT_TYPES.REMOVE_DEACTIVATED_ACCOUNT_LIST
});

export const decactivateDistrictReq = ({
  data,
  successCb,
  failureCb
}: {
  data: IDistrictDeactivate;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): IDeactivateDistrictReq => ({
  type: DISTRICT_TYPES.DEACTIVATE_DISTRICT_REQUEST,
  data,
  successCb,
  failureCb
});

export const deactivateDistrictSuccess = (): IDeactivateDistrictSuccess => ({
  type: DISTRICT_TYPES.DEACTIVATE_DISTRICT_SUCCESS
});

export const deactivateDistrictFail = (error: Error): IDeactivateDistrictFail => ({
  type: DISTRICT_TYPES.DEACTIVATE_DISTRICT_FAIL,
  error
});

export const fetchDistrictOptionsRequest = (tenantId: string): IFetchDistrictOptionsRequest => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_OPTIONS_REQUEST,
  tenantId
});

export const fetchDistrictOptionsSuccess = (payload: IDistrictOption[]): IFetchDistrictOptionsSuccess => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_OPTIONS_SUCCESS,
  payload
});

export const fetchDistrictOptionsFailure = (): IFetchDistrictOptionsFailure => ({
  type: DISTRICT_TYPES.FETCH_DISTRICT_OPTIONS_FAILURE
});

export const clearDistrictDetails = () => ({
  type: DISTRICT_TYPES.CLEAR_DISTRICT_DETAILS
});

export const setDistrictDetails = (data?: Partial<IDistrict>): ISetDistrictDetails => ({
  type: DISTRICT_TYPES.SET_DISTRICT_DETAILS,
  data
});

export const clearDistrictList = (): IClearDistrictList => ({
  type: DISTRICT_TYPES.CLEAR_DISTRICT_LIST
});

export const clearDistrictAdmin = (): IClearDistrictAdmin => ({
  type: DISTRICT_TYPES.CLEAR_DISTRICT_ADMIN
});

export const resetClinicalWorkflow = () => ({
  type: DISTRICT_TYPES.RESET_CLINICAL_WORKFLOW_REQUEST
});
