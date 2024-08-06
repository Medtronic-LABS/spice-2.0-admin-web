import { runSaga } from 'redux-saga';
import {
  activateCounty,
  createCounty,
  createCountyAdminInfo,
  createCountyWorkflowRequest,
  deactivateCounty,
  deleteCountyWorkflowRequest,
  fetchCountyDetail,
  fetchCountyOptions,
  fetchCountyList,
  fetchClinicalWorkflows,
  getDashboardCounty,
  removeCountyAdmin,
  updateCountyAdminInfo,
  updateCountyDetail,
  updateCountyWorkflowRequest
} from '../sagas';
import * as countyService from '../../../services/countyAPI';
import * as countyActions from '../actions';
import * as siteActions from '../../healthFacilityDashboard/actions';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/countyDataConstants';
import * as ACTION_TYPES from '../actionTypes';
import { AxiosPromise, AxiosResponse } from 'axios';

const createCountyMockData = MOCK_DATA_CONSTANTS.CREATE_COUNTY_PAYLOAD;
const updateCountyMockData = MOCK_DATA_CONSTANTS.UPDATE_COUNTY_PAYLOAD;
const countyAdminMockData = MOCK_DATA_CONSTANTS.COUNTY_ADMIN;
const defaultRequestMockData = MOCK_DATA_CONSTANTS.DEFAULT_REQUEST_PAYLOAD;
const searchCountyAdminRequestMockData = MOCK_DATA_CONSTANTS.SEARCH_COUNTY_ADMIN_REQUEST_PAYLOAD;
const countyDetailResponseMockData = MOCK_DATA_CONSTANTS.COUNTY_DETAIL_RESPONSE_PAYLOAD;
const countyWorkflowMockData = MOCK_DATA_CONSTANTS.COUNTY_WORLFOW_PAYLOAD;
const deleteCountyWorkflowMockData = MOCK_DATA_CONSTANTS.DELETE_COUNTY_WORLFOW_PAYLOAD;
const fetchClinicalWorkflowsRequestMockData = MOCK_DATA_CONSTANTS.FETCH_CLINICAL_WORKFLOWS_REQUEST_PAYLOAD;
const fetchClinicalWorkflowsResponseMockData = MOCK_DATA_CONSTANTS.FETCH_CLINICAL_WORKFLOWS_RESPONSE_PAYLOAD;
const fetchActiveCountyRequestMockData = MOCK_DATA_CONSTANTS.FETCH_ACTIVE_COUNTY_LIST_REQUEST_PAYLOAD;
const fetchInactiveCountyRequestMockData = MOCK_DATA_CONSTANTS.FETCH_INACTIVE_ACCOUNTS_REQUEST_PAYLOAD;
const fetchCountyResponseMockData = MOCK_DATA_CONSTANTS.FETCH_COUNTY_LIST_RESPONSE_PAYLOAD;
const fetchDashboardCountyRequestMockData = MOCK_DATA_CONSTANTS.FETCH_DASHBOARD_COUNTY_PAYLOAD;
const dashboardCountyResponseMockData = MOCK_DATA_CONSTANTS.DASHBOARD_COUNTY_RESPONSE_PAYLOAD;
const activateCountyRequestMockData = MOCK_DATA_CONSTANTS.ACTIVATE_COUNTY_PAYLOAD;
const deactivateCountyRequestMockData = MOCK_DATA_CONSTANTS.DEACTIVATE_COUNTY_PAYLOAD;
const fetchCountyOptionsRequestMockData = MOCK_DATA_CONSTANTS.FETCH_COUNTY_OPTIONS_REQUEST_PAYLOAD;
const fetchCountyOptionsResponseMockData = MOCK_DATA_CONSTANTS.FETCH_COUNTY_OPTIONS_RESPONSE_PAYLOAD;

describe('Create County in Region', () => {
  it('Creates an county and dispatches success', async () => {
    const createCountySpy = jest
      .spyOn(countyService, 'createCounty')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createCounty,
      { data: createCountyMockData, type: ACTION_TYPES.CREATE_COUNTY_REQUEST }
    ).toPromise();
    expect(createCountySpy).toHaveBeenCalledWith(createCountyMockData);
    expect(dispatched).toEqual([countyActions.createCountySuccess()]);
  });

  it('Fails to create an county and dispatches failure', async () => {
    const error = new Error('Failed to create county');
    const createCountySpy = jest.spyOn(countyService, 'createCounty').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createCounty,
      { data: createCountyMockData, type: ACTION_TYPES.CREATE_COUNTY_REQUEST }
    ).toPromise();
    expect(createCountySpy).toHaveBeenCalledWith(createCountyMockData);
    expect(dispatched).toEqual([countyActions.createCountyFailure(error)]);
  });
});

describe('Update an County Detail', () => {
  it('Updates an county and dispatches success', async () => {
    const updateCountySpy = jest
      .spyOn(countyService, 'updateCounty')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateCountyDetail,
      { data: updateCountyMockData, type: ACTION_TYPES.UPDATE_COUNTY_DETAIL_REQUEST }
    ).toPromise();
    expect(updateCountySpy).toHaveBeenCalledWith(updateCountyMockData);
    expect(dispatched).toEqual([countyActions.updateCountyDetailSuccess(updateCountyMockData)]);
  });

  it('Fails to update an county and dispatches failure', async () => {
    const error = new Error('Failed to update county');
    const updateCountySpy = jest.spyOn(countyService, 'updateCounty').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateCountyDetail,
      { data: updateCountyMockData, type: ACTION_TYPES.UPDATE_COUNTY_DETAIL_REQUEST }
    ).toPromise();
    expect(updateCountySpy).toHaveBeenCalledWith(updateCountyMockData);
    expect(dispatched).toEqual([countyActions.updateCountyDetailFail(error)]);
  });
});

describe('Fetch County Detail', () => {
  it('Fetches an county detail and dispatches success', async () => {
    const fetchCountyDetailSpy = jest.spyOn(countyService, 'fetchCountyDetails').mockImplementation(() => {
      return Promise.resolve({ data: { entity: countyDetailResponseMockData } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountyDetail,
      { payload: defaultRequestMockData, type: ACTION_TYPES.FETCH_COUNTY_DETAIL_REQUEST }
    ).toPromise();
    expect(fetchCountyDetailSpy).toHaveBeenCalledWith(defaultRequestMockData);
    expect(dispatched).toEqual([countyActions.fetchCountyDetailSuccess(countyDetailResponseMockData as any)]);
  });

  it('Search for county admins in county detail and dispatches success', async () => {
    const fetchCountyDetailSpy = jest.spyOn(countyService, 'fetchCountyAdmins').mockImplementation(() => {
      return Promise.resolve({ data: { entityList: countyDetailResponseMockData.users } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountyDetail,
      {
        payload: searchCountyAdminRequestMockData as any,
        type: ACTION_TYPES.FETCH_COUNTY_DETAIL_REQUEST
      }
    ).toPromise();
    expect(fetchCountyDetailSpy).toHaveBeenCalledWith(searchCountyAdminRequestMockData);
    expect(dispatched).toEqual([countyActions.searchUserSuccess(countyDetailResponseMockData.users as any)]);
  });

  it('Search for county admins in county detail and dispatches failure', async () => {
    const error = new Error('Failed to search county detail');
    const fetchCountyDetailSpy = jest.spyOn(countyService, 'fetchCountyAdmins').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountyDetail,
      {
        payload: searchCountyAdminRequestMockData as any,
        type: ACTION_TYPES.FETCH_COUNTY_DETAIL_REQUEST
      }
    ).toPromise();
    expect(fetchCountyDetailSpy).toHaveBeenCalledWith(searchCountyAdminRequestMockData);
    expect(dispatched).toEqual([countyActions.fetchCountyDetailFail(error)]);
  });

  it('Fails to fetch an county detail and dispatches failure', async () => {
    const error = new Error('Failed to fetch county detail');
    const fetchCountyDetailSpy = jest
      .spyOn(countyService, 'fetchCountyDetails')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountyDetail,
      { payload: defaultRequestMockData, type: ACTION_TYPES.FETCH_COUNTY_DETAIL_REQUEST }
    ).toPromise();
    expect(fetchCountyDetailSpy).toHaveBeenCalledWith(defaultRequestMockData);
    expect(dispatched).toEqual([countyActions.fetchCountyDetailFail(error)]);
  });
});

describe('Create an County Admin', () => {
  it('Creates an county admin and dispatches success', async () => {
    const createCountyAdminSpy = jest
      .spyOn(countyService, 'createCountyAdmin')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createCountyAdminInfo,
      { data: countyAdminMockData, type: ACTION_TYPES.CREATE_COUNTY_ADMIN_REQUEST }
    ).toPromise();
    expect(createCountyAdminSpy).toHaveBeenCalledWith(countyAdminMockData);
    expect(dispatched).toEqual([countyActions.createCountyAdminSuccess()]);
  });

  it('Fails to create an county admin and dispatches failure', async () => {
    const error = new Error('Failed to create county admin');
    const createCountyAdminSpy = jest
      .spyOn(countyService, 'createCountyAdmin')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createCountyAdminInfo,
      { data: countyAdminMockData, type: ACTION_TYPES.CREATE_COUNTY_ADMIN_REQUEST }
    ).toPromise();
    expect(createCountyAdminSpy).toHaveBeenCalledWith(countyAdminMockData);
    expect(dispatched).toEqual([countyActions.createCountyAdminFail(error)]);
  });
});

describe('Update an County Admin', () => {
  it('Updates an county admin and dispatches success', async () => {
    const updateCountyAdminSpy = jest
      .spyOn(countyService, 'updateCountyAdmin')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateCountyAdminInfo,
      { data: countyAdminMockData, type: ACTION_TYPES.UPDATE_COUNTY_ADMIN_REQUEST }
    ).toPromise();
    expect(updateCountyAdminSpy).toHaveBeenCalledWith(countyAdminMockData);
    expect(dispatched).toEqual([countyActions.updateCountyAdminSuccess()]);
  });

  it('Fails to update county admin and dispatches failure', async () => {
    const error = new Error('Failed to update county admin');
    const updateCountyAdminSpy = jest
      .spyOn(countyService, 'updateCountyAdmin')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateCountyAdminInfo,
      { data: countyAdminMockData, type: ACTION_TYPES.UPDATE_COUNTY_ADMIN_REQUEST }
    ).toPromise();
    expect(updateCountyAdminSpy).toHaveBeenCalledWith(countyAdminMockData);
    expect(dispatched).toEqual([countyActions.updateCountyAdminFail(error)]);
  });
});

describe('Remove an County Admin', () => {
  it('Remove an county admin and dispatches success', async () => {
    const updateCountyAdminSpy = jest
      .spyOn(countyService, 'deleteCountyAdmin')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      removeCountyAdmin,
      { data: defaultRequestMockData, type: ACTION_TYPES.DELETE_COUNTY_ADMIN_REQUEST }
    ).toPromise();
    expect(updateCountyAdminSpy).toHaveBeenCalledWith(defaultRequestMockData);
    expect(dispatched).toEqual([countyActions.deleteCountyAdminSuccess()]);
  });

  it('Fails to update county admin and dispatches failure', async () => {
    const error = new Error('Failed to update county admin');
    const updateCountyAdminSpy = jest
      .spyOn(countyService, 'deleteCountyAdmin')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      removeCountyAdmin,
      { data: defaultRequestMockData, type: ACTION_TYPES.DELETE_COUNTY_ADMIN_REQUEST }
    ).toPromise();
    expect(updateCountyAdminSpy).toHaveBeenCalledWith(defaultRequestMockData);
    expect(dispatched).toEqual([countyActions.deleteCountyAdminFail(error)]);
  });
});

describe('Create an County Workflow', () => {
  it('Creates an county workflow and dispatches success', async () => {
    const createCountyWorkflowSpy = jest
      .spyOn(countyService, 'createCountyWorkflowModule')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createCountyWorkflowRequest,
      { data: countyWorkflowMockData, type: ACTION_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_REQUEST }
    ).toPromise();
    expect(createCountyWorkflowSpy).toHaveBeenCalledWith(countyWorkflowMockData);
    expect(dispatched).toEqual([countyActions.createCountyWorkflowModuleSuccess()]);
  });

  it('Fails to create an county workflow and dispatches failure', async () => {
    const error = new Error('Failed to create county workflow');
    const createCountyWorkflowSpy = jest
      .spyOn(countyService, 'createCountyWorkflowModule')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createCountyWorkflowRequest,
      { data: countyWorkflowMockData, type: ACTION_TYPES.CREATE_COUNTY_WORKFLOW_MODULE_REQUEST }
    ).toPromise();
    expect(createCountyWorkflowSpy).toHaveBeenCalledWith(countyWorkflowMockData);
    expect(dispatched).toEqual([countyActions.createCountyWorkflowModuleFailure(error)]);
  });
});

describe('Update an County Workflow', () => {
  it('Updates an county workflow and dispatches success', async () => {
    const updateCountyWorkflowSpy = jest
      .spyOn(countyService, 'updateCountyWorkflowModule')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateCountyWorkflowRequest,
      { data: countyWorkflowMockData, type: ACTION_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_REQUEST }
    ).toPromise();
    expect(updateCountyWorkflowSpy).toHaveBeenCalledWith(countyWorkflowMockData);
    expect(dispatched).toEqual([countyActions.updateCountyWorkflowModuleSuccess()]);
  });

  it('Fails to update an county workflow and dispatches failure', async () => {
    const error = new Error('Failed to update county workflow');
    const updateCountyWorkflowSpy = jest
      .spyOn(countyService, 'updateCountyWorkflowModule')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateCountyWorkflowRequest,
      { data: countyWorkflowMockData, type: ACTION_TYPES.UPDATE_COUNTY_WORKFLOW_MODULE_REQUEST }
    ).toPromise();
    expect(updateCountyWorkflowSpy).toHaveBeenCalledWith(countyWorkflowMockData);
    expect(dispatched).toEqual([countyActions.updateCountyWorkflowModuleFailure(error)]);
  });
});

describe('Delete an County Workflow', () => {
  it('Removes an county workflow and dispatches success', async () => {
    const deleteCountyWorkflowSpy = jest
      .spyOn(countyService, 'deleteCountyWorkflowModule')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteCountyWorkflowRequest,
      { data: deleteCountyWorkflowMockData, type: ACTION_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_REQUEST }
    ).toPromise();
    expect(deleteCountyWorkflowSpy).toHaveBeenCalledWith(deleteCountyWorkflowMockData);
    expect(dispatched).toEqual([countyActions.deleteCountyWorkflowModuleSuccess()]);
  });

  it('Fails to remove an county workflow and dispatches failure', async () => {
    const error = new Error('Failed to delete county workflow');
    const deleteCountyWorkflowSpy = jest
      .spyOn(countyService, 'deleteCountyWorkflowModule')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteCountyWorkflowRequest,
      { data: deleteCountyWorkflowMockData, type: ACTION_TYPES.DELETE_COUNTY_WORKFLOW_MODULE_REQUEST }
    ).toPromise();
    expect(deleteCountyWorkflowSpy).toHaveBeenCalledWith(deleteCountyWorkflowMockData);
    expect(dispatched).toEqual([countyActions.deleteCountyWorkflowModuleFailure(error)]);
  });
});

describe('Fetches Clinical Workflow List', () => {
  it('Fetches list of clinical workflows and dispatches success', async () => {
    const fetchClinicalWorkflowsSpy = jest.spyOn(countyService, 'fetchClinicalWorkflows').mockImplementation(() =>
      Promise.resolve({
        data: { entityList: fetchClinicalWorkflowsResponseMockData, totalCount: 10 }
      } as AxiosResponse)
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchClinicalWorkflows,
      { data: fetchClinicalWorkflowsRequestMockData, type: ACTION_TYPES.FETCH_CLINICAL_WORKFLOW_REQUEST }
    ).toPromise();
    expect(fetchClinicalWorkflowsSpy).toHaveBeenCalledWith(fetchClinicalWorkflowsRequestMockData);
    expect(dispatched).toEqual([
      countyActions.fetchClinicalWorkflowSuccess({
        data: fetchClinicalWorkflowsResponseMockData,
        total: 10
      })
    ]);
  });

  it('Fails to fetch list of clinical workflows and dispatches failure', async () => {
    const error = new Error('Failed to fetch clinical workflows');
    const fetchClinicalWorkflowsSpy = jest
      .spyOn(countyService, 'fetchClinicalWorkflows')
      .mockImplementation(() => Promise.reject(error) as any);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchClinicalWorkflows,
      { data: fetchClinicalWorkflowsRequestMockData, type: ACTION_TYPES.FETCH_CLINICAL_WORKFLOW_REQUEST }
    ).toPromise();
    expect(fetchClinicalWorkflowsSpy).toHaveBeenCalledWith(fetchClinicalWorkflowsRequestMockData);
    expect(dispatched).toEqual([countyActions.fetchClinicalWorkflowFailure()]);
  });
});

describe('Fetches County List', () => {
  it('Fetches list of Active Countys and dispatches success', async () => {
    const fetchActivateCountysSpy = jest
      .spyOn(countyService, 'fetchCountyList')
      .mockImplementation(() =>
        Promise.resolve({ data: { entityList: fetchCountyResponseMockData, totalCount: 10 } } as AxiosResponse)
      );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountyList,
      { ...fetchActiveCountyRequestMockData, type: ACTION_TYPES.FETCH_COUNTY_LIST_REQUEST }
    ).toPromise();
    expect(fetchActivateCountysSpy).toHaveBeenCalledWith('5', true, 0, 10, 'Sample');
    expect(dispatched).toEqual([
      countyActions.fetchCountyListSuccess({
        countyList: fetchCountyResponseMockData as any,
        total: 10
      })
    ]);
  });

  it('Fails to fetch list of Countys and dispatches failure', async () => {
    const error = new Error('Failed to fetch Countys');
    const fetchCountysSpy = jest
      .spyOn(countyService, 'fetchCountyList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountyList,
      { ...fetchActiveCountyRequestMockData, type: ACTION_TYPES.FETCH_COUNTY_LIST_REQUEST }
    ).toPromise();
    expect(fetchCountysSpy).toHaveBeenCalledWith('5', true, 0, 10, 'Sample');
    expect(dispatched).toEqual([countyActions.fetchCountyListFailure(error)]);
  });

  it('Fetches list of Deactivated Accounts and dispatches success', async () => {
    const fetchDeactivatedAccountsSpy = jest
      .spyOn(countyService, 'fetchDeactivatedAccounts')
      .mockImplementation(() =>
        Promise.resolve({ data: { entityList: fetchCountyResponseMockData, totalCount: 10 } } as AxiosResponse)
      );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountyList,
      { ...(fetchInactiveCountyRequestMockData as any), type: ACTION_TYPES.FETCH_COUNTY_LIST_REQUEST }
    ).toPromise();
    expect(fetchDeactivatedAccountsSpy).toHaveBeenCalledWith(0, 10, undefined, 'Sample', '3');
    expect(dispatched).toEqual([
      countyActions.fetchCountyListSuccess({
        countyList: fetchCountyResponseMockData as any,
        total: 10
      })
    ]);
  });
});

describe('Fetches County List for Dashboard', () => {
  it('Fetches list of county for dashboard and dispatches success', async () => {
    const fetchDashboardCountysSpy = jest
      .spyOn(countyService, 'fetchDashboardCounty')
      .mockImplementation(() =>
        Promise.resolve({ data: { entityList: dashboardCountyResponseMockData, totalCount: 10 } } as AxiosResponse)
      );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ user: { user: { tenantId: '4' } } })
      },
      getDashboardCounty,
      { payload: fetchDashboardCountyRequestMockData, type: ACTION_TYPES.FETCH_COUNTY_DASHBOARD_LIST_REQUEST }
    ).toPromise();
    expect(fetchDashboardCountysSpy).toHaveBeenCalledWith(fetchDashboardCountyRequestMockData);
    expect(dispatched).toEqual([
      countyActions.fetchDashboardCountySuccess({
        data: dashboardCountyResponseMockData,
        total: 10
      })
    ]);
  });

  it('Fails to fetch list of county for dashboard and dispatches failure', async () => {
    const error = new Error('Failed to fetch dashboard county');
    const fetchDashboardCountysSpy = jest
      .spyOn(countyService, 'fetchDashboardCounty')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ user: { user: { tenantId: '4' } } })
      },
      getDashboardCounty,
      { payload: fetchDashboardCountyRequestMockData, type: ACTION_TYPES.FETCH_COUNTY_DASHBOARD_LIST_REQUEST }
    ).toPromise();
    expect(fetchDashboardCountysSpy).toHaveBeenCalledWith(fetchDashboardCountyRequestMockData);
    expect(dispatched).toEqual([countyActions.fetchDashboardCountyFail(error)]);
  });
});

describe('Activates an inactive county', () => {
  it('Activates an county and dispatches success', async () => {
    const activateCountySpy = jest
      .spyOn(countyService, 'activateCounty')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      activateCounty,
      { data: activateCountyRequestMockData, type: ACTION_TYPES.ACTIVATE_COUNTY_REQUEST }
    ).toPromise();
    expect(activateCountySpy).toHaveBeenCalledWith(activateCountyRequestMockData);
    expect(dispatched).toEqual([countyActions.activateCountySuccess()]);
  });

  it('Fails to activate county and dispatches failure', async () => {
    const error = new Error('Failed to activate county');
    const activateCountySpy = jest
      .spyOn(countyService, 'activateCounty')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      activateCounty,
      { data: activateCountyRequestMockData, type: ACTION_TYPES.ACTIVATE_COUNTY_REQUEST }
    ).toPromise();
    expect(activateCountySpy).toHaveBeenCalledWith(activateCountyRequestMockData);
    expect(dispatched).toEqual([countyActions.activateCountyFail(error)]);
  });
});

describe('Deactivates an county', () => {
  it('Deactivates an county and dispatches success', async () => {
    const deactivateCountySpy = jest
      .spyOn(countyService, 'deactivateCounty')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    const task = runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deactivateCounty,
      { data: deactivateCountyRequestMockData, type: ACTION_TYPES.DEACTIVATE_COUNTY_REQUEST }
    );

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(task.toPromise());
      }, 1000);
    });

    expect(deactivateCountySpy).toHaveBeenCalledWith(deactivateCountyRequestMockData);
    expect(dispatched).toEqual([countyActions.deactivateCountySuccess(), siteActions.clearSiteDropdown()]);
  });

  it('Fails to deactivate county and dispatches failure', async () => {
    const error = new Error('Failed to deactivate county');
    const deactivateCountySpy = jest
      .spyOn(countyService, 'deactivateCounty')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deactivateCounty,
      { data: deactivateCountyRequestMockData, type: ACTION_TYPES.DEACTIVATE_COUNTY_REQUEST }
    ).toPromise();
    expect(deactivateCountySpy).toHaveBeenCalledWith(deactivateCountyRequestMockData);
    expect(dispatched).toEqual([countyActions.deactivateCountyFail(error)]);
  });
});

describe('Fetches County Options', () => {
  it('Fetches list of county options and dispatches success', async () => {
    const fetchCountyOptionsSpy = jest
      .spyOn(countyService, 'fetchCountyOptions')
      .mockImplementation(() =>
        Promise.resolve({ data: { entityList: fetchCountyOptionsResponseMockData } } as AxiosResponse)
      );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountyOptions,
      { ...fetchCountyOptionsRequestMockData, type: ACTION_TYPES.FETCH_COUNTY_OPTIONS_REQUEST }
    ).toPromise();
    expect(fetchCountyOptionsSpy).toHaveBeenCalledWith(fetchCountyOptionsRequestMockData);
    expect(dispatched).toEqual([countyActions.fetchCountyOptionsSuccess(fetchCountyOptionsResponseMockData)]);
  });

  it('Fails to fetch list of county options and dispatches failure', async () => {
    const error = new Error('Failed to fetch dashboard county');
    const fetchCountyOptionsSpy = jest
      .spyOn(countyService, 'fetchCountyOptions')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({ user: { user: { tenantId: '4' } } })
      },
      fetchCountyOptions,
      { ...fetchCountyOptionsRequestMockData, type: ACTION_TYPES.FETCH_COUNTY_OPTIONS_REQUEST }
    ).toPromise();
    expect(fetchCountyOptionsSpy).toHaveBeenCalledWith(fetchCountyOptionsRequestMockData);
    expect(dispatched).toEqual([countyActions.fetchCountyOptionsFailure()]);
  });
});
