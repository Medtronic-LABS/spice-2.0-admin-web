import { ChiefdomActions, IChiefdomState } from './types';
import * as ACTION_TYPES from './actionTypes';

export const initialState: IChiefdomState = {
  chiefdomList: [],
  listTotal: 0,
  chiefdomDetail: {
    id: '',
    name: '',
    tenantId: '',
    countryId: '',
    districtName: '',
    district: {
      id: '',
      name: '',
      tenantId: ''
    }
  },
  admins: [],
  chiefdomDashboardList: [],
  error: null,
  total: 0,
  loading: false,
  loadingMore: false,
  chiefdomAdmins: [],
  dropdownChiefdomList: [],
  dropdownChiefdomListLoading: false
};

const chiefdomReducer = (state: IChiefdomState = initialState, action = {} as ChiefdomActions): IChiefdomState => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST:
      return {
        ...state,
        [action.isLoadMore ? 'loadingMore' : 'loading']: true
      };
    case ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        chiefdomDashboardList: action.payload.isLoadMore
          ? [...state.chiefdomDashboardList, ...action.payload.chiefdomDashboardList]
          : action.payload.chiefdomDashboardList,
        total: action.payload.isLoadMore ? state.total : action.payload.total
      };
    case ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        loadingMore: false
      };
    case ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST:
    case ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_REQUEST:
    case ACTION_TYPES.CREATE_CHIEFDOM_REQUEST:
    case ACTION_TYPES.UPDATE_CHIEFDOM_REQUEST:
    case ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_REQUEST:
    case ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_REQUEST:
    case ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_REQUEST:
    case ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_SUCCESS:
      return {
        ...state,
        chiefdomDetail: action.payload.chiefdomDetail,
        admins: action.payload.chiefdomAdmins,
        loading: false
      };
    case ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
        chiefdomDetail: initialState.chiefdomDetail
      };
    case ACTION_TYPES.SEARCH_CHIEFDOM_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        admins: action.payload
      };
    case ACTION_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS:
      return {
        ...state,
        chiefdomList: action.payload.chiefdomList,
        listTotal: action.payload.total,
        loading: false
      };
    case ACTION_TYPES.CLEAR_CHIEFDOM_LIST:
      return {
        ...state,
        chiefdomList: [],
        listTotal: 0
      };
    case ACTION_TYPES.UPDATE_CHIEFDOM_SUCCESS:
      return {
        ...state,
        loading: false,
        chiefdomDetail: action.payload
          ? {
              ...state.chiefdomDetail,
              ...action.payload
            }
          : state.chiefdomDetail
      };
    case ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_SUCCESS:
    case ACTION_TYPES.FETCH_CHIEFDOM_LIST_FAILURE:
    case ACTION_TYPES.CREATE_CHIEFDOM_SUCCESS:
    case ACTION_TYPES.CREATE_CHIEFDOM_FAILURE:
    case ACTION_TYPES.UPDATE_CHIEFDOM_FAILURE:
    case ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_FAILURE:
    case ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_SUCCESS:
    case ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_FAILURE:
    case ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_SUCCESS:
    case ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_FAILURE:
    case ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_SUCCESS:
    case ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_FAILURE:
      return {
        ...state,
        loading: false
      };
    case ACTION_TYPES.CLEAR_CHIEFDOM_ADMIN_LIST:
      return {
        ...state,
        chiefdomAdmins: [],
        total: 0
      };
    case ACTION_TYPES.CLEAR_CHIEFDOM_DETAIL:
      return { ...state, chiefdomDetail: initialState.chiefdomDetail, admins: [] };
    case ACTION_TYPES.SET_CHIEFDOM_DETAILS:
      return {
        ...state,
        chiefdomDetail: { ...state.chiefdomDetail, ...action.data }
      };
    case ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST:
      return {
        ...state,
        dropdownChiefdomList: [],
        dropdownChiefdomListLoading: true
      };
    case ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_SUCCESS:
      return {
        ...state,
        dropdownChiefdomListLoading: false,
        dropdownChiefdomList: action.payload.chiefdomList || []
      };
    case ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_FAIL:
      return {
        ...state,
        dropdownChiefdomListLoading: false,
        error: action.error
      };
    case ACTION_TYPES.CLEAR_DROPDOWN_VALUES:
      return {
        ...state,
        dropdownChiefdomListLoading: false,
        dropdownChiefdomList: []
      };
    default:
      return state;
  }
};

export default chiefdomReducer;
