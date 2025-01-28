import * as HF_TYPES from './actionTypes';
import {
  IFetchHFListFailure,
  IFetchHFListRequest,
  IFetchHFListSuccess,
  IFetchHFListSuccessPayload,
  ICreateHFRequest,
  ICreateHFSuccess,
  ICreateHFFailure,
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
  IHFUserPost,
  IFetchChiefdomListRequest,
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
  IHealthFacility,
  IFetchVillagespayload,
  IFetchHFTypesRequest,
  IFetchHFTypesSuccess,
  IFetchHFTypesFailure,
  IFetchVillagesListFromHFRequest,
  IFetchVillagesListFromHFSuccess,
  IFetchVillagesListFromHFFailure,
  IVillages,
  IClearSupervisorList,
  IClearVillagesHFList,
  IClearHFList,
  IHFUserGet,
  IFetchUserDetailRequest,
  IFetchUserDetailSuccess,
  IFetchUserDetailFailure,
  IFetchCultureListSuccessPayload,
  IFetchCountryListSuccessPayload,
  IFetchCultureListRequest,
  IFetchCultureListSuccess,
  IFetchCultureListFailure,
  IFetchCountryListRequest,
  IFetchCountryListSuccess,
  IFetchCountryListFailure,
  IDeleteHFRequest,
  IDeleteHFSuccess,
  IDeleteHFFailure,
  IClearDependentData,
  IClearVillagesList,
  IPeerSupervisorValidation,
  IChiefdom,
  IDistrict,
  IClearHFSummary,
  IFetchHFDashboardListRequest,
  IFetchHFDashboardListSuccessPayload,
  IFetchHFDashboardListSuccess,
  IFetchHFDashboardListFailure,
  IHealthFacilitySummary,
  ISetHFSummary,
  IFetchUnlinkedVillagesRequest,
  IFetchUnlinkedVillagesSuccess,
  IFetchUnlinkedVillagesFailure,
  IValidateLinkedRestrictions,
  IValidateLinkedRestrictionsSuccess,
  IValidateLinkedRestrictionsFailure,
  IObjectData,
  IFetchVillagesListUserLinked,
  IClearHFFormData,
  IClearHFWorkflowList,
  IFetchCityListRequest,
  IFetchCityListSuccess,
  IFetchCityListFailure,
  ISetAssignedHFListForHFAdminPayload,
  ISetAssignedHFListForHFAdmin,
  IClearAssignedHFListForHFAdmin
} from '../healthFacility/types';
import ApiError from '../../global/ApiError';

export const fetchHFListRequest = ({
  countryId,
  skip,
  limit,
  searchTerm,
  tenantIds,
  userBased,
  forHFAdmin,
  successCb,
  failureCb
}: Omit<IFetchHFListRequest, 'type'>): IFetchHFListRequest => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_LIST_REQUEST,
  skip,
  limit,
  countryId,
  searchTerm,
  tenantIds,
  userBased,
  forHFAdmin,
  successCb,
  failureCb
});

export const fetchHFListSuccess = (payload: IFetchHFListSuccessPayload): IFetchHFListSuccess => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_LIST_SUCCESS,
  payload
});

export const fetchHFListFailure = (error: Error): IFetchHFListFailure => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_LIST_FAILURE,
  error
});

export const setAssignedHFListForHFAdmin = (
  payload: ISetAssignedHFListForHFAdminPayload
): ISetAssignedHFListForHFAdmin => ({
  type: HF_TYPES.SET_ASSIGNED_HF_LIST_FOR_HF_ADMIN,
  payload
});

export const clearAssignedHFListForHFAdmin = (): IClearAssignedHFListForHFAdmin => ({
  type: HF_TYPES.CLEAR_ASSIGNED_HF_LIST_FOR_HF_ADMIN
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
  type: HF_TYPES.CREATE_HEALTH_FACILITY_REQUEST,
  data,
  successCb,
  failureCb
});

export const createHFSuccess = (): ICreateHFSuccess => ({
  type: HF_TYPES.CREATE_HEALTH_FACILITY_SUCCESS
});

export const createHFFailure = (error: Error): ICreateHFFailure => ({
  type: HF_TYPES.CREATE_HEALTH_FACILITY_FAILURE,
  error
});

export const deleteHealthFacilityRequest = ({
  data,
  successCb,
  failureCb
}: Omit<IDeleteHFRequest, 'type'>): IDeleteHFRequest => ({
  type: HF_TYPES.DELETE_HEALTH_FACILITY_REQUEST,
  data,
  successCb,
  failureCb
});

export const deleteHealthFacilitySuccess = (): IDeleteHFSuccess => ({
  type: HF_TYPES.DELETE_HEALTH_FACILITY_SUCCESS
});

export const deleteHealthFacilityFailure = (error: Error): IDeleteHFFailure => ({
  type: HF_TYPES.DELETE_HEALTH_FACILITY_FAILURE,
  error
});

export const clearHFList = (): IClearHFList => ({
  type: HF_TYPES.CLEAR_HEALTH_FACILITY_LIST
});
export const clearSupervisorList = (): IClearSupervisorList => ({
  type: HF_TYPES.CLEAR_PEER_SUPERVISOR_LIST
});
export const clearVillageHFList = (): IClearVillagesHFList => ({
  type: HF_TYPES.CLEAR_VILLAGES_LIST_FROM_HF
});
export const clearVillageList = (): IClearVillagesList => ({
  type: HF_TYPES.CLEAR_VILLAGES_LIST
});
export const clearAllDependentData = (): IClearDependentData => ({
  type: HF_TYPES.CLEAR_ALL_DEPENDENT_DATA
});

export const clearHFSummary = (): IClearHFSummary => ({
  type: HF_TYPES.CLEAR_HF_SUMMARY
});

export const fetchHFDashboardListRequest = ({
  skip,
  limit,
  isLoadMore,
  searchTerm,
  countryId,
  successCb,
  failureCb
}: Omit<IFetchHFDashboardListRequest, 'type'>): IFetchHFDashboardListRequest => {
  return {
    type: HF_TYPES.FETCH_HF_DASHBOARD_LIST_REQUEST,
    skip,
    limit,
    isLoadMore,
    countryId,
    searchTerm,
    successCb,
    failureCb
  };
};

export const fetchHFDashboardListSuccess = (
  payload: IFetchHFDashboardListSuccessPayload
): IFetchHFDashboardListSuccess => ({
  type: HF_TYPES.FETCH_HF_DASHBOARD_LIST_SUCCESS,
  payload
});

export const fetchHFDashboardListFailure = (error: Error): IFetchHFDashboardListFailure => ({
  type: HF_TYPES.FETCH_HF_DASHBOARD_LIST_FAILURE,
  error
});

export const setHFSummary = (data: Partial<IHealthFacilitySummary>): ISetHFSummary => ({
  type: HF_TYPES.SET_HF_SUMMARY,
  data
});

export const fetchHFSummaryRequest = ({
  tenantId,
  id,
  failureCb,
  successCb,
  appTypes
}: Omit<IFetchHFSummaryRequest, 'type'>): IFetchHFSummaryRequest => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST,
  tenantId,
  id,
  appTypes,
  failureCb,
  successCb
});

export const fetchHFSummarySuccess = (payload: IHealthFacility): IFetchHFSummarySuccess => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_SUCCESS,
  payload
});

export const fetchHFSummaryFailure = (error: Error): IFetchHFSummaryFailure => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_FAILURE,
  error
});

export const fetchUserDetailRequest = ({
  id,
  failureCb,
  successCb
}: Omit<IFetchUserDetailRequest, 'type'>): IFetchUserDetailRequest => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST,
  id,
  failureCb,
  successCb
});

export const fetchUserDetailSuccess = (payload: IHFUserGet): IFetchUserDetailSuccess => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_SUCCESS,
  payload
});

export const fetchUserDetailFailure = (error: Error): IFetchUserDetailFailure => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_FAILURE,
  error
});

export const fetchHFTypesRequest = ({
  failureCb,
  successCb
}: Omit<IFetchHFTypesRequest, 'type'>): IFetchHFTypesRequest => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_TYPES_REQUEST,
  failureCb,
  successCb
});

export const fetchHFTypesSuccess = (payload: IObjectData[]): IFetchHFTypesSuccess => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_TYPES_SUCCESS,
  payload
});

export const fetchHFTypesFailure = (error: Error): IFetchHFTypesFailure => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_TYPES_FAILURE,
  error
});

// this same action is being used to create admin
export const createHFUserRequest = ({
  data,
  successCb,
  failureCb
}: {
  data: IHFUserPost;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}): ICreateHFUserRequest => ({
  type: HF_TYPES.CREATE_HEALTH_FACILITY_USER_REQUEST,
  data,
  successCb,
  failureCb
});

export const createHFUserSuccess = (): ICreateHFUserSuccess => ({
  type: HF_TYPES.CREATE_HEALTH_FACILITY_USER_SUCCESS
});

export const createHFUserFailure = (error: Error): ICreateHFUserFailure => ({
  type: HF_TYPES.CREATE_HEALTH_FACILITY_USER_FAILURE,
  error
});

export const updateHFDetailsRequest = ({
  data,
  successCb,
  failureCb
}: Omit<IUpdateHFDetailsRequest, 'type'>): IUpdateHFDetailsRequest => ({
  type: HF_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateHFDetailsSuccess = (): IUpdateHFDetailsSuccess => ({
  type: HF_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_SUCCESS
});

export const updateHFDetailsFailure = (error: Error): IUpdateHFDetailsFailure => ({
  type: HF_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_FAILURE,
  error
});

// this same action is being used to update admin
export const updateHFUserRequest = ({
  data,
  successCb,
  failureCb
}: Omit<IUpdateHFUserRequest, 'type'>): IUpdateHFUserRequest => ({
  type: HF_TYPES.UPDATE_HEALTH_FACILITY_USER_REQUEST,
  data,
  successCb,
  failureCb
});

export const updateHFUserSuccess = (): IUpdateHFUserSuccess => ({
  type: HF_TYPES.UPDATE_HEALTH_FACILITY_USER_SUCCESS
});

export const updateHFUserFailure = (error: Error): IUpdateHFUserFailure => ({
  type: HF_TYPES.UPDATE_HEALTH_FACILITY_USER_FAILURE,
  error
});

export const fetchHFUserListRequest = ({
  countryId,
  skip,
  limit,
  searchTerm,
  roleNames,
  isSiteUsers,
  tenantBased,
  tenantId,
  tenantIds,
  successCb,
  failureCb
}: Omit<IFetchHFUserListRequest, 'type'>): IFetchHFUserListRequest => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_REQUEST,
  skip,
  limit,
  countryId,
  searchTerm,
  roleNames,
  isSiteUsers,
  tenantBased,
  tenantId,
  tenantIds,
  successCb,
  failureCb
});

export const fetchHFUserListSuccess = (payload: IFetchHFUserListSuccessPayload): IFetchHFUserListSuccess => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_SUCCESS,
  payload
});

export const fetchHFUserListFailure = (error: Error): IFetchHFUserListFailure => ({
  type: HF_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_FAILURE,
  error
});

// this same action is being used to delete admin
export const deleteHFUserRequest = ({
  data,
  successCb,
  failureCb
}: Omit<IDeleteHFUserRequest, 'type'>): IDeleteHFUserRequest => ({
  type: HF_TYPES.DELETE_HEALTH_FACILITY_USER_REQUEST,
  data,
  successCb,
  failureCb
});

export const deleteHFUserSuccess = (): IDeleteHFUserSuccess => ({
  type: HF_TYPES.DELETE_HEALTH_FACILITY_USER_SUCCESS
});

export const deleteHFUserFailure = (error: Error): IDeleteHFUserFailure => ({
  type: HF_TYPES.DELETE_HEALTH_FACILITY_USER_FAILURE,
  error
});

// DISTRICT LIST
export const fetchDistrictListRequest = ({
  countryId,
  successCb,
  failureCb
}: Omit<IFetchDistrictListRequest, 'type'>): IFetchDistrictListRequest => ({
  type: HF_TYPES.FETCH_DISTRICT_LIST_REQUEST_FOR_HF,
  countryId,
  successCb,
  failureCb
});

export const fetchDistrictListSuccess = (payload: { list: IDistrict[]; total: number }): IFetchDistrictListSuccess => ({
  type: HF_TYPES.FETCH_DISTRICT_LIST_SUCCESS_FOR_HF,
  payload
});

export const fetchDistrictListFailure = (error: Error): IFetchDistrictListFailure => ({
  type: HF_TYPES.FETCH_DISTRICT_LIST_FAILURE_FOR_HF,
  error
});

// CHIEFDOM LIST
export const fetchChiefdomListRequest = ({
  countryId,
  districtId,
  successCb,
  failureCb
}: Omit<IFetchChiefdomListRequest, 'type'>): IFetchChiefdomListRequest => ({
  type: HF_TYPES.FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF,
  countryId,
  districtId,
  successCb,
  failureCb
});

export const fetchChiefdomListSuccess = (payload: { list: IChiefdom[]; total: number }): IFetchChiefdomListSuccess => ({
  type: HF_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS_FOR_HF,
  payload
});

export const fetchChiefdomListFailure = (error: Error): IFetchChiefdomListFailure => ({
  type: HF_TYPES.FETCH_CHIEFDOM_LIST_FAILURE_FOR_HF,
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
  type: HF_TYPES.FETCH_VILLAGES_LIST_REQUEST_FOR_HF,
  countryId,
  districtId,
  chiefdomId,
  successCb,
  failureCb
});

export const fetchVillagesListSuccess = (payload: IFetchVillagespayload): IFetchVillagesListSuccess => ({
  type: HF_TYPES.FETCH_VILLAGES_LIST_SUCCESS_FOR_HF,
  payload
});

export const fetchVillagesListFailure = (error: Error): IFetchVillagesListFailure => ({
  type: HF_TYPES.FETCH_VILLAGES_LIST_FAILURE_FOR_HF,
  error
});

// city list
export const fetchCityListRequest = ({
  searchTerm,
  appTypes,
  successCb,
  failureCb
}: Omit<IFetchCityListRequest, 'type'>): IFetchCityListRequest => ({
  type: HF_TYPES.FETCH_CITY_LIST_REQUEST_FOR_HF,
  searchTerm,
  appTypes,
  successCb,
  failureCb
});

export const fetchCityListSuccess = (): IFetchCityListSuccess => ({
  type: HF_TYPES.FETCH_CITY_LIST_SUCCESS_FOR_HF
});

export const fetchCityListFailure = (error: Error): IFetchCityListFailure => ({
  type: HF_TYPES.FETCH_CITY_LIST_FAILURE_FOR_HF,
  error
});

export const clearHFWorkflowList = (): IClearHFWorkflowList => ({
  type: HF_TYPES.CLEAR_HF_WORKFLOW_LIST
});

// UNLINKED VILLAGES LIST
export const fetchUnlinkedVillagesRequest = ({
  countryId,
  districtId,
  chiefdomId,
  healthFacilityId,
  successCb,
  failureCb
}: Omit<IFetchUnlinkedVillagesRequest, 'type'>): IFetchUnlinkedVillagesRequest => ({
  type: HF_TYPES.FETCH_UNLINKED_VILLAGES_REQUEST,
  countryId,
  districtId,
  chiefdomId,
  healthFacilityId,
  successCb,
  failureCb
});

export const fetchUnlinkedVillagesListSuccess = (payload: IFetchVillagespayload): IFetchUnlinkedVillagesSuccess => ({
  type: HF_TYPES.FETCH_UNLINKED_VILLAGES_SUCCESS,
  payload
});

export const fetchUnlinkedVillagesListFailure = (error: Error): IFetchUnlinkedVillagesFailure => ({
  type: HF_TYPES.FETCH_UNLINKED_VILLAGES_FAILURE,
  error
});

export const clearHFFormData = (): IClearHFFormData => ({
  type: HF_TYPES.CLEAR_HF_FORM_DATA
});

// VILLAGES LIST FROM HF
export const fetchVillagesListFromHFRequest = ({
  countryId,
  districtId,
  chiefdomId,
  successCb,
  failureCb
}: Omit<IFetchVillagesListFromHFRequest, 'type'>): IFetchVillagesListFromHFRequest => ({
  type: HF_TYPES.FETCH_VILLAGES_LIST_FROM_HF_REQUEST,
  countryId,
  districtId,
  chiefdomId,
  successCb,
  failureCb
});

// VILLAGES LIST FROM HF
export const fetchVillagesListUserLinked = ({
  tenantIds,
  userId,
  successCb,
  failureCb
}: Omit<IFetchVillagesListUserLinked, 'type'>): IFetchVillagesListUserLinked => ({
  type: HF_TYPES.FETCH_VILLAGES_LIST_USER_LINKED,
  tenantIds,
  userId,
  successCb,
  failureCb
});

export const fetchVillagesListFromHFSuccess = (payload: {
  data: { list: IVillages[]; hfTenantIds: number[] };
}): IFetchVillagesListFromHFSuccess => ({
  type: HF_TYPES.FETCH_VILLAGES_LIST_FROM_HF_SUCCESS,
  payload
});

export const fetchVillagesListFromHFFailure = (error: Error): IFetchVillagesListFromHFFailure => ({
  type: HF_TYPES.FETCH_VILLAGES_LIST_FROM_HF_FAILURE,
  error
});

// PEER_SUPERVISOR LIST
export const fetchPeerSupervisorListRequest = ({
  tenantIds,
  appTypes,
  successCb,
  failureCb
}: Omit<IFetchPeerSupervisorListRequest, 'type'>): IFetchPeerSupervisorListRequest => {
  return {
    type: HF_TYPES.FETCH_PEER_SUPERVISOR_LIST_REQUEST,
    tenantIds,
    appTypes,
    successCb,
    failureCb
  };
};

export const fetchPeerSupervisorListSuccess = (payload: {
  data: { list: IPeerSupervisor[]; hfTenantIds: number[] };
  total: number;
}): IFetchPeerSupervisorListSuccess => ({
  type: HF_TYPES.FETCH_PEER_SUPERVISOR_LIST_SUCCESS,
  payload
});

export const fetchPeerSupervisorListFailure = (error: Error): IFetchPeerSupervisorListFailure => ({
  type: HF_TYPES.FETCH_PEER_SUPERVISOR_LIST_FAILURE,
  error
});

// WORKFLOW LIST
export const fetchWorkflowListRequest = ({
  countryId,
  successCb,
  failureCb
}: Omit<IFetchWorkflowListRequest, 'type'>): IFetchWorkflowListRequest => ({
  type: HF_TYPES.FETCH_WORKFLOW_LIST_REQUEST,
  countryId,
  successCb,
  failureCb
});

export const validationPeerSupervisor = ({
  ids,
  tenantId,
  appTypes,
  successCb,
  failureCb
}: Omit<IPeerSupervisorValidation, 'type'>): IPeerSupervisorValidation => ({
  type: HF_TYPES.FETCH_PEER_SUPERVISOR_VALIDATION,
  ids,
  tenantId,
  appTypes,
  successCb,
  failureCb
});

export const fetchWorkflowListSuccess = (payload: { list: IWorkflow[] }): IFetchWorkflowListSuccess => ({
  type: HF_TYPES.FETCH_WORKFLOW_LIST_SUCCESS,
  payload
});

export const fetchWorkflowListFailure = (error: Error): IFetchWorkflowListFailure => ({
  type: HF_TYPES.FETCH_WORKFLOW_LIST_FAILURE,
  error
});

export const fetchPeerSupervisorValidationsFailure = (error: Error): any => ({
  type: HF_TYPES.FETCH_PEER_SUPERVISOR_VALIDATION,
  error
});

export const validateLinkedRestrictionsRequest = ({
  ids,
  appTypes,
  tenantId,
  healthFacilityId,
  linkedVillageIds,
  successCb,
  failureCb
}: Omit<IValidateLinkedRestrictions, 'type'>): IValidateLinkedRestrictions => ({
  type: HF_TYPES.LINKED_RESTRICTIONS_VALIDATION_REQUEST,
  ids,
  appTypes,
  tenantId,
  healthFacilityId,
  linkedVillageIds,
  successCb,
  failureCb
});
export const validateLinkedRestrictionsSuccess = (): IValidateLinkedRestrictionsSuccess => ({
  type: HF_TYPES.LINKED_RESTRICTIONS_VALIDATION_SUCCESS
});
export const validateLinkedRestrictionsFailure = (error: Error): IValidateLinkedRestrictionsFailure => ({
  type: HF_TYPES.LINKED_RESTRICTIONS_VALIDATION_FAILURE,
  error
});

export const clearHealthFacilityDetail = () => ({
  type: HF_TYPES.CLEAR_HEALTH_FACILITY_DETAIL
});

export const fetchCultureListRequest = (): IFetchCultureListRequest => ({
  type: HF_TYPES.FETCH_CULTURE_LIST_REQUEST
});

export const fetchCultureListSuccess = (payload: IFetchCultureListSuccessPayload): IFetchCultureListSuccess => ({
  type: HF_TYPES.FETCH_CULTURE_LIST_SUCCESS,
  payload
});

export const fetchCultureListFailure = (): IFetchCultureListFailure => ({
  type: HF_TYPES.FETCH_CULTURE_LIST_FAILURE
});

export const fetchCountryListRequest = (): IFetchCountryListRequest => ({
  type: HF_TYPES.FETCH_COUNTRY_LIST_REQUEST
});

export const fetchCountryListSuccess = (payload: IFetchCountryListSuccessPayload): IFetchCountryListSuccess => ({
  type: HF_TYPES.FETCH_COUNTRY_LIST_SUCCESS,
  payload
});

export const fetchCountryListFailure = (): IFetchCountryListFailure => ({
  type: HF_TYPES.FETCH_COUNTRY_LIST_FAILURE
});

export const clearHFDropdown = () => ({
  type: HF_TYPES.CLEAR_HF_DROPDOWN_OPTIONS
});
