import * as HEALTH_FACILITY_ACTION_TYPES from '../healthFacility/actionTypes';

import {
  HealthFacilityActions,
  IChiefdom,
  IDistrict,
  IHFUserGet,
  IHealthFacility,
  IHealthFacilityState
} from './types';

const initialState: IHealthFacilityState = {
  hfTotal: 0,
  loading: false,
  healthFacility: {
    id: 0,
    name: '',
    type: '',
    phuFocalPersonName: '',
    phuFocalPersonNumber: '',
    address: '',
    district: {} as IDistrict,
    chiefdom: {} as IChiefdom,
    cityName: '',
    latitude: '',
    longitude: '',
    postalCode: '',
    language: '',
    tenantId: 0,
    peerSupervisors: [],
    linkedVillages: [],
    clinicalWorkflows: []
  },
  hfTypes: [],
  hfTypesLoading: false,
  healthFacilityList: [] as IHealthFacility[],
  healthFacilityUserList: [],
  hfUser: {} as IHFUserGet,
  hfUserDetailLoading: false,
  hfUsersTotal: 0,
  hfUsersLoading: false,
  districtList: [],
  districtTotal: 0,
  districtLoading: false,
  chiefdomList: [],
  chiefdomTotal: 0,
  chiefdomLoading: false,
  villagesList: [],
  villagesTotal: 0,
  villagesLoading: false,
  villagesFromHFList: { list: [], hfTenantIds: null },
  villagesFromHFLoading: false,
  peerSupervisorList: { list: [], hfTenantIds: null },
  peerSupervisorTotal: 0,
  peerSupervisorLoading: false,
  clinicalWorkflowList: [],
  clinicalWorkflowLoading: false,
  error: null
};

const healthFacilityReducer = (
  state: IHealthFacilityState = initialState,
  action = {} as HealthFacilityActions
): IHealthFacilityState => {
  switch (action.type) {
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        hfTotal: action.payload.total || 0,
        healthFacilityList: action.payload.healthFacilityList || []
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_SUCCESS:
      return {
        ...state,
        hfUsersLoading: false,
        hfUsersTotal: action.payload.total || 0,
        healthFacilityUserList: action.payload.users || []
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_SUCCESS:
      return {
        ...state,
        hfUserDetailLoading: false,
        hfUser: action.payload
      };
    case HEALTH_FACILITY_ACTION_TYPES.CREATE_HEALTH_FACILITY_SUCCESS:
    case HEALTH_FACILITY_ACTION_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_SUCCESS:
    case HEALTH_FACILITY_ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_SUCCESS:
    case HEALTH_FACILITY_ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_SUCCESS:
    case HEALTH_FACILITY_ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_SUCCESS:
      return {
        ...state,
        healthFacility: action.payload,
        loading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_REQUEST:
      return {
        ...state,
        hfUsersLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST:
      return {
        ...state,
        hfUserDetailLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_REQUEST:
    case HEALTH_FACILITY_ACTION_TYPES.CREATE_HEALTH_FACILITY_REQUEST:
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST:
    case HEALTH_FACILITY_ACTION_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_REQUEST:
    case HEALTH_FACILITY_ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_REQUEST:
    case HEALTH_FACILITY_ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_REQUEST:
    case HEALTH_FACILITY_ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_FAILURE:
      return {
        ...state,
        hfUsersLoading: false,
        error: action.error
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_FAILURE:
      return {
        ...state,
        hfUserDetailLoading: false,
        error: action.error
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_FAILURE:
    case HEALTH_FACILITY_ACTION_TYPES.CREATE_HEALTH_FACILITY_FAILURE:
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_FAILURE:
    case HEALTH_FACILITY_ACTION_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_FAILURE:
    case HEALTH_FACILITY_ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_FAILURE:
    case HEALTH_FACILITY_ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_FAILURE:
    case HEALTH_FACILITY_ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_HEALTH_FACILITY_LIST:
      return {
        ...state,
        healthFacilityList: [],
        hfTotal: 0
      };
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_PEER_SUPERVISOR_LIST:
      return {
        ...state,
        peerSupervisorList: { list: [], hfTenantIds: [] },
        peerSupervisorTotal: 0
      };
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_VILLAGES_LIST_FROM_HF:
      return {
        ...state,
        villagesFromHFList: { list: [], hfTenantIds: [] }
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST:
      return {
        ...state,
        districtLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_DISTRICT_LIST_SUCCESS:
      return {
        ...state,
        districtLoading: false,
        districtList: action.payload.list,
        districtTotal: action.payload.total
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_DISTRICT_LIST_FAILURE:
      return {
        ...state,
        districtLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST:
      return {
        ...state,
        chiefdomLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS:
      return {
        ...state,
        chiefdomLoading: false,
        chiefdomList: action.payload.list,
        chiefdomTotal: action.payload.total
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CHIEFDOM_LIST_FAILURE:
      return {
        ...state,
        chiefdomLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_VILLAGES_LIST_REQUEST:
      return {
        ...state,
        villagesLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_VILLAGES_LIST_SUCCESS:
      return {
        ...state,
        villagesLoading: false,
        villagesList: action.payload.list,
        villagesTotal: action.payload.total
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_VILLAGES_LIST_FAILURE:
      return {
        ...state,
        villagesLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_REQUEST:
      return {
        ...state,
        villagesFromHFLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_SUCCESS:
      return {
        ...state,
        villagesFromHFLoading: false,
        villagesFromHFList: action.payload.data
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_FAILURE:
      return {
        ...state,
        villagesFromHFLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_REQUEST:
      return {
        ...state,
        peerSupervisorLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_SUCCESS:
      return {
        ...state,
        peerSupervisorLoading: false,
        peerSupervisorList: action.payload.data,
        peerSupervisorTotal: action.payload.total
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_FAILURE:
      return {
        ...state,
        peerSupervisorLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_WORKFLOW_LIST_REQUEST:
      return {
        ...state,
        clinicalWorkflowLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_WORKFLOW_LIST_SUCCESS:
      return {
        ...state,
        clinicalWorkflowLoading: false,
        clinicalWorkflowList: action.payload.list
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_WORKFLOW_LIST_FAILURE:
      return {
        ...state,
        clinicalWorkflowLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_REQUEST:
      return {
        ...state,
        hfTypesLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_SUCCESS:
      return {
        ...state,
        hfTypesLoading: false,
        hfTypes: action.payload
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_FAILURE:
      return {
        ...state,
        hfTypesLoading: false
      };
    default:
      return state;
  }
};

export default healthFacilityReducer;
