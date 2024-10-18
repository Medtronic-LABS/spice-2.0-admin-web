import chiefdomReducer, { initialState } from '../reducer';
import * as ACTION_TYPES from '../actionTypes';

describe('chiefdomReducer', () => {
  let mainInitialState: any;
  let mainExpectedState: any;
  beforeEach(() => {
    mainInitialState = initialState;
    mainExpectedState = initialState;
  });

  it('should handle FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST with loadMore false', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST,
      isLoadMore: false
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST with loadMore true', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST,
      isLoadMore: true
    };
    const expectedState = {
      ...mainInitialState,
      loadingMore: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_DASHBOARD_LIST_SUCCESS', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: false,
        chiefdomDashboardList: [],
        total: 0
      }
    };
    const expectedState = {
      ...mainInitialState,
      chiefdomDashboardList: [],
      total: 0
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_DASHBOARD_LIST_SUCCESS with loading more', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: true,
        chiefdomDashboardList: [
          {
            id: '2',
            name: 'chiefdom 2'
          }
        ],
        total: 1
      }
    };
    const expectedState = {
      ...mainInitialState,
      chiefdomDashboardList: [
        {
          id: '2',
          name: 'chiefdom 2'
        }
      ],
      total: 0
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_DASHBOARD_LIST_FAILURE', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_FAILURE
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      loadingMore: false
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_LIST_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_DETAIL_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should habdle FETCH_CHIEFDOM_DETAIL_SUCCESS', () => {
    const payload = {
      chiefdomDetail: {
        id: '1',
        name: 'chiefdom 1'
      },
      loading: false
    };
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_SUCCESS,
      payload: {
        ...payload,
        chiefdomAdmins: [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe'
          }
        ]
      }
    };
    const expectedState = {
      ...mainInitialState,
      ...payload,
      admins: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe'
        }
      ]
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_CHIEFDOM_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.CREATE_CHIEFDOM_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_CHIEFDOM_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.UPDATE_CHIEFDOM_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_CHIEFDOM_ADMIN_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_CHIEFDOM_ADMIN_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_CHIEFDOM_ADMIN_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_BY_ID_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_DETAIL_FAILURE', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_FAILURE,
      error: 'Failed to fetch chiefdom detail'
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      error: action.error,
      chiefdomDetail: mainInitialState.chiefdomDetail
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle SEARCH_CHIEFDOM_USER_SUCCESS', () => {
    const action: any = {
      type: ACTION_TYPES.SEARCH_CHIEFDOM_USER_SUCCESS,
      payload: ['admin1', 'admin2']
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      admins: action.payload
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_LIST_SUCCESS', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_SUCCESS,
      payload: {
        chiefdomList: ['ou1', 'ou2'],
        total: 2
      }
    };
    const expectedState = {
      ...mainInitialState,
      chiefdomList: action.payload.chiefdomList,
      listTotal: action.payload.total,
      loading: false
    };
    expect(chiefdomReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should clear chiefdom list', () => {
    const action: any = { type: ACTION_TYPES.CLEAR_CHIEFDOM_LIST };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should update chiefdom detail', () => {
    const payload = {
      id: '123',
      name: 'Updated Chiefdom'
    };
    const action: any = {
      type: ACTION_TYPES.UPDATE_CHIEFDOM_SUCCESS,
      payload
    };

    const expectedState = {
      ...mainExpectedState,
      chiefdomDetail: {
        ...mainExpectedState.chiefdomDetail,
        id: '123',
        name: 'Updated Chiefdom'
      }
    };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle update chiefdom admin success', () => {
    const action: any = { type: ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_SUCCESS };
    const expectedState = {
      loading: false,
      ...mainExpectedState
    };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch chiefdom list failure', () => {
    const action: any = { type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_FAILURE };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch chiefdom list success', () => {
    const action: any = { type: ACTION_TYPES.CREATE_CHIEFDOM_SUCCESS };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch chiefdom list failure', () => {
    const action: any = { type: ACTION_TYPES.CREATE_CHIEFDOM_FAILURE };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch chiefdom list failure', () => {
    const action: any = { type: ACTION_TYPES.UPDATE_CHIEFDOM_FAILURE };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch chiefdom list failure', () => {
    const action: any = { type: ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_FAILURE };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch chiefdom list success', () => {
    const action: any = { type: ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_SUCCESS };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch chiefdom list failure', () => {
    const action: any = { type: ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_FAILURE };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch chiefdom list success', () => {
    const action: any = { type: ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_SUCCESS };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch chiefdom list failure', () => {
    const action: any = { type: ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_FAILURE };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch chiefdom list success', () => {
    const action: any = { type: ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_SUCCESS };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch chiefdom list failure', () => {
    const action: any = { type: ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_FAILURE };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle clear chiefdom admin list', () => {
    const action: any = { type: ACTION_TYPES.CLEAR_CHIEFDOM_ADMIN_LIST };
    const newState = chiefdomReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle clear chiefdom detail', () => {
    const localInitialState: any = {
      chiefdomDetail: {
        id: '1',
        name: 'Chiefdom 1',
        tenantId: 'tenant1',
        countryId: 'district1',
        districtName: 'District 1',
        district: {
          id: 'district1',
          name: 'District 1',
          tenantId: '123'
        }
      },
      admins: ['admin1', 'admin2']
    };
    const action: any = { type: ACTION_TYPES.CLEAR_CHIEFDOM_DETAIL };
    const expectedState = {
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
      admins: []
    };
    const newState = chiefdomReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle set chiefdom details', () => {
    const localInitialState: any = {
      chiefdomDetail: {
        id: '1',
        name: 'Chiefdom 1',
        tenantId: 'tenant1',
        district: {
          id: 'district1',
          name: 'District 1'
        }
      }
    };
    const action: any = {
      type: ACTION_TYPES.SET_CHIEFDOM_DETAILS,
      data: {
        name: 'Updated Chiefdom',
        district: {
          id: 'district1',
          name: 'Updated District'
        }
      }
    };

    const expectedState = {
      chiefdomDetail: {
        id: '1',
        name: 'Updated Chiefdom',
        tenantId: 'tenant1',
        district: {
          id: 'district1',
          name: 'Updated District'
        }
      }
    };
    const newState = chiefdomReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch chiefdom dropdown request', () => {
    const localInitialState: any = {
      dropdownChiefdomList: ['option1', 'option2'],
      dropdownChiefdomListLoading: false
    };
    const action: any = { type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST };
    const expectedState = {
      dropdownChiefdomList: [],
      dropdownChiefdomListLoading: true
    };
    const newState = chiefdomReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch chiefdom dropdown success', () => {
    const localInitialState: any = {
      dropdownChiefdomList: [],
      dropdownChiefdomListLoading: true
    };
    const payload = {
      chiefdomList: ['option1', 'option2']
    };
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_SUCCESS,
      payload
    };
    const expectedState = {
      dropdownChiefdomListLoading: false,
      dropdownChiefdomList: payload.chiefdomList || []
    };
    const newState = chiefdomReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch chiefdom dropdown fail', () => {
    const localInitialState: any = {
      dropdownChiefdomList: [],
      dropdownChiefdomListLoading: true
    };
    const error = 'Failed to fetch chiefdom dropdown';
    const action: any = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_FAIL,
      error
    };
    const expectedState = {
      dropdownChiefdomList: [],
      dropdownChiefdomListLoading: false,
      error
    };
    const newState = chiefdomReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle clear dropdown values', () => {
    const localInitialState: any = {
      dropdownChiefdomList: ['option1', 'option2'],
      dropdownChiefdomListLoading: true
    };
    const action: any = { type: ACTION_TYPES.CLEAR_DROPDOWN_VALUES };
    const expectedState = {
      dropdownChiefdomListLoading: false,
      dropdownChiefdomList: []
    };
    const newState = chiefdomReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });
});
