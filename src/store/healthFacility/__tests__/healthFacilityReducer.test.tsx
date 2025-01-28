import healthFacilityReducer from '../reducer';
import * as actionTypes from '../actionTypes';
import * as MOCK_DATA from '../../../tests/mockData/healthFacilityConstants';
import { initialState } from '../reducer';

describe('healthFacilityReducer', () => {
  it('should handle FETCH_HF_DASHBOARD_LIST_REQUEST with loadMore true', () => {
    const action: any = {
      type: actionTypes.FETCH_HF_DASHBOARD_LIST_REQUEST,
      isLoadMore: true
    };
    const expectedState = {
      ...initialState,
      loadingMore: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_HF_DASHBOARD_LIST_REQUEST with loadMore false', () => {
    const action: any = {
      type: actionTypes.FETCH_HF_DASHBOARD_LIST_REQUEST,
      isLoadMore: false
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_HF_DASHBOARD_LIST_SUCCESS with loadMore false', () => {
    const action: any = {
      type: actionTypes.FETCH_HF_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: false,
        total: MOCK_DATA.HF_DASHBOARD_LIST.length,
        siteDashboardList: MOCK_DATA.HF_DASHBOARD_LIST
      }
    };
    const expectedState = {
      ...initialState,
      loading: false,
      loadingMore: false,
      hfDashboardList: MOCK_DATA.HF_DASHBOARD_LIST,
      hfTotal: MOCK_DATA.HF_DASHBOARD_LIST.length
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_HF_DASHBOARD_LIST_SUCCESS with loadMore true', () => {
    const action: any = {
      type: actionTypes.FETCH_HF_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: true,
        total: MOCK_DATA.HF_DASHBOARD_LIST.length,
        siteDashboardList: MOCK_DATA.HF_DASHBOARD_LIST
      }
    };
    const expectedState = {
      ...initialState,
      loading: false,
      loadingMore: false,
      hfDashboardList: [...initialState.hfDashboardList, ...MOCK_DATA.HF_DASHBOARD_LIST],
      hfTotal: initialState.hfTotal
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_HEALTH_FACILITY_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_LIST_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_LIST_SUCCESS,
      payload: { healthFacilityList: MOCK_DATA.HF_LIST, total: MOCK_DATA.HF_LIST.length }
    };
    const expectedState = {
      ...initialState,
      loading: false,
      hfTotal: action.payload.total,
      healthFacilityList: action.payload.healthFacilityList
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_LIST_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_LIST_FAILURE,
      error: 'Failed to fetch health facility'
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_HEALTH_FACILITY_LIST', () => {
    const action: any = {
      type: actionTypes.CLEAR_HEALTH_FACILITY_LIST
    };
    const expectedState = {
      ...initialState,
      healthFacilityList: [],
      hfTotal: 0
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_HEALTH_FACILITY_REQUEST', () => {
    const action: any = {
      type: actionTypes.CREATE_HEALTH_FACILITY_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_HEALTH_FACILITY_SUCCESS', () => {
    const action: any = {
      type: actionTypes.CREATE_HEALTH_FACILITY_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_HEALTH_FACILITY_FAILURE', () => {
    const action: any = {
      type: actionTypes.CREATE_HEALTH_FACILITY_FAILURE,
      error: 'Failed to create health facility'
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_HEALTH_FACILITY_REQUEST', () => {
    const action: any = {
      type: actionTypes.DELETE_HEALTH_FACILITY_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_HEALTH_FACILITY_SUCCESS', () => {
    const action: any = {
      type: actionTypes.DELETE_HEALTH_FACILITY_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle LINKED_RESTRICTIONS_VALIDATION_SUCCESS', () => {
    const action: any = {
      type: actionTypes.LINKED_RESTRICTIONS_VALIDATION_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle LINKED_RESTRICTIONS_VALIDATION_FAILURE', () => {
    const action: any = {
      type: actionTypes.LINKED_RESTRICTIONS_VALIDATION_FAILURE
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_HEALTH_FACILITY_FAILURE', () => {
    const action: any = {
      type: actionTypes.DELETE_HEALTH_FACILITY_FAILURE,
      error: 'Failed to delete health facility'
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_TYPES_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_TYPES_REQUEST
    };
    const expectedState = {
      ...initialState,
      hfTypesLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_TYPES_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_TYPES_SUCCESS,
      payload: MOCK_DATA.HF_TYPES
    };
    const expectedState = {
      ...initialState,
      hfTypesLoading: false,
      hfTypes: action.payload
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_TYPES_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_TYPES_FAILURE
    };
    const expectedState = {
      ...initialState,
      hfTypesLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_HEALTH_FACILITY_DETAILS_REQUEST', () => {
    const action: any = {
      type: actionTypes.UPDATE_HEALTH_FACILITY_DETAILS_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_HEALTH_FACILITY_DETAILS_SUCCESS', () => {
    const action: any = {
      type: actionTypes.UPDATE_HEALTH_FACILITY_DETAILS_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_HEALTH_FACILITY_DETAILS_FAILURE', () => {
    const action: any = {
      type: actionTypes.UPDATE_HEALTH_FACILITY_DETAILS_FAILURE,
      error: 'Failed to update health facility details'
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_USER_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_USER_LIST_REQUEST
    };
    const expectedState = {
      ...initialState,
      hfUsersLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_USER_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_USER_LIST_SUCCESS,
      payload: { users: MOCK_DATA.HF_USERS, total: MOCK_DATA.HF_USERS.length }
    };
    const expectedState = {
      ...initialState,
      hfUsersLoading: false,
      hfUsersTotal: action.payload.total,
      healthFacilityUserList: action.payload.users
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_USER_LIST_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_USER_LIST_FAILURE,
      error: 'Failed to fetch health facility user list'
    };
    const expectedState = {
      ...initialState,
      hfUsersLoading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST
    };
    const expectedState = {
      ...initialState,
      hfUserDetailLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_USER_DETAIL_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_USER_DETAIL_SUCCESS,
      payload: MOCK_DATA.HF_USER
    };
    const expectedState = {
      ...initialState,
      hfUserDetailLoading: false,
      hfUser: action.payload
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_USER_DETAIL_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_USER_DETAIL_FAILURE,
      error: 'Failed to fetch health facility user details'
    };
    const expectedState = {
      ...initialState,
      hfUserDetailLoading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_HEALTH_FACILITY_USER_REQUEST', () => {
    const action: any = {
      type: actionTypes.DELETE_HEALTH_FACILITY_USER_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_HEALTH_FACILITY_USER_SUCCESS', () => {
    const action: any = {
      type: actionTypes.DELETE_HEALTH_FACILITY_USER_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_HEALTH_FACILITY_USER_FAILURE', () => {
    const action: any = {
      type: actionTypes.DELETE_HEALTH_FACILITY_USER_FAILURE,
      error: 'Failed to delete health facility user'
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_HEALTH_FACILITY_USER_REQUEST', () => {
    const action: any = {
      type: actionTypes.CREATE_HEALTH_FACILITY_USER_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_HEALTH_FACILITY_USER_SUCCESS', () => {
    const action: any = {
      type: actionTypes.CREATE_HEALTH_FACILITY_USER_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CREATE_HEALTH_FACILITY_USER_FAILURE', () => {
    const action: any = {
      type: actionTypes.CREATE_HEALTH_FACILITY_USER_FAILURE,
      error: 'Failed to create health facility user'
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_HEALTH_FACILITY_USER_REQUEST', () => {
    const action: any = {
      type: actionTypes.UPDATE_HEALTH_FACILITY_USER_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_HEALTH_FACILITY_USER_SUCCESS', () => {
    const action: any = {
      type: actionTypes.UPDATE_HEALTH_FACILITY_USER_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_HEALTH_FACILITY_USER_FAILURE', () => {
    const action: any = {
      type: actionTypes.UPDATE_HEALTH_FACILITY_USER_FAILURE,
      error: 'Failed to update health facility user'
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_SUMMARY_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_SUMMARY_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_SUMMARY_SUCCESS,
      payload: MOCK_DATA.HF_SUMMARY
    };
    const expectedState = {
      ...initialState,
      loading: false,
      healthFacility: action.payload
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_HEALTH_FACILITY_SUMMARY_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_SUMMARY_FAILURE,
      error: 'Failed to create health facility summary'
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: action.error
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF
    };
    const expectedState = {
      ...initialState,
      chiefdomLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_CHIEFDOM_LIST_SUCCESS_FOR_HF,
      payload: { list: MOCK_DATA.CHIEF_DOM_LIST, total: MOCK_DATA.CHIEF_DOM_LIST.length }
    };
    const expectedState = {
      ...initialState,
      chiefdomLoading: false,
      chiefdomList: action.payload.list,
      chiefdomTotal: action.payload.total
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CHIEFDOM_LIST_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_CHIEFDOM_LIST_FAILURE_FOR_HF
    };
    const expectedState = {
      ...initialState,
      chiefdomLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_DISTRICT_LIST_REQUEST_FOR_HF
    };
    const expectedState = {
      ...initialState,
      districtLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_DISTRICT_LIST_SUCCESS_FOR_HF,
      payload: { list: MOCK_DATA.DISTRICT_LIST, total: MOCK_DATA.DISTRICT_LIST.length }
    };
    const expectedState = {
      ...initialState,
      districtLoading: false,
      districtList: action.payload.list,
      districtTotal: action.payload.total
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_DISTRICT_LIST_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_DISTRICT_LIST_FAILURE_FOR_HF
    };
    const expectedState = {
      ...initialState,
      districtLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_VILLAGES_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_VILLAGES_LIST_REQUEST_FOR_HF
    };
    const expectedState = {
      ...initialState,
      villagesLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_VILLAGES_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_VILLAGES_LIST_SUCCESS_FOR_HF,
      payload: { list: MOCK_DATA.VILLAGES_LIST, total: MOCK_DATA.VILLAGES_LIST.length }
    };
    const expectedState = {
      ...initialState,
      villagesLoading: false,
      villagesList: action.payload.list,
      villagesTotal: action.payload.total
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_VILLAGES_LIST_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_VILLAGES_LIST_FAILURE_FOR_HF
    };
    const expectedState = {
      ...initialState,
      villagesLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_VILLAGES_LIST_FROM_HF_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_VILLAGES_LIST_FROM_HF_REQUEST
    };
    const expectedState = {
      ...initialState,
      villagesFromHFLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_VILLAGES_LIST_FROM_HF_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_VILLAGES_LIST_FROM_HF_SUCCESS,
      payload: { data: MOCK_DATA.VILLAGES_LIST_FROM_HF }
    };
    const expectedState = {
      ...initialState,
      villagesFromHFLoading: false,
      villagesFromHFList: action.payload.data
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_VILLAGES_LIST_FROM_HF_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_VILLAGES_LIST_FROM_HF_FAILURE
    };
    const expectedState = {
      ...initialState,
      villagesFromHFLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_ALL_DEPENDENT_DATA', () => {
    const action: any = {
      type: actionTypes.CLEAR_ALL_DEPENDENT_DATA
    };
    const expectedState = {
      ...initialState,
      healthFacility: {},
      chiefdomList: [],
      villagesList: [],
      villagesFromHFList: { list: [], hfTenantIds: null }
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_HF_FORM_DATA', () => {
    const action: any = {
      type: actionTypes.CLEAR_HF_FORM_DATA
    };
    const expectedState = {
      ...initialState,
      chiefdomList: [],
      villagesList: [],
      villagesFromHFList: { list: [], hfTenantIds: null }
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_VILLAGES_LIST_FROM_HF', () => {
    const action: any = {
      type: actionTypes.CLEAR_VILLAGES_LIST_FROM_HF
    };
    const expectedState = {
      ...initialState,
      villagesFromHFList: { list: [], hfTenantIds: [] }
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_VILLAGES_LIST', () => {
    const action: any = {
      type: actionTypes.CLEAR_VILLAGES_LIST
    };
    const expectedState = {
      ...initialState,
      villagesList: []
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_PEER_SUPERVISOR_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_PEER_SUPERVISOR_LIST_REQUEST
    };
    const expectedState = {
      ...initialState,
      peerSupervisorLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_PEER_SUPERVISOR_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_PEER_SUPERVISOR_LIST_SUCCESS,
      payload: { data: MOCK_DATA.PEER_SUPERVISOR, total: MOCK_DATA.PEER_SUPERVISOR.list.length }
    };
    const expectedState = {
      ...initialState,
      peerSupervisorLoading: false,
      peerSupervisorList: action.payload.data,
      peerSupervisorTotal: action.payload.total
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_PEER_SUPERVISOR_LIST_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_PEER_SUPERVISOR_LIST_FAILURE
    };
    const expectedState = {
      ...initialState,
      peerSupervisorLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_PEER_SUPERVISOR_LIST', () => {
    const action: any = {
      type: actionTypes.CLEAR_PEER_SUPERVISOR_LIST
    };
    const expectedState = {
      ...initialState,
      peerSupervisorList: { list: [], hfTenantIds: [] },
      peerSupervisorTotal: 0
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_HEALTH_FACILITY_DETAIL', () => {
    const action: any = {
      type: actionTypes.CLEAR_HEALTH_FACILITY_DETAIL
    };
    const expectedState = {
      ...initialState,
      healthFacility: initialState.healthFacility
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_WORKFLOW_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_WORKFLOW_LIST_REQUEST
    };
    const expectedState = {
      ...initialState,
      clinicalWorkflowLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_WORKFLOW_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_WORKFLOW_LIST_SUCCESS,
      payload: { list: MOCK_DATA.WORKFLOW_LIST }
    };
    const expectedState = {
      ...initialState,
      clinicalWorkflowLoading: false,
      clinicalWorkflowList: action.payload.list
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_WORKFLOW_LIST_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_WORKFLOW_LIST_FAILURE
    };
    const expectedState = {
      ...initialState,
      clinicalWorkflowLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  // tslint:disable-next-line:no-empty
  it('should handle FETCH_PEER_SUPERVISOR_VALIDATION', () => {});

  it('should handle FETCH_CULTURE_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_CULTURE_LIST_REQUEST
    };
    const expectedState = {
      ...initialState,
      cultureListLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CULTURE_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_CULTURE_LIST_SUCCESS,
      payload: MOCK_DATA.CULTURE_LIST
    };
    const expectedState = {
      ...initialState,
      cultureListLoading: false,
      cultureList: action.payload
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_CULTURE_LIST_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_CULTURE_LIST_FAILURE
    };
    const expectedState = {
      ...initialState,
      cultureListLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTRY_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_COUNTRY_LIST_REQUEST
    };
    const expectedState = {
      ...initialState,
      countryListLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTRY_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_COUNTRY_LIST_SUCCESS,
      payload: MOCK_DATA.COUNTRY_LIST
    };
    const expectedState = {
      ...initialState,
      countryList: action.payload,
      countryListLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_COUNTRY_LIST_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_COUNTRY_LIST_FAILURE
    };
    const expectedState = {
      ...initialState,
      countryListLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_HF_SUMMARY', () => {
    const action: any = {
      type: actionTypes.SET_HF_SUMMARY,
      data: { id: 1, tenantId: 1 }
    };
    const expectedState = {
      ...initialState,
      healthFacility: { ...initialState.healthFacility, id: 1, tenantId: 1 },
      loading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_HEALTH_FACILITY_USER_CLEAR_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_HEALTH_FACILITY_USER_CLEAR_LIST_REQUEST
    };
    const expectedState = {
      ...initialState,
      hfTotal: 0,
      healthFacilityList: []
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_UNLINKED_VILLAGES_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_UNLINKED_VILLAGES_REQUEST
    };
    const expectedState = {
      ...initialState,
      unlinkedVillagesLoading: true
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_UNLINKED_VILLAGES_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_UNLINKED_VILLAGES_SUCCESS,
      payload: {
        list: [],
        total: 0
      }
    };
    const expectedState = {
      ...initialState,
      unlinkedVillagesLoading: false,
      unlinkedVillagesList: [],
      unlinkedVillagesTotal: 0
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_UNLINKED_VILLAGES_FAILURE', () => {
    const action: any = {
      type: actionTypes.FETCH_UNLINKED_VILLAGES_FAILURE
    };
    const expectedState = {
      ...initialState,
      unlinkedVillagesLoading: false
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle CLEAR_HF_DROPDOWN_OPTIONS', () => {
    const action: any = {
      type: actionTypes.CLEAR_HF_DROPDOWN_OPTIONS
    };
    const expectedState = {
      ...initialState,
      hfDropdownLoading: false,
      hfDropdownOptions: {
        list: [],
        regionTenantId: ''
      }
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle CLEAR_HF_WORKFLOW_LIST', () => {
    const action: any = {
      type: actionTypes.CLEAR_HF_WORKFLOW_LIST
    };
    const expectedState = {
      ...initialState,
      clinicalWorkflowList: []
    };
    expect(healthFacilityReducer(initialState, action)).toEqual(expectedState);
  });
});
