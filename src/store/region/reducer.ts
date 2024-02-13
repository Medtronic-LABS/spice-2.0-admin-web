import * as REGIONTYPES from './actionTypes';

import { IRegionState, RegionActions } from './types';

const initialStateGetter: () => IRegionState = () => ({
  file: {},
  uploading: false,
  downloading: false,
  error: null,
  loading: false,
  regionDetails: { list: [], total: 0 }
});

const regionReducer = (state = initialStateGetter(), action = {} as RegionActions): IRegionState => {
  switch (action.type) {
    case REGIONTYPES.UPLOAD_FILE_REQUEST:
      return {
        ...state,
        uploading: true
      };
    case REGIONTYPES.UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        uploading: false,
        file: action.payload,
        error: null
      };
    case REGIONTYPES.UPLOAD_FILE_FAILURE:
      return {
        ...state,
        uploading: false,
        error: action.payload.error
      };
    case REGIONTYPES.DOWNLOAD_FILE_REQUEST:
      return {
        ...state,
        downloading: true
      };
    case REGIONTYPES.DOWNLOAD_FILE_SUCCESS:
      return {
        ...state,
        downloading: false,
        error: null
      };
    case REGIONTYPES.DOWNLOAD_FILE_FAILURE:
      return {
        ...state,
        downloading: false,
        error: action.payload.error
      };
    case REGIONTYPES.REGION_DETAILS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case REGIONTYPES.REGION_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        regionDetails: action.payload,
        error: null
      };
    case REGIONTYPES.REGION_DETAILS_FAILURE:
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

export default regionReducer;
