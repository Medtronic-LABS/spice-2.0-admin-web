import * as SITE_ACTION_TYPES from '../healthFacilityDashboard/actionTypes';

import { SiteActions, ISiteState } from './types';

const initialState: ISiteState = {
  total: 0,
  site: {
    name: '',
    siteType: '',
    email: '',
    address1: '',
    address2: '',
    district: {
      id: '',
      name: ''
    },
    postalCode: '',
    phoneNumber: '',
    location: '',
    culture: {
      id: '',
      name: '',
      deleted: true,
      code: ''
    },
    addressUse: '',
    addressType: '',
    chiefdom: {
      id: '',
      name: ''
    },
    city: { label: '', value: { Latitude: 0, Longitude: 0 } },
    country: '',
    siteLevel: {
      label: '',
      value: ''
    },
    id: 0,
    tenantId: 0,
    mflCode: ''
  },
  siteList: [
    {
      id: 0,
      name: '',
      siteType: '',
      tenantId: 0,
      cultureName: '',
      siteLevel: '',
      chiefdomName: ''
    }
  ],
  siteDashboardList: [
    {
      id: 0,
      name: '',
      siteType: '',
      tenantId: 0,
      chiefdom: ''
    }
  ],
  siteUserList: [],
  loading: false,
  error: null,
  districtList: [],
  districtDropdownLoading: false,
  chiefdomList: [],
  chiefdomDropdownLoading: false,
  cultureList: [],
  cultureListLoading: false,
  loadingMore: false,
  siteDropdownLoading: false,
  siteDropdownOptions: {
    list: [],
    regionTenantId: ''
  }
};

const siteReducer = (state: ISiteState = initialState, action = {} as SiteActions) => {
  switch (action.type) {
    case SITE_ACTION_TYPES.FETCH_SITE_DASHBOARD_LIST_REQUEST:
      return {
        ...state,
        [action.isLoadMore ? 'loadingMore' : 'loading']: true
      };
    case SITE_ACTION_TYPES.FETCH_SITE_DASHBOARD_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        siteDashboardList: action.payload.isLoadMore
          ? [...state.siteDashboardList, ...action.payload.siteDashboardList]
          : action.payload.siteDashboardList,
        total: action.payload.isLoadMore ? state.total : action.payload.total
      };
    case SITE_ACTION_TYPES.FETCH_SITE_DASHBOARD_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        loadingMore: false
      };
    case SITE_ACTION_TYPES.FETCH_SITE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        total: action.payload.total || 0,
        siteList: action.payload.sites || []
      };
    case SITE_ACTION_TYPES.CLEAR_SITE_LIST:
      return {
        ...state,
        total: 0,
        siteList: []
      };
    case SITE_ACTION_TYPES.FETCH_SITE_USER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        total: action.payload.total || 0,
        siteUserList: action.payload.siteUsers || []
      };
    case SITE_ACTION_TYPES.CLEAR_SITE_USER_LIST:
      return {
        ...state,
        total: 0,
        siteUserList: []
      };
    case SITE_ACTION_TYPES.FETCH_DISTRICT_DROPDOWN_SUCCESS:
      return {
        ...state,
        districtDropdownLoading: false,
        districtList: action.payload.districtList || []
      };
    case SITE_ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_SUCCESS:
      return {
        ...state,
        chiefdomDropdownLoading: false,
        chiefdomList: action.payload.chiefdomList || []
      };
    case SITE_ACTION_TYPES.FETCH_CULTURE_DROPDOWN_SUCCESS:
      return {
        ...state,
        cultureListLoading: false,
        cultureList: action.payload.cultureList || []
      };
    case SITE_ACTION_TYPES.CREATE_SITE_SUCCESS:
    case SITE_ACTION_TYPES.UPDATE_SITE_DETAILS_SUCCESS:
    case SITE_ACTION_TYPES.CREATE_SITE_USER_SUCCESS:
    case SITE_ACTION_TYPES.UPDATE_SITE_USER_SUCCESS:
    case SITE_ACTION_TYPES.DELETE_SITE_USER_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case SITE_ACTION_TYPES.FETCH_SITE_SUMMARY_SUCCESS:
      return {
        ...state,
        site: action.payload,
        loading: false
      };
    case SITE_ACTION_TYPES.CLEAR_SITE_SUMMARY:
      return {
        ...state,
        site: initialState.site
      };
    case SITE_ACTION_TYPES.SET_SITE_SUMMARY:
      return {
        ...state,
        site: { ...state.site, ...action.data },
        loading: false
      };
    case SITE_ACTION_TYPES.FETCH_SITE_LIST_REQUEST:
    case SITE_ACTION_TYPES.CREATE_SITE_REQUEST:
    case SITE_ACTION_TYPES.FETCH_SITE_SUMMARY_REQUEST:
    case SITE_ACTION_TYPES.UPDATE_SITE_DETAILS_REQUEST:
    case SITE_ACTION_TYPES.CREATE_SITE_USER_REQUEST:
    case SITE_ACTION_TYPES.UPDATE_SITE_USER_REQUEST:
    case SITE_ACTION_TYPES.FETCH_SITE_USER_LIST_REQUEST:
    case SITE_ACTION_TYPES.DELETE_SITE_USER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case SITE_ACTION_TYPES.FETCH_DISTRICT_DROPDOWN_REQUEST:
      return {
        ...state,
        districtList: [],
        districtDropdownLoading: true
      };
    case SITE_ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST:
      return {
        ...state,
        chiefdomList: [],
        chiefdomDropdownLoading: true
      };
    case SITE_ACTION_TYPES.FETCH_CULTURE_DROPDOWN_REQUEST:
      return {
        ...state,
        cultureList: [],
        cultureListLoading: true
      };
    case SITE_ACTION_TYPES.FETCH_SITE_LIST_FAILURE:
    case SITE_ACTION_TYPES.CREATE_SITE_FAILURE:
    case SITE_ACTION_TYPES.FETCH_SITE_SUMMARY_FAILURE:
    case SITE_ACTION_TYPES.UPDATE_SITE_DETAILS_FAILURE:
    case SITE_ACTION_TYPES.CREATE_SITE_USER_FAILURE:
    case SITE_ACTION_TYPES.UPDATE_SITE_USER_FAILURE:
    case SITE_ACTION_TYPES.FETCH_SITE_USER_LIST_FAILURE:
    case SITE_ACTION_TYPES.DELETE_SITE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case SITE_ACTION_TYPES.FETCH_SITE_USERS_FAILURE:
      return {
        ...state,
        error: action.error
      };
    case SITE_ACTION_TYPES.FETCH_DISTRICT_DROPDOWN_FAILURE:
      return {
        ...state,
        districtDropdownLoading: false,
        error: action.error
      };
    case SITE_ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_FAILURE:
      return {
        ...state,
        chiefdomDropdownLoading: false,
        error: action.error
      };
    case SITE_ACTION_TYPES.FETCH_CULTURE_DROPDOWN_FAILURE:
      return {
        ...state,
        cultureListLoading: false,
        error: action.error
      };
    case SITE_ACTION_TYPES.CLEAR_DROPDOWN_VALUES:
      return {
        ...state,
        districtList: [],
        chiefdomList: [],
        cultureList: []
      };
    default:
      return state;
  }
};

export default siteReducer;
