import * as REGION_TYPES from './actionTypes';
import { RegionActions, IRegionState } from './types';

export const initialState: IRegionState = {
  regions: [],
  total: 0,
  loading: false,
  loadingMore: false,
  error: null,
  detail: {
    id: '',
    tenantId: '',
    name: '',
    list: [],
    appTypes: [],
    total: 0
  },
  isClientRegistryEnabled: undefined,
  file: {},
  uploading: false,
  downloading: false
};

const regionReducer = (state = initialState, action = {} as RegionActions): IRegionState => {
  switch (action.type) {
    case REGION_TYPES.FETCH_REGION_DETAIL_REQUEST:
    case REGION_TYPES.FETCH_COUNTRY_DETAILS_REQUEST:
    case REGION_TYPES.CREATE_REGION_REQUEST:
    case REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case REGION_TYPES.CREATE_REGION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    case REGION_TYPES.CREATE_REGION_FAILURE:
    case REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case REGION_TYPES.FETCH_REGIONS_FAILURE:
    case REGION_TYPES.FETCH_REGION_DETAIL_FAILURE:
    case REGION_TYPES.FETCH_COUNTRY_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: action.error,
        detail: initialState.detail
      };
    case REGION_TYPES.UPLOAD_FILE_REQUEST:
      return {
        ...state,
        uploading: true
      };
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
    case REGION_TYPES.FETCH_REGION_DETAIL_SUCCESS:
    case REGION_TYPES.FETCH_COUNTRY_DETAILS_SUCCESS:
      return {
        ...state,
        detail: { ...state.detail, ...action.payload },
        loading: false
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
    case REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        isClientRegistryEnabled: action.payload.isClientRegistryEnabled
      };
    case REGION_TYPES.SET_REGION_DETAILS:
      return {
        ...state,
        detail: { ...state.detail, ...action.data }
      };
    case REGION_TYPES.UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        uploading: false,
        file: action.payload,
        error: null
      };
    case REGION_TYPES.UPLOAD_FILE_FAILURE:
      return {
        ...state,
        uploading: false,
        error: action.payload.error
      };
    case REGION_TYPES.DOWNLOAD_FILE_REQUEST:
      return {
        ...state,
        downloading: true
      };
    case REGION_TYPES.DOWNLOAD_FILE_SUCCESS:
      return {
        ...state,
        downloading: false,
        error: null
      };
    case REGION_TYPES.DOWNLOAD_FILE_FAILURE:
      return {
        ...state,
        downloading: false,
        error: action.payload.error
      };
    default:
      return {
        ...state
      };
  }
};

export default regionReducer;
