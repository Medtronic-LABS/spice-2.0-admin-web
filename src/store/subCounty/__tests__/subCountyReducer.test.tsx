import subCountyReducer, { initialState } from '../reducer';
import * as ACTION_TYPES from '../actionTypes';

describe('subCountyReducer', () => {
  let mainInitialState: any;
  let mainExpectedState: any;
  beforeEach(() => {
    mainInitialState = initialState;
    mainExpectedState = initialState;
  });

  it('should handle FETCH_SUB_COUNTY_DASHBOARD_LIST_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_REQUEST,
      isLoadMore: false
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_SUB_COUNTY_DASHBOARD_LIST_SUCCESS', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: false,
        subCountyDashboardList: [],
        total: 0
      }
    };
    const expectedState = {
      ...mainInitialState,
      subCountyDashboardList: [],
      total: 0
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_SUB_COUNTY_DASHBOARD_LIST_SUCCESS with loading more', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: true,
        subCountyDashboardList: [
          {
            id: '2',
            name: 'sub county 2'
          }
        ],
        total: 1
      }
    };
    const expectedState = {
      ...mainInitialState,
      subCountyDashboardList: [
        {
          id: '2',
          name: 'sub county 2'
        }
      ],
      total: 0
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_SUB_COUNTY_DASHBOARD_LIST_FAILURE', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_FAILURE
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      loadingMore: false
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_SUB_COUNTY_LIST_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_LIST_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_SUB_COUNTY_DETAIL_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should habdle FETCH_SUB_COUNTY_DETAIL_SUCCESS', () => {
    const payload = {
      subCountyDetail: {
        id: '1',
        name: 'sub county 1'
      },
      loading: false
    };
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_SUCCESS,
      payload: {
        ...payload,
        subCountyAdmins: [
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
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_SUB_COUNTY_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.CREATE_SUB_COUNTY_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_SUB_COUNTY_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.UPDATE_SUB_COUNTY_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_SUB_COUNTY_ADMIN_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_SUB_COUNTY_ADMIN_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_SUB_COUNTY_ADMIN_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_SUB_COUNTY_BY_ID_REQUEST', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_REQUEST
    };
    const expectedState = {
      ...mainInitialState,
      loading: true
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_SUB_COUNTY_DETAIL_FAILURE', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_FAILURE,
      error: 'Failed to fetch sub county detail'
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      error: action.error,
      subCountyDetail: mainInitialState.subCountyDetail
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle SEARCH_SUB_COUNTY_USER_SUCCESS', () => {
    const action: any = {
      type: ACTION_TYPES.SEARCH_SUB_COUNTY_USER_SUCCESS,
      payload: ['admin1', 'admin2']
    };
    const expectedState = {
      ...mainInitialState,
      loading: false,
      admins: action.payload
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_SUB_COUNTY_LIST_SUCCESS', () => {
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_LIST_SUCCESS,
      payload: {
        subCountyList: ['ou1', 'ou2'],
        total: 2
      }
    };
    const expectedState = {
      ...mainInitialState,
      subCountyList: action.payload.subCountyList,
      listTotal: action.payload.total,
      loading: false
    };
    expect(subCountyReducer(mainInitialState, action)).toEqual(expectedState);
  });

  it('should clear sub county list', () => {
    const action: any = { type: ACTION_TYPES.CLEAR_SUB_COUNTY_LIST };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should update sub county detail', () => {
    const payload = {
      id: '123',
      name: 'Updated Sub County'
    };
    const action: any = {
      type: ACTION_TYPES.UPDATE_SUB_COUNTY_SUCCESS,
      payload
    };

    const expectedState = {
      ...mainExpectedState,
      subCountyDetail: {
        ...mainExpectedState.subCountyDetail,
        id: '123',
        name: 'Updated Sub County'
      }
    };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle update sub county admin success', () => {
    const action: any = { type: ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_SUCCESS };
    const expectedState = {
      loading: false,
      ...mainExpectedState
    };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch sub county list failure', () => {
    const action: any = { type: ACTION_TYPES.FETCH_SUB_COUNTY_LIST_FAILURE };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch sub county list success', () => {
    const action: any = { type: ACTION_TYPES.CREATE_SUB_COUNTY_SUCCESS };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch sub county list failure', () => {
    const action: any = { type: ACTION_TYPES.CREATE_SUB_COUNTY_FAILURE };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch sub county list failure', () => {
    const action: any = { type: ACTION_TYPES.UPDATE_SUB_COUNTY_FAILURE };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch sub county list failure', () => {
    const action: any = { type: ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_FAILURE };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch sub county list success', () => {
    const action: any = { type: ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_SUCCESS };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch sub county list failure', () => {
    const action: any = { type: ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_FAILURE };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch sub county list success', () => {
    const action: any = { type: ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_SUCCESS };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch sub county list failure', () => {
    const action: any = { type: ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_FAILURE };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });
  it('should handle fetch sub county list success', () => {
    const action: any = { type: ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_SUCCESS };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle fetch sub county list failure', () => {
    const action: any = { type: ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_FAILURE };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle clear sub county admin list', () => {
    const action: any = { type: ACTION_TYPES.CLEAR_SUB_COUNTY_ADMIN_LIST };
    const newState = subCountyReducer(mainInitialState, action);
    expect(newState).toEqual(mainExpectedState);
  });

  it('should handle clear sub county detail', () => {
    const localInitialState: any = {
      subCountyDetail: {
        id: '1',
        name: 'Sub County 1',
        tenantId: 'tenant1',
        countryId: 'county1',
        countyName: 'County 1',
        county: {
          id: 'account1',
          name: 'Account 1',
          tenantId: '123'
        }
      },
      admins: ['admin1', 'admin2']
    };
    const action: any = { type: ACTION_TYPES.CLEAR_SUB_COUNTY_DETAIL };
    const expectedState = {
      subCountyDetail: {
        id: '',
        name: '',
        tenantId: '',
        countryId: '',
        countyName: '',
        county: {
          id: '',
          name: '',
          tenantId: ''
        }
      },
      admins: []
    };
    const newState = subCountyReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle set sub county details', () => {
    const localInitialState: any = {
      subCountyDetail: {
        id: '1',
        name: 'Sub County 1',
        tenantId: 'tenant1',
        account: {
          id: 'account1',
          name: 'Account 1'
        },
        county: {
          id: 'county1',
          name: 'County 1'
        }
      }
    };
    const action: any = {
      type: ACTION_TYPES.SET_SUB_COUNTY_DETAILS,
      data: {
        name: 'Updated Sub County',
        account: {
          id: 'account1',
          name: 'Updated Account'
        }
      }
    };

    const expectedState = {
      subCountyDetail: {
        id: '1',
        name: 'Updated Sub County',
        tenantId: 'tenant1',
        account: {
          id: 'account1',
          name: 'Updated Account'
        },
        county: {
          id: 'county1',
          name: 'County 1'
        }
      }
    };
    const newState = subCountyReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch sub county dropdown request', () => {
    const localInitialState: any = {
      dropdownSubCountyList: ['option1', 'option2'],
      dropdownSubCountyListLoading: false
    };
    const action: any = { type: ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_REQUEST };
    const expectedState = {
      dropdownSubCountyList: [],
      dropdownSubCountyListLoading: true
    };
    const newState = subCountyReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch sub county dropdown success', () => {
    const localInitialState: any = {
      dropdownSubCountyList: [],
      dropdownSubCountyListLoading: true
    };
    const payload = {
      subCountyList: ['option1', 'option2']
    };
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_SUCCESS,
      payload
    };
    const expectedState = {
      dropdownSubCountyListLoading: false,
      dropdownSubCountyList: payload.subCountyList || []
    };
    const newState = subCountyReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle fetch sub county dropdown fail', () => {
    const localInitialState: any = {
      dropdownSubCountyList: [],
      dropdownSubCountyListLoading: true
    };
    const error = 'Failed to fetch sub county dropdown';
    const action: any = {
      type: ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_FAIL,
      error
    };
    const expectedState = {
      dropdownSubCountyList: [],
      dropdownSubCountyListLoading: false,
      error
    };
    const newState = subCountyReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle clear dropdown values', () => {
    const localInitialState: any = {
      dropdownSubCountyList: ['option1', 'option2'],
      dropdownSubCountyListLoading: true
    };
    const action: any = { type: ACTION_TYPES.CLEAR_DROPDOWN_VALUES };
    const expectedState = {
      dropdownSubCountyListLoading: false,
      dropdownSubCountyList: []
    };
    const newState = subCountyReducer(localInitialState, action);
    expect(newState).toEqual(expectedState);
  });
});
