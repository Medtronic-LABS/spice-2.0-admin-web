import * as DISTRICT_TYPES from './actionTypes';

import { DistrictActions, IDistrictState } from './types';

export const initialState: IDistrictState = {
  district: {
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
  districtList: [],
  districtOptions: [],
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

const districtReducer = (state = initialState, action = {} as DistrictActions): IDistrictState => {
  switch (action.type) {
    case DISTRICT_TYPES.FETCH_DISTRICT_LIST_REQUEST:
    case DISTRICT_TYPES.FETCH_DISTRICT_DETAIL_REQUEST:
    case DISTRICT_TYPES.CREATE_DISTRICT_REQUEST:
    case DISTRICT_TYPES.UPDATE_DISTRICT_DETAIL_REQUEST:
    case DISTRICT_TYPES.DELETE_DISTRICT_ADMIN_REQUEST:
    case DISTRICT_TYPES.ACTIVATE_ACCOUNT_REQUEST:
    case DISTRICT_TYPES.DEACTIVATE_DISTRICT_REQUEST:
    case DISTRICT_TYPES.CREATE_DISTRICT_ADMIN_REQUEST:
    case DISTRICT_TYPES.UPDATE_DISTRICT_ADMIN_REQUEST:
      return {
        ...state,
        loading: true
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        districtList: action.payload.districtList,
        total: action.payload.total,
        error: null
      };
    case DISTRICT_TYPES.CLEAR_DISTRICT_LIST:
      return {
        ...state,
        districtList: [],
        total: 0
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_LIST_FAILURE:
    case DISTRICT_TYPES.CREATE_DISTRICT_FAILURE:
    case DISTRICT_TYPES.UPDATE_DISTRICT_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case DISTRICT_TYPES.REMOVE_DEACTIVATED_ACCOUNT_LIST:
      return {
        ...state,
        districtList: []
      };
    case DISTRICT_TYPES.CREATE_DISTRICT_SUCCESS:
    case DISTRICT_TYPES.CREATE_DISTRICT_ADMIN_SUCCESS:
    case DISTRICT_TYPES.UPDATE_DISTRICT_ADMIN_SUCCESS:
    case DISTRICT_TYPES.CREATE_DISTRICT_ADMIN_FAIL:
    case DISTRICT_TYPES.UPDATE_DISTRICT_ADMIN_FAIL:
    case DISTRICT_TYPES.DELETE_DISTRICT_ADMIN_SUCCESS:
    case DISTRICT_TYPES.DELETE_DISTRICT_ADMIN_FAIL:
    case DISTRICT_TYPES.ACTIVATE_ACCOUNT_SUCCESS:
    case DISTRICT_TYPES.ACTIVATE_ACCOUNT_FAIL:
    case DISTRICT_TYPES.DEACTIVATE_DISTRICT_SUCCESS:
    case DISTRICT_TYPES.DEACTIVATE_DISTRICT_FAIL:
      return {
        ...state,
        loading: false,
        error: null
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
        district: initialState.district
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_DETAIL_SUCCESS:
      return {
        ...state,
        district: action.payload,
        loading: false
      };
    case DISTRICT_TYPES.SEACRH_DISTRICT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        district: { ...state.district, users: action.payload }
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_REQUEST:
      return {
        ...state,
        [action.payload.isLoadMore ? 'loadingMore' : 'loading']: true
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_SUCCESS:
      return {
        ...state,
        dashboardList: action.payload.isLoadMore
          ? [...state.dashboardList, ...action.payload.data]
          : action.payload.data,
        total: action.payload.total ? action.payload.total : state.total,
        loadingMore: false,
        loading: false
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_FAIL:
      return {
        ...state,
        loadingMore: false,
        loading: false,
        dashboardList: []
      };
    case DISTRICT_TYPES.UPDATE_DISTRICT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        district: { ...state.district, ...action.data }
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_OPTIONS_REQUEST:
      return {
        ...state,
        loadingOptions: true
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_OPTIONS_SUCCESS:
      return {
        ...state,
        districtOptions: action.payload,
        loadingOptions: false
      };
    case DISTRICT_TYPES.FETCH_DISTRICT_OPTIONS_FAILURE:
      return {
        ...state,
        loadingOptions: false
      };
    case DISTRICT_TYPES.CLEAR_DISTRICT_ADMIN:
      return {
        ...state,
        admins: [],
        total: 0
      };
    case DISTRICT_TYPES.CLEAR_DISTRICT_DETAILS:
      return {
        ...state,
        district: initialState.district
      };
    case DISTRICT_TYPES.SET_DISTRICT_DETAILS:
      return {
        ...state,
        district: { ...state.district, ...action.data }
      };
    default:
      return {
        ...state
      };
  }
};

export default districtReducer;
