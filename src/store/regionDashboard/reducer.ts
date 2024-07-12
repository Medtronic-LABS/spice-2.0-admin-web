import * as REGION_TYPES from './actionTypes';

import { RegionActions, IRegionState } from './types';

const initialState: IRegionState = {
  regions: [],
  total: 0,
  loading: false,
  loadingMore: false,
  error: null,
  detail: {
    id: '',
    name: '',
    countryCode: '',
    unitMeasurement: '',
    users: [],
    tenantId: ''
  },
  isClientRegistryEnabled: undefined
};

const regionReducer = (state = initialState, action = {} as RegionActions): IRegionState => {
  console.log(REGION_TYPES, state)
  switch (action.type) {
    case REGION_TYPES.FETCH_REGIONS_REQUEST:
      return {
        ...state,
        [action.isLoadMore ? 'loadingMore' : 'loading']: true
      };
    case REGION_TYPES.FETCH_REGIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        regions: action.payload.isLoadMore
          ? [...state.regions, ...(action.payload.regions || [])]
          : action.payload.regions || [],
        total: action.payload.total ? action.payload.total : state.total,
        error: null
      };
    case REGION_TYPES.FETCH_REGIONS_FAILURE:
    case REGION_TYPES.FETCH_REGION_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: action.error,
        detail: initialState.detail
      };
    case REGION_TYPES.CLEAR_REGION_DETAIL:
      return {
        ...state,
        detail: initialState.detail
      };
    case REGION_TYPES.CLEAR_CLIENT_REGISTRY_STATUS:
      return {
        ...state,
        isClientRegistryEnabled: undefined
      };
    case REGION_TYPES.FETCH_REGION_DETAIL_SUCCESS:
      return {
        ...state,
        detail: action.payload,
        loading: false
      };
    case REGION_TYPES.SEACRH_REGION_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        detail: { ...state.detail, users: action.payload }
      };
    case REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        isClientRegistryEnabled: action.payload.isClientRegistryEnabled
      };
    case REGION_TYPES.FETCH_REGION_DETAIL_REQUEST:
    case REGION_TYPES.CREATE_REGION_REQUEST:
    case REGION_TYPES.UPDATE_REGION_DETAIL_REQUEST:
    case REGION_TYPES.CREATE_REGION_ADMIN_REQUEST:
    case REGION_TYPES.UPDATE_REGION_ADMIN_REQUEST:
    case REGION_TYPES.DELETE_REGION_ADMIN_REQUEST:
    case REGION_TYPES.DEACTIVATE_REGION_REQUEST:
    case REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case REGION_TYPES.CREATE_REGION_SUCCESS:
    case REGION_TYPES.CREATE_REGION_ADMIN_SUCCESS:
    case REGION_TYPES.UPDATE_REGION_ADMIN_SUCCESS:
    case REGION_TYPES.CREATE_REGION_ADMIN_FAIL:
    case REGION_TYPES.UPDATE_REGION_ADMIN_FAIL:
    case REGION_TYPES.DELETE_REGION_ADMIN_SUCCESS:
    case REGION_TYPES.DELETE_REGION_ADMIN_FAIL:
    case REGION_TYPES.DEACTIVATE_REGION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    case REGION_TYPES.UPDATE_REGION_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        detail: { ...state.detail, ...action.data }
      };
    case REGION_TYPES.CREATE_REGION_FAILURE:
    case REGION_TYPES.UPDATE_REGION_DETAIL_FAIL:
    case REGION_TYPES.DEACTIVATE_REGION_FAIL:
    case REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case REGION_TYPES.SET_REGION_DETAILS:
      return {
        ...state,
        detail: { ...state.detail, ...action.data }
      };
    default:
      return {
        ...state
      };
  }
};

export default regionReducer;
