import regionReducer, { initialState } from '../reducer';
import * as REGION_TYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS, { MOCK_REGION_DETAIL } from '../../../tests/mockData/regionDataConstants';

describe('Region Reducer', () => {
  let mainInitialState: any;
  let mainExpectedState: any;
  beforeEach(() => {
    mainInitialState = initialState;
    mainExpectedState = initialState;
  });
  it('should handle fetch region detail request: FETCH_REGION_DETAIL_REQUEST', () => {
    const action: any = { type: REGION_TYPES.FETCH_REGION_DETAIL_REQUEST };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle create region request: CREATE_REGION_REQUEST', () => {
    const action: any = { type: REGION_TYPES.CREATE_REGION_REQUEST };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle deactivate region request: FETCH_CLIENT_REGISTRY_STATUS_REQUEST', () => {
    const action: any = { type: REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_REQUEST };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch cointry detail request: FETCH_COUNTRY_DETAILS_REQUEST', () => {
    const action: any = { type: REGION_TYPES.FETCH_COUNTRY_DETAILS_REQUEST };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTRY_DETAILS_SUCCESS', () => {
    const action: any = {
      type: REGION_TYPES.FETCH_COUNTRY_DETAILS_SUCCESS,
      payload: { list: MOCK_REGION_DETAIL.entityList, total: MOCK_REGION_DETAIL.totalCount, ...MOCK_REGION_DETAIL }
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      error: null,
      detail: action.payload
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle client registry status success: FETCH_CLIENT_REGISTRY_STATUS_SUCCESS', () => {
    const action: any = {
      type: REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_SUCCESS,
      payload: { isClientRegistryEnabled: true }
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      isClientRegistryEnabled: true
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle create region success: CREATE_REGION_SUCCESS', () => {
    const action: any = { type: REGION_TYPES.CREATE_REGION_SUCCESS };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      error: null
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle create region failure: CREATE_REGION_FAILURE', () => {
    const action: any = {
      type: REGION_TYPES.CREATE_REGION_FAILURE,
      error: 'Failed to create region'
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      error: 'Failed to create region'
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('deactivate region failure: FETCH_CLIENT_REGISTRY_STATUS_FAIL', () => {
    const action: any = {
      type: REGION_TYPES.FETCH_CLIENT_REGISTRY_STATUS_FAIL,
      error: 'Failed to fetch client registry'
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      error: 'Failed to fetch client registry'
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('clear client registry: CLEAR_CLIENT_REGISTRY_STATUS', () => {
    const action: any = {
      type: REGION_TYPES.CLEAR_CLIENT_REGISTRY_STATUS
    };
    const expectedState = {
      ...mainInitialState,
      isClientRegistryEnabled: undefined
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch regions failure: FETCH_REGIONS_FAILURE', () => {
    const error = 'Failed to fetch regions';
    const action: any = { type: REGION_TYPES.FETCH_REGIONS_FAILURE, error };
    mainExpectedState = {
      ...mainInitialState,
      loading: false,
      loadingMore: false,
      error,
      detail: {
        appTypes: [],
        id: '',
        name: '',
        list: [],
        tenantId: '',
        total: 0
      }
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch regions failure: FETCH_REGION_DETAIL_FAILURE', () => {
    const error = 'Failed to fetch region detail';
    const action: any = { type: REGION_TYPES.FETCH_REGION_DETAIL_FAILURE, error };
    mainExpectedState = {
      ...mainInitialState,
      loading: false,
      loadingMore: false,
      error,
      detail: {
        appTypes: [],
        id: '',
        name: '',
        list: [],
        tenantId: '',
        total: 0
      }
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle UPLOAD_FILE_REQUEST', () => {
    const uploadingInitialState: any = {
      uploading: false
    };
    const action: any = {
      type: REGION_TYPES.UPLOAD_FILE_REQUEST
    };
    const expectedState = {
      uploading: true
    };
    expect(regionReducer(uploadingInitialState, action)).toEqual(expectedState);
  });

  it('should handle fetch regions request', () => {
    const action: any = { type: REGION_TYPES.FETCH_REGIONS_REQUEST, isLoadMore: false };
    mainExpectedState = {
      ...mainInitialState,
      loading: true
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch regions success: FETCH_REGIONS_SUCCESS', () => {
    const payload = MOCK_DATA_CONSTANTS.FETCH_REGION_LIST_REPONSE;
    const action: any = { type: REGION_TYPES.FETCH_REGIONS_SUCCESS, payload };
    mainExpectedState = {
      ...mainInitialState,
      loading: false,
      loadingMore: false,
      regions: payload.isLoadMore ? [...mainInitialState.regions, ...payload.regions] : payload.regions,
      total: payload.total ? payload.total : mainInitialState.total,
      error: null
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle FETCH_REGION_DETAIL_SUCCESS', () => {
    const action: any = {
      type: REGION_TYPES.FETCH_REGION_DETAIL_SUCCESS,
      payload: { list: MOCK_REGION_DETAIL.entityList, total: MOCK_REGION_DETAIL.totalCount, ...MOCK_REGION_DETAIL }
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      error: null,
      detail: action.payload
    };
    expect(regionReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle clear region detail: CLEAR_REGION_DETAIL', () => {
    const action: any = { type: REGION_TYPES.CLEAR_REGION_DETAIL };
    const expectedState = {
      ...mainInitialState,
      detail: {
        appTypes: [],
        id: '',
        name: '',
        tenantId: '',
        list: [],
        total: 0
      }
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });
  it('set region detail: SET_REGION_DETAILS', () => {
    const data = { id: '1', tenantId: '1', name: 'Kenya', list: [], total: 0 };
    const action: any = {
      type: REGION_TYPES.SET_REGION_DETAILS,
      data
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      detail: {
        ...mainInitialState.detail,
        ...data
      }
    };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });
  it('should handle UPLOAD_FILE_SUCCESS', () => {
    const uploadingInitialState: any = {
      uploading: true,
      file: {}
    };
    const action: any = {
      type: REGION_TYPES.UPLOAD_FILE_SUCCESS,
      payload: {} as any
    };
    const expectedState = {
      uploading: false,
      error: null,
      file: {} as any
    };
    expect(regionReducer(uploadingInitialState, action)).toEqual(expectedState);
  });
  it('should handle UPLOAD_FILE_FAILURE', () => {
    const uploadingInitialState: any = {
      uploading: true,
      error: null
    };
    const action: any = {
      type: REGION_TYPES.UPLOAD_FILE_FAILURE,
      payload: { error: 'Upload failed' }
    };
    const expectedState = {
      uploading: false,
      error: action.payload.error
    };
    expect(regionReducer(uploadingInitialState, action)).toEqual(expectedState);
  });
  it('should handle DOWNLOAD_FILE_REQUEST', () => {
    const uploadingInitialState: any = {
      downloading: false
    };
    const action: any = {
      type: REGION_TYPES.DOWNLOAD_FILE_REQUEST
    };
    const expectedState = {
      downloading: true
    };
    expect(regionReducer(uploadingInitialState, action)).toEqual(expectedState);
  });
  it('should handle DOWNLOAD_FILE_SUCCESS', () => {
    const uploadingInitialState: any = {
      downloading: true,
      error: null
    };
    const action: any = {
      type: REGION_TYPES.DOWNLOAD_FILE_SUCCESS
    };
    const expectedState = {
      downloading: false,
      error: null
    };
    expect(regionReducer(uploadingInitialState, action)).toEqual(expectedState);
  });
  it('should handle DOWNLOAD_FILE_FAILURE', () => {
    const uploadingInitialState: any = {
      downloading: true
    };
    const action: any = {
      type: REGION_TYPES.DOWNLOAD_FILE_FAILURE,
      payload: { error: 'Download Failed' }
    };
    const expectedState = {
      downloading: false,
      error: action.payload.error
    };
    expect(regionReducer(uploadingInitialState, action)).toEqual(expectedState);
  });
  it('should handle default case', () => {
    const action: any = { type: 'UNKNOWN_ACTION_TYPE' };
    const newState = regionReducer(mainInitialState, action);
    expect(newState).toEqual(mainInitialState);
  });
});
