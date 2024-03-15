import * as SITE_TYPES from './actionTypes';
import {
  IFetchHFListFailure,
  IFetchHFListRequest,
  IFetchHFListSuccess,
  IFetchHFListSuccessPayload,
  ICreateHFRequest,
  ICreateHFSuccess,
  ICreateHFFailure,
  IClearDropdownValues,
  IFetchHFSummaryRequest,
  IFetchHFSummarySuccess,
  IFetchHFSummaryFailure,
  ICreateHFUserRequest,
  ICreateHFUserSuccess,
  ICreateHFUserFailure,
  IUpdateHFDetailsRequest,
  IUpdateHFDetailsSuccess,
  IUpdateHFDetailsFailure,
  IUpdateHFUserRequest,
  IUpdateHFUserSuccess,
  IUpdateHFUserFailure,
  IFetchHFUserListRequest,
  IFetchHFUserListSuccessPayload,
  IFetchHFUserListSuccess,
  IFetchHFUserListFailure,
  IDeleteHFUserRequest,
  IDeleteHFUserSuccess,
  IDeleteHFUserFailure,
  ICreateHFRequestPayload,
  IHealthFacilitySummary,
  IHFUserPost,
  IFetchChiefdomListRequest,
  IChiefdom,
  IFetchChiefdomListSuccess,
  IFetchChiefdomListFailure,
  IFetchDistrictListRequest,
  IFetchDistrictListSuccess,
  IFetchDistrictListFailure,
  IFetchVillagesListRequest,
  IFetchVillagesListFailure,
  IFetchVillagesListSuccess,
  IFetchPeerSupervisorListSuccess,
  IPeerSupervisor,
  IFetchPeerSupervisorListFailure,
  IFetchPeerSupervisorListRequest,
  IFetchWorkflowListRequest,
  IWorkflow,
  IFetchWorkflowListSuccess,
  IFetchWorkflowListFailure,
  IDistrict,
  IHealthFacility,
  IFetchVillagespayload,
  IFetchHFTypesRequest,
  IFetchHFTypesSuccess,
  IObjectData,
  IFetchHFTypesFailure
} from '../healthFacility/types';
import ApiError from '../../global/ApiError';

export const fetchHFListRequest = ({
  countryId,
  skip,
  limit,
  searchTerm,
  userBased,
  failureCb
}: Omit<IFetchHFListRequest, 'type'>): IFetchHFListRequest => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_LIST_REQUEST,
  skip,
  limit,
  countryId,
  searchTerm,
  userBased,
  failureCb
});

export const fetchHFListSuccess = (payload: IFetchHFListSuccessPayload): IFetchHFListSuccess => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_LIST_SUCCESS,
  payload
});

export const fetchHFListFailure = (error: Error): IFetchHFListFailure => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_LIST_FAILURE,
  error
});

export const createHFRequest = ({
  data,
  successCb,
  failureCb
}: {
  data: ICreateHFRequestPayload;
  successCb?: () => void;
  failureCb?: (error: ApiError) => void;
}): ICreateHFRequest => ({
  type: SITE_TYPES.CREATE_HEALTH_FACILITY_REQUEST,
  data,
  successCb,
  failureCb
});

export const createHFSuccess = (): ICreateHFSuccess => ({
  type: SITE_TYPES.CREATE_HEALTH_FACILITY_SUCCESS
});

export const createHFFailure = (error: Error): ICreateHFFailure => ({
  type: SITE_TYPES.CREATE_HEALTH_FACILITY_FAILURE,
  error
});

export const clearDropdownValues = (): IClearDropdownValues => ({
  type: SITE_TYPES.CLEAR_DROPDOWN_VALUES
});

export const fetchHFSummaryRequest = ({
  tenantId,
  id,
  failureCb,
  successCb
}: {
  tenantId: number;
  id: number;
  successCb?: (data: IHealthFacility) => void;
  failureCb?: (error: Error) => void;
}): IFetchHFSummaryRequest => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST,
  tenantId,
  id,
  failureCb,
  successCb
});

export const fetchHFSummarySuccess = (payload: IHealthFacilitySummary): IFetchHFSummarySuccess => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_SUCCESS,
  payload
});

export const fetchHFSummaryFailure = (error: Error): IFetchHFSummaryFailure => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_FAILURE,
  error
});
export const fetchHFTypesRequest = ({
  failureCb,
  successCb
}: Omit<IFetchHFTypesRequest, 'type'>): IFetchHFTypesRequest => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_TYPES_REQUEST,
  failureCb,
  successCb
});

export const fetchHFTypesSuccess = (payload: IObjectData[]): IFetchHFTypesSuccess => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_TYPES_SUCCESS,
  payload
});

export const fetchHFTypesFailure = (error: Error): IFetchHFTypesFailure => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_TYPES_FAILURE,
  error
});

export const createHFUserRequest = ({
  data,
  successCb,
  failureCb
}: {
  data: IHFUserPost;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): ICreateHFUserRequest => ({
  type: SITE_TYPES.CREATE_HEALTH_FACILITY_USER_REQUEST,
  data,
  successCb,
  failureCb
});

export const createHFUserSuccess = (): ICreateHFUserSuccess => ({
  type: SITE_TYPES.CREATE_HEALTH_FACILITY_USER_SUCCESS
});

export const createHFUserFailure = (error: Error): ICreateHFUserFailure => ({
  type: SITE_TYPES.CREATE_HEALTH_FACILITY_USER_FAILURE,
  error
});

export const updateHFDetailsRequest = ({
  data,
  successCb,
  failureCb
}: Omit<IUpdateHFDetailsRequest, 'type'>): IUpdateHFDetailsRequest => ({
  type: SITE_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateHFDetailsSuccess = (): IUpdateHFDetailsSuccess => ({
  type: SITE_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_SUCCESS
});

export const updateHFDetailsFailure = (error: Error): IUpdateHFDetailsFailure => ({
  type: SITE_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_FAILURE,
  error
});

export const updateHFUserRequest = ({
  data,
  successCb,
  failureCb
}: Omit<IUpdateHFUserRequest, 'type'>): IUpdateHFUserRequest => ({
  type: SITE_TYPES.UPDATE_HEALTH_FACILITY_USER_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateHFUserSuccess = (): IUpdateHFUserSuccess => ({
  type: SITE_TYPES.UPDATE_HEALTH_FACILITY_USER_SUCCESS
});

export const updateHFUserFailure = (error: Error): IUpdateHFUserFailure => ({
  type: SITE_TYPES.UPDATE_HEALTH_FACILITY_USER_FAILURE,
  error
});

export const fetchHFUserListRequest = ({
  countryId,
  tenantId,
  skip,
  limit,
  searchTerm,
  userBased,
  tenantBased,
  successCb,
  failureCb
}: Omit<IFetchHFUserListRequest, 'type'>): IFetchHFUserListRequest => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_REQUEST,
  skip,
  limit,
  countryId,
  tenantId,
  searchTerm,
  userBased,
  tenantBased,
  successCb,
  failureCb
});

export const fetchHFUserListSuccess = (payload: IFetchHFUserListSuccessPayload): IFetchHFUserListSuccess => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_SUCCESS,
  payload
});

export const fetchHFUserListFailure = (error: Error): IFetchHFUserListFailure => ({
  type: SITE_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_FAILURE,
  error
});

export const deleteHFUserRequest = ({
  data,
  successCb,
  failureCb
}: Omit<IDeleteHFUserRequest, 'type'>): IDeleteHFUserRequest => ({
  type: SITE_TYPES.DELETE_HEALTH_FACILITY_USER_REQUEST,
  data,
  successCb,
  failureCb
});

export const deleteHFUserSuccess = (): IDeleteHFUserSuccess => ({
  type: SITE_TYPES.DELETE_HEALTH_FACILITY_USER_SUCCESS
});

export const deleteHFUserFailure = (error: Error): IDeleteHFUserFailure => ({
  type: SITE_TYPES.DELETE_HEALTH_FACILITY_USER_FAILURE,
  error
});

// DISTRICT LIST
export const fetchDistrictListRequest = ({
  countryId,
  successCb,
  failureCb
}: Omit<IFetchDistrictListRequest, 'type'>): IFetchDistrictListRequest => ({
  type: SITE_TYPES.FETCH_DISTRICT_LIST_REQUEST,
  countryId,
  successCb,
  failureCb
});

export const fetchDistrictListSuccess = (payload: { list: IDistrict[]; total: number }): IFetchDistrictListSuccess => ({
  type: SITE_TYPES.FETCH_DISTRICT_LIST_SUCCESS,
  payload
});

export const fetchDistrictListFailure = (error: Error): IFetchDistrictListFailure => ({
  type: SITE_TYPES.FETCH_DISTRICT_LIST_FAILURE,
  error
});

// CHIEFDOM LIST
export const fetchChiefdomListRequest = ({
  countryId,
  districtId,
  successCb,
  failureCb
}: Omit<IFetchChiefdomListRequest, 'type'>): IFetchChiefdomListRequest => ({
  type: SITE_TYPES.FETCH_CHIEFDOM_LIST_REQUEST,
  countryId,
  districtId,
  successCb,
  failureCb
});

export const fetchChiefdomListSuccess = (payload: { list: IChiefdom[]; total: number }): IFetchChiefdomListSuccess => ({
  type: SITE_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS,
  payload
});

export const fetchChiefdomListFailure = (error: Error): IFetchChiefdomListFailure => ({
  type: SITE_TYPES.FETCH_CHIEFDOM_LIST_FAILURE,
  error
});

// VILLAGES LIST
export const fetchVillagesListRequest = ({
  countryId,
  districtId,
  chiefdomId,
  successCb,
  failureCb
}: Omit<IFetchVillagesListRequest, 'type'>): IFetchVillagesListRequest => ({
  type: SITE_TYPES.FETCH_VILLAGES_LIST_REQUEST,
  countryId,
  districtId,
  chiefdomId,
  successCb,
  failureCb
});

export const fetchVillagesListSuccess = (payload: IFetchVillagespayload): IFetchVillagesListSuccess => ({
  type: SITE_TYPES.FETCH_VILLAGES_LIST_SUCCESS,
  payload
});

export const fetchVillagesListFailure = (error: Error): IFetchVillagesListFailure => ({
  type: SITE_TYPES.FETCH_VILLAGES_LIST_FAILURE,
  error
});

// PEER_SUPERVISOR LIST
export const fetchPeerSupervisorListRequest = ({
  tenantIds,
  successCb,
  failureCb
}: Omit<IFetchPeerSupervisorListRequest, 'type'>): IFetchPeerSupervisorListRequest => ({
  type: SITE_TYPES.FETCH_PEER_SUPERVISOR_LIST_REQUEST,
  tenantIds,
  successCb,
  failureCb
});

export const fetchPeerSupervisorListSuccess = (payload: {
  list: IPeerSupervisor[];
  total: number;
}): IFetchPeerSupervisorListSuccess => ({
  type: SITE_TYPES.FETCH_PEER_SUPERVISOR_LIST_SUCCESS,
  payload
});

export const fetchPeerSupervisorListFailure = (error: Error): IFetchPeerSupervisorListFailure => ({
  type: SITE_TYPES.FETCH_PEER_SUPERVISOR_LIST_FAILURE,
  error
});

// WORKFLOW LIST
export const fetchWorkflowListRequest = ({
  countryId,
  successCb,
  failureCb
}: Omit<IFetchWorkflowListRequest, 'type'>): IFetchWorkflowListRequest => ({
  type: SITE_TYPES.FETCH_WORKFLOW_LIST_REQUEST,
  countryId,
  successCb,
  failureCb
});

export const fetchWorkflowListSuccess = (payload: { list: IWorkflow[] }): IFetchWorkflowListSuccess => ({
  type: SITE_TYPES.FETCH_WORKFLOW_LIST_SUCCESS,
  payload
});

export const fetchWorkflowListFailure = (error: Error): IFetchWorkflowListFailure => ({
  type: SITE_TYPES.FETCH_WORKFLOW_LIST_FAILURE,
  error
});
