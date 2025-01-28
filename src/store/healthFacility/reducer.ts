import * as HEALTH_FACILITY_ACTION_TYPES from '../healthFacility/actionTypes';

import {
  HealthFacilityActions,
  IDistrict,
  IHFUserGet,
  IHealthFacility,
  IHealthFacilityState,
  IChiefdom
} from './types';

export const initialState: IHealthFacilityState = {
  hfTotal: 0,
  loading: false,
  healthFacility: {
    id: 0,
    name: '',
    type: '',
    phuFocalPersonName: '',
    phuFocalPersonNumber: '',
    address: '',
    chiefdom: {} as IChiefdom,
    cityName: '',
    latitude: '',
    longitude: '',
    postalCode: '',
    language: '',
    tenantId: 0,
    peerSupervisors: [],
    linkedVillages: [],
    clinicalWorkflows: [],
    workflows: [],
    district: {} as IDistrict
  },
  hfTypes: [],
  hfTypesLoading: false,
  healthFacilityList: [] as IHealthFacility[],
  assignedHFListForHFAdmin: [] as IHealthFacility[],
  assignedHFListForHFAdminTotal: 0,
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
  unlinkedVillagesList: [],
  unlinkedVillagesTotal: 0,
  unlinkedVillagesLoading: false,
  villagesList: [],
  villagesTotal: 0,
  villagesLoading: false,
  villagesFromHFList: { list: [], hfTenantIds: null },
  villagesFromHFLoading: false,
  peerSupervisorList: { list: [], hfTenantIds: null },
  peerSupervisorTotal: 0,
  peerSupervisorLoading: false,
  cultureListLoading: false,
  countryListLoading: false,
  cultureList: [],
  countryList: [],
  clinicalWorkflowList: [],
  clinicalWorkflowLoading: false,
  error: null,
  hfDropdownLoading: false,
  hfDropdownOptions: {
    list: [],
    regionTenantId: ''
  },
  hfDashboardList: [
    {
      id: 0,
      name: '',
      type: '',
      tenantId: 0,
      chiefdom: ''
    }
  ],
  loadingMore: false
};

const healthFacilityReducer = (
  state: IHealthFacilityState = initialState,
  action = {} as HealthFacilityActions
): IHealthFacilityState => {
  switch (action.type) {
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HF_DASHBOARD_LIST_REQUEST:
      return {
        ...state,
        [action.isLoadMore ? 'loadingMore' : 'loading']: true
      };

    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HF_DASHBOARD_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        hfDashboardList: action.payload.isLoadMore
          ? [...state.hfDashboardList, ...action.payload.siteDashboardList]
          : action.payload.siteDashboardList,
        hfTotal: action.payload.isLoadMore ? state.hfTotal : action.payload.total
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        hfTotal: action.payload.total || 0,
        healthFacilityList: action.payload.healthFacilityList || []
      };
    case HEALTH_FACILITY_ACTION_TYPES.SET_ASSIGNED_HF_LIST_FOR_HF_ADMIN:
      return {
        ...state,
        loading: false,
        assignedHFListForHFAdmin: action.payload.healthFacilityList || [],
        assignedHFListForHFAdminTotal: action.payload.total || 0
      };
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_ASSIGNED_HF_LIST_FOR_HF_ADMIN:
      return {
        ...state,
        assignedHFListForHFAdmin: [],
        assignedHFListForHFAdminTotal: 0
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
    case HEALTH_FACILITY_ACTION_TYPES.DELETE_HEALTH_FACILITY_SUCCESS:
    case HEALTH_FACILITY_ACTION_TYPES.LINKED_RESTRICTIONS_VALIDATION_SUCCESS:
    case HEALTH_FACILITY_ACTION_TYPES.LINKED_RESTRICTIONS_VALIDATION_FAILURE:
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
    case HEALTH_FACILITY_ACTION_TYPES.SET_HF_SUMMARY:
      return {
        ...state,
        healthFacility: { ...state.healthFacility, ...action.data },
        loading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_REQUEST:
      return {
        ...state,
        hfUsersLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_CLEAR_LIST_REQUEST:
      return {
        ...state,
        hfTotal: 0,
        healthFacilityList: []
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
    case HEALTH_FACILITY_ACTION_TYPES.DELETE_HEALTH_FACILITY_REQUEST:
    case HEALTH_FACILITY_ACTION_TYPES.LINKED_RESTRICTIONS_VALIDATION_REQUEST:
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
    case HEALTH_FACILITY_ACTION_TYPES.DELETE_HEALTH_FACILITY_FAILURE:
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
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_VILLAGES_LIST:
      return {
        ...state,
        villagesList: []
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST_FOR_HF:
      return {
        ...state,
        districtLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_DISTRICT_LIST_SUCCESS_FOR_HF:
      return {
        ...state,
        districtLoading: false,
        districtList: action.payload.list,
        districtTotal: action.payload.total
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_DISTRICT_LIST_FAILURE_FOR_HF:
      return {
        ...state,
        districtLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF:
      return {
        ...state,
        chiefdomLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS_FOR_HF:
      return {
        ...state,
        chiefdomLoading: false,
        chiefdomList: action.payload.list,
        chiefdomTotal: action.payload.total
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CHIEFDOM_LIST_FAILURE_FOR_HF:
      return {
        ...state,
        chiefdomLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_VILLAGES_LIST_REQUEST_FOR_HF:
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CITY_LIST_REQUEST_FOR_HF:
      return {
        ...state,
        villagesLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_VILLAGES_LIST_SUCCESS_FOR_HF:
      return {
        ...state,
        villagesLoading: false,
        villagesList: action.payload.list,
        villagesTotal: action.payload.total
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_VILLAGES_LIST_FAILURE_FOR_HF:
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CITY_LIST_FAILURE_FOR_HF:
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CITY_LIST_SUCCESS_FOR_HF:
      return {
        ...state,
        villagesLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_UNLINKED_VILLAGES_REQUEST:
      return {
        ...state,
        unlinkedVillagesLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_UNLINKED_VILLAGES_SUCCESS:
      return {
        ...state,
        unlinkedVillagesLoading: false,
        unlinkedVillagesList: action.payload.list,
        unlinkedVillagesTotal: action.payload.total
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_UNLINKED_VILLAGES_FAILURE:
      return {
        ...state,
        unlinkedVillagesLoading: false
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
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_HF_WORKFLOW_LIST:
      return {
        ...state,
        clinicalWorkflowList: []
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
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_HEALTH_FACILITY_DETAIL:
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_HF_SUMMARY:
      return {
        ...state,
        healthFacility: initialState.healthFacility
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CULTURE_LIST_SUCCESS:
      return {
        ...state,
        cultureListLoading: false,
        cultureList: action.payload
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CULTURE_LIST_REQUEST:
      return {
        ...state,
        cultureListLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_COUNTRY_LIST_SUCCESS:
      return {
        ...state,
        countryList: action.payload,
        countryListLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_CULTURE_LIST_FAILURE:
      return {
        ...state,
        cultureListLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_COUNTRY_LIST_REQUEST:
      return {
        ...state,
        countryListLoading: true
      };
    case HEALTH_FACILITY_ACTION_TYPES.FETCH_COUNTRY_LIST_FAILURE:
      return {
        ...state,
        countryListLoading: false
      };
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_ALL_DEPENDENT_DATA:
      return {
        ...state,
        healthFacility: {} as IHealthFacility,
        chiefdomList: [],
        villagesList: [],
        unlinkedVillagesList: [],
        villagesFromHFList: { list: [], hfTenantIds: null }
      };
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_HF_FORM_DATA:
      return {
        ...state,
        chiefdomList: [],
        villagesList: [],
        villagesTotal: 0,
        unlinkedVillagesList: [],
        unlinkedVillagesTotal: 0,
        villagesFromHFList: { list: [], hfTenantIds: null }
      };
    case HEALTH_FACILITY_ACTION_TYPES.CLEAR_HF_DROPDOWN_OPTIONS:
      return {
        ...state,
        hfDropdownLoading: false,
        hfDropdownOptions: {
          list: [],
          regionTenantId: ''
        }
      };
    default:
      return state;
  }
};

export default healthFacilityReducer;
