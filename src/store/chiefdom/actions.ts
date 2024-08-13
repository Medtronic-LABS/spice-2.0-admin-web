import {
  IFetchChiefdomDetailFail,
  IFetchChiefdomDetailSuccess,
  IFetchChiefdomDashboardListFailure,
  IFetchChiefdomDashboardListRequest,
  IFetchChiefdomDashboardListSuccess,
  IFetchChiefdomDashboardListSuccessPayload,
  ICreateChiefdomRequest,
  IFetchChiefdomDetailReq,
  IFetchChiefdomDetailReqPayload,
  IChiefdomAdmin,
  ISearchChiefdomAdminSuccess,
  IFetchChiefdomListRequest,
  IFetchChiefdomListSuccess,
  IFetchChiefdomListFailure,
  IFetchChiefdomListSuccessPayload,
  IUpdateChiefdomSuccess,
  IUpdateChiefdomFailure,
  IUpdateChiefdomRequest,
  IUpdateChiefdomAdminRequest,
  IUpdateChiefdomAdminSuccess,
  IUpdateChiefdomAdminFailure,
  IFetchChiefdomDetailSuccessPayload,
  IChiefdomDetail,
  ICreateChiefdomAdminRequest,
  ICreateChiefdomAdminSuccess,
  ICreateChiefdomAdminFailure,
  IDeleteChiefdomAdminRequest,
  IDeleteChiefdomAdminSuccess,
  IDeleteChiefdomAdminFailure,
  IFetchChiefdomByIdFailure,
  IFetchChiefdomByIdSuccess,
  IFetchChiefdomByIdRequest,
  ISetChiefdomDetails,
  IClearChiefdomAdminList,
  IClearChiefdomList,
  IChiefdomDropdownRequest,
  IChiefdomDropdownFailure,
  IChiefdomDropdownSuccess,
  IChiefdomDropdownSuccessPayload
} from './types';
import * as ACTION_TYPES from './actionTypes';

export const fetchChiefdomDashboardListRequest = ({
  skip,
  limit,
  isLoadMore,
  search,
  successCb,
  failureCb
}: Omit<IFetchChiefdomDashboardListRequest, 'type'>): IFetchChiefdomDashboardListRequest => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST,
  skip,
  limit,
  isLoadMore,
  search,
  successCb,
  failureCb
});

export const fetchChiefdomDashboardListSuccess = (
  payload: IFetchChiefdomDashboardListSuccessPayload
): IFetchChiefdomDashboardListSuccess => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_SUCCESS,
  payload
});

export const fetchChiefdomDashboardListFailure = (error: Error): IFetchChiefdomDashboardListFailure => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_FAILURE,
  error
});

export const fetchChiefdomDetail = (payload: IFetchChiefdomDetailReqPayload): IFetchChiefdomDetailReq => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_REQUEST,
  payload
});

export const fetchChiefdomDetailSuccess = (
  payload: IFetchChiefdomDetailSuccessPayload
): IFetchChiefdomDetailSuccess => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_SUCCESS,
  payload
});

export const fetchChiefdomDetailFail = (error: Error): IFetchChiefdomDetailFail => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_FAILURE,
  error
});

export const searchUserSuccess = (payload: IChiefdomAdmin[]): ISearchChiefdomAdminSuccess => ({
  type: ACTION_TYPES.SEARCH_CHIEFDOM_USER_SUCCESS,
  payload
});

export const fetchChiefdomListRequest = ({
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
}): IFetchChiefdomListRequest => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST,
  tenantId,
  skip,
  limit,
  search,
  failureCb
});

export const fetchChiefdomListSuccess = (payload: IFetchChiefdomListSuccessPayload): IFetchChiefdomListSuccess => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS,
  payload
});

export const fetchChiefdomListFailure = (error: Error): IFetchChiefdomListFailure => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_FAILURE,
  error
});

export const createChiefdomRequest = ({
  payload,
  successCb,
  failureCb
}: Omit<ICreateChiefdomRequest, 'type'>): ICreateChiefdomRequest => ({
  type: ACTION_TYPES.CREATE_CHIEFDOM_REQUEST,
  payload,
  successCb,
  failureCb
});

export const createChiefdomSuccess = () => ({
  type: ACTION_TYPES.CREATE_CHIEFDOM_SUCCESS
});

export const createChiefdomFailure = () => ({
  type: ACTION_TYPES.CREATE_CHIEFDOM_FAILURE
});

export const updateChiefdomReq = ({
  payload,
  isSuccessPayloadNeeded,
  successCb,
  failureCb
}: Omit<IUpdateChiefdomRequest, 'type'>): IUpdateChiefdomRequest => ({
  type: ACTION_TYPES.UPDATE_CHIEFDOM_REQUEST,
  payload,
  isSuccessPayloadNeeded,
  successCb,
  failureCb
});

export const updateChiefdomSuccess = (payload?: Partial<IChiefdomDetail>): IUpdateChiefdomSuccess => ({
  type: ACTION_TYPES.UPDATE_CHIEFDOM_SUCCESS,
  payload
});

export const updateChiefdomFailure = (): IUpdateChiefdomFailure => ({
  type: ACTION_TYPES.UPDATE_CHIEFDOM_FAILURE
});

export const updateChiefdomAdminReq = ({
  payload,
  successCb,
  failureCb
}: Omit<IUpdateChiefdomAdminRequest, 'type'>): IUpdateChiefdomAdminRequest => ({
  type: ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_REQUEST,
  payload,
  successCb,
  failureCb
});

export const updateChiefdomAdminSuccess = (): IUpdateChiefdomAdminSuccess => ({
  type: ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_SUCCESS
});

export const updateChiefdomAdminFailure = (): IUpdateChiefdomAdminFailure => ({
  type: ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_FAILURE
});

export const createChiefdomAdminReq = ({
  payload,
  successCb,
  failureCb
}: Omit<ICreateChiefdomAdminRequest, 'type'>): ICreateChiefdomAdminRequest => ({
  type: ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_REQUEST,
  payload,
  successCb,
  failureCb
});

export const createChiefdomAdminSuccess = (): ICreateChiefdomAdminSuccess => ({
  type: ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_SUCCESS
});

export const createChiefdomAdminFailure = (): ICreateChiefdomAdminFailure => ({
  type: ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_FAILURE
});

export const deleteChiefdomAdminReq = ({
  payload,
  successCb,
  failureCb
}: Omit<IDeleteChiefdomAdminRequest, 'type'>): IDeleteChiefdomAdminRequest => ({
  type: ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_REQUEST,
  payload,
  successCb,
  failureCb
});

export const deleteChiefdomAdminSuccess = (): IDeleteChiefdomAdminSuccess => ({
  type: ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_SUCCESS
});

export const deleteChiefdomAdminFailure = (): IDeleteChiefdomAdminFailure => ({
  type: ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_FAILURE
});

export const fetchChiefdomByIdReq = ({
  payload,
  successCb,
  failureCb
}: Omit<IFetchChiefdomByIdRequest, 'type'>): IFetchChiefdomByIdRequest => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_REQUEST,
  payload,
  successCb,
  failureCb
});

export const fetchChiefdomByIdSuccess = (): IFetchChiefdomByIdSuccess => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_SUCCESS
});

export const fetchChiefdomByIdFailure = (): IFetchChiefdomByIdFailure => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_FAILURE
});

export const clearChiefdomDetail = () => ({
  type: ACTION_TYPES.CLEAR_CHIEFDOM_DETAIL
});

export const setChiefdomDetails = (data?: Partial<IChiefdomDetail>): ISetChiefdomDetails => ({
  type: ACTION_TYPES.SET_CHIEFDOM_DETAILS,
  data
});

export const clearChiefdomList = (): IClearChiefdomList => ({
  type: ACTION_TYPES.CLEAR_CHIEFDOM_LIST
});

export const clearChiefdomAdminList = (): IClearChiefdomAdminList => ({
  type: ACTION_TYPES.CLEAR_CHIEFDOM_ADMIN_LIST
});

export const fetchChiefdomDropdownRequest = ({ tenantId }: { tenantId: string }): IChiefdomDropdownRequest => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST,
  tenantId
});

export const fetchChiefdomDropdownSuccess = (payload: IChiefdomDropdownSuccessPayload): IChiefdomDropdownSuccess => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_SUCCESS,
  payload
});

export const fetchChiefdomDropdownFailure = (error: Error): IChiefdomDropdownFailure => ({
  type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_FAIL,
  error
});

export const clearChiefdomDropdown = () => ({
  type: ACTION_TYPES.CLEAR_DROPDOWN_VALUES
});
