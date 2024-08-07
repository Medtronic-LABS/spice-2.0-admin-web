import { runSaga } from 'redux-saga';
import { AxiosResponse } from 'axios';
import * as subCountyService from '../../../services/subCountyAPI';
import {
  createSubCounty,
  createSubCountyAdmin,
  deleteSubCountyAdmin,
  fetchSubCountyById,
  fetchSubCountyDashboardList,
  fetchSubCountyDetail,
  fetchSubCountyList,
  getOUListForDropdown,
  updateSubCounty,
  updateSubCountyAdmin
} from '../sagas';
import * as ACTION_TYPES from '../actionTypes';
import * as subCountyActions from '../actions';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/subCountyDataConstants';

const fetchSubCountyDetailWithSearchRequestMockData =
  MOCK_DATA_CONSTANTS.FETCH_SUB_COUNTY_DETAILS_REQUEST_PAYLOAD_WITH_SEARCH;
const fetchSubCountyDetailRequestMockData = MOCK_DATA_CONSTANTS.ID_AND_TENANT_ID_REQUEST_PAYLOAD;
const fetchSubCountyDetailResponseMockData = MOCK_DATA_CONSTANTS.FETCH_SUB_COUNTY_DETAIL_RESPONSE_PAYLOAD;
const fetchSubCountyAdminsResponseMockData = MOCK_DATA_CONSTANTS.FETCH_SUB_COUNTY_ADMINS_RESPONSE_PAYLOAD;
const updateSubCountyRequestMockData = MOCK_DATA_CONSTANTS.UPDATE_SUB_COUNTY_REQUEST_PAYLOAD;
const fetchDashboardSubCountysRequestMockData = MOCK_DATA_CONSTANTS.FETCH_DASHBOARD_SUB_COUNTYS_REQUEST_PAYLOAD;
const fetchDashboardSubCountysResponseMockData = MOCK_DATA_CONSTANTS.FETCH_DASHBOARD_SUB_COUNTYS_RESPONSE_PAYLOAD;
const fetchSubCountysRequestMockData = MOCK_DATA_CONSTANTS.FETCH_SUB_COUNTY_LIST_REQUEST_PAYLOAD;
const fetchSubCountysResponseMockData = MOCK_DATA_CONSTANTS.FETCH_SUB_COUNTY_LIST_RESPONSE_PAYLOAD;
const createSubCountyRequestMockData = MOCK_DATA_CONSTANTS.CREATE_SUB_COUNTY_REQUEST_PAYLOAD;
const fetchSubCountyByIdRequestMockData = MOCK_DATA_CONSTANTS.ID_AND_TENANT_ID_REQUEST_PAYLOAD;
const fetchSubCountyByIdResponseMockData = MOCK_DATA_CONSTANTS.FETCH_SUB_COUNTY_BY_ID_REQUEST_PAYLOAD;
const fetchDropdownSubCountysRequestMockData = MOCK_DATA_CONSTANTS.FETCH_SUB_COUNTY_DROPDOWN_LIST_REQUEST_PAYLOAD;
const subCountyAdminRequestMockData = MOCK_DATA_CONSTANTS.SUB_COUNTY_ADMIN_REQUEST_PAYLOAD;
const deleteSubCountyAdminRequestMockData = MOCK_DATA_CONSTANTS.ID_AND_TENANT_ID_REQUEST_PAYLOAD;

describe('Fetch Sub County Detail', () => {
  it('Fetches a list of Sub County Admins and dispatches success', async () => {
    const fetchSubCountyDetailSpy = jest.spyOn(subCountyService, 'fetchSubCountyAdmins').mockImplementation(() => {
      return Promise.resolve({ data: { entityList: fetchSubCountyAdminsResponseMockData } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSubCountyDetail,
      {
        payload: fetchSubCountyDetailWithSearchRequestMockData as any,
        type: ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountyDetailSpy).toHaveBeenCalledWith(fetchSubCountyDetailWithSearchRequestMockData);
    expect(dispatched).toEqual([subCountyActions.searchUserSuccess(fetchSubCountyAdminsResponseMockData)]);
  });

  it('Fetches sub county details and dispatches success', async () => {
    const fetchSubCountyDetailSpy = jest.spyOn(subCountyService, 'getSubCountyDetails').mockImplementation(() => {
      return Promise.resolve({
        data: {
          entity: {
            ...fetchSubCountyDetailResponseMockData,
            users: fetchSubCountyDetailResponseMockData.users
          }
        }
      } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSubCountyDetail,
      {
        payload: fetchSubCountyDetailRequestMockData,
        type: ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountyDetailSpy).toHaveBeenCalledWith(fetchSubCountyDetailRequestMockData);
    const { users: subCountyAdmins, ...subCountyDetail } = fetchSubCountyDetailResponseMockData;
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyDetailSuccess({ subCountyAdmins, subCountyDetail })]);
  });
  it('Fails to fetch sub county and dispatches failure', async () => {
    const error = new Error('Failed fetch to sub county');
    const fetchSubCountyDetailSpy = jest
      .spyOn(subCountyService, 'getSubCountyDetails')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSubCountyDetail,
      { payload: fetchSubCountyDetailRequestMockData, type: ACTION_TYPES.FETCH_SUB_COUNTY_DETAIL_REQUEST }
    ).toPromise();
    expect(fetchSubCountyDetailSpy).toHaveBeenCalledWith(fetchSubCountyDetailRequestMockData);
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyDetailFail(error)]);
  });
});

describe('Updates an Sub County', () => {
  it('Updates Sub County and dispatches success', async () => {
    const updateSubCountySpy = jest.spyOn(subCountyService, 'updateSubCounty').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateSubCounty,
      {
        payload: updateSubCountyRequestMockData,
        type: ACTION_TYPES.UPDATE_SUB_COUNTY_REQUEST
      }
    ).toPromise();
    expect(updateSubCountySpy).toHaveBeenCalledWith(updateSubCountyRequestMockData);
    expect(dispatched).toEqual([subCountyActions.updateSubCountySuccess()]);
  });

  it('Updates Sub County with successPayload flag and dispatches success', async () => {
    const updateSubCountySpy = jest.spyOn(subCountyService, 'updateSubCounty').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateSubCounty,
      {
        payload: updateSubCountyRequestMockData,
        isSuccessPayloadNeeded: true,
        type: ACTION_TYPES.UPDATE_SUB_COUNTY_REQUEST
      }
    ).toPromise();
    expect(updateSubCountySpy).toHaveBeenCalledWith(updateSubCountyRequestMockData);
    expect(dispatched).toEqual([subCountyActions.updateSubCountySuccess({ name: 'Sub County Two' })]);
  });

  it('Fails to update Sub county and dispatches failure', async () => {
    const error = new Error('Failed to update Sub County');
    const updateSubCountySpy = jest
      .spyOn(subCountyService, 'updateSubCounty')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateSubCounty,
      {
        payload: updateSubCountyRequestMockData,
        type: ACTION_TYPES.UPDATE_SUB_COUNTY_REQUEST
      }
    ).toPromise();
    expect(updateSubCountySpy).toHaveBeenCalledWith(updateSubCountyRequestMockData);
    expect(dispatched).toEqual([subCountyActions.updateSubCountyFailure()]);
  });
});

describe('Fetch Sub County List in Dashboard', () => {
  it('Fetches a list of Sub County for Dashboard and dispatches success', async () => {
    const fetchSubCountyDashboardListSpy = jest
      .spyOn(subCountyService, 'fetchSubCountyDashboardList')
      .mockImplementation(() => {
        return Promise.resolve({
          data: { entityList: fetchDashboardSubCountysResponseMockData, totalCount: 10 }
        } as AxiosResponse);
      });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ user: { user: { tenantId: '4' } } })
      },
      fetchSubCountyDashboardList,
      {
        ...fetchDashboardSubCountysRequestMockData,
        type: ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountyDashboardListSpy).toHaveBeenCalledWith('4', null, 0, undefined, 'Sample');
    const payload = {
      subCountyDashboardList: fetchDashboardSubCountysResponseMockData,
      total: 10,
      isLoadMore: false
    };
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyDashboardListSuccess(payload)]);
  });

  it('Fails to fetch list of Sub County for Dashboard and dispatches failure', async () => {
    const error = new Error('Failed to fetch Sub county dashboard list');
    const fetchSubCountyDashboardListSpy = jest
      .spyOn(subCountyService, 'fetchSubCountyDashboardList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ user: { user: { tenantId: '4' } } })
      },
      fetchSubCountyDashboardList,
      {
        ...fetchDashboardSubCountysRequestMockData,
        type: ACTION_TYPES.FETCH_SUB_COUNTY_DASHBOARD_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountyDashboardListSpy).toHaveBeenCalledWith('4', null, 0, undefined, 'Sample');
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyDashboardListFailure(error)]);
  });
});

describe('Fetch Sub County List', () => {
  it('Fetches a list of Sub County and dispatches success', async () => {
    const fetchSubCountyListSpy = jest.spyOn(subCountyService, 'fetchSubCountyList').mockImplementation(() => {
      return Promise.resolve({
        data: { entityList: fetchSubCountysResponseMockData, totalCount: 10 }
      } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSubCountyList,
      {
        ...fetchSubCountysRequestMockData,
        type: ACTION_TYPES.FETCH_SUB_COUNTY_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountyListSpy).toHaveBeenCalledWith('1', null, 0, 'Sample');
    const payload = {
      subCountyList: fetchSubCountysResponseMockData,
      total: 10
    };
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyListSuccess(payload)]);
  });

  it('Fails to fetch list of Sub County and dispatches failure', async () => {
    const error = new Error('Failed to fetch sub county list');
    const fetchSubCountyListSpy = jest
      .spyOn(subCountyService, 'fetchSubCountyList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSubCountyList,
      {
        ...fetchSubCountysRequestMockData,
        type: ACTION_TYPES.FETCH_SUB_COUNTY_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountyListSpy).toHaveBeenCalledWith('1', null, 0, 'Sample');
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyListFailure(error)]);
  });
});

describe('Creates an Sub County', () => {
  it('Creates Sub County and dispatches success', async () => {
    const createSubCountySpy = jest.spyOn(subCountyService, 'createSubCounty').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createSubCounty,
      {
        payload: createSubCountyRequestMockData,
        type: ACTION_TYPES.CREATE_SUB_COUNTY_REQUEST
      }
    ).toPromise();
    expect(createSubCountySpy).toHaveBeenCalledWith(createSubCountyRequestMockData);
    expect(dispatched).toEqual([subCountyActions.createSubCountySuccess()]);
  });

  it('Fails to create Sub County and dispatches failure', async () => {
    const error = new Error('Failed to create sub county');
    const createSubCountySpy = jest.spyOn(subCountyService, 'createSubCounty').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createSubCounty,
      {
        payload: createSubCountyRequestMockData,
        type: ACTION_TYPES.CREATE_SUB_COUNTY_REQUEST
      }
    ).toPromise();
    expect(createSubCountySpy).toHaveBeenCalledWith(createSubCountyRequestMockData);
    expect(dispatched).toEqual([subCountyActions.createSubCountyFailure()]);
  });
});

describe('Fetches an Sub County', () => {
  it('Fetches Sub County and dispatches success', async () => {
    const fetchSubCountySpy = jest.spyOn(subCountyService, 'fetchSubCountyById').mockImplementation(() => {
      return Promise.resolve({
        data: { entity: fetchSubCountyByIdResponseMockData }
      } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSubCountyById,
      {
        payload: fetchSubCountyByIdRequestMockData,
        type: ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountySpy).toHaveBeenCalledWith(fetchSubCountyByIdRequestMockData);
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyByIdSuccess()]);
  });

  it('Fails to fetch Sub County and dispatches failure', async () => {
    const error = new Error('Failed to fetch sub county');
    const fetchSubCountySpy = jest.spyOn(subCountyService, 'fetchSubCountyById').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSubCountyById,
      {
        payload: fetchSubCountyByIdRequestMockData,
        type: ACTION_TYPES.FETCH_SUB_COUNTY_BY_ID_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountySpy).toHaveBeenCalledWith(fetchSubCountyByIdRequestMockData);
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyByIdFailure()]);
  });
});

describe('Fetch Sub County Drpodown List', () => {
  it('Fetches Sub County Dropdown list and dispatches success', async () => {
    const fetchSubCountyDropdownListSpy = jest
      .spyOn(subCountyService, 'fetchSubCountyForDropdown')
      .mockImplementation(() => {
        return Promise.resolve({
          data: { entityList: fetchSubCountysResponseMockData, total: 10, limit: null }
        } as AxiosResponse);
      });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      getOUListForDropdown,
      {
        tenantId: '4',
        type: ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountyDropdownListSpy).toHaveBeenCalledWith(fetchDropdownSubCountysRequestMockData);
    const payload = {
      subCountyList: fetchSubCountysResponseMockData,
      total: 10,
      limit: null
    };
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyDropdownSuccess(payload)]);
  });

  it('Fails to fetch Sub County Dropdown list and dispatches failure', async () => {
    const error = new Error('Failed to fetch Sub County Dropdown list');
    const fetchSubCountyDropdownListSpy = jest
      .spyOn(subCountyService, 'fetchSubCountyForDropdown')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      getOUListForDropdown,
      {
        tenantId: '4',
        type: ACTION_TYPES.FETCH_SUB_COUNTY_DROPDOWN_REQUEST
      }
    ).toPromise();
    expect(fetchSubCountyDropdownListSpy).toHaveBeenCalledWith(fetchDropdownSubCountysRequestMockData);
    expect(dispatched).toEqual([subCountyActions.fetchSubCountyDropdownFailure(error)]);
  });
});

describe('Creates an Sub County Admin', () => {
  it('Creates Sub County admin and dispatches success', async () => {
    const createSubCountyAdminSpy = jest.spyOn(subCountyService, 'createSubCountyAdmin').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createSubCountyAdmin,
      {
        payload: subCountyAdminRequestMockData,
        type: ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_REQUEST
      }
    ).toPromise();
    expect(createSubCountyAdminSpy).toHaveBeenCalledWith(subCountyAdminRequestMockData);
    expect(dispatched).toEqual([subCountyActions.createSubCountyAdminSuccess()]);
  });

  it('Fails to create Sub County admin and dispatches failure', async () => {
    const error = new Error('Failed to create Sub County admin');
    const createSubCountyAdminSpy = jest
      .spyOn(subCountyService, 'createSubCountyAdmin')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createSubCountyAdmin,
      {
        payload: subCountyAdminRequestMockData,
        type: ACTION_TYPES.CREATE_SUB_COUNTY_ADMIN_REQUEST
      }
    ).toPromise();
    expect(createSubCountyAdminSpy).toHaveBeenCalledWith(subCountyAdminRequestMockData);
    expect(dispatched).toEqual([subCountyActions.createSubCountyAdminFailure()]);
  });
});

describe('Updates an Sub County Admin', () => {
  it('Updates Sub County admin and dispatches success', async () => {
    const updateSubCountyAdminSpy = jest.spyOn(subCountyService, 'updateSubCountyAdmin').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateSubCountyAdmin,
      {
        payload: subCountyAdminRequestMockData,
        type: ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_REQUEST
      }
    ).toPromise();
    expect(updateSubCountyAdminSpy).toHaveBeenCalledWith(subCountyAdminRequestMockData);
    expect(dispatched).toEqual([subCountyActions.updateSubCountyAdminSuccess()]);
  });

  it('Fails to update Sub County admin and dispatches failure', async () => {
    const error = new Error('Failed to update Sub County admin');
    const updateSubCountyAdminSpy = jest
      .spyOn(subCountyService, 'updateSubCountyAdmin')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateSubCountyAdmin,
      {
        payload: subCountyAdminRequestMockData,
        type: ACTION_TYPES.UPDATE_SUB_COUNTY_ADMIN_REQUEST
      }
    ).toPromise();
    expect(updateSubCountyAdminSpy).toHaveBeenCalledWith(subCountyAdminRequestMockData);
    expect(dispatched).toEqual([subCountyActions.updateSubCountyAdminFailure()]);
  });
});

describe('Deletes an Sub County Admin', () => {
  it('Deletes Sub County admin and dispatches success', async () => {
    const deleteSubCountyAdminSpy = jest.spyOn(subCountyService, 'deleteSubCountyAdmin').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteSubCountyAdmin,
      {
        payload: subCountyAdminRequestMockData,
        type: ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_REQUEST
      }
    ).toPromise();
    expect(deleteSubCountyAdminSpy).toHaveBeenCalledWith(subCountyAdminRequestMockData);
    expect(dispatched).toEqual([subCountyActions.deleteSubCountyAdminSuccess()]);
  });

  it('Fails to delete Sub County admin and dispatches failure', async () => {
    const error = new Error('Failed to delete Sub County admin');
    const deleteSubCountyAdminSpy = jest
      .spyOn(subCountyService, 'deleteSubCountyAdmin')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteSubCountyAdmin,
      {
        payload: deleteSubCountyAdminRequestMockData,
        type: ACTION_TYPES.DELETE_SUB_COUNTY_ADMIN_REQUEST
      }
    ).toPromise();
    expect(deleteSubCountyAdminSpy).toHaveBeenCalledWith(deleteSubCountyAdminRequestMockData);
    expect(dispatched).toEqual([subCountyActions.deleteSubCountyAdminFailure()]);
  });
});
