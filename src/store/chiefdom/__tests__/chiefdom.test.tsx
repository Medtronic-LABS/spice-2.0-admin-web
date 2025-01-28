import { runSaga } from 'redux-saga';
import { AxiosResponse } from 'axios';
import * as chiefdomService from '../../../services/chiefdomAPI';
import {
  createChiefdom,
  createChiefdomAdmin,
  deleteChiefdomAdmin,
  fetchChiefdomById,
  fetchChiefdomDashboardList,
  fetchChiefdomDetail,
  fetchChiefdomList,
  getChiefdomListForDropdown,
  updateChiefdom,
  updateChiefdomAdmin
} from '../sagas';
import * as ACTION_TYPES from '../actionTypes';
import * as chiefdomActions from '../actions';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/chiefdomDataConstants';

const fetchChiefdomDetailWithSearchRequestMockData =
  MOCK_DATA_CONSTANTS.FETCH_CHIEFDOM_DETAILS_REQUEST_PAYLOAD_WITH_SEARCH;
const fetchChiefdomDetailRequestMockData = MOCK_DATA_CONSTANTS.ID_AND_TENANT_ID_REQUEST_PAYLOAD;
const fetchChiefdomDetailResponseMockData = MOCK_DATA_CONSTANTS.FETCH_CHIEFDOM_DETAIL_RESPONSE_PAYLOAD;
const fetchChiefdomAdminsResponseMockData = MOCK_DATA_CONSTANTS.FETCH_CHIEFDOM_ADMINS_RESPONSE_PAYLOAD;
const updateChiefdomRequestMockData = MOCK_DATA_CONSTANTS.UPDATE_CHIEFDOM_REQUEST_PAYLOAD;
const fetchDashboardChiefdomsRequestMockData = MOCK_DATA_CONSTANTS.FETCH_DASHBOARD_CHIEFDOM_REQUEST_PAYLOAD;
const fetchDashboardChiefdomsResponseMockData = MOCK_DATA_CONSTANTS.FETCH_DASHBOARD_CHIEFDOM_RESPONSE_PAYLOAD;
const fetchChiefdomsRequestMockData = MOCK_DATA_CONSTANTS.FETCH_SUB_CHIEFDOM_REQUEST_PAYLOAD;
const fetchChiefdomsResponseMockData = MOCK_DATA_CONSTANTS.FETCH_CHIEFDOM_LIST_RESPONSE_PAYLOAD;
const createChiefdomRequestMockData = MOCK_DATA_CONSTANTS.CREATE_CHIEFDOM_REQUEST_PAYLOAD;
const fetchChiefdomByIdRequestMockData = MOCK_DATA_CONSTANTS.ID_AND_TENANT_ID_REQUEST_PAYLOAD;
const fetchChiefdomByIdResponseMockData = MOCK_DATA_CONSTANTS.FETCH_CHIEFDOM_BY_ID_REQUEST_PAYLOAD;
const fetchDropdownChiefdomsRequestMockData = MOCK_DATA_CONSTANTS.FETCH_CHIEFDOM_DROPDOWN_LIST_REQUEST_PAYLOAD;
const chiefdomAdminRequestMockData = MOCK_DATA_CONSTANTS.CHIEFDOM_ADMIN_REQUEST_PAYLOAD;
const deleteChiefdomAdminRequestMockData = MOCK_DATA_CONSTANTS.ID_AND_TENANT_ID_REQUEST_PAYLOAD;

describe('Fetch Chiefdom Detail', () => {
  it('Fetches chiefdom details and dispatches success', async () => {
    const fetchChiefdomDetailSpy = jest.spyOn(chiefdomService, 'getChiefdomDetails').mockImplementation(() => {
      return Promise.resolve({
        data: {
          entity: {
            ...fetchChiefdomDetailResponseMockData,
            users: fetchChiefdomDetailResponseMockData.users
          }
        }
      } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomDetail,
      {
        payload: fetchChiefdomDetailRequestMockData,
        type: ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_REQUEST
      }
    ).toPromise();
    expect(fetchChiefdomDetailSpy).toHaveBeenCalledWith(fetchChiefdomDetailRequestMockData);
    const { users: chiefdomAdmins, ...chiefdomDetail } = fetchChiefdomDetailResponseMockData;
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomDetailSuccess({ chiefdomAdmins, chiefdomDetail })]);
  });
  it('Fails to fetch chiefdom and dispatches failure', async () => {
    const error = new Error('Failed fetch to chiefdom');
    const fetchChiefdomDetailSpy = jest
      .spyOn(chiefdomService, 'getChiefdomDetails')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomDetail,
      { payload: fetchChiefdomDetailRequestMockData, type: ACTION_TYPES.FETCH_CHIEFDOM_DETAIL_REQUEST }
    ).toPromise();
    expect(fetchChiefdomDetailSpy).toHaveBeenCalledWith(fetchChiefdomDetailRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomDetailFail(error)]);
  });
});

describe('Updates an Chiefdom', () => {
  it('Updates Chiefdom and dispatches success', async () => {
    const updateChiefdomSpy = jest.spyOn(chiefdomService, 'updateChiefdom').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateChiefdom,
      {
        payload: updateChiefdomRequestMockData,
        type: ACTION_TYPES.UPDATE_CHIEFDOM_REQUEST
      }
    ).toPromise();
    expect(updateChiefdomSpy).toHaveBeenCalledWith(updateChiefdomRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.updateChiefdomSuccess()]);
  });

  it('Updates Chiefdom with successPayload flag and dispatches success', async () => {
    const updateChiefdomSpy = jest.spyOn(chiefdomService, 'updateChiefdom').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateChiefdom,
      {
        payload: updateChiefdomRequestMockData,
        isSuccessPayloadNeeded: true,
        type: ACTION_TYPES.UPDATE_CHIEFDOM_REQUEST
      }
    ).toPromise();
    expect(updateChiefdomSpy).toHaveBeenCalledWith(updateChiefdomRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.updateChiefdomSuccess({ name: 'Chiefdom Two' })]);
  });

  it('Fails to update Chiefdom and dispatches failure', async () => {
    const error = new Error('Failed to update Chiefdom');
    const updateChiefdomSpy = jest
      .spyOn(chiefdomService, 'updateChiefdom')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateChiefdom,
      {
        payload: updateChiefdomRequestMockData,
        type: ACTION_TYPES.UPDATE_CHIEFDOM_REQUEST
      }
    ).toPromise();
    expect(updateChiefdomSpy).toHaveBeenCalledWith(updateChiefdomRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.updateChiefdomFailure()]);
  });
});

describe('Fetch Chiefdom List in Dashboard', () => {
  it('Fetches a list of Chiefdom for Dashboard and dispatches success', async () => {
    const fetchChiefdomDashboardListSpy = jest
      .spyOn(chiefdomService, 'fetchChiefdomDashboardList')
      .mockImplementation(() => {
        return Promise.resolve({
          data: { entityList: fetchDashboardChiefdomsResponseMockData, totalCount: 10 }
        } as AxiosResponse);
      });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ user: { user: { tenantId: '4' } } })
      },
      fetchChiefdomDashboardList,
      {
        ...fetchDashboardChiefdomsRequestMockData,
        type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchChiefdomDashboardListSpy).toHaveBeenCalledWith('4', null, 0, undefined, 'Sample');
    const payload = {
      chiefdomDashboardList: fetchDashboardChiefdomsResponseMockData,
      total: 10,
      isLoadMore: false
    };
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomDashboardListSuccess(payload)]);
  });

  it('Fails to fetch list of Chiefdom for Dashboard and dispatches failure', async () => {
    const error = new Error('Failed to fetch Chiefdom dashboard list');
    const fetchChiefdomDashboardListSpy = jest
      .spyOn(chiefdomService, 'fetchChiefdomDashboardList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ user: { user: { tenantId: '4' } } })
      },
      fetchChiefdomDashboardList,
      {
        ...fetchDashboardChiefdomsRequestMockData,
        type: ACTION_TYPES.FETCH_CHIEFDOM_DASHBOARD_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchChiefdomDashboardListSpy).toHaveBeenCalledWith('4', null, 0, undefined, 'Sample');
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomDashboardListFailure(error)]);
  });
});

describe('Fetch Chiefdom List', () => {
  it('Fetches a list of Chiefdom and dispatches success', async () => {
    const fetchChiefdomListSpy = jest.spyOn(chiefdomService, 'fetchChiefdomList').mockImplementation(() => {
      return Promise.resolve({
        data: { entityList: fetchChiefdomsResponseMockData, totalCount: 10 }
      } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomList,
      {
        ...fetchChiefdomsRequestMockData,
        type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchChiefdomListSpy).toHaveBeenCalledWith('1', null, 0, 'Sample');
    const payload = {
      chiefdomList: fetchChiefdomsResponseMockData,
      total: 10
    };
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomListSuccess(payload)]);
  });

  it('Fails to fetch list of Chiefdom and dispatches failure', async () => {
    const error = new Error('Failed to fetch chiefdom list');
    const fetchChiefdomListSpy = jest
      .spyOn(chiefdomService, 'fetchChiefdomList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomList,
      {
        ...fetchChiefdomsRequestMockData,
        type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchChiefdomListSpy).toHaveBeenCalledWith('1', null, 0, 'Sample');
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomListFailure(error)]);
  });
});

describe('Creates an Chiefdom', () => {
  it('Creates Chiefdom and dispatches success', async () => {
    const createChiefdomSpy = jest.spyOn(chiefdomService, 'createChiefdom').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createChiefdom,
      {
        payload: createChiefdomRequestMockData,
        type: ACTION_TYPES.CREATE_CHIEFDOM_REQUEST
      }
    ).toPromise();
    expect(createChiefdomSpy).toHaveBeenCalledWith(createChiefdomRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.createChiefdomSuccess()]);
  });

  it('Fails to create Chiefdom and dispatches failure', async () => {
    const error = new Error('Failed to create chiefdom');
    const createChiefdomSpy = jest.spyOn(chiefdomService, 'createChiefdom').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createChiefdom,
      {
        payload: createChiefdomRequestMockData,
        type: ACTION_TYPES.CREATE_CHIEFDOM_REQUEST
      }
    ).toPromise();
    expect(createChiefdomSpy).toHaveBeenCalledWith(createChiefdomRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.createChiefdomFailure()]);
  });
});

describe('Fetches an Chiefdom', () => {
  it('Fetches Chiefdom and dispatches success', async () => {
    const fetchChiefdomSpy = jest.spyOn(chiefdomService, 'fetchChiefdomById').mockImplementation(() => {
      return Promise.resolve({
        data: { entity: fetchChiefdomByIdResponseMockData }
      } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomById,
      {
        payload: fetchChiefdomByIdRequestMockData,
        type: ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_REQUEST
      }
    ).toPromise();
    expect(fetchChiefdomSpy).toHaveBeenCalledWith(fetchChiefdomByIdRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomByIdSuccess()]);
  });

  it('Fails to fetch Chiefdom and dispatches failure', async () => {
    const error = new Error('Failed to fetch chiefdom');
    const fetchChiefdomSpy = jest.spyOn(chiefdomService, 'fetchChiefdomById').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomById,
      {
        payload: fetchChiefdomByIdRequestMockData,
        type: ACTION_TYPES.FETCH_CHIEFDOM_BY_ID_REQUEST
      }
    ).toPromise();
    expect(fetchChiefdomSpy).toHaveBeenCalledWith(fetchChiefdomByIdRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomByIdFailure()]);
  });
});

describe('Fetch Chiefdom Drpodown List', () => {
  it('Fetches Chiefdom Dropdown list and dispatches success', async () => {
    const fetchChiefdomDropdownListSpy = jest
      .spyOn(chiefdomService, 'fetchChiefdomForDropdown')
      .mockImplementation(() => {
        return Promise.resolve({
          data: { entityList: fetchChiefdomsResponseMockData, total: 10, limit: null }
        } as AxiosResponse);
      });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      getChiefdomListForDropdown,
      {
        tenantId: '4',
        type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST
      }
    ).toPromise();
    expect(fetchChiefdomDropdownListSpy).toHaveBeenCalledWith(fetchDropdownChiefdomsRequestMockData);
    const payload = {
      chiefdomList: fetchChiefdomsResponseMockData,
      total: 10,
      limit: null
    };
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomDropdownSuccess(payload)]);
  });

  it('Fails to fetch Chiefdom Dropdown list and dispatches failure', async () => {
    const error = new Error('Failed to fetch Chiefdom Dropdown list');
    const fetchChiefdomDropdownListSpy = jest
      .spyOn(chiefdomService, 'fetchChiefdomForDropdown')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      getChiefdomListForDropdown,
      {
        tenantId: '4',
        type: ACTION_TYPES.FETCH_CHIEFDOM_DROPDOWN_REQUEST
      }
    ).toPromise();
    expect(fetchChiefdomDropdownListSpy).toHaveBeenCalledWith(fetchDropdownChiefdomsRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.fetchChiefdomDropdownFailure(error)]);
  });
});

describe('Creates an Chiefdom Admin', () => {
  it('Creates Chiefdom admin and dispatches success', async () => {
    const createChiefdomAdminSpy = jest.spyOn(chiefdomService, 'createChiefdomAdmin').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createChiefdomAdmin,
      {
        payload: chiefdomAdminRequestMockData,
        type: ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_REQUEST
      }
    ).toPromise();
    expect(createChiefdomAdminSpy).toHaveBeenCalledWith(chiefdomAdminRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.createChiefdomAdminSuccess()]);
  });

  it('Fails to create Chiefdom admin and dispatches failure', async () => {
    const error = new Error('Failed to create Chiefdom admin');
    const createChiefdomAdminSpy = jest
      .spyOn(chiefdomService, 'createChiefdomAdmin')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createChiefdomAdmin,
      {
        payload: chiefdomAdminRequestMockData,
        type: ACTION_TYPES.CREATE_CHIEFDOM_ADMIN_REQUEST
      }
    ).toPromise();
    expect(createChiefdomAdminSpy).toHaveBeenCalledWith(chiefdomAdminRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.createChiefdomAdminFailure()]);
  });
});

describe('Updates an Chiefdom Admin', () => {
  it('Updates Chiefdom admin and dispatches success', async () => {
    const updateChiefdomAdminSpy = jest.spyOn(chiefdomService, 'updateChiefdomAdmin').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateChiefdomAdmin,
      {
        payload: chiefdomAdminRequestMockData,
        type: ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_REQUEST
      }
    ).toPromise();
    expect(updateChiefdomAdminSpy).toHaveBeenCalledWith(chiefdomAdminRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.updateChiefdomAdminSuccess()]);
  });

  it('Fails to update Chiefdom admin and dispatches failure', async () => {
    const error = new Error('Failed to update Chiefdom admin');
    const updateChiefdomAdminSpy = jest
      .spyOn(chiefdomService, 'updateChiefdomAdmin')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateChiefdomAdmin,
      {
        payload: chiefdomAdminRequestMockData,
        type: ACTION_TYPES.UPDATE_CHIEFDOM_ADMIN_REQUEST
      }
    ).toPromise();
    expect(updateChiefdomAdminSpy).toHaveBeenCalledWith(chiefdomAdminRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.updateChiefdomAdminFailure()]);
  });
});

describe('Deletes an Chiefdom Admin', () => {
  it('Deletes Chiefdom admin and dispatches success', async () => {
    const deleteChiefdomAdminSpy = jest.spyOn(chiefdomService, 'deleteChiefdomAdmin').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteChiefdomAdmin,
      {
        payload: chiefdomAdminRequestMockData,
        type: ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_REQUEST
      }
    ).toPromise();
    expect(deleteChiefdomAdminSpy).toHaveBeenCalledWith(chiefdomAdminRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.deleteChiefdomAdminSuccess()]);
  });

  it('Fails to delete Chiefdom admin and dispatches failure', async () => {
    const error = new Error('Failed to delete Chiefdom admin');
    const deleteChiefdomAdminSpy = jest
      .spyOn(chiefdomService, 'deleteChiefdomAdmin')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteChiefdomAdmin,
      {
        payload: deleteChiefdomAdminRequestMockData,
        type: ACTION_TYPES.DELETE_CHIEFDOM_ADMIN_REQUEST
      }
    ).toPromise();
    expect(deleteChiefdomAdminSpy).toHaveBeenCalledWith(deleteChiefdomAdminRequestMockData);
    expect(dispatched).toEqual([chiefdomActions.deleteChiefdomAdminFailure()]);
  });
});
