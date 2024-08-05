import { SubCountyActions, ISubCountyState } from './types';
import * as ACTION_TYPES from './actionTypes';

export const initialState: ISubCountyState = {
  subCountyList: [],
  listTotal: 0,
  subCountyDetail: {
    id: '',
    name: '',
    tenantId: '',
    countryId: '',
    countyName: '',
    account: {
      id: '',
      name: '',
      tenantId: ''
    }
  },
  admins: [],
  subCountyDashboardList: [],
  error: null,
  total: 0,
  loading: false,
  loadingMore: false,
  subCountyAdmins: [],
  dropdownSubCountyList: [],
  dropdownSubCountyListLoading: false
};

const subCountyReducer = (
  state: ISubCountyState = initialState,
  action = {} as SubCountyActions
): ISubCountyState => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_REQUEST:
      return {
        ...state,
        [action.isLoadMore ? 'loadingMore' : 'loading']: true
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        subCountyDashboardList: action.payload.isLoadMore
          ? [...state.subCountyDashboardList, ...action.payload.subCountyDashboardList]
          : action.payload.subCountyDashboardList,
        total: action.payload.isLoadMore ? state.total : action.payload.total
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        loadingMore: false
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_LIST_REQUEST:
    case ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_REQUEST:
    case ACTION_TYPES.CREATE_SUB_COUNTY_REQUEST:
    case ACTION_TYPES.UPDATE_SUB_COUNTY_REQUEST:
    case ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_REQUEST:
    case ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_REQUEST:
    case ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_REQUEST:
    case ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_REQUEST:
    case ACTION_TYPES.FETCH_SUB_COUNTY_ADMIN_LIST_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_SUCCESS:
      return {
        ...state,
        subCountyDetail: action.payload.subCountyDetail,
        admins: action.payload.subCountyAdmins,
        loading: false
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
        subCountyDetail: initialState.subCountyDetail
      };
    case ACTION_TYPES.SEARCH_SUB_COUNTY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        admins: action.payload
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_LIST_SUCCESS:
      return {
        ...state,
        subCountyList: action.payload.subCountyList,
        listTotal: action.payload.total,
        loading: false
      };
    case ACTION_TYPES.CLEAR_SUB_COUNTY_LIST:
      return {
        ...state,
        subCountyList: [],
        listTotal: 0
      };
    case ACTION_TYPES.UPDATE_SUB_COUNTY_SUCCESS:
      return {
        ...state,
        loading: false,
        subCountyDetail: action.payload
          ? {
              ...state.subCountyDetail,
              ...action.payload
            }
          : state.subCountyDetail
      };
    case ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_SUCCESS:
    case ACTION_TYPES.FETCH_SUB_COUNTY_LIST_FAILURE:
    case ACTION_TYPES.CREATE_SUB_COUNTY_SUCCESS:
    case ACTION_TYPES.CREATE_SUB_COUNTY_FAILURE:
    case ACTION_TYPES.UPDATE_SUB_COUNTY_FAILURE:
    case ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_FAILURE:
    case ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_SUCCESS:
    case ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_FAILURE:
    case ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_SUCCESS:
    case ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_FAILURE:
    case ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_SUCCESS:
    case ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_FAILURE:
      return {
        ...state,
        loading: false
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_ADMIN_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        subCountyAdmins: action.payload.subCountyAdmins,
        total: action.payload.total,
        error: null
      };
    case ACTION_TYPES.CLEAR_SUB_COUNTY_ADMIN_LIST:
      return {
        ...state,
        subCountyAdmins: [],
        total: 0
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_ADMIN_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case ACTION_TYPES.CLEAR_SUB_COUNTY_DETAIL:
      return { ...state, subCountyDetail: initialState.subCountyDetail, admins: [] };
    case ACTION_TYPES.SET_SUB_COUNTY_DETAILS:
      return {
        ...state,
        subCountyDetail: { ...state.subCountyDetail, ...action.data }
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_REQUEST:
      return {
        ...state,
        dropdownSubCountyList: [],
        dropdownSubCountyListLoading: true
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_SUCCESS:
      return {
        ...state,
        dropdownSubCountyListLoading: false,
        dropdownSubCountyList: action.payload.subCountyList || []
      };
    case ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_FAIL:
      return {
        ...state,
        dropdownSubCountyListLoading: false,
        error: action.error
      };
    case ACTION_TYPES.CLEAR_DROPDOWN_VALUES:
      return {
        ...state,
        dropdownSubCountyListLoading: false,
        dropdownSubCountyList: []
      };
    default:
      return state;
  }
};

export default subCountyReducer;
