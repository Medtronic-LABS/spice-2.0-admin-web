import {
  IFetchSubCountyDetailFail,
  IFetchSubCountyDetailSuccess,
  IFetchSubCountyDashboardListFailure,
  IFetchSubCountyDashboardListRequest,
  IFetchSubCountyDashboardListSuccess,
  IFetchSubCountyDashboardListSuccessPayload,
  ICreateSubCountyRequest,
  IFetchSubCountyDetailReq,
  IFetchSubCountyDetailReqPayload,
  ISubCountyAdmin,
  ISearchSubCountyAdminSuccess,
  IFetchSubCountyListRequest,
  IFetchSubCountyListSuccess,
  IFetchSubCountyListFailure,
  IFetchSubCountyListSuccessPayload,
  IUpdateSubCountySuccess,
  IUpdateSubCountyFailure,
  IUpdateSubCountyRequest,
  IUpdateSubCountyAdminRequest,
  IUpdateSubCountyAdminSuccess,
  IUpdateSubCountyAdminFailure,
  IFetchSubCountyDetailSuccessPayload,
  ISubCountyDetail,
  ICreateSubCountyAdminRequest,
  ICreateSubCountyAdminSuccess,
  ICreateSubCountyAdminFailure,
  IDeleteSubCountyAdminRequest,
  IDeleteSubCountyAdminSuccess,
  IDeleteSubCountyAdminFailure,
  IFetchSubCountyByIdFailure,
  IFetchSubCountyByIdSuccess,
  IFetchSubCountyByIdRequest,
  ISetSubCountyDetails,
  IClearSubCountyAdminList,
  IClearSubCountyList,
  ISubCountyDropdownRequest,
  ISubCountyDropdownFailure,
  ISubCountyDropdownSuccess,
  ISubCountyDropdownSuccessPayload
} from './types';
import * as ACTION_TYPES from './actionTypes';

export const fetchSubCountyDashboardListRequest = ({
  skip,
  limit,
  isLoadMore,
  search,
  successCb,
  failureCb
}: Omit<IFetchSubCountyDashboardListRequest, 'type'>): IFetchSubCountyDashboardListRequest => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_REQUEST,
  skip,
  limit,
  isLoadMore,
  search,
  successCb,
  failureCb
});

export const fetchSubCountyDashboardListSuccess = (
  payload: IFetchSubCountyDashboardListSuccessPayload
): IFetchSubCountyDashboardListSuccess => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_SUCCESS,
  payload
});

export const fetchSubCountyDashboardListFailure = (error: Error): IFetchSubCountyDashboardListFailure => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_FAILURE,
  error
});

export const fetchSubCountyDetail = (payload: IFetchSubCountyDetailReqPayload): IFetchSubCountyDetailReq => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_REQUEST,
  payload
});

export const fetchSubCountyDetailSuccess = (
  payload: IFetchSubCountyDetailSuccessPayload
): IFetchSubCountyDetailSuccess => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_SUCCESS,
  payload
});

export const fetchSubCountyDetailFail = (error: Error): IFetchSubCountyDetailFail => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_FAILURE,
  error
});

export const searchUserSuccess = (payload: ISubCountyAdmin[]): ISearchSubCountyAdminSuccess => ({
  type: ACTION_TYPES.SEARCH_SUB_COUNTY_USER_SUCCESS,
  payload
});

export const fetchSubCountyListRequest = ({
  tenantId,
  skip,
  limit,
  search,
  failureCb
}: {
  tenantId: string;
  skip?: number;
  limit?: number | null;
  search?: string;
  failureCb?: (error: Error) => void;
}): IFetchSubCountyListRequest => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_LIST_REQUEST,
  tenantId,
  skip,
  limit,
  search,
  failureCb
});

export const fetchSubCountyListSuccess = (payload: IFetchSubCountyListSuccessPayload): IFetchSubCountyListSuccess => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_LIST_SUCCESS,
  payload
});

export const fetchSubCountyListFailure = (error: Error): IFetchSubCountyListFailure => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_LIST_FAILURE,
  error
});

export const createSubCountyRequest = ({
  payload,
  successCb,
  failureCb
}: Omit<ICreateSubCountyRequest, 'type'>): ICreateSubCountyRequest => ({
  type: ACTION_TYPES.CREATE_SUB_COUNTY_REQUEST,
  payload,
  successCb,
  failureCb
});

export const createSubCountySuccess = () => ({
  type: ACTION_TYPES.CREATE_SUB_COUNTY_SUCCESS
});

export const createSubCountyFailure = () => ({
  type: ACTION_TYPES.CREATE_SUB_COUNTY_FAILURE
});

export const updateSubCountyReq = ({
  payload,
  isSuccessPayloadNeeded,
  successCb,
  failureCb
}: Omit<IUpdateSubCountyRequest, 'type'>): IUpdateSubCountyRequest => ({
  type: ACTION_TYPES.UPDATE_SUB_COUNTY_REQUEST,
  payload,
  isSuccessPayloadNeeded,
  successCb,
  failureCb
});

export const updateSubCountySuccess = (payload?: Partial<ISubCountyDetail>): IUpdateSubCountySuccess => ({
  type: ACTION_TYPES.UPDATE_SUB_COUNTY_SUCCESS,
  payload
});

export const updateSubCountyFailure = (): IUpdateSubCountyFailure => ({
  type: ACTION_TYPES.UPDATE_SUB_COUNTY_FAILURE
});

export const updateSubCountyAdminReq = ({
  payload,
  successCb,
  failureCb
}: Omit<IUpdateSubCountyAdminRequest, 'type'>): IUpdateSubCountyAdminRequest => ({
  type: ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_REQUEST,
  payload,
  successCb,
  failureCb
});

export const updateSubCountyAdminSuccess = (): IUpdateSubCountyAdminSuccess => ({
  type: ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_SUCCESS
});

export const updateSubCountyAdminFailure = (): IUpdateSubCountyAdminFailure => ({
  type: ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_FAILURE
});

export const createSubCountyAdminReq = ({
  payload,
  successCb,
  failureCb
}: Omit<ICreateSubCountyAdminRequest, 'type'>): ICreateSubCountyAdminRequest => ({
  type: ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_REQUEST,
  payload,
  successCb,
  failureCb
});

export const createSubCountyAdminSuccess = (): ICreateSubCountyAdminSuccess => ({
  type: ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_SUCCESS
});

export const createSubCountyAdminFailure = (): ICreateSubCountyAdminFailure => ({
  type: ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_FAILURE
});

export const deleteSubCountyAdminReq = ({
  payload,
  successCb,
  failureCb
}: Omit<IDeleteSubCountyAdminRequest, 'type'>): IDeleteSubCountyAdminRequest => ({
  type: ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_REQUEST,
  payload,
  successCb,
  failureCb
});

export const deleteSubCountyAdminSuccess = (): IDeleteSubCountyAdminSuccess => ({
  type: ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_SUCCESS
});

export const deleteSubCountyAdminFailure = (): IDeleteSubCountyAdminFailure => ({
  type: ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_FAILURE
});

export const fetchSubCountyByIdReq = ({
  payload,
  successCb,
  failureCb
}: Omit<IFetchSubCountyByIdRequest, 'type'>): IFetchSubCountyByIdRequest => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_REQUEST,
  payload,
  successCb,
  failureCb
});

export const fetchSubCountyByIdSuccess = (): IFetchSubCountyByIdSuccess => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_SUCCESS
});

export const fetchSubCountyByIdFailure = (): IFetchSubCountyByIdFailure => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_FAILURE
});

export const clearSubCountyDetail = () => ({
  type: ACTION_TYPES.CLEAR_SUB_COUNTY_DETAIL
});

export const setSubCountyDetails = (data?: Partial<ISubCountyDetail>): ISetSubCountyDetails => ({
  type: ACTION_TYPES.SET_SUB_COUNTY_DETAILS,
  data
});

export const clearSubCountyList = (): IClearSubCountyList => ({
  type: ACTION_TYPES.CLEAR_SUB_COUNTY_LIST
});

export const clearSubCountyAdminList = (): IClearSubCountyAdminList => ({
  type: ACTION_TYPES.CLEAR_SUB_COUNTY_ADMIN_LIST
});

export const fetchSubCountyDropdownRequest = ({ tenantId }: { tenantId: string }): ISubCountyDropdownRequest => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_REQUEST,
  tenantId
});

export const fetchSubCountyDropdownSuccess = (
  payload: ISubCountyDropdownSuccessPayload
): ISubCountyDropdownSuccess => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_SUCCESS,
  payload
});

export const fetchSubCountyDropdownFailure = (error: Error): ISubCountyDropdownFailure => ({
  type: ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_FAIL,
  error
});

export const clearSubCountyDropdown = () => ({
  type: ACTION_TYPES.CLEAR_DROPDOWN_VALUES
});
