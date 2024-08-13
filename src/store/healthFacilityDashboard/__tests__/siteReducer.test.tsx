import siteReducer from '../reducer';
import * as SITE_ACTION_TYPES from '../actionTypes';

describe('siteReducer', () => {
  let initialState: any;
  beforeEach(() => {
    initialState = {
      total: 0,
      site: {
        name: '',
        siteType: '',
        email: '',
        account: { id: '', name: '', email: '', tenantId: '' },
        mflCode: '',
        address1: '',
        address2: '',
        district: {
          id: '',
          name: ''
        },
        postalCode: '',
        phoneNumber: '',
        location: '',
        culture: {
          id: '',
          name: '',
          deleted: true,
          code: ''
        },
        addressUse: '',
        addressType: '',
        chiefdom: {
          id: '',
          name: ''
        },
        city: { label: '', value: { Latitude: 0, Longitude: 0 } },
        country: '',
        siteLevel: {
          label: '',
          value: ''
        },
        id: 0,
        tenantId: 0
      },
      siteList: [
        {
          id: 0,
          name: '',
          siteType: '',
          tenantId: 0,
          cultureName: '',
          siteLevel: '',
          chiefdomName: ''
        }
      ],
      siteDashboardList: [
        {
          id: 0,
          name: '',
          siteType: '',
          tenantId: 0,
          chiefdom: ''
        }
      ],
      siteUserList: [],
      loading: false,
      error: null,
      districtList: [],
      districtDropdownLoading: false,
      chiefdomList: [],
      chiefdomDropdownLoading: false,
      cultureList: [],
      cultureListLoading: false,
      loadingMore: false,
      siteDropdownLoading: false,
      siteDropdownOptions: {
        list: [],
        regionTenantId: ''
      }
    };
  });
  it('should return the initial state', () => {
    const action: any = {};
    const newState = siteReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
  it('should handle FETCH_SITE_DASHBOARD_LIST_REQUEST', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_DASHBOARD_LIST_REQUEST,
      isLoadMore: true
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loadingMore).toBe(true);
  });
  it('should handle FETCH_SITE_DASHBOARD_LIST_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_DASHBOARD_LIST_SUCCESS,
      payload: {
        isLoadMore: false,
        siteDashboardList: [{ id: 1, name: 'Site 1' }],
        total: 1
      }
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.loadingMore).toBe(false);
    expect(newState.siteDashboardList).toEqual([{ id: 1, name: 'Site 1' }]);
    expect(newState.total).toBe(1);
  });
  it('should handle FETCH_SITE_DASHBOARD_LIST_FAILURE', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_DASHBOARD_LIST_FAILURE
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.loadingMore).toBe(false);
  });
  it('should handle FETCH_SITE_LIST_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_LIST_SUCCESS,
      payload: {
        total: 2,
        sites: [
          { id: 1, name: 'Site 1' },
          { id: 2, name: 'Site 2' }
        ]
      }
    };
    const actionWithNull: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_LIST_SUCCESS,
      payload: {
        total: null,
        sites: null
      }
    };
    const newState = siteReducer(initialState, action);
    const newStateWithNull = siteReducer(initialState, actionWithNull);
    expect(newState.loading).toBe(false);
    expect(newState.total).toBe(2);
    expect(newState.siteList).toEqual([
      { id: 1, name: 'Site 1' },
      { id: 2, name: 'Site 2' }
    ]);
    expect(newStateWithNull.total).toBe(0);
    expect(newStateWithNull.siteList).toEqual([]);
  });

  it('should handle CLEAR_SITE_LIST', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.CLEAR_SITE_LIST
    };
    const newState = siteReducer(initialState, action);
    expect(newState.total).toBe(0);
    expect(newState.siteList).toEqual([]);
  });
  it('should handle FETCH_SITE_USER_LIST_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_USER_LIST_SUCCESS,
      payload: {
        total: 3,
        siteUsers: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' },
          { id: 3, name: 'User 3' }
        ]
      }
    };
    const actionWithNull: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_USER_LIST_SUCCESS,
      payload: {
        total: null,
        siteUsers: null
      }
    };
    const newState = siteReducer(initialState, action);
    const newStateWithNull = siteReducer(initialState, actionWithNull);
    expect(newState.loading).toBe(false);
    expect(newState.total).toBe(3);
    expect(newState.siteUserList).toEqual([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' }
    ]);
    expect(newStateWithNull.total).toBe(0);
    expect(newStateWithNull.siteUserList).toEqual([]);
  });
  it('should handle CLEAR_SITE_USER_LIST', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.CLEAR_SITE_USER_LIST
    };
    const newState = siteReducer(initialState, action);
    expect(newState.total).toBe(0);
    expect(newState.siteUserList).toEqual([]);
  });
  it('should handle FETCH_DISTRICT_DROPDOWN_SUCCESS', () => {
    const districtList = [
      { id: 1, name: 'District 1' },
      { id: 2, name: 'District 2' }
    ];
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_DISTRICT_DROPDOWN_SUCCESS,
      payload: {
        districtList
      }
    };
    const actionWithNull: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_USER_LIST_SUCCESS,
      payload: {
        districtList: null
      }
    };
    const newState = siteReducer(initialState, action);
    const newStateWithNull = siteReducer(initialState, actionWithNull);
    expect(newState.districtDropdownLoading).toBe(false);
    expect(newState.districtList).toEqual(districtList);
    expect(newStateWithNull.districtList).toEqual([]);
  });
  it('should handle FETCH_CHIEFDOM_DROPDOWN_SUCCESS', () => {
    const chiefdomList = [
      { id: 1, name: 'Chiefdom 1' },
      { id: 2, name: 'Chiefdom 2' }
    ];
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_SUCCESS,
      payload: {
        chiefdomList
      }
    };
    const actionWithNull: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_USER_LIST_SUCCESS,
      payload: {
        chiefdomList: null
      }
    };
    const newState = siteReducer(initialState, action);
    const newStateWithNull = siteReducer(initialState, actionWithNull);
    expect(newState.chiefdomDropdownLoading).toBe(false);
    expect(newState.chiefdomList).toEqual(chiefdomList);
    expect(newStateWithNull.chiefdomList).toEqual([]);
  });
  it('should handle FETCH_CULTURE_DROPDOWN_SUCCESS', () => {
    const cultureList = [
      { id: 1, name: 'Culture 1' },
      { id: 2, name: 'Culture 2' }
    ];
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_CULTURE_DROPDOWN_SUCCESS,
      payload: {
        cultureList
      }
    };
    const actionWithNull: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_USER_LIST_SUCCESS,
      payload: {
        cultureList: null
      }
    };
    const newState = siteReducer(initialState, action);
    const newStateWithNull = siteReducer(initialState, actionWithNull);
    expect(newState.cultureListLoading).toBe(false);
    expect(newState.cultureList).toEqual(cultureList);
    expect(newStateWithNull.cultureList).toEqual([]);
  });
  it('should handle CREATE_SITE_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.CREATE_SITE_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle  UPDATE_SITE_DETAILS_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.UPDATE_SITE_DETAILS_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle CREATE_SITE_USER_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.CREATE_SITE_USER_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle  UPDATE_SITE_USER_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.UPDATE_SITE_USER_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle DELETE_SITE_USER_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.DELETE_SITE_USER_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle FETCH_SITE_SUMMARY_SUCCESS', () => {
    const siteData = { id: 1, name: 'Site 1' };
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_SUMMARY_SUCCESS,
      payload: siteData
    };
    const newState = siteReducer(initialState, action);
    expect(newState.site).toEqual(siteData);
    expect(newState.loading).toBe(false);
  });
  it('should handle FETCH_CULTURE_DROPDOWN_SUCCESS', () => {
    const cultureList = [
      { id: 1, name: 'Culture 1' },
      { id: 2, name: 'Culture 2' }
    ];
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_CULTURE_DROPDOWN_SUCCESS,
      payload: {
        cultureList
      }
    };
    const newState = siteReducer(initialState, action);
    expect(newState.cultureListLoading).toBe(false);
    expect(newState.cultureList).toEqual(cultureList);
  });
  it('should handle CREATE_SITE_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.CREATE_SITE_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle  UPDATE_SITE_DETAILS_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.UPDATE_SITE_DETAILS_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle CREATE_SITE_USER_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.CREATE_SITE_USER_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle  UPDATE_SITE_USER_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.UPDATE_SITE_USER_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle DELETE_SITE_USER_SUCCESS', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.DELETE_SITE_USER_SUCCESS
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
  });
  it('should handle FETCH_SITE_SUMMARY_SUCCESS', () => {
    const siteData = { id: 1, name: 'Site 1' };
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_SUMMARY_SUCCESS,
      payload: siteData
    };
    const newState = siteReducer(initialState, action);
    expect(newState.site).toEqual(siteData);
    expect(newState.loading).toBe(false);
  });
  it('should handle FETCH_DISTRICT_DROPDOWN_REQUEST', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_DISTRICT_DROPDOWN_REQUEST
    };
    const newState = siteReducer(initialState, action);
    expect(newState.districtList).toEqual([]);
    expect(newState.districtDropdownLoading).toBe(true);
  });
  it('should handle FETCH_CHIEFDOM_DROPDOWN_REQUEST', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST
    };
    const newState = siteReducer(initialState, action);
    expect(newState.chiefdomList).toEqual([]);
    expect(newState.chiefdomDropdownLoading).toBe(true);
  });
  it('should handle FETCH_CULTURE_DROPDOWN_REQUEST', () => {
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_CULTURE_DROPDOWN_REQUEST
    };
    const newState = siteReducer(initialState, action);
    expect(newState.cultureList).toEqual([]);
    expect(newState.cultureListLoading).toBe(true);
  });
  it('should handle FETCH_SITE_LIST_FAILURE', () => {
    const error = 'An error occurred';
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_LIST_FAILURE,
      error
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });
  it('should handle CREATE_SITE_FAILURE', () => {
    const error = 'An error occurred';
    const action: any = {
      type: SITE_ACTION_TYPES.CREATE_SITE_FAILURE,
      error
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });
  it('should handle FETCH_SITE_SUMMARY_FAILURE', () => {
    const error = 'An error occurred';
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_SUMMARY_FAILURE,
      error
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });
  it('should handle UPDATE_SITE_DETAILS_FAILURE', () => {
    const error = 'An error occurred';
    const action: any = {
      type: SITE_ACTION_TYPES.UPDATE_SITE_DETAILS_FAILURE,
      error
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });
  it('should handle CREATE_SITE_USER_FAILURE', () => {
    const error = 'An error occurred';
    const action: any = {
      type: SITE_ACTION_TYPES.CREATE_SITE_USER_FAILURE,
      error
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });
  it('should handle UPDATE_SITE_USER_FAILURE', () => {
    const error = 'An error occurred';
    const action: any = {
      type: SITE_ACTION_TYPES.UPDATE_SITE_USER_FAILURE,
      error
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });
  it('should handle DELETE_SITE_USER_FAILURE', () => {
    const error = 'An error occurred';
    const action: any = {
      type: SITE_ACTION_TYPES.DELETE_SITE_USER_FAILURE,
      error
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });
  it('should handle FETCH_SITE_USER_LIST_FAILURE', () => {
    const error = 'An error occurred';
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_USER_LIST_FAILURE,
      error
    };
    const newState = siteReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });
  it('should handle FETCH_SITE_USERS_FAILURE', () => {
    const initialStateVar: any = {
      error: null
    };
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_USERS_FAILURE,
      error: 'Failed to fetch site users'
    };
    const expectedState = {
      error: 'Failed to fetch site users'
    };
    expect(siteReducer(initialStateVar, action)).toEqual(expectedState);
  });
  it('should handle FETCH_DISTRICT_DROPDOWN_FAILURE', () => {
    const initialStateVar: any = {
      districtDropdownLoading: true,
      error: null
    };
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_DISTRICT_DROPDOWN_FAILURE,
      error: 'Failed to fetch district dropdown'
    };
    const expectedState = {
      districtDropdownLoading: false,
      error: 'Failed to fetch district dropdown'
    };
    expect(siteReducer(initialStateVar, action)).toEqual(expectedState);
  });
  it('should handle FETCH_CHIEFDOM_DROPDOWN_FAILURE', () => {
    const initialStateVar: any = {
      chiefdomDropdownLoading: true,
      error: null
    };
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_FAILURE,
      error: 'Failed to fetch chiefdom dropdown'
    };
    const expectedState = {
      chiefdomDropdownLoading: false,
      error: 'Failed to fetch chiefdom dropdown'
    };
    expect(siteReducer(initialStateVar, action)).toEqual(expectedState);
  });
  it('should handle FETCH_CULTURE_DROPDOWN_FAILURE', () => {
    const initialStateVar: any = {
      cultureListLoading: true,
      error: null
    };
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_CULTURE_DROPDOWN_FAILURE,
      error: 'Failed to fetch culture dropdown'
    };
    const expectedState = {
      cultureListLoading: false,
      error: 'Failed to fetch culture dropdown'
    };
    expect(siteReducer(initialStateVar, action)).toEqual(expectedState);
  });
  it('should handle CLEAR_DROPDOWN_VALUES', () => {
    const initialStateVar: any = {
      districtList: ['District 1', 'District 2'],
      chiefdomList: ['Chiefdom 1', 'Chiefdom 2'],
      cultureList: ['Culture 1', 'Culture 2']
    };
    const action: any = {
      type: SITE_ACTION_TYPES.CLEAR_DROPDOWN_VALUES
    };
    const expectedState = {
      districtList: [],
      chiefdomList: [],
      cultureList: []
    };
    expect(siteReducer(initialStateVar, action)).toEqual(expectedState);
  });
  it('should handle FETCH_SITE_DROPDOWN_SUCCESS', () => {
    const initialStateVar: any = {
      siteDropdownLoading: true,
      siteDropdownOptions: {
        list: [],
        regionTenantId: ''
      }
    };
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_DROPDOWN_SUCCESS,
      payload: {
        siteList: ['Site 1', 'Site 2'],
        regionTenantId: '123'
      }
    };
    const actionWithNull: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_DROPDOWN_SUCCESS,
      payload: {
        siteList: null,
        regionTenantId: '123'
      }
    };
    const expectedState = {
      siteDropdownLoading: false,
      siteDropdownOptions: {
        list: ['Site 1', 'Site 2'],
        regionTenantId: '123'
      }
    };
    const expectedStateWithNull = {
      siteDropdownLoading: false,
      siteDropdownOptions: {
        list: [],
        regionTenantId: '123'
      }
    };
    expect(siteReducer(initialStateVar, action)).toEqual(expectedState);
    expect(siteReducer(initialStateVar, actionWithNull)).toEqual(expectedStateWithNull);
  });
  it('should handle FETCH_SITE_DROPDOWN_REQUEST', () => {
    const initialStateVar: any = {
      siteDropdownLoading: false,
      siteDropdownOptions: {
        list: ['Site 1', 'Site 2'],
        regionTenantId: '123'
      }
    };
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_DROPDOWN_REQUEST
    };
    const expectedState = {
      siteDropdownLoading: true,
      siteDropdownOptions: {
        list: [],
        regionTenantId: ''
      }
    };
    expect(siteReducer(initialStateVar, action)).toEqual(expectedState);
  });
  it('should handle FETCH_SITE_DROPDOWN_FAILURE', () => {
    const initialStateVar: any = {
      siteDropdownLoading: true,
      error: null
    };
    const action: any = {
      type: SITE_ACTION_TYPES.FETCH_SITE_DROPDOWN_FAILURE,
      error: 'Failed to fetch site dropdown'
    };
    const expectedState = {
      siteDropdownLoading: false,
      error: 'Failed to fetch site dropdown'
    };
    expect(siteReducer(initialStateVar, action)).toEqual(expectedState);
  });
  it('should handle CLEAR_SITE_DROPDOWN_OPTIONS', () => {
    const initialStateVar: any = {
      siteDropdownLoading: true,
      siteDropdownOptions: {
        list: ['Site 1', 'Site 2'],
        regionTenantId: '123'
      }
    };
    const action: any = {
      type: SITE_ACTION_TYPES.CLEAR_SITE_DROPDOWN_OPTIONS
    };
    const expectedState = {
      siteDropdownLoading: false,
      siteDropdownOptions: {
        list: [],
        regionTenantId: ''
      }
    };
    expect(siteReducer(initialStateVar, action)).toEqual(expectedState);
  });
  it('should handle SITE_ACTION_TYPES.CLEAR_SITE_SUMMARY', () => {
    const previousState = {
      ...initialState,
      site: {
        name: '',
        siteType: '',
        email: '',
        account: { id: '', name: '', email: '', tenantId: '' },
        mflCode: '',
        chiefdom: { id: '', name: '', email: '', tenantId: '' },
        address1: '',
        address2: '',
        district: {
          id: '',
          name: ''
        }
      }
    };
    const action: any = {
      type: SITE_ACTION_TYPES.CLEAR_SITE_SUMMARY
    };
    const newState = siteReducer(previousState, action);
    expect(newState.site).toEqual(initialState.site);
  });
  it('should handle SITE_ACTION_TYPES.SET_SITE_SUMMARY', () => {
    const previousState = {
      ...initialState,
      site: {
        name: '',
        siteType: '',
        email: '',
        account: { id: '', name: '', email: '', tenantId: '' },
        chiefdom: { id: '', name: '', email: '', tenantId: '' },
        address1: '',
        address2: '',
        district: {
          id: '',
          name: ''
        }
      },
      loading: true
    };
    const action: any = {
      type: SITE_ACTION_TYPES.SET_SITE_SUMMARY,
      data: {
        site: {
          name: '',
          siteType: '',
          email: '',
          account: { id: '', name: '', email: '', tenantId: '' },
          chiefdom: { id: '', name: '', email: '', tenantId: '' },
          address1: '',
          address2: '',
          district: {
            id: '',
            name: ''
          }
        }
      }
    };
    const newState = siteReducer(previousState, action);
    expect(newState.site).toEqual({
      ...previousState.site,
      ...action.data
    });
    expect(newState.loading).toBe(false);
  });
});
