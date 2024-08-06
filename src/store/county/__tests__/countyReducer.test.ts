import countyReducer from '../reducer';
import * as types from '../actionTypes';

describe('countyReducer', () => {
  it('should handle loading actions as true', () => {
    const initialState: any = {
      loading: false
    };
    const loadingActions = [
      types.FETCH_COUNTY_LIST_REQUEST,
      types.FETCH_COUNTY_DETAIL_REQUEST,
      types.FETCH_CLINICAL_WORKFLOW_REQUEST,
      types.CREATE_COUNTY_REQUEST,
      types.UPDATE_COUNTY_DETAIL_REQUEST,
      types.DELETE_COUNTY_ADMIN_REQUEST,
      types.ACTIVATE_COUNTY_REQUEST,
      types.DEACTIVATE_COUNTY_REQUEST,
      types.CREATE_COUNTY_ADMIN_REQUEST,
      types.UPDATE_COUNTY_ADMIN_REQUEST,
      types.CREATE_COUNTY_WORKFLOW_MODULE_REQUEST,
      types.UPDATE_COUNTY_WORKFLOW_MODULE_REQUEST,
      types.DELETE_COUNTY_WORKFLOW_MODULE_REQUEST
    ];
    loadingActions.forEach((actionType) => {
      const action: any = { type: actionType };
      const expectedState = {
        loading: true
      };
      expect(countyReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should handle loading actions as false with error null', () => {
    const initialState: any = {
      loading: false,
      error: null
    };
    const loadingActions = [
      types.CREATE_COUNTY_SUCCESS,
      types.CREATE_COUNTY_ADMIN_SUCCESS,
      types.UPDATE_COUNTY_ADMIN_SUCCESS,
      types.CREATE_COUNTY_ADMIN_FAIL,
      types.UPDATE_COUNTY_ADMIN_FAIL,
      types.DELETE_COUNTY_ADMIN_SUCCESS,
      types.DELETE_COUNTY_ADMIN_FAIL,
      types.ACTIVATE_COUNTY_SUCCESS,
      types.ACTIVATE_COUNTY_FAIL,
      types.DEACTIVATE_COUNTY_SUCCESS,
      types.DEACTIVATE_COUNTY_FAIL,
      types.FETCH_CLINICAL_WORKFLOW_FAILURE,
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
      expect(countyReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should handle FETCH_COUNTY_SUCCESS', () => {
    const initialState: any = {
      loading: false,
      countyList: [],
      total: 0,
      error: null
    };
    const action: any = {
      type: types.FETCH_COUNTY_LIST_SUCCESS,
      payload: {
        countyList: [
          { id: 1, name: 'County 1' },
          { id: 2, name: 'County 2' }
        ],
        total: 2
      }
    };
    const expectedState = {
      loading: false,
      countyList: [
        { id: 1, name: 'County 1' },
        { id: 2, name: 'County 2' }
      ],
      total: 2,
      error: null
    };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_COUNTY', () => {
    const initialState: any = {
      loading: false,
      countyList: [],
      total: 0,
      error: null
    };
    const action: any = {
      type: types.CLEAR_COUNTY_LIST
    };
    const expectedState = {
      loading: false,
      countyList: [],
      total: 0,
      error: null
    };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_FAILURE', () => {
    const initialState: any = {
      loading: false,
      error: null
    };
    const error: any = 'Error fetching county';
    const loadingActions = [
      types.FETCH_COUNTY_LIST_FAILURE,
      types.CREATE_COUNTY_FAILURE,
      types.UPDATE_COUNTY_DETAIL_FAIL,
      types.CREATE_COUNTY_WORKFLOW_MODULE_FAILURE,
      types.UPDATE_COUNTY_WORKFLOW_MODULE_FAILURE,
      types.DELETE_COUNTY_WORKFLOW_MODULE_FAILURE
    ];
    loadingActions.forEach((actionType) => {
      const action: any = { type: actionType, error };
      const expectedState = {
        loading: false,
        error
      };
      expect(countyReducer(initialState, action)).toEqual(expectedState);
    });
  });

  it('should remove all county from state when removing deactivated county list', () => {
    const initialState: any = {
      loading: false,
      countyList: [
        { id: 1, name: 'County 1' },
        { id: 2, name: 'County 2' }
      ],
      error: null
    };
    const action: any = {
      type: types.REMOVE_DEACTIVATED_COUNTY_LIST
    };
    const expectedState = {
      loading: false,
      countyList: [],
      error: null
    };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_DETAIL_FAILURE', () => {
    const initialState: any = { loading: true, error: null, county: { id: 1, name: 'Test County' } };
    const action: any = { type: types.FETCH_COUNTY_DETAIL_FAILURE, error: 'Error fetching county details' };
    const expectedState = {
      loading: false,
      error: 'Error fetching county details',
      county: {
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

    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_DETAIL_SUCCESS', () => {
    const initialState: any = {
      county: {},
      total: 0,
      loading: false,
      error: null
    };
    const county = { id: 1, name: 'John Doe' };
    const action: any = {
      type: types.FETCH_COUNTY_DETAIL_SUCCESS,
      payload: county
    };
    const expectedState = {
      ...initialState,
      county,
      loading: false
    };
    const actualState = countyReducer(initialState, action);
    expect(actualState).toEqual(expectedState);
  });

  it('should handle SEACRH_COUNTY_USER_SUCCESS', () => {
    const initialState: any = {
      loading: true,
      county: {
        users: []
      }
    };
    const action: any = {
      type: types.SEACRH_COUNTY_USER_SUCCESS,
      payload: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ]
    };

    const expectedState = {
      loading: false,
      county: {
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ]
      }
    };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should set loading to true when isLoadMore is false', () => {
    const initialState: any = {
      loading: false,
      loadingMore: false
    };
    const action: any = {
      type: types.FETCH_COUNTY_DASHBOARD_LIST_REQUEST,
      payload: {
        isLoadMore: false
      }
    };
    const expectedState = {
      loading: true,
      loadingMore: false
    };
    const resultState = countyReducer(initialState, action);
    expect(resultState).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_DASHBOARD_LIST_SUCCESS when isLoadMore is false', () => {
    const initialState: any = {
      dashboardList: [],
      total: 0,
      loadingMore: false,
      loading: false
    };
    const action: any = {
      type: types.FETCH_COUNTY_DASHBOARD_LIST_SUCCESS,
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
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_DASHBOARD_LIST_SUCCESS when isLoadMore is true', () => {
    const initialState: any = {
      dashboardList: [{ id: 1, name: 'Dashboard 1' }],
      total: 1,
      loadingMore: false,
      loading: false
    };
    const action: any = {
      type: types.FETCH_COUNTY_DASHBOARD_LIST_SUCCESS,
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
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_DASHBOARD_LIST_SUCCESS when total is not provided', () => {
    const initialState: any = {
      dashboardList: [],
      total: 0,
      loadingMore: false,
      loading: false
    };
    const action: any = {
      type: types.FETCH_COUNTY_DASHBOARD_LIST_SUCCESS,
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
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_DASHBOARD_LIST_FAIL', () => {
    const initialState: any = {
      loadingMore: true,
      loading: false,
      dashboardList: [{ id: 1, name: 'Dashboard 1' }]
    };
    const action: any = {
      type: types.FETCH_COUNTY_DASHBOARD_LIST_FAIL
    };
    const expectedState = {
      loadingMore: false,
      loading: false,
      dashboardList: []
    };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_COUNTY_DETAIL_SUCCESS', () => {
    const initialState: any = {
      loading: true,
      county: {
        id: 1,
        name: 'County 1',
        email: 'county1@example.com'
      }
    };
    const action: any = {
      type: types.UPDATE_COUNTY_DETAIL_SUCCESS,
      data: {
        name: 'Updated County 1',
        phone: '1234567890'
      }
    };
    const expectedState = {
      loading: false,
      county: {
        id: 1,
        name: 'Updated County 1',
        email: 'county1@example.com',
        phone: '1234567890'
      }
    };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_OPTIONS_REQUEST', () => {
    const initialState: any = {
      countyOptions: null,
      loadingOptions: false
    };
    const action: any = { type: types.FETCH_COUNTY_OPTIONS_REQUEST };
    const expectedState = { ...initialState, loadingOptions: true };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_OPTIONS_SUCCESS', () => {
    const initialState: any = {
      countyOptions: null,
      loadingOptions: false
    };
    const data = {
      option1: 'option1',
      option2: 'option2'
    };
    const action: any = {
      type: types.FETCH_COUNTY_OPTIONS_SUCCESS,
      payload: data
    };
    const expectedState = { ...initialState, countyOptions: data, loadingOptions: false };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTY_OPTIONS_FAILURE', () => {
    const initialState: any = { loadingOptions: true };
    const action: any = { type: types.FETCH_COUNTY_OPTIONS_FAILURE };
    const expectedState = { loadingOptions: false };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_COUNTY_ADMIN', () => {
    const initialState: any = { admins: [{ id: 1, name: 'John Doe' }], total: 1 };
    const action: any = { type: types.CLEAR_COUNTY_ADMIN };
    const expectedState = { admins: [], total: 0 };
    expect(countyReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CLINICAL_WORKFLOW_SUCCESS', () => {
    const initialState: any = {
      clinicalWorkflows: [],
      clinicalWorkflowsCount: 0,
      loading: false
    };
    const data = {
      data: [
        { id: 1, name: 'Workflow 1' },
        { id: 2, name: 'Workflow 2' }
      ],
      total: 2
    };
    const action: any = { type: types.FETCH_CLINICAL_WORKFLOW_SUCCESS, payload: data };
    const state = countyReducer(initialState, action);

    expect(state.clinicalWorkflows).toEqual(data.data);
    expect(state.clinicalWorkflowsCount).toEqual(data.total);
    expect(state.loading).toEqual(false);
  });

  it('should handle RESET_CLINICAL_WORKFLOW_REQUEST', () => {
    const initialState: any = {
      clinicalWorkflows: [],
      clinicalWorkflowsCount: 0,
      loading: false
    };
    const action: any = { type: types.RESET_CLINICAL_WORKFLOW_REQUEST };
    const state = countyReducer(initialState, action);

    expect(state.clinicalWorkflows).toEqual([]);
    expect(state.clinicalWorkflowsCount).toEqual(0);
  });
});
