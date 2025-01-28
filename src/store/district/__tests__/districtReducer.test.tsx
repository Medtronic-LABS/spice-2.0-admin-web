import districtReducer from '../reducer';
import * as types from '../actionTypes';

describe('districtReducer', () => {
  it('should handle loading actions as true', () => {
    const initialState: any = {
      loading: false
    };
    const loadingActions = [
      types.FETCH_DISTRICT_LIST_REQUEST,
      types.FETCH_DISTRICT_DETAIL_REQUEST,
      types.CREATE_DISTRICT_REQUEST,
      types.UPDATE_DISTRICT_DETAIL_REQUEST,
      types.DELETE_DISTRICT_ADMIN_REQUEST,
      types.ACTIVATE_ACCOUNT_REQUEST,
      types.DEACTIVATE_DISTRICT_REQUEST,
      types.CREATE_DISTRICT_ADMIN_REQUEST,
      types.UPDATE_DISTRICT_ADMIN_REQUEST
    ];
    loadingActions.forEach((actionType) => {
      const action: any = { type: actionType };
      const expectedState = {
        loading: true
      };
      expect(districtReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should handle loading actions as false with error null', () => {
    const initialState: any = {
      loading: false,
      error: null
    };
    const loadingActions = [
      types.CREATE_DISTRICT_SUCCESS,
      types.CREATE_DISTRICT_ADMIN_SUCCESS,
      types.UPDATE_DISTRICT_ADMIN_SUCCESS,
      types.CREATE_DISTRICT_ADMIN_FAIL,
      types.UPDATE_DISTRICT_ADMIN_FAIL,
      types.DELETE_DISTRICT_ADMIN_SUCCESS,
      types.DELETE_DISTRICT_ADMIN_FAIL,
      types.ACTIVATE_ACCOUNT_SUCCESS,
      types.ACTIVATE_ACCOUNT_FAIL,
      types.DEACTIVATE_DISTRICT_SUCCESS,
      types.DEACTIVATE_DISTRICT_FAIL,
      types.CREATE_COUNTY_WORKFLOW_MODULE_SUCCESS,
      types.UPDATE_COUNTY_WORKFLOW_MODULE_SUCCESS,
      types.DELETE_COUNTY_WORKFLOW_MODULE_SUCCESS
    ];
    loadingActions.forEach((actionType) => {
      const action: any = { type: actionType };
      const expectedState = {
        loading: false,
        error: null
      };
      expect(districtReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should handle all failures', () => {
    const initialState: any = {
      loading: false,
      error: null
    };
    const error: any = 'Error fetching district';
    const loadingActions = [
      types.FETCH_DISTRICT_LIST_FAILURE,
      types.CREATE_DISTRICT_FAILURE,
      types.UPDATE_DISTRICT_DETAIL_FAIL
    ];
    loadingActions.forEach((actionType) => {
      const action: any = { type: actionType, error };
      const expectedState = {
        loading: false,
        error
      };
      expect(districtReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should handle FETCH_DISTRICT_SUCCESS', () => {
    const initialState: any = {
      loading: false,
      districtList: [],
      total: 0,
      error: null
    };
    const action: any = {
      type: types.FETCH_DISTRICT_LIST_SUCCESS,
      payload: {
        districtList: [
          { id: 1, name: 'District 1' },
          { id: 2, name: 'District 2' }
        ],
        total: 2
      }
    };
    const expectedState = {
      loading: false,
      districtList: [
        { id: 1, name: 'District 1' },
        { id: 2, name: 'District 2' }
      ],
      total: 2,
      error: null
    };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_DISTRICT', () => {
    const initialState: any = {
      loading: false,
      districtList: [],
      total: 0,
      error: null
    };
    const action: any = {
      type: types.CLEAR_DISTRICT_LIST
    };
    const expectedState = {
      loading: false,
      districtList: [],
      total: 0,
      error: null
    };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should remove all district from state when removing deactivated district list', () => {
    const initialState: any = {
      loading: false,
      districtList: [
        { id: 1, name: 'District 1' },
        { id: 2, name: 'District 2' }
      ],
      error: null
    };
    const action: any = {
      type: types.REMOVE_DEACTIVATED_ACCOUNT_LIST
    };
    const expectedState = {
      loading: false,
      districtList: [],
      error: null
    };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_DETAIL_FAILURE', () => {
    const initialState: any = { loading: true, error: null, district: { id: 1, name: 'Test District' } };
    const action: any = { type: types.FETCH_DISTRICT_DETAIL_FAILURE, error: 'Error fetching district details' };
    const expectedState = {
      loading: false,
      error: 'Error fetching district details',
      district: {
        id: '',
        maxNoOfUsers: '',
        name: '',
        tenantId: '',
        updatedAt: '',
        users: [],
        country: {
          countryCode: '',
          tenantId: '',
          id: ''
        }
      }
    };

    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_DETAIL_SUCCESS', () => {
    const initialState: any = {
      district: {},
      total: 0,
      loading: false,
      error: null
    };
    const district = { id: 1, name: 'John Doe' };
    const action: any = {
      type: types.FETCH_DISTRICT_DETAIL_SUCCESS,
      payload: district
    };
    const expectedState = {
      ...initialState,
      district,
      loading: false
    };
    const actualState = districtReducer(initialState, action);
    expect(actualState).toEqual(expectedState);
  });

  it('should handle SEACRH_DISTRICT_USER_SUCCESS', () => {
    const initialState: any = {
      loading: true,
      district: {
        users: []
      }
    };
    const action: any = {
      type: types.SEACRH_DISTRICT_USER_SUCCESS,
      payload: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ]
    };

    const expectedState = {
      loading: false,
      district: {
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ]
      }
    };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should set loading to true when isLoadMore is false', () => {
    const initialState: any = {
      loading: false,
      loadingMore: false
    };
    const action: any = {
      type: types.FETCH_DISTRICT_DASHBOARD_LIST_REQUEST,
      payload: {
        isLoadMore: false
      }
    };
    const expectedState = {
      loading: true,
      loadingMore: false
    };
    const resultState = districtReducer(initialState, action);
    expect(resultState).toEqual(expectedState);
  });

  it('should set loading to true when isLoadMore is true', () => {
    const initialState: any = {
      loading: false,
      loadingMore: false
    };
    const action: any = {
      type: types.FETCH_DISTRICT_DASHBOARD_LIST_REQUEST,
      payload: {
        isLoadMore: true
      }
    };
    const expectedState = {
      loading: false,
      loadingMore: true
    };
    const resultState = districtReducer(initialState, action);
    expect(resultState).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_DASHBOARD_LIST_SUCCESS when isLoadMore is false', () => {
    const initialState: any = {
      dashboardList: [],
      total: 0,
      loadingMore: false,
      loading: false
    };
    const action: any = {
      type: types.FETCH_DISTRICT_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: false,
        data: [
          { id: 1, name: 'Dashboard 1' },
          { id: 2, name: 'Dashboard 2' }
        ],
        total: 2
      }
    };
    const expectedState = {
      dashboardList: [
        { id: 1, name: 'Dashboard 1' },
        { id: 2, name: 'Dashboard 2' }
      ],
      total: 2,
      loadingMore: false,
      loading: false
    };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_DASHBOARD_LIST_SUCCESS when isLoadMore is true', () => {
    const initialState: any = {
      dashboardList: [{ id: 1, name: 'Dashboard 1' }],
      total: 1,
      loadingMore: false,
      loading: false
    };
    const action: any = {
      type: types.FETCH_DISTRICT_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: true,
        data: [
          { id: 2, name: 'Dashboard 2' },
          { id: 3, name: 'Dashboard 3' }
        ],
        total: 3
      }
    };
    const expectedState = {
      dashboardList: [
        { id: 1, name: 'Dashboard 1' },
        { id: 2, name: 'Dashboard 2' },
        { id: 3, name: 'Dashboard 3' }
      ],
      total: 3,
      loadingMore: false,
      loading: false
    };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_DASHBOARD_LIST_SUCCESS when total is not provided', () => {
    const initialState: any = {
      dashboardList: [],
      total: 0,
      loadingMore: false,
      loading: false
    };
    const action: any = {
      type: types.FETCH_DISTRICT_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: false,
        data: [
          { id: 1, name: 'Dashboard 1' },
          { id: 2, name: 'Dashboard 2' }
        ]
      }
    };
    const expectedState = {
      dashboardList: [
        { id: 1, name: 'Dashboard 1' },
        { id: 2, name: 'Dashboard 2' }
      ],
      total: 0,
      loadingMore: false,
      loading: false
    };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_DASHBOARD_LIST_FAIL', () => {
    const initialState: any = {
      loadingMore: true,
      loading: false,
      dashboardList: [{ id: 1, name: 'Dashboard 1' }]
    };
    const action: any = {
      type: types.FETCH_DISTRICT_DASHBOARD_LIST_FAIL
    };
    const expectedState = {
      loadingMore: false,
      loading: false,
      dashboardList: []
    };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_DISTRICT_DETAIL_SUCCESS', () => {
    const initialState: any = {
      loading: true,
      district: {
        id: 1,
        name: 'District 1',
        email: 'district1@example.com'
      }
    };
    const action: any = {
      type: types.UPDATE_DISTRICT_DETAIL_SUCCESS,
      data: {
        name: 'Updated District 1',
        phone: '1234567890'
      }
    };
    const expectedState = {
      loading: false,
      district: {
        id: 1,
        name: 'Updated District 1',
        email: 'district1@example.com',
        phone: '1234567890'
      }
    };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_OPTIONS_REQUEST', () => {
    const initialState: any = {
      districtOptions: null,
      loadingOptions: false
    };
    const action: any = { type: types.FETCH_DISTRICT_OPTIONS_REQUEST };
    const expectedState = { ...initialState, loadingOptions: true };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_OPTIONS_SUCCESS', () => {
    const initialState: any = {
      districtOptions: null,
      loadingOptions: false
    };
    const data = {
      option1: 'option1',
      option2: 'option2'
    };
    const action: any = {
      type: types.FETCH_DISTRICT_OPTIONS_SUCCESS,
      payload: data
    };
    const expectedState = { ...initialState, districtOptions: data, loadingOptions: false };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_OPTIONS_FAILURE', () => {
    const initialState: any = { loadingOptions: true };
    const action: any = { type: types.FETCH_DISTRICT_OPTIONS_FAILURE };
    const expectedState = { loadingOptions: false };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_DISTRICT_ADMIN', () => {
    const initialState: any = { admins: [{ id: 1, name: 'John Doe' }], total: 1 };
    const action: any = { type: types.CLEAR_DISTRICT_ADMIN };
    const expectedState = { admins: [], total: 0 };
    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_DISTRICT_DETAILS', () => {
    const initialState: any = {
      district: {
        name: '',
        id: '',
        tenantId: '',
        maxNoOfUsers: '',
        users: [],
        updatedAt: '',
        country: {
          countryCode: '',
          tenantId: '',
          id: ''
        }
      }
    };
    const action: any = { type: types.CLEAR_DISTRICT_DETAILS };
    const state = districtReducer(initialState, action);

    expect(state.district).toEqual(initialState.district);
  });

  it('should handle SET_DISTRICT_DETAILS', () => {
    const initialState: any = {
      district: {
        name: '',
        id: '',
        tenantId: '',
        maxNoOfUsers: '',
        users: [],
        updatedAt: '',
        country: {
          countryCode: '',
          tenantId: '',
          id: ''
        }
      }
    };
    const data = {
      id: 10,
      tenantId: 10
    };
    const action: any = { type: types.SET_DISTRICT_DETAILS, data };
    const expectedState = {
      district: {
        name: '',
        id: 10,
        tenantId: 10,
        maxNoOfUsers: '',
        users: [],
        updatedAt: '',
        country: {
          countryCode: '',
          tenantId: '',
          id: ''
        }
      }
    };

    expect(districtReducer(initialState, action)).toEqual(expectedState);
  });
});
