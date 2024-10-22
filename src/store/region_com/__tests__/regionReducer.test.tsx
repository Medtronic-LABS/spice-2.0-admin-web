import regionReducer from '../reducer';
import * as REGIONTYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/regionDataConstants';

describe('regionReducer', () => {
  it('should handle UPLOAD_FILE_REQUEST', () => {
    const initialState: any = {
      uploading: false
    };
    const action: any = {
      type: REGIONTYPES.UPLOAD_FILE_REQUEST_COM
    };
    const expectedState = {
      uploading: true
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPLOAD_FILE_SUCCESS', () => {
    const initialState: any = {
      uploading: true,
      file: {}
    };
    const action: any = {
      type: REGIONTYPES.UPLOAD_FILE_SUCCESS_COM,
      payload: {} as any
    };
    const expectedState = {
      uploading: false,
      error: null,
      file: {} as any
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPLOAD_FILE_FAILURE', () => {
    const initialState: any = {
      uploading: true,
      error: null
    };
    const action: any = {
      type: REGIONTYPES.UPLOAD_FILE_FAILURE_COM,
      payload: { error: 'Upload failed' }
    };
    const expectedState = {
      uploading: false,
      error: action.payload.error
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DOWNLOAD_FILE_REQUEST', () => {
    const initialState: any = {
      downloading: false
    };
    const action: any = {
      type: REGIONTYPES.DOWNLOAD_FILE_REQUEST_COM
    };
    const expectedState = {
      downloading: true
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DOWNLOAD_FILE_SUCCESS', () => {
    const initialState: any = {
      downloading: true,
      error: null
    };
    const action: any = {
      type: REGIONTYPES.DOWNLOAD_FILE_SUCCESS_COM
    };
    const expectedState = {
      downloading: false,
      error: null
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DOWNLOAD_FILE_FAILURE', () => {
    const initialState: any = {
      downloading: true
    };
    const action: any = {
      type: REGIONTYPES.DOWNLOAD_FILE_FAILURE_COM,
      payload: { error: 'Download Failed' }
    };
    const expectedState = {
      downloading: false,
      error: action.payload.error
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle REGION_DETAILS_REQUEST', () => {
    const initialState: any = {
      loading: false
    };
    const action: any = {
      type: REGIONTYPES.REGION_DETAILS_REQUEST_COM
    };
    const expectedState = {
      loading: true
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle REGION_DETAILS_SUCCESS', () => {
    const initialState: any = {
      loading: true,
      error: null,
      regionDetails: { list: [], total: 0 }
    };
    const action: any = {
      type: REGIONTYPES.REGION_DETAILS_SUCCESS_COM,
      payload: MOCK_DATA_CONSTANTS.REGION_DETAILS_RESPONSE_PAYLOAD
    };
    const expectedState = {
      loading: false,
      error: null,
      regionDetails: action.payload
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle REGION_DETAILS_FAILURE', () => {
    const initialState: any = {
      loading: true,
      error: null
    };
    const action: any = {
      type: REGIONTYPES.REGION_DETAILS_FAILURE_COM,
      payload: { error: 'Fetching Region details failed' }
    };
    const expectedState = {
      loading: false,
      error: action.payload.error
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });
});
