import * as COUNTY_TYPES from './actionTypes';

import { CountyActions, ICountyState } from './types';

export const initialState: ICountyState = {
  county: {
    name: '',
    id: '',
    tenantId: '',
    maxNoOfUsers: '',
    users: [],
    updatedAt: '',
    country: {
      countryCode: '',
      tenantId: '',
      id: ''
    }
  },
  countyList: [],
  countyOptions: [],
  admins: [],
  total: 0,
  loading: false,
  dashboardList: [],
  clinicalWorkflows: [],
  clinicalWorkflowsCount: 0,
  loadingMore: false,
  loadingOptions: false,
  error: null
};

const countyReducer = (state = initialState, action = {} as CountyActions): ICountyState => {
  switch (action.type) {
    case COUNTY_TYPES.FETCH_COUNTY_LIST_REQUEST:
    case COUNTY_TYPES.FETCH_COUNTY_DETAIL_REQUEST:
    case COUNTY_TYPES.FETCH_CLINICAL_WORKFLOW_REQUEST:
    case COUNTY_TYPES.CREATE_COUNTY_REQUEST:
    case COUNTY_TYPES.UPDATE_COUNTY_DETAIL_REQUEST:
    case COUNTY_TYPES.DELETE_COUNTY_ADMIN_REQUEST:
    case COUNTY_TYPES.ACTIVATE_COUNTY_REQUEST:
    case COUNTY_TYPES.DEACTIVATE_COUNTY_REQUEST:
    case COUNTY_TYPES.CREATE_COUNTY_ADMIN_REQUEST:
    case COUNTY_TYPES.UPDATE_COUNTY_ADMIN_REQUEST:
    case COUNTY_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_REQUEST:
    case COUNTY_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_REQUEST:
    case COUNTY_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case COUNTY_TYPES.FETCH_COUNTY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        countyList: action.payload.countyList,
        total: action.payload.total,
        error: null
      };
    case COUNTY_TYPES.CLEAR_COUNTY_LIST:
      return {
        ...state,
        countyList: [],
        total: 0
      };
    case COUNTY_TYPES.FETCH_COUNTY_LIST_FAILURE:
    case COUNTY_TYPES.CREATE_COUNTY_FAILURE:
    case COUNTY_TYPES.UPDATE_COUNTY_DETAIL_FAIL:
    case COUNTY_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_FAILURE:
    case COUNTY_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_FAILURE:
    case COUNTY_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case COUNTY_TYPES.REMOVE_DEACTIVATED_COUNTY_LIST:
      return {
        ...state,
        countyList: []
      };
    case COUNTY_TYPES.CREATE_COUNTY_SUCCESS:
    case COUNTY_TYPES.CREATE_COUNTY_ADMIN_SUCCESS:
    case COUNTY_TYPES.UPDATE_COUNTY_ADMIN_SUCCESS:
    case COUNTY_TYPES.CREATE_COUNTY_ADMIN_FAIL:
    case COUNTY_TYPES.UPDATE_COUNTY_ADMIN_FAIL:
    case COUNTY_TYPES.DELETE_COUNTY_ADMIN_SUCCESS:
    case COUNTY_TYPES.DELETE_COUNTY_ADMIN_FAIL:
    case COUNTY_TYPES.ACTIVATE_COUNTY_SUCCESS:
    case COUNTY_TYPES.ACTIVATE_COUNTY_FAIL:
    case COUNTY_TYPES.DEACTIVATE_COUNTY_SUCCESS:
    case COUNTY_TYPES.DEACTIVATE_COUNTY_FAIL:
    case COUNTY_TYPES.FETCH_CLINICAL_WORKFLOW_FAILURE:
    case COUNTY_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_SUCCESS:
    case COUNTY_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_SUCCESS:
    case COUNTY_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    case COUNTY_TYPES.FETCH_COUNTY_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
        county: initialState.county
      };
    case COUNTY_TYPES.FETCH_COUNTY_DETAIL_SUCCESS:
      return {
        ...state,
        county: action.payload,
        loading: false
      };
    case COUNTY_TYPES.SEACRH_COUNTY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        county: { ...state.county, users: action.payload }
      };
    case COUNTY_TYPES.FETCH_COUNTY_DASHBOARD_LIST_REQUEST:
      return {
        ...state,
        [action.payload.isLoadMore ? 'loadingMore' : 'loading']: true
      };
    case COUNTY_TYPES.FETCH_COUNTY_DASHBOARD_LIST_SUCCESS:
      return {
        ...state,
        dashboardList: action.payload.isLoadMore
          ? [...state.dashboardList, ...action.payload.data]
          : action.payload.data,
        total: action.payload.total ? action.payload.total : state.total,
        loadingMore: false,
        loading: false
      };
    case COUNTY_TYPES.FETCH_COUNTY_DASHBOARD_LIST_FAIL:
      return {
        ...state,
        loadingMore: false,
        loading: false,
        dashboardList: []
      };
    case COUNTY_TYPES.UPDATE_COUNTY_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        county: { ...state.county, ...action.data }
      };
    case COUNTY_TYPES.FETCH_COUNTY_OPTIONS_REQUEST:
      return {
        ...state,
        loadingOptions: true
      };
    case COUNTY_TYPES.FETCH_COUNTY_OPTIONS_SUCCESS:
      return {
        ...state,
        countyOptions: action.payload,
        loadingOptions: false
      };
    case COUNTY_TYPES.FETCH_COUNTY_OPTIONS_FAILURE:
      return {
        ...state,
        loadingOptions: false
      };
    case COUNTY_TYPES.CLEAR_COUNTY_ADMIN:
      return {
        ...state,
        admins: [],
        total: 0
      };
    case COUNTY_TYPES.CLEAR_COUNTY_DETAILS:
      return {
        ...state,
        county: initialState.county
      };
    case COUNTY_TYPES.SET_COUNTY_DETAILS:
      return {
        ...state,
        county: { ...state.county, ...action.data }
      };
    case COUNTY_TYPES.FETCH_CLINICAL_WORKFLOW_SUCCESS:
      return {
        ...state,
        clinicalWorkflows: action.payload?.data || [],
        clinicalWorkflowsCount: action.payload?.total,
        loading: false
      };
    case COUNTY_TYPES.RESET_CLINICAL_WORKFLOW_REQUEST:
      return {
        ...state,
        clinicalWorkflows: [],
        clinicalWorkflowsCount: 0
      };

    default:
      return {
        ...state
      };
  }
};

export default countyReducer;
