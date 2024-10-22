import * as REGIONTYPES from './actionTypes';

import { IRegionState, RegionActions } from './types';

const initialStateGetter: () => IRegionState = () => ({
  file: {},
  uploading: false,
  downloading: false,
  error: null,
  loading: false,
  detail: {
    id: '',
    tenantId: '',
    name: '',
    appTypes: [],
    total: 0
  },
  regionDetails: { list: [], total: 0 }
});

const regionReducerCom = (state = initialStateGetter(), action = {} as RegionActions): IRegionState => {
  switch (action.type) {
    case REGIONTYPES.SET_REGION_DETAILS_COM:
      return {
        ...state,
        detail: { ...state.detail, ...action.data }
      };
    case REGIONTYPES.UPLOAD_FILE_REQUEST_COM:
      return {
        ...state,
        uploading: true
      };
    case REGIONTYPES.UPLOAD_FILE_SUCCESS_COM:
      return {
        ...state,
        uploading: false,
        file: action.payload,
        error: null
      };
    case REGIONTYPES.UPLOAD_FILE_FAILURE_COM:
      return {
        ...state,
        uploading: false,
        error: action.payload.error
      };
    case REGIONTYPES.DOWNLOAD_FILE_REQUEST_COM:
      return {
        ...state,
        downloading: true
      };
    case REGIONTYPES.DOWNLOAD_FILE_SUCCESS_COM:
      return {
        ...state,
        downloading: false,
        error: null
      };
    case REGIONTYPES.DOWNLOAD_FILE_FAILURE_COM:
      return {
        ...state,
        downloading: false,
        error: action.payload.error
      };
    case REGIONTYPES.REGION_DETAILS_REQUEST_COM:
      return {
        ...state,
        loading: true
      };
    case REGIONTYPES.REGION_DETAILS_SUCCESS_COM:
      return {
        ...state,
        loading: false,
        regionDetails: action.payload,
        error: null
      };
    case REGIONTYPES.REGION_DETAILS_FAILURE_COM:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    default:
      return {
        ...state
      };
  }
};

export default regionReducerCom;
