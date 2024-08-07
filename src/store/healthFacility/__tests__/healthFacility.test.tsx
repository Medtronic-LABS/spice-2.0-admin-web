import { runSaga } from 'redux-saga';
import {
  fetchHealthFacilityList,
  createHealthFacilityRequest,
  deleteHFRequest,
  fetchHFSummaryRequest,
  updateHFDetailsRequest,
  fetchHFUserList,
  fetchUserDetailRequest,
  deleteHFUserRequest,
  updateHFUserSagaRequest,
  createHFUserSagaRequest,
  fetchDistrictListSagaRequest,
  fetchChiefdomListSagaRequest,
  fetchVillagesListSagaRequest,
  fetchPeerSupervisorListSagaRequest,
  fetchWorkflowListSagaRequest,
  validateLinkedRestrictionsSagaRequest,
  fetchHFTypesSaga,
  fetchVillagesListFromHFSagaRequest,
  fetchCultureList,
  fetchCountryList
} from '../sagas';
import * as hfService from '../../../services/healthFacilityAPI';
import * as hfActions from '../actions';
import * as ACTION_TYPES from '../actionTypes';
import * as HF_MOCK_DATA from '../../../tests/mockData/healthFacilityConstants';
import { AxiosPromise } from 'axios';
import ApiError from '../../../global/ApiError';

const hfListRequestPayload = HF_MOCK_DATA.HF_LIST_FETCH_PAYLOAD;
const hfListDataPayload = HF_MOCK_DATA.HF_LIST;
const hfTiIdRequestPayload = HF_MOCK_DATA.HF_TI_ID;
const hfSummary = HF_MOCK_DATA.HF_SUMMARY;
const hfUsersRequest = HF_MOCK_DATA.HF_USERS_REQUEST;
const hfUsersList = HF_MOCK_DATA.HF_USERS;
const hfUser = HF_MOCK_DATA.HF_USER;
const hfUserDeleteRequest = HF_MOCK_DATA.HF_ID_TIS;
const hfDistrictList = HF_MOCK_DATA.DISTRICT_LIST;
const hfChiefDomRequest = HF_MOCK_DATA.HF_CI_DI;
const hfChiefdomList = HF_MOCK_DATA.CHIEF_DOM_LIST;
const hfVillageRequest = HF_MOCK_DATA.HF_CI_DI_CDI;
const hfVillageList = HF_MOCK_DATA.VILLAGES_LIST;
const hfPeerSupervisor = HF_MOCK_DATA.PEER_SUPERVISOR;
const hfWorkflowList = HF_MOCK_DATA.WORKFLOW_LIST;
const hfIdsTiRequestPayload = HF_MOCK_DATA.HF_IDS_TI;
const hfTypeList = HF_MOCK_DATA.HF_TYPES;
const villagesListFromHF = HF_MOCK_DATA.VILLAGES_LIST_FROM_HF;
const hfCultureList = HF_MOCK_DATA.CULTURE_LIST;

describe('Fetch Health Facility in Region', () => {
  it('Fetch all health facility list and dispatch success', async () => {
    const fetchHFListSpy = jest.spyOn(hfService, 'fetchHealthFacilityList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entityList: hfListDataPayload, totalCount: 10 }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchHealthFacilityList,
      {
        ...hfListRequestPayload,
        type: ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchHFListSpy).toHaveBeenCalledWith({
      ...hfListRequestPayload
    });
    expect(dispatched).toEqual([
      hfActions.fetchHFListSuccess({
        healthFacilityList: hfListDataPayload as any,
        total: 10,
        limit: 10
      })
    ]);
  });

  it('Fetch all health facility and dispatches failure', async () => {
    const error = new Error('Failed to fetch health facility');
    const fetchHFListSpy = jest
      .spyOn(hfService, 'fetchHealthFacilityList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchHealthFacilityList,
      {
        ...hfListRequestPayload,
        type: ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_REQUEST
      }
    ).toPromise();
    expect(fetchHFListSpy).toHaveBeenCalledWith({
      ...hfListRequestPayload
    });
    expect(dispatched).toEqual([hfActions.fetchHFListFailure(error)]);
  });
});

describe('Create Health Facility in Region', () => {
  it('Create health facility and dispatches success', async () => {
    const createHFSpy = jest.spyOn(hfService, 'createHealthFacility').mockImplementation(
      () =>
        Promise.resolve({
          data: hfListDataPayload[0]
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createHealthFacilityRequest,
      {
        type: ACTION_TYPES.CREATE_HEALTH_FACILITY_REQUEST,
        data: hfListDataPayload[0] as any
      }
    ).toPromise();
    expect(createHFSpy).toHaveBeenCalledWith(hfListDataPayload[0]);
    expect(dispatched).toEqual([hfActions.createHFSuccess()]);
  });

  it('Create health facility and dispatches failure', async () => {
    const error = new ApiError('Failed to create health facility');
    const createHFSpy = jest.spyOn(hfService, 'createHealthFacility').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createHealthFacilityRequest,
      {
        type: ACTION_TYPES.CREATE_HEALTH_FACILITY_REQUEST,
        data: hfListDataPayload[0] as any
      }
    ).toPromise();
    expect(createHFSpy).toHaveBeenCalledWith(hfListDataPayload[0]);
    expect(dispatched).toEqual([hfActions.createHFFailure(error)]);
  });
});

describe('Delete Health Facility from Region', () => {
  it('Delete a HF and dispatches success', async () => {
    const deleteHFSpy = jest.spyOn(hfService, 'deleteHealtFacility').mockImplementation(() => Promise.resolve() as any);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteHFRequest,
      { data: hfTiIdRequestPayload, type: ACTION_TYPES.DELETE_HEALTH_FACILITY_REQUEST }
    ).toPromise();
    expect(deleteHFSpy).toHaveBeenCalledWith(hfTiIdRequestPayload);
    expect(dispatched).toEqual([hfActions.deleteHealthFacilitySuccess()]);
  });

  it('Delete a HF and dispatches failure', async () => {
    const error = new Error('Failed to delete health facility');
    const deleteHFSpy = jest.spyOn(hfService, 'deleteHealtFacility').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteHFRequest,
      { data: hfTiIdRequestPayload, type: ACTION_TYPES.DELETE_HEALTH_FACILITY_REQUEST }
    ).toPromise();
    expect(deleteHFSpy).toHaveBeenCalledWith(hfTiIdRequestPayload);
    expect(dispatched).toEqual([hfActions.deleteHealthFacilityFailure(error)]);
  });
});

describe('Fetch Health Facility Summary in Region', () => {
  it('Fetch health facility summary and dispatches success', async () => {
    const fetchHFSummarySpy = jest.spyOn(hfService, 'fetchHFSummary').mockImplementation(
      () =>
        Promise.resolve({
          data: { entity: hfSummary }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchHFSummaryRequest,
      { ...hfTiIdRequestPayload, type: ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST }
    ).toPromise();
    expect(fetchHFSummarySpy).toHaveBeenCalledWith(hfTiIdRequestPayload.tenantId, hfTiIdRequestPayload.id);
    expect(dispatched).toEqual([hfActions.fetchHFSummarySuccess(hfSummary as any)]);
  });

  it('Fetch health facility summary and dispatches failure', async () => {
    const error = new Error('Failed to fetch health facility summary');
    const fetchHFSummarySpy = jest.spyOn(hfService, 'fetchHFSummary').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchHFSummaryRequest,
      { ...hfTiIdRequestPayload, type: ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST }
    ).toPromise();
    expect(fetchHFSummarySpy).toHaveBeenCalledWith(hfTiIdRequestPayload.tenantId, hfTiIdRequestPayload.id);
    expect(dispatched).toEqual([hfActions.fetchHFSummaryFailure(error)]);
  });
});

describe('Update Health Facility Summary in Region', () => {
  it('Update health facility summary and dispatches success', async () => {
    const updateHFSummarySpy = jest.spyOn(hfService, 'updateHFDetails').mockImplementation(
      () =>
        Promise.resolve({
          data: { entity: hfSummary }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateHFDetailsRequest,
      {
        type: ACTION_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_REQUEST,
        data: { ...hfSummary } as any
      }
    ).toPromise();
    expect(updateHFSummarySpy).toHaveBeenCalledWith(hfSummary);
    expect(dispatched).toEqual([hfActions.updateHFDetailsSuccess()]);
  });
  it('Update health facility summary and dispatches failure', async () => {
    const error = new Error('Failed to fetch health facility summary');
    const updateHFSummarySpy = jest.spyOn(hfService, 'updateHFDetails').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateHFDetailsRequest,
      {
        type: ACTION_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_REQUEST,
        data: { ...hfSummary } as any
      }
    ).toPromise();
    expect(updateHFSummarySpy).toHaveBeenCalledWith(hfSummary);
    expect(dispatched).toEqual([hfActions.updateHFDetailsFailure(error)]);
  });
});

describe('Fetch Health Facility Users in Region', () => {
  it('Fetch HF users list and dispatches success', async () => {
    const fetchHFUsersListSpy = jest.spyOn(hfService, 'fetchHFUserList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entityList: hfUsersList, totalCount: hfUsersList.length }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchHFUserList,
      {
        ...(hfUsersRequest as any),
        type: ACTION_TYPES.FETCH_HEALTH_FACILITY_USERS_REQUEST
      }
    ).toPromise();
    expect(fetchHFUsersListSpy).toHaveBeenCalledWith({
      ...hfUsersRequest
    });
    expect(dispatched).toEqual([
      hfActions.fetchHFUserListSuccess({
        users: hfUsersList as any,
        total: hfUsersList.length,
        limit: 10
      })
    ]);
  });

  it('Fetch HF users list and dispatch failure', async () => {
    const error = new Error('Failed to fetch Users list');
    const fetchHFUsersListSpy = jest
      .spyOn(hfService, 'fetchHFUserList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchHFUserList,
      {
        ...(hfUsersRequest as any),
        type: ACTION_TYPES.FETCH_HEALTH_FACILITY_USERS_REQUEST
      }
    ).toPromise();
    expect(fetchHFUsersListSpy).toHaveBeenCalledWith({
      ...hfUsersRequest
    });
    expect(dispatched).toEqual([hfActions.fetchHFUserListFailure(error)]);
  });
});

describe('Fetch Health Facility User Details in Region', () => {
  it('Fetch HF user details and dispatch success', async () => {
    const fetchHFUserSpy = jest.spyOn(hfService, 'fetchHFUserDetail').mockImplementation(
      () =>
        Promise.resolve({
          data: { entity: hfUser }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUserDetailRequest,
      {
        id: hfUser.id,
        type: ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST
      }
    ).toPromise();
    expect(fetchHFUserSpy).toHaveBeenCalledWith(hfUser.id);
    expect(dispatched).toEqual([hfActions.fetchUserDetailSuccess(hfUser as any)]);
  });

  it('Fetch HF user details and dispatch failure', async () => {
    const error = new Error('Failed to fetch HF user details');
    const fetchHFUserSpy = jest.spyOn(hfService, 'fetchHFUserDetail').mockImplementation(() => Promise.reject(error));

    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUserDetailRequest,
      {
        id: hfUser.id,
        type: ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST
      }
    ).toPromise();
    expect(fetchHFUserSpy).toHaveBeenCalledWith(hfUser.id);
    expect(dispatched).toEqual([hfActions.fetchUserDetailFailure(error)]);
  });
});

describe('Delete Health Facility User from Region', () => {
  it('Delete HF user and dispatch success', async () => {
    const deleteHFUserSpy = jest.spyOn(hfService, 'deleteHFUser').mockImplementation(() => Promise.resolve() as any);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteHFUserRequest,
      {
        type: ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_REQUEST,
        data: hfUserDeleteRequest
      }
    ).toPromise();
    expect(deleteHFUserSpy).toHaveBeenCalledWith(hfUserDeleteRequest);
    expect(dispatched).toEqual([hfActions.deleteHFUserSuccess()]);
  });

  it('Delete HF user and dispatch failure', async () => {
    const error = new Error('Failed to delete HF user');
    const deleteHFUserSpy = jest.spyOn(hfService, 'deleteHFUser').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteHFUserRequest,
      {
        type: ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_REQUEST,
        data: hfUserDeleteRequest
      }
    ).toPromise();
    expect(deleteHFUserSpy).toHaveBeenCalledWith(hfUserDeleteRequest);
    expect(dispatched).toEqual([hfActions.deleteHFUserFailure(error)]);
  });
});

describe('Update Health Facility User from Region', () => {
  it('Update HF user and dispatch success', async () => {
    const updateHFUserSpy = jest.spyOn(hfService, 'updateHFUser').mockImplementation(() => Promise.resolve() as any);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateHFUserSagaRequest,
      {
        type: ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_REQUEST,
        data: { ...hfUser } as any
      }
    ).toPromise();
    expect(updateHFUserSpy).toHaveBeenCalledWith(hfUser);
    expect(dispatched).toEqual([hfActions.updateHFUserSuccess()]);
  });

  it('Update HF user and dispatch failure', async () => {
    const error = new Error('Failed to update HF user');
    const updateHFUserSpy = jest.spyOn(hfService, 'updateHFUser').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateHFUserSagaRequest,
      {
        type: ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_REQUEST,
        data: { ...hfUser } as any
      }
    ).toPromise();
    expect(updateHFUserSpy).toHaveBeenCalledWith(hfUser);
    expect(dispatched).toEqual([hfActions.updateHFUserFailure(error)]);
  });
});

describe('Create Health Facility User', () => {
  it('Create HF user and dispatch success', async () => {
    const createHFUserSpy = jest.spyOn(hfService, 'addHFUser').mockImplementation(() => Promise.resolve() as any);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createHFUserSagaRequest,
      {
        type: ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_REQUEST,
        data: { ...hfUser } as any
      }
    ).toPromise();
    expect(createHFUserSpy).toHaveBeenCalledWith(hfUser);
    expect(dispatched).toEqual([hfActions.createHFUserSuccess()]);
  });

  it('Create HF user and dispatch failure', async () => {
    const error = new Error('Failed to create HF user');
    const createHFUserSpy = jest.spyOn(hfService, 'addHFUser').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createHFUserSagaRequest,
      {
        type: ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_REQUEST,
        data: { ...hfUser } as any
      }
    ).toPromise();
    expect(createHFUserSpy).toHaveBeenCalledWith(hfUser);
    expect(dispatched).toEqual([hfActions.createHFUserFailure(error)]);
  });
});

describe('Fetch Health Facility district list in region', () => {
  it('Fetch HF district list and dispatch success', async () => {
    const fetchDistrictListSpy = jest.spyOn(hfService, 'fetchDistrictList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entity: hfDistrictList },
          totalCount: hfDistrictList.length
        }) as unknown as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchDistrictListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST,
        countryId: 1
      }
    ).toPromise();
    expect(fetchDistrictListSpy).toHaveBeenCalledWith(1);
    expect(dispatched).toEqual([
      hfActions.fetchDistrictListSuccess({ list: hfDistrictList, total: hfDistrictList.length })
    ]);
  });

  it('Fetch HF district list and dispatch failure', async () => {
    const error = new Error('Failed to fetch district list');
    const fetchDistrictListSpy = jest
      .spyOn(hfService, 'fetchDistrictList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchDistrictListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST,
        countryId: 1
      }
    ).toPromise();
    expect(fetchDistrictListSpy).toHaveBeenCalledWith(1);
    expect(dispatched).toEqual([hfActions.fetchDistrictListFailure(error)]);
  });
});

describe('Fetch Chief-Dom for Health Facility in Region', () => {
  it('Fetch chief dom and dispatch success', async () => {
    const chiefdomSpy = jest.spyOn(hfService, 'fetchChiefdomList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entity: hfChiefdomList },
          totalCount: hfChiefdomList.length
        }) as unknown as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST,
        countryId: hfChiefDomRequest.countryId,
        districtId: hfChiefDomRequest.districtId
      }
    ).toPromise();
    expect(chiefdomSpy).toHaveBeenCalledWith(hfChiefDomRequest.countryId, hfChiefDomRequest.districtId);
    expect(dispatched).toEqual([
      hfActions.fetchChiefdomListSuccess({ list: hfChiefdomList, total: hfChiefdomList.length })
    ]);
  });

  it('Fetch chief dom and dispatch failure', async () => {
    const error = new Error('Failed to fetch chief dom');
    const chiefdomSpy = jest.spyOn(hfService, 'fetchChiefdomList').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchChiefdomListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST,
        countryId: hfChiefDomRequest.countryId,
        districtId: hfChiefDomRequest.districtId
      }
    ).toPromise();
    expect(chiefdomSpy).toHaveBeenCalledWith(hfChiefDomRequest.countryId, hfChiefDomRequest.districtId);
    expect(dispatched).toEqual([hfActions.fetchChiefdomListFailure(error)]);
  });
});

describe('Fetch Village List for Health Facility in Region', () => {
  it('Fetch village list and dispatch success', async () => {
    const hfVillageListSpy = jest.spyOn(hfService, 'fetchVillagesList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entity: hfVillageList },
          totalCount: hfVillageList.length
        }) as unknown as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchVillagesListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_VILLAGES_LIST_REQUEST,
        countryId: hfVillageRequest.countryId,
        districtId: hfVillageRequest.districtId,
        chiefdomId: hfVillageRequest.chiefdomId
      }
    ).toPromise();
    expect(hfVillageListSpy).toHaveBeenCalledWith(
      hfVillageRequest.countryId,
      hfVillageRequest.districtId,
      hfVillageRequest.chiefdomId
    );
    expect(dispatched).toEqual([
      hfActions.fetchVillagesListSuccess({ list: hfVillageList as any, total: hfVillageList.length })
    ]);
  });

  it('Fetch village list and dispatch success', async () => {
    const error = new Error('Failed to fetch village list');
    const hfVillageListSpy = jest.spyOn(hfService, 'fetchVillagesList').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchVillagesListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_VILLAGES_LIST_REQUEST,
        countryId: hfVillageRequest.countryId,
        districtId: hfVillageRequest.districtId,
        chiefdomId: hfVillageRequest.chiefdomId
      }
    ).toPromise();
    expect(hfVillageListSpy).toHaveBeenCalledWith(
      hfVillageRequest.countryId,
      hfVillageRequest.districtId,
      hfVillageRequest.chiefdomId
    );
    expect(dispatched).toEqual([hfActions.fetchVillagesListFailure(error)]);
  });
});

describe('Fetch Peer Supervisor List for Health Facility in Region', () => {
  it('Fetch peer supervisor list and dispatch success', async () => {
    const tenantIds = [2];
    const hfPeerSupervisorSpy = jest.spyOn(hfService, 'fetchPeerSupervisorList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entity: hfPeerSupervisor.list },
          totalCount: hfPeerSupervisor.list.length
        }) as unknown as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchPeerSupervisorListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_REQUEST,
        tenantIds
      }
    ).toPromise();
    expect(hfPeerSupervisorSpy).toHaveBeenCalledWith(tenantIds);
    expect(dispatched).toEqual([
      hfActions.fetchPeerSupervisorListSuccess({
        data: { list: hfPeerSupervisor.list as any, hfTenantIds: tenantIds },
        total: hfPeerSupervisor.list.length
      })
    ]);
  });
  it('Fetch peer supervisor list and dispatch failure', async () => {
    const error = new Error('Failed to fetch supervisor list');
    const tenantIds = [2];
    const hfPeerSupervisorSpy = jest
      .spyOn(hfService, 'fetchPeerSupervisorList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchPeerSupervisorListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_PEER_SUPERVISOR_LIST_REQUEST,
        tenantIds
      }
    ).toPromise();
    expect(hfPeerSupervisorSpy).toHaveBeenCalledWith(tenantIds);
    expect(dispatched).toEqual([hfActions.fetchPeerSupervisorListFailure(error)]);
  });
});

describe('Fetch Workflow List for Health Facility in Region', () => {
  it('Fetch workflow list and dispatch success', async () => {
    const countryId = 1;
    const hfWorkflowSpy = jest.spyOn(hfService, 'fetchWorkflowList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entityList: hfWorkflowList }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchWorkflowListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_WORKFLOW_LIST_REQUEST,
        countryId
      }
    ).toPromise();
    expect(hfWorkflowSpy).toHaveBeenCalledWith({ countryId });
    expect(dispatched).toEqual([
      hfActions.fetchWorkflowListSuccess({
        list: hfWorkflowList
      })
    ]);
  });

  it('Fetch workflow list and dispatch failure', async () => {
    const error = new Error('Failed to fetch workflow list');
    const countryId = 1;
    const hfWorkflowSpy = jest.spyOn(hfService, 'fetchWorkflowList').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchWorkflowListSagaRequest,
      {
        type: ACTION_TYPES.FETCH_WORKFLOW_LIST_REQUEST,
        countryId
      }
    ).toPromise();
    expect(hfWorkflowSpy).toHaveBeenCalledWith({ countryId });
    expect(dispatched).toEqual([hfActions.fetchWorkflowListFailure(error)]);
  });
});

describe('Fetch Peer Supervisor Validation for Health Facility in Region', () => {
  it('Fetch peer supervisor validation and dispatch success', async () => {
    const validationSpy = jest.spyOn(hfService, 'validateLinkedRestrictionsAPI').mockImplementation(
      () =>
        Promise.resolve({
          ...hfIdsTiRequestPayload
        }) as unknown as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      validateLinkedRestrictionsSagaRequest,
      {
        type: ACTION_TYPES.LINKED_RESTRICTIONS_VALIDATION_REQUEST,
        ...hfIdsTiRequestPayload
      }
    ).toPromise();
    expect(validationSpy).toHaveBeenCalledWith({ ...hfIdsTiRequestPayload });
  });

  it('Fetch peer supervisor validation and dispatch failure', async () => {
    const error = new Error('Failed to validate peer supervisor');
    const validationSpy = jest
      .spyOn(hfService, 'validateLinkedRestrictionsAPI')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      validateLinkedRestrictionsSagaRequest,
      {
        type: ACTION_TYPES.LINKED_RESTRICTIONS_VALIDATION_REQUEST,
        ...hfIdsTiRequestPayload
      }
    ).toPromise();
    expect(validationSpy).toHaveBeenCalledWith({ ...hfIdsTiRequestPayload });
    expect(dispatched).toEqual([hfActions.validateLinkedRestrictionsFailure(error)]);
  });
});

describe('Fetch Health Facility Types in Region', () => {
  it('Fetch health facility types and dispatch success', async () => {
    const hfTypesSpy = jest.spyOn(hfService, 'fetchHealthFacilityTypes').mockImplementation(
      () =>
        Promise.resolve({
          data: { entity: hfTypeList }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchHFTypesSaga,
      {
        type: ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_REQUEST
      }
    ).toPromise();
    expect(hfTypesSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([hfActions.fetchHFTypesSuccess(hfTypeList)]);
  });

  it('Fetch health facility types and dispatch failure', async () => {
    const error = new Error('Failed to HF types and dispatch failure');
    const hfTypesSpy = jest
      .spyOn(hfService, 'fetchHealthFacilityTypes')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchHFTypesSaga,
      {
        type: ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_REQUEST
      }
    ).toPromise();
    expect(hfTypesSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([hfActions.fetchHFTypesFailure(error)]);
  });
});

describe('Fetch Villages List from Health Facility in Region', () => {
  it('Fetch villages list and dispatch success', async () => {
    const tenantIds = [2];
    const userId = 1;
    const villageListHF = jest
      .spyOn(hfService, 'fetchVillagesListfromHF')
      .mockImplementation(
        () => Promise.resolve({ data: { entity: villagesListFromHF, hfTenantIds: tenantIds } }) as AxiosPromise
      );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchVillagesListFromHFSagaRequest,
      {
        type: ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_REQUEST,
        tenantIds,
        userId
      }
    ).toPromise();
    expect(villageListHF).toHaveBeenCalledWith(tenantIds, userId);
    expect(dispatched).toEqual([
      hfActions.fetchVillagesListFromHFSuccess({ data: { list: villagesListFromHF as any, hfTenantIds: tenantIds } })
    ]);
  });

  it('Fetch villages list and dispatch failure', async () => {
    const error = new Error('Failed to fetch villages list');
    const tenantIds = [2];
    const userId = 1;
    const villageListHF = jest
      .spyOn(hfService, 'fetchVillagesListfromHF')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchVillagesListFromHFSagaRequest,
      {
        type: ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_REQUEST,
        tenantIds,
        userId
      }
    ).toPromise();
    expect(villageListHF).toHaveBeenCalledWith(tenantIds, userId);
    expect(dispatched).toEqual([hfActions.fetchVillagesListFromHFFailure(error)]);
  });
});

describe('Fetch Culture List from Health Facility in Region', () => {
  it('Fetch culture list and dispatch success', async () => {
    const hfCultureListSpy = jest
      .spyOn(hfService, 'fetchCultureList')
      .mockImplementation(() => Promise.resolve({ data: { entity: hfCultureList } }) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCultureList
    ).toPromise();
    expect(hfCultureListSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([hfActions.fetchCultureListSuccess(hfCultureList)]);
  });

  it('Fetch culture list and dispatch failure', async () => {
    const error = new Error('Failed to fetch culture list');
    const hfCultureListSpy = jest.spyOn(hfService, 'fetchCultureList').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCultureList
    ).toPromise();
    expect(hfCultureListSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([hfActions.fetchCultureListFailure()]);
  });
});

describe('Fetch Country List from Health Facility in Region', () => {
  it('Fetch country list and dispatch success', async () => {
    const code = '232';
    const hfCountryListSpy = jest
      .spyOn(hfService, 'fetchCountryCodeList')
      .mockImplementation(() => Promise.resolve({ data: { entity: [code] } }) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountryList
    ).toPromise();
    expect(hfCountryListSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([
      hfActions.fetchCountryListSuccess([
        {
          phoneNumberCode: code,
          id: code
        }
      ])
    ]);
  });

  it('Fetch country list and dispatch failure', async () => {
    const error = new Error('Failed to fetch country list');
    const hfCountryListSpy = jest
      .spyOn(hfService, 'fetchCountryCodeList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchCountryList
    ).toPromise();
    expect(hfCountryListSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([hfActions.fetchCountryListFailure()]);
  });
});
