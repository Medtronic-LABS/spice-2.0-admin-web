import { runSaga } from 'redux-saga';
import {
  createSiteRequest,
  createSiteUserRequest,
  deleteSiteUserRequest,
  fetchSiteDistrictList,
  fetchSiteCultureList,
  fetchSiteDashboardList,
  fetchSiteList,
  fetchSitesForDropdown,
  fetchSiteSummaryRequest,
  fetchSiteSummaryusersRequest,
  fetchSiteUserList,
  fetchChiefdomList,
  updateSiteDetailsRequest,
  updateSiteUserRequest
} from '../sagas';
import * as siteService from '../../../services/siteAPI';
import * as siteActions from '../actions';
import * as ACTION_TYPES from '../actionTypes';
import { AxiosPromise } from 'axios';
import { SITE_MOCK_DATA, SITE_USER_MOCK_DATA } from '../siteMockDataConstants';
import { ISiteUserList } from '../types';
import { clearDropdownValues, fetchChiefdomDropdownRequest } from '../actions';

const siteListResponsePayload = SITE_MOCK_DATA.SITE_LIST_RESPONSE_PAYLOAD;
const siteDistrictListResponsePayload = SITE_MOCK_DATA.SITE_DISTRICT_LIST_RESPONSE;
const siteChiefdomResponsePayload = SITE_MOCK_DATA.SITE_CHIEFDOM_RESPONSE;
const siteCultureListResponsePayload = SITE_MOCK_DATA.SITE_CULTURE_LIST;
const siteDataRequestPayload = SITE_MOCK_DATA.SITE_DATA_REQUEST_PAYLOAD;
const siteDetailRequestPayload = SITE_MOCK_DATA.SITE_DETAIL_REQUEST_PAYLOAD;
const siteDetailResponsePayload = SITE_MOCK_DATA.SITE_DETAIL_RESPONSE_PAYLOAD;
const siteUserListRequestPayload = SITE_MOCK_DATA.SITE_USER_REQUEST_PAYLOAD;
const siteUserListResponsePayload = SITE_MOCK_DATA.SITE_USER_LIST_RESPONSE_PAYLOAD;
const siteUserDeleteRequestPayload = SITE_MOCK_DATA.SITE_DETAIL_REQUEST_PAYLOAD;
const siteUserCreateRequestPayload = SITE_USER_MOCK_DATA.SITE_CREATE_USER_REQ_PAYLOAD;
const siteUserUpdateRequestPayload = SITE_USER_MOCK_DATA.SITE_UPDATE_USER_REQ_PAYLOAD;
const siteSummaryUserListRequestPayload = SITE_MOCK_DATA.SITE_SUMMARY_USER_REQUEST_PAYLOAD;
const siteDashboardListResponsePayload = SITE_MOCK_DATA.SITE_DASHBOARD_RESPONSE_PAYLOAD;
const siteDashboardListRequestPayload = SITE_MOCK_DATA.SITE_DASHBOARD_LIST_REQUEST_PAYLOAD;
const siteListDropdownRequestPayload = SITE_MOCK_DATA.SITE_LIST_DROPDOWN;
const siteListDropdownResponsePayload = SITE_MOCK_DATA.SITE_LIST_DROPDOWN_RESPONSE;

describe('Fetch Site List', () => {
  it('Fetch the site list and dispatches success', async () => {
    const fetchSiteListSpy = jest.spyOn(siteService, 'fetchSiteList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entityList: siteListResponsePayload, totalCount: 10, limit: 10 }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteList,
      { tenantId: 1, skip: 0, limit: 10, search: 'test', type: ACTION_TYPES.FETCH_SITE_LIST_REQUEST }
    ).toPromise();
    expect(fetchSiteListSpy).toHaveBeenCalledWith({ tenantId: 1, skip: 0, limit: 10, search: 'test' });
    expect(dispatched).toEqual([
      siteActions.fetchSiteListSuccess({ sites: siteListResponsePayload, total: 10, limit: 10 })
    ]);
  });

  it('Fails to fetch site list and dispatches failure', async () => {
    const error = new Error('Failed to fetch site list');
    const fetchSiteListSpy = jest.spyOn(siteService, 'fetchSiteList').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteList,
      { tenantId: 1, skip: 0, limit: 10, search: 'test', type: ACTION_TYPES.FETCH_SITE_LIST_REQUEST }
    ).toPromise();
    expect(fetchSiteListSpy).toHaveBeenCalledWith({ tenantId: 1, skip: 0, limit: 10, search: 'test' });
    expect(dispatched).toEqual([siteActions.fetchSiteListFailure(error)]);
  });
});

describe('Fetch district list', () => {
  it('Fetch the district list and dispatches success', async () => {
    const siteDistrictListSpy = jest
      .spyOn(siteService, 'fetchSiteDistrict')
      .mockImplementation(() => Promise.resolve({ data: siteDistrictListResponsePayload }) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteDistrictList,
      {
        countryId: '1',
        type: ACTION_TYPES.FETCH_DISTRICT_DROPDOWN_REQUEST
      }
    ).toPromise();
    expect(siteDistrictListSpy).toHaveBeenCalledWith('1');
    expect(dispatched).toEqual([
      siteActions.fetchSiteDistrictDropdownSuccess({ districtList: siteDistrictListResponsePayload })
    ]);
  });

  it('Fetch the district list and dispatches failure', async () => {
    const error = new Error('Failed to fetch district list');
    const siteDistrictListSpy = jest
      .spyOn(siteService, 'fetchSiteDistrict')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteDistrictList,
      {
        countryId: '1',
        type: ACTION_TYPES.FETCH_DISTRICT_DROPDOWN_REQUEST
      }
    ).toPromise();
    expect(siteDistrictListSpy).toHaveBeenCalledWith('1');
    expect(dispatched).toEqual([siteActions.fetchSiteDistrictDropdownFailure(error)]);
  });
});

describe('Fetch chiefdom list', () => {
  it('Fetch the chiefdom list and dispatches success', async () => {
    const siteChiefdomListSpy = jest
      .spyOn(siteService, 'fetchChiefdom')
      .mockImplementation(() => Promise.resolve({ data: { entityList: siteChiefdomResponsePayload } }) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomList,
      {
        districtId: '1',
        type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST
      }
    ).toPromise();
    expect(siteChiefdomListSpy).toHaveBeenCalledWith('1');
    expect(dispatched).toEqual([
      siteActions.fetchChiefdomDropdownSuccess({ chiefdomList: siteChiefdomResponsePayload })
    ]);
  });

  it('Fetch the chiefdom list and dispatches failure', async () => {
    const error = new Error('Failed to fetch chiefdom list');
    const siteChiefdomListSpy = jest
      .spyOn(siteService, 'fetchChiefdom')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomList,
      {
        districtId: '1',
        type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST
      }
    ).toPromise();
    expect(siteChiefdomListSpy).toHaveBeenCalledWith('1');
    expect(dispatched).toEqual([siteActions.fetchChiefdomDropdownFailure(error)]);
  });
});

describe('Fetch site culture list', () => {
  it('Fetch the site culture list and dispatches success', async () => {
    const siteCultureListSpy = jest
      .spyOn(siteService, 'fetchSiteCulture')
      .mockImplementation(() => Promise.resolve({ data: siteCultureListResponsePayload }) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteCultureList
    ).toPromise();
    expect(siteCultureListSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([
      siteActions.fetchCultureDropdownSuccess({ cultureList: siteCultureListResponsePayload })
    ]);
  });

  it('Fetch the site culture list and dispatches failure', async () => {
    const error = new Error('Failed to fetch site culture list');
    const siteCultureListSpy = jest
      .spyOn(siteService, 'fetchSiteCulture')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteCultureList
    ).toPromise();
    expect(siteCultureListSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([siteActions.fetchCultureDropdownFailure(error)]);
  });
});

describe('Create a site', () => {
  it('Create a site and dispatches success', async () => {
    const createSiteSpy = jest
      .spyOn(siteService, 'createSite')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createSiteRequest,
      {
        data: siteDataRequestPayload,
        type: ACTION_TYPES.CREATE_SITE_REQUEST
      }
    ).toPromise();
    expect(createSiteSpy).toHaveBeenCalledWith(siteDataRequestPayload);
    expect(dispatched).toEqual([siteActions.clearSiteDropdown(), siteActions.createSiteSuccess()]);
  });

  it('Create a site and dispatches failure', async () => {
    const error = new Error('Create a site');
    const createSiteSpy = jest.spyOn(siteService, 'createSite').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createSiteRequest,
      {
        data: siteDataRequestPayload,
        type: ACTION_TYPES.CREATE_SITE_REQUEST
      }
    ).toPromise();
    expect(createSiteSpy).toHaveBeenCalledWith(siteDataRequestPayload);
    expect(dispatched).toEqual([siteActions.createSiteFailure(error)]);
  });
});

describe('Update the site detail', () => {
  it('Update the site detail and dispatches success', async () => {
    const updateSiteSpy = jest
      .spyOn(siteService, 'updateSiteDetails')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateSiteDetailsRequest,
      {
        data: siteDataRequestPayload,
        type: ACTION_TYPES.UPDATE_SITE_DETAILS_REQUEST
      }
    ).toPromise();
    expect(updateSiteSpy).toHaveBeenCalledWith(siteDataRequestPayload);
    expect(dispatched).toEqual([siteActions.clearSiteDropdown(), siteActions.updateSiteDetailsSuccess()]);
  });

  it('Update the site detail and dispatches failure', async () => {
    const error = new Error('Failed to update the site detail');
    const updateSiteSpy = jest.spyOn(siteService, 'updateSiteDetails').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateSiteDetailsRequest,
      {
        data: siteDataRequestPayload,
        type: ACTION_TYPES.UPDATE_SITE_DETAILS_REQUEST
      }
    ).toPromise();
    expect(updateSiteSpy).toHaveBeenCalledWith(siteDataRequestPayload);
    expect(dispatched).toEqual([siteActions.updateSiteDetailsFailure(error)]);
  });
});

describe('Fetch site detail for the site summary', () => {
  it('Fetch the site detail and dispatches success', async () => {
    const siteDetailSpy = jest
      .spyOn(siteService, 'fetchSiteSummary')
      .mockImplementation(() => Promise.resolve({ data: { entity: siteDetailResponsePayload } }) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteSummaryRequest,
      {
        ...siteDetailRequestPayload,
        type: ACTION_TYPES.FETCH_SITE_SUMMARY_REQUEST
      }
    ).toPromise();
    expect(siteDetailSpy).toHaveBeenCalledWith(42, 2);
    expect(dispatched).toEqual([siteActions.fetchSiteSummarySuccess(siteDetailResponsePayload)]);
  });

  it('Fetch the site detail and dispatches failure', async () => {
    const error = new Error('Failed to fetch the site detail');
    const siteDetailSpy = jest.spyOn(siteService, 'fetchSiteSummary').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteSummaryRequest,
      {
        ...siteDetailRequestPayload,
        type: ACTION_TYPES.FETCH_SITE_SUMMARY_REQUEST
      }
    ).toPromise();
    expect(siteDetailSpy).toHaveBeenCalledWith(42, 2);
    expect(dispatched).toEqual([siteActions.fetchSiteSummaryFailure(error)]);
  });
});

describe('Fetch site user list for the site summary', () => {
  it('Fetch the site user list and dispatches success', async () => {
    const siteUsers = siteUserListResponsePayload.map((siteUser: any) => {
      siteUser.organizationName = siteUser.organizations[0].name;
      siteUser.roleName = siteUser.defaultRoleName;
      return siteUser;
    }) as unknown as ISiteUserList[];
    const siteUserListSpy = jest
      .spyOn(siteService, 'fetchSiteUserList')
      .mockImplementation(
        () => Promise.resolve({ data: { entityList: siteUserListResponsePayload, totalCount: 10 } }) as AxiosPromise
      );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteUserList,
      {
        ...siteUserListRequestPayload,
        search: '',
        type: ACTION_TYPES.FETCH_SITE_USER_LIST_REQUEST
      }
    ).toPromise();
    expect(siteUserListSpy).toHaveBeenCalledWith(siteUserListRequestPayload);
    expect(dispatched).toEqual([siteActions.fetchSiteUserListSuccess({ siteUsers, total: 10, limit: 10 })]);
  });

  it('Fetch the site user list and dispatches failure', async () => {
    const error = new Error('Failed to fetch site user list');
    const siteUserListSpy = jest
      .spyOn(siteService, 'fetchSiteUserList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteUserList,
      {
        ...siteUserListRequestPayload,
        search: '',
        type: ACTION_TYPES.FETCH_SITE_USER_LIST_REQUEST
      }
    ).toPromise();
    expect(siteUserListSpy).toHaveBeenCalledWith(siteUserListRequestPayload);
    expect(dispatched).toEqual([siteActions.fetchSiteUserListFailure(error)]);
  });
});

describe('Delete a site user from a site', () => {
  it('Delete a site user and dispatches success', async () => {
    const deleteSiteUserSpy = jest
      .spyOn(siteService, 'deleteSiteUser')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteSiteUserRequest,
      { data: siteUserDeleteRequestPayload, type: ACTION_TYPES.DELETE_SITE_USER_REQUEST }
    ).toPromise();
    expect(deleteSiteUserSpy).toHaveBeenCalledWith(siteUserDeleteRequestPayload);
    expect(dispatched).toEqual([siteActions.deleteSiteUserSuccess()]);
  });

  it('Fails to delete a site user and dispatches failure', async () => {
    const error = new Error('Failed to delete a site user');
    const deleteSiteUserSpy = jest.spyOn(siteService, 'deleteSiteUser').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteSiteUserRequest,
      { data: siteUserDeleteRequestPayload, type: ACTION_TYPES.DELETE_SITE_USER_REQUEST }
    ).toPromise();
    expect(deleteSiteUserSpy).toHaveBeenCalledWith(siteUserDeleteRequestPayload);
    expect(dispatched).toEqual([siteActions.deleteSiteUserFailure(error)]);
  });
});

describe('Create a site user from a site', () => {
  it('Create a site user and dispatches success', async () => {
    const createSiteUserSpy = jest
      .spyOn(siteService, 'addSiteUser')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createSiteUserRequest,
      {
        data: siteUserCreateRequestPayload,
        type: ACTION_TYPES.CREATE_SITE_USER_REQUEST
      }
    ).toPromise();
    expect(createSiteUserSpy).toHaveBeenCalledWith(siteUserCreateRequestPayload);
    expect(dispatched).toEqual([siteActions.createSiteUserSuccess()]);
  });

  it('Fails to create a site user and dispatches failure', async () => {
    const error = new Error('Failed to create a site user');
    const createSiteUserSpy = jest.spyOn(siteService, 'addSiteUser').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createSiteUserRequest,
      {
        data: siteUserCreateRequestPayload,
        type: ACTION_TYPES.CREATE_SITE_USER_REQUEST
      }
    ).toPromise();
    expect(createSiteUserSpy).toHaveBeenCalledWith(siteUserCreateRequestPayload);
    expect(dispatched).toEqual([siteActions.createSiteUserFailure(error)]);
  });
});

describe('Update a site user from a site', () => {
  it('Update a site user and dispatches success', async () => {
    const updateSiteUserSpy = jest
      .spyOn(siteService, 'updateSiteUser')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateSiteUserRequest,
      {
        data: siteUserUpdateRequestPayload,
        type: ACTION_TYPES.UPDATE_SITE_USER_REQUEST
      }
    ).toPromise();
    expect(updateSiteUserSpy).toHaveBeenCalledWith(siteUserUpdateRequestPayload);
    expect(dispatched).toEqual([siteActions.updateSiteUserSuccess()]);
  });

  it('Fails to update a site user and dispatches failure', async () => {
    const error = new Error('Failed to update a site user');
    const updateSiteUserSpy = jest.spyOn(siteService, 'updateSiteUser').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateSiteUserRequest,
      {
        data: siteUserUpdateRequestPayload,
        type: ACTION_TYPES.UPDATE_SITE_USER_REQUEST
      }
    ).toPromise();
    expect(updateSiteUserSpy).toHaveBeenCalledWith(siteUserUpdateRequestPayload);
    expect(dispatched).toEqual([siteActions.updateSiteUserFailure(error)]);
  });
});

describe('Fetch site summary users list for the site summary', () => {
  it('Fetch the site summary users list and dispatches success', async () => {
    const siteUsers = siteUserListResponsePayload.map((siteUser: any) => {
      siteUser.roleName = siteUser.defaultRoleName;
      return siteUser;
    }) as unknown as ISiteUserList[];
    const siteSummaryUserListSpy = jest
      .spyOn(siteService, 'fetchSiteUsers')
      .mockImplementation(
        () => Promise.resolve({ data: { entityList: siteUserListResponsePayload, totalCount: 10 } }) as AxiosPromise
      );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteSummaryusersRequest,
      {
        ...siteSummaryUserListRequestPayload,
        type: ACTION_TYPES.FETCH_SITE_USERS_REQUEST
      }
    ).toPromise();
    expect(siteSummaryUserListSpy).toHaveBeenCalledWith(siteSummaryUserListRequestPayload);
    expect(dispatched).toEqual([siteActions.fetchSiteSummaryUsersSuccess(siteUsers as any)]);
  });

  it('Fetch the site summary user list and dispatches failure', async () => {
    const error = new Error('Failed to fetch site summary user list');
    const siteSummaryUserListSpy = jest
      .spyOn(siteService, 'fetchSiteUsers')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSiteSummaryusersRequest,
      {
        ...siteSummaryUserListRequestPayload,
        type: ACTION_TYPES.FETCH_SITE_USERS_REQUEST
      }
    ).toPromise();
    expect(siteSummaryUserListSpy).toHaveBeenCalledWith(siteSummaryUserListRequestPayload);
    expect(dispatched).toEqual([siteActions.fetchSiteSummaryUsersFailure(error)]);
    siteSummaryUserListSpy.mockClear();
  });
});

describe('Fetch the site dashboard list', () => {
  it('Fetch the site dashboard list and dispatches success', async () => {
    const fetchSiteDashboardListSpy = jest.spyOn(siteService, 'fetchSiteList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entityList: siteDashboardListResponsePayload.siteDashboardList, totalCount: 10 }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action: any) => dispatched.push(action),
        getState: () => ({ user: { user: { tenantId: '4' } } })
      },
      fetchSiteDashboardList,
      {
        ...siteDashboardListRequestPayload,
        isLoadMore: true,
        type: ACTION_TYPES.FETCH_SITE_DASHBOARD_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchSiteDashboardListSpy).toHaveBeenCalledWith({ ...siteDashboardListRequestPayload, tenantId: '4' });
    expect(dispatched).toEqual([siteActions.fetchSiteDashboardListSuccess(siteDashboardListResponsePayload)]);
  });

  it('Fails to fetch site dashboard list and dispatches failure', async () => {
    const error = new Error('Failed to fetch site dashboard list');
    const fetchSiteDashboardListSpy = jest
      .spyOn(siteService, 'fetchSiteList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action: any) => dispatched.push(action),
        getState: () => ({ user: { user: { tenantId: '4' } } })
      },
      fetchSiteDashboardList,
      {
        ...siteDashboardListRequestPayload,
        isLoadMore: true,
        type: ACTION_TYPES.FETCH_SITE_DASHBOARD_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchSiteDashboardListSpy).toHaveBeenCalledWith({ ...siteDashboardListRequestPayload, tenantId: '4' });
    expect(dispatched).toEqual([siteActions.fetchSiteDashboardListFailure(error)]);
  });
});

describe('Fetch sites list for dropdown in Program', () => {
  it('Fetch sites list for dropdown and dispatches success', async () => {
    const fetchSiteListDropdownSpy = jest.spyOn(siteService, 'getSitesForDropdown').mockImplementation(
      () =>
        Promise.resolve({
          data: { entityList: siteListDropdownResponsePayload, totalCount: 10, limit: 10 }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSitesForDropdown,
      { ...siteListDropdownRequestPayload, type: ACTION_TYPES.FETCH_SITE_DROPDOWN_REQUEST }
    ).toPromise();
    expect(fetchSiteListDropdownSpy).toHaveBeenCalledWith({ tenantId: '2' });
    expect(dispatched).toEqual([
      siteActions.fetchSiteDropdownSuccess({
        siteList: siteListDropdownResponsePayload,
        total: 10,
        regionTenantId: '2'
      })
    ]);
  });

  it('Fails to fetch sites list for dropdown and dispatches failure', async () => {
    const error = new Error('Failed to fetch sites list for dropdown');
    const fetchSiteListDropdownSpy = jest
      .spyOn(siteService, 'getSitesForDropdown')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSitesForDropdown,
      { ...siteListDropdownRequestPayload, type: ACTION_TYPES.FETCH_SITE_DROPDOWN_REQUEST }
    ).toPromise();
    expect(fetchSiteListDropdownSpy).toHaveBeenCalledWith({ tenantId: '2' });
    expect(dispatched).toEqual([siteActions.fetchSiteDropdownFailure(error)]);
  });
});

describe('fetchChiefdomDropdownRequest', () => {
  it('should return a valid action object with provided districtId', () => {
    const districtId = '123';
    const action = fetchChiefdomDropdownRequest({ districtId });
    const expectedAction = {
      type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST,
      districtId
    };
    expect(action).toEqual(expectedAction);
  });
});

describe('clearDropdownValues', () => {
  it('should return a valid action object with the correct type', () => {
    const action = clearDropdownValues();
    const expectedAction = {
      type: ACTION_TYPES.CLEAR_DROPDOWN_VALUES
    };
    expect(action).toEqual(expectedAction);
  });
});
