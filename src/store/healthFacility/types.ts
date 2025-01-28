import ApiError from '../../global/ApiError';
import * as ACTION_TYPES from './actionTypes';

export interface IHealthFacilityState {
  healthFacility: IHealthFacility;
  hfTypes: IObjectData[];
  hfTypesLoading: boolean;
  loading: boolean;
  healthFacilityList: IHealthFacility[];
  assignedHFListForHFAdmin: IHealthFacility[];
  assignedHFListForHFAdminTotal: number;
  hfTotal: number;
  healthFacilityUserList: IHFUserGet[];
  hfUser: IHFUserGet;
  hfUserDetailLoading: boolean;
  hfUsersLoading: boolean;
  hfUsersTotal: number;
  districtList: IDistrict[];
  districtTotal: number;
  districtLoading: boolean;
  chiefdomList: IChiefdom[];
  chiefdomTotal: number;
  chiefdomLoading: boolean;
  cultureListLoading: boolean;
  cultureList: ICulture[];
  countryList: ICountryCode[];
  countryListLoading: boolean;
  unlinkedVillagesList: IVillages[];
  unlinkedVillagesTotal: number;
  unlinkedVillagesLoading: boolean;
  villagesList: IVillages[];
  villagesTotal: number;
  villagesLoading: boolean;
  villagesFromHFList: { list: IVillages[]; hfTenantIds: number[] | null };
  villagesFromHFLoading: boolean;
  peerSupervisorList: { list: IPeerSupervisor[]; hfTenantIds: number[] | null };
  peerSupervisorTotal: number;
  peerSupervisorLoading: boolean;
  error: string | null | Error;
  clinicalWorkflowList: IWorkflow[];
  clinicalWorkflowLoading: boolean;
  hfDropdownLoading: boolean;
  hfDropdownOptions: any;
  hfDashboardList: IHFDashboard[];
  loadingMore: boolean;
}

export interface IHFDashboard {
  id: number;
  name: string;
  type: string;
  tenantId: number;
  chiefdom?: string;
}

export interface IFetchHFDashboardListSuccessPayload {
  siteDashboardList: IHFDashboard[];
  total: number;
  isLoadMore?: boolean;
}

export interface IFetchHFDashboardListRequest {
  type: typeof ACTION_TYPES.FETCH_HF_DASHBOARD_LIST_REQUEST;
  isLoadMore?: boolean;
  skip: number;
  limit: number | null;
  searchTerm?: string;
  countryId: string;
  successCb?: (payload: IFetchHFDashboardListSuccessPayload) => void;
  failureCb?: (error: Error) => void;
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
  tenantId: number | string;
  peerSupervisors?: IPeerSupervisor[];
  linkedVillages: IVillages[];
  clinicalWorkflows: IClinicalWorkflows[];
  workflows: number[];
  customizedWorkflows?: IClinicalWorkflows[];
  defaultTrueWorkflows?: IClinicalWorkflows[];
}

export interface IObjectData {
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
  appTypes: string[];
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

export interface ICity {
  label: string;
  value: string;
}
export interface IClinicalWorkflows {
  id: number;
  name: string;
  moduleType: string;
  workflowName: string;
  appTypes: string[];
}

export interface IFetchHFListSuccessPayload {
  total: number;
  healthFacilityList: IHealthFacility[];
  limit: number | null;
}

export interface ISetAssignedHFListForHFAdminPayload {
  total: number;
  healthFacilityList: IHealthFacility[];
}

export interface ISetAssignedHFListForHFAdmin {
  type: typeof ACTION_TYPES.SET_ASSIGNED_HF_LIST_FOR_HF_ADMIN;
  payload: ISetAssignedHFListForHFAdminPayload;
}

export interface IClearAssignedHFListForHFAdmin {
  type: typeof ACTION_TYPES.CLEAR_ASSIGNED_HF_LIST_FOR_HF_ADMIN;
}

export interface IFetchHFListRequest {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_REQUEST;
  countryId: number;
  skip: number;
  limit: number | null;
  searchTerm?: string;
  userBased?: boolean;
  tenantBased?: boolean;
  tenantIds?: number[] | string[];
  forHFAdmin?: boolean;
  successCb?: (data: IFetchHFListSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchHFDashboardListSuccessPayload {
  siteDashboardList: IHFDashboard[];
  total: number;
  isLoadMore?: boolean;
}

export interface IFetchHFDashboardListSuccess {
  type: typeof ACTION_TYPES.FETCH_HF_DASHBOARD_LIST_SUCCESS;
  payload: IFetchHFDashboardListSuccessPayload;
}

export interface IFetchHFDashboardListFailure {
  type: typeof ACTION_TYPES.FETCH_HF_DASHBOARD_LIST_FAILURE;
  error: Error;
}

export interface ISetHFSummary {
  type: typeof ACTION_TYPES.SET_HF_SUMMARY;
  data?: Partial<IHealthFacilitySummary>;
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
  villages?: number[];
  supervisor: string | null;
  district?: { tenantId: string | number };
  county?: { tenantId: string | number };
  organizations: Array<{
    formName: string;
    displayName: boolean;
    id: number;
    name: string;
    parentOrganizationId: number | null;
    formDataId: number;
  }>;
  country?: { id: number; phoneNumberCode: string; name: string; tenantId?: number };
}

export interface IUserRole {
  id: number;
  name: string;
  displayName?: string;
  groupName?: string;
  suiteAccessName?: string;
  appTypes: string[];
}

export interface IHFUserPost {
  id?: number;
  appTypes: string[];
  firstName: string;
  lastName: string;
  gender: string;
  username: string;
  phoneNumber: string;
  country?: { id: number } | null;
  countryCode?: string;
  tenantId?: number | null; // healthFacility tenantId
  roleIds: number[];
  district?: string | number;
  chiefdom?: string;
  village?: string;
  supervisorId?: number | null;
  villageIds?: number[];
  timezone?: { id: number; name?: string };
  redRisk?: boolean;
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

export interface IFetchHFDropdownSuccessPayload {
  total?: number;
  list: Array<{
    id: string;
    name: string;
    email?: string;
    tenantId: string;
  }>;
  countryId: string;
}

export interface ICreateHFRequest {
  type: typeof ACTION_TYPES.CREATE_HEALTH_FACILITY_REQUEST;
  data: ICreateHFRequestPayload;
  successCb?: () => void;
  failureCb?: (error: ApiError) => void;
}

export interface IChiefdomRequest {
  type: typeof ACTION_TYPES.CREATE_HEALTH_FACILITY_REQUEST;
  districtId: string;
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

export interface IDeleteHFPayload {
  id: number;
  tenantId: number;
}

export interface IDeleteHFRequest {
  type: typeof ACTION_TYPES.DELETE_HEALTH_FACILITY_REQUEST;
  data: IDeleteHFPayload;
  successCb?: () => void;
  failureCb?: (error: Error) => void;
}

export interface IDeleteHFSuccess {
  type: typeof ACTION_TYPES.DELETE_HEALTH_FACILITY_SUCCESS;
}

export interface IDeleteHFFailure {
  type: typeof ACTION_TYPES.DELETE_HEALTH_FACILITY_FAILURE;
  error: Error;
}

export interface IClearHFList {
  type: typeof ACTION_TYPES.CLEAR_HEALTH_FACILITY_LIST;
}
export interface IClearSupervisorList {
  type: typeof ACTION_TYPES.CLEAR_PEER_SUPERVISOR_LIST;
}
export interface IClearVillagesList {
  type: typeof ACTION_TYPES.CLEAR_VILLAGES_LIST;
}
export interface IClearVillagesHFList {
  type: typeof ACTION_TYPES.CLEAR_VILLAGES_LIST_FROM_HF;
}

export interface IClearDependentData {
  type: typeof ACTION_TYPES.CLEAR_ALL_DEPENDENT_DATA;
}

export interface IFetchHFSummaryRequest {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST;
  tenantId: number;
  id: number;
  appTypes: string[];
  successCb?: (data: IHealthFacility) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchHFSummarySuccess {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_SUCCESS;
  payload: IHealthFacility;
}

export interface IFetchHFSummaryFailure {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_FAILURE;
  error: Error;
}
export interface IFetchUserDetailRequest {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST;
  id: number;
  successCb?: (data: IHFUserGet) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchUserDetailSuccess {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_SUCCESS;
  payload: IHFUserGet;
}

export interface IFetchUserDetailFailure {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_FAILURE;
  error: Error;
}

export interface IHFUserPayLoad {
  id: string;
  appTypes: string[];
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

export interface IFetchHFTypesRequest {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_REQUEST;
  successCb?: (data: IObjectData[]) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchHFTypesSuccess {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_SUCCESS;
  payload: IObjectData[];
}

export interface IFetchHFTypesFailure {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_FAILURE;
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
  roleNames?: string[];
  isSiteUsers?: boolean | null;
  tenantIds?: string[];
  appTypes?: string[];
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

export interface IFetchHFUserListClear {
  type: typeof ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_CLEAR_LIST_REQUEST;
}

export interface IDeleteUserPayload {
  id: number;
  appTypes: string[];
  countryId: number;
  tenantIds: number[];
}

export interface IDeleteHFUserRequest {
  type: typeof ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_REQUEST;
  data: IDeleteUserPayload;
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
  type: typeof ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST_FOR_HF;
  countryId: number;
  successCb?: (data: IDistrict[], total: number) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchDistrictListSuccess {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_LIST_SUCCESS_FOR_HF;
  payload: { list: IDistrict[]; total: number };
}

export interface IFetchDistrictListFailure {
  type: typeof ACTION_TYPES.FETCH_DISTRICT_LIST_FAILURE_FOR_HF;
  error: Error;
}

export interface IChiefdom {
  tenantId: string | undefined;
  id: number;
  name: string;
}

export interface IFetchChiefdomListRequest {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF;
  countryId: number;
  districtId?: number;
  successCb?: (data: IChiefdom[], total: number) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchChiefdomListSuccess {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS_FOR_HF;
  payload: { list: IChiefdom[]; total: number };
}

export interface IFetchChiefdomListFailure {
  type: typeof ACTION_TYPES.FETCH_CHIEFDOM_LIST_FAILURE_FOR_HF;
  error: Error;
}

export interface IFetchVillagesListRequest {
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_REQUEST_FOR_HF;
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
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_SUCCESS_FOR_HF;
  payload: IFetchVillagespayload;
}

export interface IFetchVillagesListFailure {
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_FAILURE_FOR_HF;
  error: Error;
}

export interface IFetchCityListRequest {
  type: typeof ACTION_TYPES.FETCH_CITY_LIST_REQUEST_FOR_HF;
  searchTerm: string;
  appTypes: string[];
  successCb: (data: ICity[]) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchCityListSuccess {
  type: typeof ACTION_TYPES.FETCH_CITY_LIST_SUCCESS_FOR_HF;
}
export interface IFetchCityListFailure {
  type: typeof ACTION_TYPES.FETCH_CITY_LIST_FAILURE_FOR_HF;
  error: Error;
}

export interface IClearHFWorkflowList {
  type: typeof ACTION_TYPES.CLEAR_HF_WORKFLOW_LIST;
}

interface IVillagesRequestPayload {
  countryId: number;
  districtId: number;
  chiefdomId: number;
  successCb?: (data: IVillages[], total: number) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchUnlinkedVillagesRequest extends IVillagesRequestPayload {
  type: typeof ACTION_TYPES.FETCH_UNLINKED_VILLAGES_REQUEST;
  healthFacilityId?: number;
}

export interface IFetchUnlinkedVillagesSuccess {
  type: typeof ACTION_TYPES.FETCH_UNLINKED_VILLAGES_SUCCESS;
  payload: IFetchVillagespayload;
}

export interface IFetchUnlinkedVillagesFailure {
  type: typeof ACTION_TYPES.FETCH_UNLINKED_VILLAGES_FAILURE;
  error: Error;
}

export interface IClearHFFormData {
  type: typeof ACTION_TYPES.CLEAR_HF_FORM_DATA;
}
export interface IFetchVillagesListFromHFRequest {
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_REQUEST;
  countryId: number;
  districtId: number;
  chiefdomId: number;
  successCb?: (data: { list: IVillages[]; hfTenantIds: number[] }) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchVillagesListUserLinked {
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_USER_LINKED;
  tenantIds: number[];
  userId?: number;
  successCb?: (data: { list: IVillages[]; hfTenantIds: number[] }) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchVillagesListFromHFSuccess {
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_SUCCESS;
  payload: { data: { list: IVillages[]; hfTenantIds: number[] } };
}

export interface IFetchVillagesListFromHFFailure {
  type: typeof ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_FAILURE;
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
  appTypes: string[];
  successCb?: (data: { list: IPeerSupervisor[]; hfTenantIds: number[] }, total: number) => void;
  failureCb?: (error: Error) => void;
}

export interface IFetchPeerSupervisorListSuccess {
  type: typeof ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_SUCCESS;
  payload: { data: { list: IPeerSupervisor[]; hfTenantIds: number[] }; total: number };
}

export interface IFetchPeerSupervisorListFailure {
  type: typeof ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_FAILURE;
  error: Error;
}

export interface IWorkflow {
  id: string | number;
  name: string;
  isActive?: boolean;
  default?: boolean;
  coreType?: string;
  workflowId?: string;
  moduleType?: string;
  country?: string;
  tenantId?: string;
  viewScreens?: string[];
  appTypes: string[];
  workflow?: string;
  ncdWorkflow?: boolean;
  workflowName?: string;
}

export interface IFetchWorkflowListRequest {
  type: typeof ACTION_TYPES.FETCH_WORKFLOW_LIST_REQUEST;
  countryId: number;
  successCb?: (data: IWorkflow[]) => void;
  failureCb?: (error: Error) => void;
}

export interface IPeerSupervisorValidation {
  type: typeof ACTION_TYPES.FETCH_PEER_SUPERVISOR_VALIDATION;
  ids: number[];
  tenantId: number;
  appTypes: string[];
  successCb?: (data: IWorkflow[]) => void;
  failureCb?: (error: Error) => void;
}

export interface IValidateLinkedRestrictions {
  type: typeof ACTION_TYPES.LINKED_RESTRICTIONS_VALIDATION_REQUEST;
  ids: number[];
  appTypes: string[];
  tenantId: number;
  healthFacilityId: number;
  linkedVillageIds: number[];
  successCb?: (data: IWorkflow[]) => void;
  failureCb?: (error: Error) => void;
}
export interface IValidateLinkedRestrictionsSuccess {
  type: typeof ACTION_TYPES.LINKED_RESTRICTIONS_VALIDATION_SUCCESS;
}
export interface IValidateLinkedRestrictionsFailure {
  type: typeof ACTION_TYPES.LINKED_RESTRICTIONS_VALIDATION_FAILURE;
  error: Error;
}
export interface IFetchWorkflowListSuccess {
  type: typeof ACTION_TYPES.FETCH_WORKFLOW_LIST_SUCCESS;
  payload: { list: IWorkflow[] };
}

export interface IFetchWorkflowListFailure {
  type: typeof ACTION_TYPES.FETCH_WORKFLOW_LIST_FAILURE;
  error: Error;
}

export interface IClearHealthFacilityDetail {
  type: typeof ACTION_TYPES.CLEAR_HEALTH_FACILITY_DETAIL;
}
export interface ICulture {
  id: number;
  name: string;
  appTypes: string[];
}

export interface ICountryCode {
  id: string;
  phoneNumberCode: string;
}

export interface IFetchCultureListRequest {
  type: typeof ACTION_TYPES.FETCH_CULTURE_LIST_REQUEST;
}

export interface IFetchCultureListSuccess {
  type: typeof ACTION_TYPES.FETCH_CULTURE_LIST_SUCCESS;
  payload: IFetchCultureListSuccessPayload;
}

export interface IFetchCultureListFailure {
  type: typeof ACTION_TYPES.FETCH_CULTURE_LIST_FAILURE;
}

export interface IFetchCountryListRequest {
  type: typeof ACTION_TYPES.FETCH_COUNTRY_LIST_REQUEST;
}

export interface IFetchCountryListSuccess {
  type: typeof ACTION_TYPES.FETCH_COUNTRY_LIST_SUCCESS;
  payload: IFetchCountryListSuccessPayload;
}

export interface IFetchCountryListFailure {
  type: typeof ACTION_TYPES.FETCH_COUNTRY_LIST_FAILURE;
}

export interface IClearHFSummary {
  type: typeof ACTION_TYPES.CLEAR_HF_SUMMARY;
}

export interface IClearHFDropdown {
  type: typeof ACTION_TYPES.CLEAR_HF_DROPDOWN_OPTIONS;
}

export type IFetchCultureListSuccessPayload = ICulture[];

export type IFetchCountryListSuccessPayload = ICountryCode[];

export type HealthFacilityActions =
  | IFetchHFListRequest
  | IFetchHFListSuccess
  | IFetchHFListFailure
  | ICreateHFRequest
  | ICreateHFSuccess
  | ICreateHFFailure
  | IDeleteHFRequest
  | IDeleteHFSuccess
  | IDeleteHFFailure
  | IClearHFList
  | IClearSupervisorList
  | IClearVillagesHFList
  | IClearVillagesList
  | IClearDependentData
  | IFetchHFSummaryRequest
  | IFetchHFSummarySuccess
  | IFetchHFSummaryFailure
  | IFetchHFTypesRequest
  | IFetchHFTypesSuccess
  | IFetchHFTypesFailure
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
  | IFetchUserDetailRequest
  | IFetchUserDetailSuccess
  | IFetchUserDetailFailure
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
  | IFetchUnlinkedVillagesRequest
  | IFetchUnlinkedVillagesSuccess
  | IFetchUnlinkedVillagesFailure
  | IFetchVillagesListFromHFRequest
  | IFetchVillagesListFromHFSuccess
  | IFetchVillagesListFromHFFailure
  | IFetchPeerSupervisorListRequest
  | IFetchPeerSupervisorListSuccess
  | IFetchPeerSupervisorListFailure
  | IFetchWorkflowListRequest
  | IFetchWorkflowListSuccess
  | IFetchWorkflowListFailure
  | IClearHealthFacilityDetail
  | IFetchCultureListRequest
  | IFetchCultureListSuccess
  | IFetchCultureListFailure
  | IFetchCountryListRequest
  | IFetchCountryListSuccess
  | IFetchCountryListFailure
  | IFetchHFDashboardListRequest
  | IFetchHFDashboardListSuccess
  | IFetchHFDashboardListFailure
  | ISetHFSummary
  | IClearHFSummary
  | IClearHFDropdown
  | IValidateLinkedRestrictions
  | IValidateLinkedRestrictionsSuccess
  | IFetchHFUserListClear
  | IValidateLinkedRestrictionsFailure
  | IClearHFFormData
  | IClearHFWorkflowList
  | IFetchCityListRequest
  | IFetchCityListFailure
  | IFetchCityListSuccess
  | ISetAssignedHFListForHFAdmin
  | IClearAssignedHFListForHFAdmin;
