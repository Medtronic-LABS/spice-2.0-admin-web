import commonReducer, { initialState } from '../reducer';
import * as COMMON_TYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/commonDataConstants';

describe('Common Reducer', () => {
  let mainInitialState: any;
  beforeEach(() => {
    mainInitialState = initialState;
  });
  it('should handle fetch region detail request: FETCH_SIDEMENU_REQUEST', () => {
    const action: any = { type: COMMON_TYPES.FETCH_SIDEMENU_REQUEST };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    const newState = commonReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch region detail request: SET_SIDEMENU', () => {
    const payload = {
      list: MOCK_DATA_CONSTANTS.MOCK_SIDEMENU
    };
    const action: any = { type: COMMON_TYPES.FETCH_SIDEMENU_SUCCESS, payload };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      error: null,
      sideMenu: payload
    };
    const newState = commonReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle create region failure: FETCH_SIDEMENU_FAILURE', () => {
    const action: any = {
      type: COMMON_TYPES.FETCH_SIDEMENU_FAILURE,
      error: 'Failed to fetch sidemenu'
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      error: 'Failed to fetch sidemenu'
    };
    const newState = commonReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });
  it('should handle fetch region detail request: CLEAR_SIDEMENU', () => {
    const action: any = { type: COMMON_TYPES.CLEAR_SIDEMENU };
    const expectedState = {
      ...mainInitialState
    };
    const newState = commonReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });
  it('should handle default case', () => {
    const action: any = { type: 'UNKNOWN_ACTION_TYPE' };
    const newState = commonReducer(mainInitialState, action);
    expect(newState).toEqual(mainInitialState);
  });
});
