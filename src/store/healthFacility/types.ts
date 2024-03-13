import ApiError from '../../global/ApiError';
import * as ACTION_TYPES from './actionTypes';

export interface IHealthFacilityState {
  healthFacility: IHealthFacility;
  loading: boolean;
  healthFacilityList: IHealthFacility[];
  healthFacilityUserList: IHFUserGet[];
  hfTotal: number;
  hfUsersTotal: number;
  districtList: IDistrict[];
  districtTotal: number;
  districtLoading: boolean;
  chiefdomList: IChiefdom[];
  chiefdomTotal: number;
  chiefdomLoading: boolean;
  villagesList: IVillages[];
  villagesTotal: number;
  villagesLoading: boolean;
  peerSupervisorList: IPeerSupervisor[];
  peerSupervisorTotal: number;
  peerSupervisorLoading: boolean;
  error: string | null | Error;
  clinicalWorkflowList: IWorkflow[];
  clinicalWorkflowLoading: boolean;
}

export interface IHealthFacility {
  id: number;
  name: string;
  type: string;
  phuFocalPersonName: string;
  phuFocalPersonNumber: string;
  address: string;
  district: IDistrict;
  chiefdom: IChiefdom;
  cityName: string;
  latitude: string;
  longitude: string;
  postalCode: string;
  language: string;
  tenantId: number;
  peerSupervisors?: IPeerSupervisor[];
  linkedVillages: IVillages[];
  clinicalWorkflows: IClinicalWorkflows[];
}

interface IObjectData {
  id: number;
  name: string;
}

export interface IHealthFacilityForm extends Omit<IHealthFacility, 'type' | 'city' | 'language'> {
  type: { id: string; name: string };
  city: { id: string; name: string };
  language: { id: string; name: string };
}

export interface IHealthFacilityPost {
  id?: number;
  name: string;
  type: string;
  phuFocalPersonName: string;
  phuFocalPersonNumber: string;
  address: string;
  district: IDistrict;
  chiefdom: IChiefdom;
  cityName?: string;
  latitude: string;
  longitude: string;
  postalCode: string;
  language: string;
  parentTenantId: number;
  linkedSupervisorIds?: number[];
  linkedVillageIds: number[];
  clinicalWorkflowIds?: number[];
}

export interface IVillages {
  id: number;
  name: string;
  chiefdomId: string;
  countryId: string;
  districtId: string;
}
export interface IClinicalWorkflows {
  id: number;
  name: string;
  moduleType: string;
  workflowName: string;
}

export interface IFetchHFListSuccessPayload {
  total: number;
  healthFacilityList: IHealthFacility[];
  limit: number | null;
}

export interface IFetchHFListRequest {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_REQUEST;
  countryId: number;
  skip: number;
  limit: number | null;
  searchTerm?: string;
  userBased?: boolean;
  failureCb?: (error: Error) => void;
}

export interface IFetchHFListSuccess {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_SUCCESS;
  payload: IFetchHFListSuccessPayload;
}

export interface IFetchHFListFailure {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_FAILURE;
  error: Error;
}

export interface IHFUserGet {
  id?: number;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  username: string;
  countryCode: string;
  roles: IUserRole[];
  tenantId: number;
  villageIds?: number[];
  supervisor: string;
  organizations: Array<{ id: number; name: string; parentOrganizationId: number; formDataId: number }>;
  country?: { id: number; name: string };
}

export interface IUserRole {
  id: number;
  name: string;
  groupName?: string;
}

export interface IHFUserPost {
  id?: number;
  firstName: string;
  lastName: string;
  gender: string;
  username: string;
  phoneNumber: string;
  country: { id: number };
  countryCode: string;
  tenantId?: number; // healthFacility tenantId
  roleIds: number[];
  supervisorId?: number;
  villageIds?: number[];
}

export interface IOptionsResponse {
  name: string;
  _id: string;
}

export interface ICreateHFRequestPayload extends IHealthFacilityPost {
  users: IHFUserPost[];
}

export interface IHealthFacilitySummary {
  name: string;
  hfType: string;
  email: string;
  address1: string;
  postalCode: string;
  phoneNumber: string;
  id: number;
  tenantId: number | string;
}

export interface ICreateHFRequest {
  type: typeof ACTION_TYPES.CREATE_HEALTH_FACILITY_REQUEST;
  data: ICreateHFRequestPayload;
  successCb?: () => void;
  failureCb?: (error: ApiError) => void;
}

export interface ISubCountyRequest {
  type: typeof ACTION_TYPES.CREATE_HEALTH_FACILITY_REQUEST;
  countyId: string;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateHFSuccess {
  type: typeof ACTION_TYPES.CREATE_HEALTH_FACILITY_SUCCESS;
}

export interface ICreateHFFailure {
  type: typeof ACTION_TYPES.CREATE_HEALTH_FACILITY_FAILURE;
  error: Error;
}

export interface IClearDropdownValues {
  type: typeof ACTION_TYPES.CLEAR_DROPDOWN_VALUES;
}

export interface IFetchHFSummaryRequest {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST;
  tenantId: number;
  id: number;
  successCb?: (data: IHealthFacility) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchHFSummarySuccess {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_SUCCESS;
  payload: IHealthFacilitySummary;
}

export interface IFetchHFSummaryFailure {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_FAILURE;
  error: Error;
}

export interface IHFUserPayLoad {
  id: string;
  tenantId: string;
  user: IHFUserPost;
}
export interface ICreateHFUserRequest {
  type: typeof ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_REQUEST;
  data: IHFUserPost;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface ICreateHFUserSuccess {
  type: typeof ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_SUCCESS;
}

export interface ICreateHFUserFailure {
  type: typeof ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_FAILURE;
  error: Error;
}

export interface IUpdateHFDetailsRequest {
  type: typeof ACTION_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_REQUEST;
  data: IHealthFacilityPost;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUpdateHFDetailsSuccess {
  type: typeof ACTION_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_SUCCESS;
}

export interface IUpdateHFDetailsFailure {
  type: typeof ACTION_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_FAILURE;
  error: Error;
}

export interface IUpdateHFUserRequest {
  type: typeof ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_REQUEST;
  data: IHFUserPost;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IUpdateHFUserSuccess {
  type: typeof ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_SUCCESS;
}

export interface IUpdateHFUserFailure {
  type: typeof ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_FAILURE;
  error: Error;
}

export interface IFetchHFUserListSuccessPayload {
  total: number;
  users: IHFUserGet[];
  limit: number | null;
}

export interface IFetchHFUserListRequest {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_REQUEST;
  countryId: string;
  tenantId?: string;
  skip: number;
  limit: number | null;
  searchTerm?: string;
  userBased?: boolean;
  tenantBased?: boolean;
  successCb?: (data: IHFUserGet[], total: number) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchHFUserListSuccess {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_SUCCESS;
  payload: IFetchHFUserListSuccessPayload;
}

export interface IFetchHFUserListFailure {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_FAILURE;
  error: Error;
}

export interface IDeleteUserSuccessPayload {
  id: number;
  tenantId: number;
}

export interface IDeleteHFUserRequest {
  type: typeof ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_REQUEST;
  data: IDeleteUserSuccessPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IDeleteHFUserSuccess {
  type: typeof ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_SUCCESS;
}

export interface IDeleteHFUserFailure {
  type: typeof ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_FAILURE;
  error: Error;
}

export interface IDistrict {
  id: number;
  name: string;
  tenantId: number;
}

export interface IFetchDistrictListRequest {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST;
  countryId: number;
  successCb?: (data: IDistrict[], total: number) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchDistrictListSuccess {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_LIST_SUCCESS;
  payload: { list: IDistrict[]; total: number };
}

export interface IFetchDistrictListFailure {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_LIST_FAILURE;
  error: Error;
}

export interface IChiefdom {
  id: number;
  name: string;
}

export interface IFetchChiefdomListRequest {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST;
  countryId: number;
  districtId?: number;
  successCb?: (data: IChiefdom[], total: number) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchChiefdomListSuccess {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS;
  payload: { list: IChiefdom[]; total: number };
}

export interface IFetchChiefdomListFailure {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_LIST_FAILURE;
  error: Error;
}

export interface IFetchVillagesListRequest {
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_REQUEST;
  countryId: number;
  districtId: number;
  chiefdomId: number;
  successCb?: (data: IVillages[], total: number) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchVillagespayload {
  list: IVillages[];
  total: number;
}

export interface IFetchVillagesListSuccess {
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_SUCCESS;
  payload: IFetchVillagespayload;
}

export interface IFetchVillagesListFailure {
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_FAILURE;
  error: Error;
}

export interface IPeerSupervisor {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  tenantId?: string;
  roles?: IUserRole;
}

export interface IFetchPeerSupervisorListRequest {
  type: typeof ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_REQUEST;
  tenantIds: number[];
  successCb?: (data: IPeerSupervisor[], total: number) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchPeerSupervisorListSuccess {
  type: typeof ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_SUCCESS;
  payload: { list: IPeerSupervisor[]; total: number };
}

export interface IFetchPeerSupervisorListFailure {
  type: typeof ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_FAILURE;
  error: Error;
}

export interface IWorkflow {
  id: number;
  name: string;
}

export interface IFetchWorkflowListRequest {
  type: typeof ACTION_TYPES.FETCH_WORKFLOW_LIST_REQUEST;
  countryId: number;
  successCb?: (data: IWorkflow[]) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchWorkflowListSuccess {
  type: typeof ACTION_TYPES.FETCH_WORKFLOW_LIST_SUCCESS;
  payload: { list: IWorkflow[] };
}

export interface IFetchWorkflowListFailure {
  type: typeof ACTION_TYPES.FETCH_WORKFLOW_LIST_FAILURE;
  error: Error;
}

export type HealthFacilityActions =
  | IFetchHFListRequest
  | IFetchHFListSuccess
  | IFetchHFListFailure
  | ICreateHFRequest
  | ICreateHFSuccess
  | ICreateHFFailure
  | IClearDropdownValues
  | IFetchHFSummaryRequest
  | IFetchHFSummarySuccess
  | IFetchHFSummaryFailure
  | ICreateHFUserRequest
  | ICreateHFUserSuccess
  | ICreateHFUserFailure
  | IUpdateHFDetailsRequest
  | IUpdateHFDetailsSuccess
  | IUpdateHFDetailsFailure
  | IUpdateHFUserRequest
  | IUpdateHFUserSuccess
  | IUpdateHFUserFailure
  | IFetchHFUserListRequest
  | IFetchHFUserListSuccess
  | IFetchHFUserListFailure
  | IDeleteHFUserRequest
  | IDeleteHFUserSuccess
  | IDeleteHFUserFailure
  | IFetchDistrictListRequest
  | IFetchDistrictListSuccess
  | IFetchDistrictListFailure
  | IFetchChiefdomListRequest
  | IFetchChiefdomListSuccess
  | IFetchChiefdomListFailure
  | IFetchVillagesListRequest
  | IFetchVillagesListSuccess
  | IFetchVillagesListFailure
  | IFetchPeerSupervisorListRequest
  | IFetchPeerSupervisorListSuccess
  | IFetchPeerSupervisorListFailure
  | IFetchWorkflowListRequest
  | IFetchWorkflowListSuccess
  | IFetchWorkflowListFailure;
