import { runSaga } from 'redux-saga';
import {
  activateAccount,
  createDistrict,
  createDistrictAdminInfo,
  deactivateDistrict,
  fetchDistrictDetail,
  fetchDistrictOptions,
  fetchDistrictList,
  getDashboardDistrict,
  removeDistrictAdmin,
  updateDistrictAdminInfo,
  updateDistrictDetail
} from '../sagas';
import * as districtService from '../../../services/districtAPI';
import * as districtActions from '../actions';
import * as siteActions from '../../healthFacility/actions';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/districtDataConstants';
import * as ACTION_TYPES from '../actionTypes';
import { AxiosPromise, AxiosResponse } from 'axios';

const createDistrictMockData = MOCK_DATA_CONSTANTS.CREATE_DISTRICT_PAYLOAD;
const updateDistrictMockData = MOCK_DATA_CONSTANTS.UPDATE_DISTRICT_PAYLOAD;
const districtAdminMockData = MOCK_DATA_CONSTANTS.DISTRICT_ADMIN;
const defaultRequestMockData = MOCK_DATA_CONSTANTS.DEFAULT_REQUEST_PAYLOAD;
const searchDistrictAdminRequestMockData = MOCK_DATA_CONSTANTS.SEARCH_DISTRICT_ADMIN_REQUEST_PAYLOAD;
const districtDetailResponseMockData = MOCK_DATA_CONSTANTS.DISTRICT_DETAIL_RESPONSE_PAYLOAD;
const fetchActiveDistrictRequestMockData = MOCK_DATA_CONSTANTS.FETCH_ACTIVE_DISTRICT_LIST_REQUEST_PAYLOAD;
const fetchInactiveDistrictRequestMockData = MOCK_DATA_CONSTANTS.FETCH_INACTIVE_ACCOUNTS_REQUEST_PAYLOAD;
const fetchDistrictResponseMockData = MOCK_DATA_CONSTANTS.FETCH_DISTRICT_LIST_RESPONSE_PAYLOAD;
const fetchDashboardDistrictRequestMockData = MOCK_DATA_CONSTANTS.FETCH_DASHBOARD_DISTRICT_PAYLOAD;
const dashboardDistrictResponseMockData = MOCK_DATA_CONSTANTS.DASHBOARD_DISTRICT_RESPONSE_PAYLOAD;
const activateDistrictRequestMockData = MOCK_DATA_CONSTANTS.ACTIVATE_DISTRICT_PAYLOAD;
const deactivateDistrictRequestMockData = MOCK_DATA_CONSTANTS.DEACTIVATE_DISTRICT_PAYLOAD;
const fetchDistrictOptionsRequestMockData = MOCK_DATA_CONSTANTS.FETCH_DISTRICT_OPTIONS_REQUEST_PAYLOAD;
const fetchDistrictOptionsResponseMockData = MOCK_DATA_CONSTANTS.FETCH_DISTRICT_OPTIONS_RESPONSE_PAYLOAD;
const mockState = { user: { user: { appTypes: ['COMMUNITY', 'NON_COMMUNITY'] } } };

describe('District sagas', () => {
  describe('Fetches District List: FETCH_DISTRICT_LIST_REQUEST', () => {
    it('Fetches list of Active Districts and dispatches success', async () => {
      const fetchActivateDistrictsSpy = jest
        .spyOn(districtService, 'fetchDistrictList')
        .mockImplementation(() =>
          Promise.resolve({ data: { entityList: fetchDistrictResponseMockData, totalCount: 10 } } as AxiosResponse)
        );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDistrictList,
        { ...fetchActiveDistrictRequestMockData, type: ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST }
      ).toPromise();
      expect(fetchActivateDistrictsSpy).toHaveBeenCalledWith(
        fetchActiveDistrictRequestMockData.countryId,
        fetchActiveDistrictRequestMockData.tenantId,
        fetchActiveDistrictRequestMockData.isActive,
        fetchActiveDistrictRequestMockData.skip,
        fetchActiveDistrictRequestMockData.limit,
        mockState.user.user.appTypes,
        fetchActiveDistrictRequestMockData.search
      );
      expect(dispatched).toEqual([
        districtActions.fetchDistrictListSuccess({
          districtList: fetchDistrictResponseMockData as any,
          total: 10
        })
      ]);
    });

    it('Fails to fetch list of Districts and dispatches failure', async () => {
      const error = new Error('Failed to fetch Districts');
      const fetchDistrictsSpy = jest
        .spyOn(districtService, 'fetchDistrictList')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDistrictList,
        { ...fetchActiveDistrictRequestMockData, type: ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST }
      ).toPromise();
      expect(fetchDistrictsSpy).toHaveBeenCalledWith(
        fetchActiveDistrictRequestMockData.countryId,
        fetchActiveDistrictRequestMockData.tenantId,
        fetchActiveDistrictRequestMockData.isActive,
        fetchActiveDistrictRequestMockData.skip,
        fetchActiveDistrictRequestMockData.limit,
        mockState.user.user.appTypes,
        fetchActiveDistrictRequestMockData.search
      );
      expect(dispatched).toEqual([districtActions.fetchDistrictListFailure(error)]);
    });
  });

  describe('Fetch Deactivated Accounts: FETCH_DISTRICT_LIST_REQUEST', () => {
    it('Fetches list of Deactivated Accounts and dispatches success', async () => {
      const fetchDeactivatedAccountsSpy = jest
        .spyOn(districtService, 'fetchDeactivatedAccounts')
        .mockImplementation(() =>
          Promise.resolve({ data: { entityList: fetchDistrictResponseMockData, totalCount: 10 } } as AxiosResponse)
        );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDistrictList,
        { ...(fetchInactiveDistrictRequestMockData as any), type: ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST }
      ).toPromise();
      expect(fetchDeactivatedAccountsSpy).toHaveBeenCalledWith(0, 10, undefined, 'Sample', '3');
      expect(dispatched).toEqual([
        districtActions.fetchDistrictListSuccess({
          districtList: fetchDistrictResponseMockData as any,
          total: 10
        })
      ]);
    });

    it('Fetches list of Deactivated Accounts and dispatches failure', async () => {
      const error = new Error('Failed to fetch Districts');
      const fetchDeactivatedAccountsSpy = jest
        .spyOn(districtService, 'fetchDeactivatedAccounts')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDistrictList,
        { ...(fetchInactiveDistrictRequestMockData as any), type: ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST }
      ).toPromise();
      expect(fetchDeactivatedAccountsSpy).toHaveBeenCalledWith(0, 10, undefined, 'Sample', '3');
      expect(dispatched).toEqual([districtActions.fetchDistrictListFailure(error)]);
    });
  });

  describe('Create District in Region: CREATE_DISTRICT_REQUEST', () => {
    it('Creates an district and dispatches success', async () => {
      const createDistrictSpy = jest
        .spyOn(districtService, 'createDistrict')
        .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createDistrict,
        { data: createDistrictMockData, type: ACTION_TYPES.CREATE_DISTRICT_REQUEST }
      ).toPromise();
      expect(createDistrictSpy).toHaveBeenCalledWith(createDistrictMockData);
      expect(dispatched).toEqual([districtActions.createDistrictSuccess()]);
    });

    it('Fails to create an district and dispatches failure', async () => {
      const error = new Error('Failed to create district');
      const createDistrictSpy = jest
        .spyOn(districtService, 'createDistrict')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createDistrict,
        { data: createDistrictMockData, type: ACTION_TYPES.CREATE_DISTRICT_REQUEST }
      ).toPromise();
      expect(createDistrictSpy).toHaveBeenCalledWith(createDistrictMockData);
      expect(dispatched).toEqual([districtActions.createDistrictFailure(error)]);
    });
  });

  describe('Fetch District Detail: FETCH_DISTRICT_DETAIL_REQUEST', () => {
    it('Fetches an district detail and dispatches success', async () => {
      const fetchDistrictDetailSpy = jest.spyOn(districtService, 'fetchDistrictDetails').mockImplementation(() => {
        return Promise.resolve({ data: { entity: districtDetailResponseMockData } } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchDistrictDetail,
        { payload: defaultRequestMockData, type: ACTION_TYPES.FETCH_DISTRICT_DETAIL_REQUEST }
      ).toPromise();
      expect(fetchDistrictDetailSpy).toHaveBeenCalledWith(defaultRequestMockData);
      expect(dispatched).toEqual([districtActions.fetchDistrictDetailSuccess(districtDetailResponseMockData as any)]);
    });

    it('Search for district admins in district detail without countryId and dispatches success', async () => {
      const fetchDistrictDetailSpy = jest.spyOn(districtService, 'fetchDistrictAdmins').mockImplementation(() => {
        return Promise.resolve({ data: { entityList: districtDetailResponseMockData.users } } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDistrictDetail,
        {
          payload: searchDistrictAdminRequestMockData as any,
          type: ACTION_TYPES.FETCH_DISTRICT_DETAIL_REQUEST
        }
      ).toPromise();
      expect(fetchDistrictDetailSpy).toHaveBeenCalledWith({
        ...searchDistrictAdminRequestMockData,
        appTypes: mockState.user.user.appTypes
      });
      expect(dispatched).toEqual([districtActions.searchUserSuccess(districtDetailResponseMockData.users as any)]);
    });

    it('Search for district admins in district detail with countryId and dispatches success', async () => {
      const fetchDistrictDetailSpy = jest.spyOn(districtService, 'fetchDistrictAdmins').mockImplementation(() => {
        return Promise.resolve({ data: { entityList: districtDetailResponseMockData.users } } as AxiosResponse);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDistrictDetail,
        {
          payload: { ...searchDistrictAdminRequestMockData, countryId: 1 } as any,
          type: ACTION_TYPES.FETCH_DISTRICT_DETAIL_REQUEST
        }
      ).toPromise();
      expect(fetchDistrictDetailSpy).toHaveBeenCalledWith({
        ...searchDistrictAdminRequestMockData,
        countryId: 1,
        appTypes: mockState.user.user.appTypes
      });
      expect(dispatched).toEqual([districtActions.searchUserSuccess(districtDetailResponseMockData.users as any)]);
    });

    it('Search for district admins in district detail and dispatches failure', async () => {
      const error = new Error('Failed to search district detail');
      const fetchDistrictDetailSpy = jest.spyOn(districtService, 'fetchDistrictAdmins').mockImplementation(() => {
        return Promise.reject(error);
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDistrictDetail,
        {
          payload: searchDistrictAdminRequestMockData as any,
          type: ACTION_TYPES.FETCH_DISTRICT_DETAIL_REQUEST
        }
      ).toPromise();
      expect(fetchDistrictDetailSpy).toHaveBeenCalledWith({
        ...searchDistrictAdminRequestMockData,
        appTypes: mockState.user.user.appTypes
      });
      expect(dispatched).toEqual([districtActions.fetchDistrictDetailFail(error)]);
    });

    it('Fails to fetch an district detail and dispatches failure', async () => {
      const error = new Error('Failed to fetch district detail');
      const fetchDistrictDetailSpy = jest
        .spyOn(districtService, 'fetchDistrictDetails')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchDistrictDetail,
        { payload: defaultRequestMockData, type: ACTION_TYPES.FETCH_DISTRICT_DETAIL_REQUEST }
      ).toPromise();
      expect(fetchDistrictDetailSpy).toHaveBeenCalledWith(defaultRequestMockData);
      expect(dispatched).toEqual([districtActions.fetchDistrictDetailFail(error)]);
    });
  });

  describe('Fetches District List for Dashboard: FETCH_DISTRICT_DASHBOARD_LIST_REQUEST', () => {
    it('Fetches list of district for dashboard and dispatches success', async () => {
      const fetchDashboardDistrictsSpy = jest
        .spyOn(districtService, 'fetchDashboardDistrict')
        .mockImplementation(() =>
          Promise.resolve({ data: { entityList: dashboardDistrictResponseMockData, totalCount: 10 } } as AxiosResponse)
        );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({ user: { user: { tenantId: '4' } } })
        },
        getDashboardDistrict,
        { payload: fetchDashboardDistrictRequestMockData, type: ACTION_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_REQUEST }
      ).toPromise();
      expect(fetchDashboardDistrictsSpy).toHaveBeenCalledWith(fetchDashboardDistrictRequestMockData);
      expect(dispatched).toEqual([
        districtActions.fetchDashboardDistrictSuccess({
          data: dashboardDistrictResponseMockData,
          total: 10
        })
      ]);
    });

    it('Fails to fetch list of district for dashboard and dispatches failure', async () => {
      const error = new Error('Failed to fetch dashboard district');
      const fetchDashboardDistrictsSpy = jest
        .spyOn(districtService, 'fetchDashboardDistrict')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({ user: { user: { tenantId: '4' } } })
        },
        getDashboardDistrict,
        { payload: fetchDashboardDistrictRequestMockData, type: ACTION_TYPES.FETCH_DISTRICT_DASHBOARD_LIST_REQUEST }
      ).toPromise();
      expect(fetchDashboardDistrictsSpy).toHaveBeenCalledWith(fetchDashboardDistrictRequestMockData);
      expect(dispatched).toEqual([districtActions.fetchDashboardDistrictFail(error)]);
    });
  });

  describe('Update an District Detail: UPDATE_DISTRICT_DETAIL_REQUEST', () => {
    it('Updates an district and dispatches success', async () => {
      const updateDistrictSpy = jest
        .spyOn(districtService, 'updateDistrict')
        .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateDistrictDetail,
        { data: updateDistrictMockData, type: ACTION_TYPES.UPDATE_DISTRICT_DETAIL_REQUEST }
      ).toPromise();
      expect(updateDistrictSpy).toHaveBeenCalledWith(updateDistrictMockData);
      expect(dispatched).toEqual([districtActions.updateDistrictDetailSuccess(updateDistrictMockData)]);
    });

    it('Fails to update an district and dispatches failure', async () => {
      const error = new Error('Failed to update district');
      const updateDistrictSpy = jest
        .spyOn(districtService, 'updateDistrict')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateDistrictDetail,
        { data: updateDistrictMockData, type: ACTION_TYPES.UPDATE_DISTRICT_DETAIL_REQUEST }
      ).toPromise();
      expect(updateDistrictSpy).toHaveBeenCalledWith(updateDistrictMockData);
      expect(dispatched).toEqual([districtActions.updateDistrictDetailFail(error)]);
    });
  });

  describe('Update an District Admin: UPDATE_DISTRICT_ADMIN_REQUEST', () => {
    it('Updates an district admin and dispatches success', async () => {
      const updateDistrictAdminSpy = jest
        .spyOn(districtService, 'updateDistrictAdmin')
        .mockImplementation(() => Promise.resolve({} as AxiosResponse));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateDistrictAdminInfo,
        { data: districtAdminMockData, type: ACTION_TYPES.UPDATE_DISTRICT_ADMIN_REQUEST }
      ).toPromise();
      expect(updateDistrictAdminSpy).toHaveBeenCalledWith(districtAdminMockData);
      expect(dispatched).toEqual([districtActions.updateDistrictAdminSuccess()]);
    });

    it('Fails to update district admin and dispatches failure', async () => {
      const error = new Error('Failed to update district admin');
      const updateDistrictAdminSpy = jest
        .spyOn(districtService, 'updateDistrictAdmin')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateDistrictAdminInfo,
        { data: districtAdminMockData, type: ACTION_TYPES.UPDATE_DISTRICT_ADMIN_REQUEST }
      ).toPromise();
      expect(updateDistrictAdminSpy).toHaveBeenCalledWith(districtAdminMockData);
      expect(dispatched).toEqual([districtActions.updateDistrictAdminFail(error)]);
    });
  });

  describe('Create an District Admin: CREATE_DISTRICT_ADMIN_REQUEST', () => {
    it('Creates an district admin and dispatches success', async () => {
      const createDistrictAdminSpy = jest
        .spyOn(districtService, 'createDistrictAdmin')
        .mockImplementation(() => Promise.resolve({} as AxiosResponse));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createDistrictAdminInfo,
        { data: districtAdminMockData, type: ACTION_TYPES.CREATE_DISTRICT_ADMIN_REQUEST }
      ).toPromise();
      expect(createDistrictAdminSpy).toHaveBeenCalledWith(districtAdminMockData);
      expect(dispatched).toEqual([districtActions.createDistrictAdminSuccess()]);
    });

    it('Fails to create an district admin and dispatches failure', async () => {
      const error = new Error('Failed to create district admin');
      const createDistrictAdminSpy = jest
        .spyOn(districtService, 'createDistrictAdmin')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createDistrictAdminInfo,
        { data: districtAdminMockData, type: ACTION_TYPES.CREATE_DISTRICT_ADMIN_REQUEST }
      ).toPromise();
      expect(createDistrictAdminSpy).toHaveBeenCalledWith(districtAdminMockData);
      expect(dispatched).toEqual([districtActions.createDistrictAdminFail(error)]);
    });
  });

  describe('Remove an District Admin: DELETE_DISTRICT_ADMIN_REQUEST', () => {
    it('Remove an district admin and dispatches success', async () => {
      const updateDistrictAdminSpy = jest
        .spyOn(districtService, 'deleteDistrictAdmin')
        .mockImplementation(() => Promise.resolve({} as AxiosResponse));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        removeDistrictAdmin,
        { data: defaultRequestMockData, type: ACTION_TYPES.DELETE_DISTRICT_ADMIN_REQUEST }
      ).toPromise();
      expect(updateDistrictAdminSpy).toHaveBeenCalledWith(defaultRequestMockData);
      expect(dispatched).toEqual([districtActions.deleteDistrictAdminSuccess()]);
    });

    it('Fails to update district admin and dispatches failure', async () => {
      const error = new Error('Failed to update district admin');
      const updateDistrictAdminSpy = jest
        .spyOn(districtService, 'deleteDistrictAdmin')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        removeDistrictAdmin,
        { data: defaultRequestMockData, type: ACTION_TYPES.DELETE_DISTRICT_ADMIN_REQUEST }
      ).toPromise();
      expect(updateDistrictAdminSpy).toHaveBeenCalledWith(defaultRequestMockData);
      expect(dispatched).toEqual([districtActions.deleteDistrictAdminFail(error)]);
    });
  });

  describe('Activate an inactive account: ACTIVATE_ACCOUNT_REQUEST', () => {
    it('Activates an district and dispatches success', async () => {
      const activateDistrictSpy = jest
        .spyOn(districtService, 'activateAccount')
        .mockImplementation(() => Promise.resolve({} as AxiosResponse));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        activateAccount,
        { data: activateDistrictRequestMockData, type: ACTION_TYPES.ACTIVATE_ACCOUNT_REQUEST }
      ).toPromise();
      expect(activateDistrictSpy).toHaveBeenCalledWith(activateDistrictRequestMockData);
      expect(dispatched).toEqual([districtActions.activateAccountSuccess()]);
    });

    it('Fails to activate district and dispatches failure', async () => {
      const error = new Error('Failed to activate district');
      const activateDistrictSpy = jest
        .spyOn(districtService, 'activateAccount')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        activateAccount,
        { data: activateDistrictRequestMockData, type: ACTION_TYPES.ACTIVATE_ACCOUNT_REQUEST }
      ).toPromise();
      expect(activateDistrictSpy).toHaveBeenCalledWith(activateDistrictRequestMockData);
      expect(dispatched).toEqual([districtActions.activateAccountFail(error)]);
    });
  });

  describe('Deactivates an district: DEACTIVATE_DISTRICT_REQUEST', () => {
    it('Deactivates an district and dispatches success', async () => {
      const deactivateDistrictSpy = jest
        .spyOn(districtService, 'deactivateDistrict')
        .mockImplementation(() => Promise.resolve({} as AxiosResponse));
      const dispatched: any = [];
      const task = runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        deactivateDistrict,
        { data: deactivateDistrictRequestMockData, type: ACTION_TYPES.DEACTIVATE_DISTRICT_REQUEST }
      );

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(task.toPromise());
        }, 1000);
      });

      expect(deactivateDistrictSpy).toHaveBeenCalledWith(deactivateDistrictRequestMockData);
      expect(dispatched).toEqual([districtActions.deactivateDistrictSuccess(), siteActions.clearHFDropdown()]);
    });

    it('Fails to deactivate district and dispatches failure', async () => {
      const error = new Error('Failed to deactivate district');
      const deactivateDistrictSpy = jest
        .spyOn(districtService, 'deactivateDistrict')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        deactivateDistrict,
        { data: deactivateDistrictRequestMockData, type: ACTION_TYPES.DEACTIVATE_DISTRICT_REQUEST }
      ).toPromise();
      expect(deactivateDistrictSpy).toHaveBeenCalledWith(deactivateDistrictRequestMockData);
      expect(dispatched).toEqual([districtActions.deactivateDistrictFail(error)]);
    });
  });

  describe('Fetches District Options: FETCH_DISTRICT_OPTIONS_REQUEST', () => {
    it('Fetches list of district options and dispatches success', async () => {
      const fetchDistrictOptionsSpy = jest
        .spyOn(districtService, 'fetchDistrictOptions')
        .mockImplementation(() =>
          Promise.resolve({ data: { entityList: fetchDistrictOptionsResponseMockData } } as AxiosResponse)
        );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchDistrictOptions,
        { ...fetchDistrictOptionsRequestMockData, type: ACTION_TYPES.FETCH_DISTRICT_OPTIONS_REQUEST }
      ).toPromise();
      expect(fetchDistrictOptionsSpy).toHaveBeenCalledWith(fetchDistrictOptionsRequestMockData);
      expect(dispatched).toEqual([districtActions.fetchDistrictOptionsSuccess(fetchDistrictOptionsResponseMockData)]);
    });

    it('Fails to fetch list of district options and dispatches failure', async () => {
      const error = new Error('Failed to fetch dashboard district');
      const fetchDistrictOptionsSpy = jest
        .spyOn(districtService, 'fetchDistrictOptions')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({ user: { user: { tenantId: '4' } } })
        },
        fetchDistrictOptions,
        { ...fetchDistrictOptionsRequestMockData, type: ACTION_TYPES.FETCH_DISTRICT_OPTIONS_REQUEST }
      ).toPromise();
      expect(fetchDistrictOptionsSpy).toHaveBeenCalledWith(fetchDistrictOptionsRequestMockData);
      expect(dispatched).toEqual([districtActions.fetchDistrictOptionsFailure()]);
    });
  });
});
