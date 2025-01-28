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
  fetchCountryList,
  peerSupervisorValidationSagaRequest,
  fetchHealthFacilityDashboardList,
  fetchUnlinkedVillagesSagaRequest,
  fetchVillagesListUserLinkedSagaRequest,
  fetchCityListSagaRequest
} from '../sagas';
import * as hfService from '../../../services/healthFacilityAPI';
import * as hfActions from '../actions';
import * as ACTION_TYPES from '../actionTypes';
import * as HF_MOCK_DATA from '../../../tests/mockData/healthFacilityConstants';
import { AxiosPromise } from 'axios';
import ApiError from '../../../global/ApiError';

const appTypes = ['COMMUNITY'];
const mockState = {
  user: {
    user: {
      appTypes,
      organizations: [
        {
          id: 1
        }
      ]
    }
  }
};

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
const hfDashboardList = HF_MOCK_DATA.HF_DASHBOARD_LIST;

describe('HF sagas', () => {
  describe('Fetch Health Facility List: FETCH_HEALTH_FACILITY_LIST_REQUEST', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const testFetchHealthFacilityList = async (
      healthFacilityListDataPayload: any,
      totalCount: number,
      limit: number = 10,
      forHFAdmin: boolean = false
    ) => {
      const successCb = jest.fn();
      const fetchHFListSpy = jest.spyOn(hfService, 'fetchHealthFacilityList').mockImplementation(
        () =>
          Promise.resolve({
            data: { entityList: healthFacilityListDataPayload, totalCount }
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
          forHFAdmin,
          limit,
          successCb,
          type: ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_REQUEST
        }
      ).toPromise();

      expect(fetchHFListSpy).toHaveBeenCalledWith({
        ...hfListRequestPayload
      });
      expect(successCb).toHaveBeenCalled();
      if (forHFAdmin) {
        expect(dispatched).toEqual([
          hfActions.setAssignedHFListForHFAdmin({
            healthFacilityList: (healthFacilityListDataPayload as any) || [],
            total: totalCount,
            limit
          } as any)
        ]);
      } else {
        expect(dispatched).toEqual([
          hfActions.fetchHFListSuccess({
            healthFacilityList: (healthFacilityListDataPayload as any) || [],
            total: totalCount,
            limit
          })
        ]);
      }
    };

    it('Fetch all health facility list and dispatch success with data', async () => {
      await testFetchHealthFacilityList(hfListDataPayload, 10);
    });

    it('Fetch all health facility list and dispatch success with empty data', async () => {
      await testFetchHealthFacilityList(undefined, 0);
    });

    it('Fetch all health facility list for HF Admin and dispatch success with data', async () => {
      await testFetchHealthFacilityList(hfListDataPayload, 10, 10, true);
    });

    const testFetchHealthFacilityFailure = async (error: Error | string) => {
      const failureCb = jest.fn();
      const fetchHFListSpy = jest
        .spyOn(hfService, 'fetchHealthFacilityList')
        .mockImplementation(() => Promise.reject(error));

      const dispatched: any[] = [];

      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchHealthFacilityList,
        {
          ...hfListRequestPayload,
          failureCb,
          type: ACTION_TYPES.FETCH_HEALTH_FACILITY_LIST_REQUEST
        }
      ).toPromise();

      expect(fetchHFListSpy).toHaveBeenCalledWith({
        ...hfListRequestPayload
      });

      if (error instanceof Error) {
        expect(failureCb).toHaveBeenCalled();
        expect(dispatched).toEqual([hfActions.fetchHFListFailure(error)]);
      } else {
        expect(failureCb).not.toHaveBeenCalled();
      }
    };

    it('Fetch all health facility and dispatches failure with Error object', async () => {
      await testFetchHealthFacilityFailure(new Error('Failed to fetch health facility'));
    });

    it('Fetch all health facility and dispatches failure with string error', async () => {
      await testFetchHealthFacilityFailure('Failed to fetch health facility');
    });
  });

  describe('Create Health Facility Request: CREATE_HEALTH_FACILITY_REQUEST', () => {
    it('Create health facility and dispatches success', async () => {
      const successCb = jest.fn();
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
          data: hfListDataPayload[0] as any,
          successCb
        }
      ).toPromise();
      expect(createHFSpy).toHaveBeenCalledWith(hfListDataPayload[0]);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.createHFSuccess()]);
    });

    it('Create health facility and dispatches failure with instance of ApiError', async () => {
      const failureCb = jest.fn();
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
          data: hfListDataPayload[0] as any,
          failureCb
        }
      ).toPromise();
      expect(createHFSpy).toHaveBeenCalledWith(hfListDataPayload[0]);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.createHFFailure(error)]);
    });

    it('Create health facility and dispatches failure without instance of ApiError', async () => {
      const failureCb = jest.fn();
      const error = 'Failed to create health facility';
      const createHFSpy = jest.spyOn(hfService, 'createHealthFacility').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createHealthFacilityRequest,
        {
          type: ACTION_TYPES.CREATE_HEALTH_FACILITY_REQUEST,
          data: hfListDataPayload[0] as any,
          failureCb
        }
      ).toPromise();
      expect(createHFSpy).toHaveBeenCalledWith(hfListDataPayload[0]);
      expect(failureCb).not.toHaveBeenCalled();
    });
  });

  describe('Delete Health Facility Request: DELETE_HEALTH_FACILITY_REQUEST', () => {
    it('Delete a HF and dispatches success', async () => {
      const successCb = jest.fn();
      const deleteHFSpy = jest
        .spyOn(hfService, 'deleteHealtFacility')
        .mockImplementation(() => Promise.resolve() as any);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        deleteHFRequest,
        { data: hfTiIdRequestPayload, successCb, type: ACTION_TYPES.DELETE_HEALTH_FACILITY_REQUEST }
      ).toPromise();
      expect(deleteHFSpy).toHaveBeenCalledWith(hfTiIdRequestPayload);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.deleteHealthFacilitySuccess()]);
    });

    it('Delete a HF and dispatches failure', async () => {
      const error = new Error('Failed to delete health facility');
      const failureCb = jest.fn();
      const deleteHFSpy = jest.spyOn(hfService, 'deleteHealtFacility').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        deleteHFRequest,
        { data: hfTiIdRequestPayload, failureCb, type: ACTION_TYPES.DELETE_HEALTH_FACILITY_REQUEST }
      ).toPromise();
      expect(deleteHFSpy).toHaveBeenCalledWith(hfTiIdRequestPayload);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.deleteHealthFacilityFailure(error)]);
    });
  });

  describe('Fetch Health Facility Summary: FETCH_HEALTH_FACILITY_SUMMARY_REQUEST', () => {
    it('Fetch health facility summary and dispatches success', async () => {
      const successCb = jest.fn();
      const fetchHFSummarySpy = jest.spyOn(hfService, 'fetchHFSummary').mockImplementation(
        () =>
          Promise.resolve({
            data: { entity: hfSummary }
          }) as AxiosPromise
      );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchHFSummaryRequest,
        { ...hfTiIdRequestPayload, successCb, type: ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST }
      ).toPromise();
      expect(fetchHFSummarySpy).toHaveBeenCalledWith(hfTiIdRequestPayload.tenantId, hfTiIdRequestPayload.id, appTypes);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchHFSummarySuccess(hfSummary as any)]);
    });

    it('Fetch health facility summary and dispatches failure', async () => {
      const error = new Error('Failed to fetch health facility summary');
      const failureCb = jest.fn();
      const fetchHFSummarySpy = jest.spyOn(hfService, 'fetchHFSummary').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchHFSummaryRequest,
        { ...hfTiIdRequestPayload, failureCb, type: ACTION_TYPES.FETCH_HEALTH_FACILITY_SUMMARY_REQUEST }
      ).toPromise();
      expect(fetchHFSummarySpy).toHaveBeenCalledWith(hfTiIdRequestPayload.tenantId, hfTiIdRequestPayload.id, appTypes);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchHFSummaryFailure(error)]);
    });
  });

  describe('Update Health Facility Summary: UPDATE_HEALTH_FACILITY_DETAILS_REQUEST', () => {
    it('Update health facility summary and dispatches success', async () => {
      const successCb = jest.fn();
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
          data: { ...hfSummary } as any,
          successCb
        }
      ).toPromise();
      expect(updateHFSummarySpy).toHaveBeenCalledWith(hfSummary);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.updateHFDetailsSuccess()]);
    });
    it('Update health facility summary and dispatches failure', async () => {
      const error = new Error('Failed to fetch health facility summary');
      const failureCb = jest.fn();
      const updateHFSummarySpy = jest
        .spyOn(hfService, 'updateHFDetails')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateHFDetailsRequest,
        {
          type: ACTION_TYPES.UPDATE_HEALTH_FACILITY_DETAILS_REQUEST,
          data: { ...hfSummary } as any,
          failureCb
        }
      ).toPromise();
      expect(updateHFSummarySpy).toHaveBeenCalledWith(hfSummary);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.updateHFDetailsFailure(error)]);
    });
  });

  describe('Fetch Health Facility User Details: FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST', () => {
    it('Fetch HF user details and dispatch success', async () => {
      const successCb = jest.fn();
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
          successCb,
          type: ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST
        }
      ).toPromise();
      expect(fetchHFUserSpy).toHaveBeenCalledWith(hfUser.id);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchUserDetailSuccess(hfUser as any)]);
    });

    it('Fetch HF user details and dispatch failure', async () => {
      const error = new Error('Failed to fetch HF user details');
      const failureCb = jest.fn();
      const fetchHFUserSpy = jest.spyOn(hfService, 'fetchHFUserDetail').mockImplementation(() => Promise.reject(error));

      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchUserDetailRequest,
        {
          id: hfUser.id,
          failureCb,
          type: ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_DETAIL_REQUEST
        }
      ).toPromise();
      expect(fetchHFUserSpy).toHaveBeenCalledWith(hfUser.id);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchUserDetailFailure(error)]);
    });
  });

  describe('Delete Health Facility User: DELETE_HEALTH_FACILITY_USER_REQUEST', () => {
    it('Delete HF user and dispatch success', async () => {
      const successCb = jest.fn();
      const deleteHFUserSpy = jest.spyOn(hfService, 'deleteHFUser').mockImplementation(() => Promise.resolve() as any);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        deleteHFUserRequest,
        {
          type: ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_REQUEST,
          data: hfUserDeleteRequest,
          successCb
        }
      ).toPromise();
      expect(deleteHFUserSpy).toHaveBeenCalledWith(hfUserDeleteRequest);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.deleteHFUserSuccess()]);
    });

    it('Delete HF user and dispatch failure', async () => {
      const error = new Error('Failed to delete HF user');
      const failureCb = jest.fn();
      const deleteHFUserSpy = jest.spyOn(hfService, 'deleteHFUser').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        deleteHFUserRequest,
        {
          type: ACTION_TYPES.DELETE_HEALTH_FACILITY_USER_REQUEST,
          data: hfUserDeleteRequest,
          failureCb
        }
      ).toPromise();
      expect(deleteHFUserSpy).toHaveBeenCalledWith(hfUserDeleteRequest);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.deleteHFUserFailure(error)]);
    });
  });

  describe('Update Health Facility User: UPDATE_HEALTH_FACILITY_USER_REQUEST', () => {
    it('Update HF user and dispatch success', async () => {
      const successCb = jest.fn();
      const updateHFUserSpy = jest.spyOn(hfService, 'updateHFUser').mockImplementation(() => Promise.resolve() as any);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateHFUserSagaRequest,
        {
          type: ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_REQUEST,
          data: { ...hfUser } as any,
          successCb
        }
      ).toPromise();
      expect(updateHFUserSpy).toHaveBeenCalledWith(hfUser);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.updateHFUserSuccess()]);
    });

    it('Update HF user and dispatch failure', async () => {
      const error = new Error('Failed to update HF user');
      const failureCb = jest.fn();
      const updateHFUserSpy = jest.spyOn(hfService, 'updateHFUser').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateHFUserSagaRequest,
        {
          type: ACTION_TYPES.UPDATE_HEALTH_FACILITY_USER_REQUEST,
          data: { ...hfUser } as any,
          failureCb
        }
      ).toPromise();
      expect(updateHFUserSpy).toHaveBeenCalledWith(hfUser);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.updateHFUserFailure(error)]);
    });
  });

  describe('Create Health Facility User: CREATE_HEALTH_FACILITY_USER_REQUEST', () => {
    it('Create HF user and dispatch success', async () => {
      const successCb = jest.fn();
      const createHFUserSpy = jest.spyOn(hfService, 'addHFUser').mockImplementation(() => Promise.resolve() as any);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createHFUserSagaRequest,
        {
          type: ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_REQUEST,
          data: { ...hfUser } as any,
          successCb
        }
      ).toPromise();
      expect(createHFUserSpy).toHaveBeenCalledWith(hfUser);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.createHFUserSuccess()]);
    });

    it('Create HF user and dispatch failure', async () => {
      const error = new Error('Failed to create HF user');
      const failureCb = jest.fn();
      const createHFUserSpy = jest.spyOn(hfService, 'addHFUser').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createHFUserSagaRequest,
        {
          type: ACTION_TYPES.CREATE_HEALTH_FACILITY_USER_REQUEST,
          data: { ...hfUser } as any,
          failureCb
        }
      ).toPromise();
      expect(createHFUserSpy).toHaveBeenCalledWith(hfUser);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.createHFUserFailure(error)]);
    });
  });

  describe('Fetch Peer Supervisor List for Health Facility: FETCH_PEER_SUPERVISOR_LIST_REQUEST', () => {
    it('Fetch peer supervisor list and dispatch success', async () => {
      const tenantIds = [2];
      const successCb = jest.fn();
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
          tenantIds,
          appTypes,
          successCb
        }
      ).toPromise();
      expect(hfPeerSupervisorSpy).toHaveBeenCalledWith(tenantIds, appTypes);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([
        hfActions.fetchPeerSupervisorListSuccess({
          data: { list: hfPeerSupervisor.list as any, hfTenantIds: tenantIds },
          total: hfPeerSupervisor.list.length
        })
      ]);
    });
    it('Fetch peer supervisor list and dispatch failure', async () => {
      const error = new Error('Failed to fetch supervisor list');
      const failureCb = jest.fn();
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
          tenantIds,
          appTypes,
          failureCb
        }
      ).toPromise();
      expect(hfPeerSupervisorSpy).toHaveBeenCalledWith(tenantIds, appTypes);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchPeerSupervisorListFailure(error)]);
    });
  });

  describe('Fetch Workflow List for Health Facility: FETCH_WORKFLOW_LIST_REQUEST', () => {
    it('Fetch workflow list and dispatch success', async () => {
      const countryId = 1;
      const successCb = jest.fn();
      const hfWorkflowSpy = jest.spyOn(hfService, 'fetchWorkflowList').mockImplementation(
        () =>
          Promise.resolve({
            data: { entityList: hfWorkflowList }
          }) as AxiosPromise
      );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchWorkflowListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_WORKFLOW_LIST_REQUEST,
          countryId,
          successCb
        }
      ).toPromise();
      expect(hfWorkflowSpy).toHaveBeenCalledWith({ countryId });
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([
        hfActions.fetchWorkflowListSuccess({
          list: hfWorkflowList
        })
      ]);
    });
    it('Fetch workflow list with more than one app type and dispatch success', async () => {
      const countryId = 1;
      const successCb = jest.fn();
      const hfWorkflowSpy = jest.spyOn(hfService, 'fetchWorkflowList').mockImplementation(
        () =>
          Promise.resolve({
            data: { entityList: hfWorkflowList }
          }) as AxiosPromise
      );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => ({
            ...mockState,
            user: {
              ...mockState.user,
              user: { ...mockState.user.user, appTypes: ['COMMUNITY', 'NON_COMMUNITY'] }
            }
          })
        },
        fetchWorkflowListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_WORKFLOW_LIST_REQUEST,
          countryId,
          successCb
        }
      ).toPromise();
      expect(hfWorkflowSpy).toHaveBeenCalledWith({ countryId });
      // expect(successCb).toHaveBeenCalled();
      // expect(dispatched).toEqual([
      //   hfActions.fetchWorkflowListSuccess({
      //     list: hfWorkflowList
      //   })
      // ]);
    });
    it('Fetch workflow list and dispatch failure', async () => {
      const error = new Error('Failed to fetch workflow list');
      const failureCb = jest.fn();
      const countryId = 1;
      const hfWorkflowSpy = jest.spyOn(hfService, 'fetchWorkflowList').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchWorkflowListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_WORKFLOW_LIST_REQUEST,
          countryId,
          failureCb
        }
      ).toPromise();
      expect(hfWorkflowSpy).toHaveBeenCalledWith({ countryId });
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchWorkflowListFailure(error)]);
    });
  });

  describe('Fetch Peer Supervisor Validation for Health Facility: LINKED_RESTRICTIONS_VALIDATION_REQUEST', () => {
    it('Fetch peer supervisor validation and dispatch success', async () => {
      const successCb = jest.fn();
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
          ...hfIdsTiRequestPayload,
          successCb
        }
      ).toPromise();
      expect(successCb).toHaveBeenCalled();
      expect(validationSpy).toHaveBeenCalledWith({ ...hfIdsTiRequestPayload });
    });

    it('Fetch peer supervisor validation and dispatch failure', async () => {
      const error = new Error('Failed to validate peer supervisor');
      const failureCb = jest.fn();
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
          ...hfIdsTiRequestPayload,
          failureCb
        }
      ).toPromise();
      expect(validationSpy).toHaveBeenCalledWith({ ...hfIdsTiRequestPayload });
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.validateLinkedRestrictionsFailure(error)]);
    });
  });

  describe('Fetch Health Facility Types: FETCH_HEALTH_FACILITY_TYPES_REQUEST', () => {
    it('Fetch health facility types and dispatch success', async () => {
      const successCb = jest.fn();
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
          type: ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_REQUEST,
          successCb
        }
      ).toPromise();
      expect(hfTypesSpy).toHaveBeenCalledWith();
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchHFTypesSuccess(hfTypeList)]);
    });

    it('Fetch health facility types and dispatch failure', async () => {
      const error = new Error('Failed to HF types and dispatch failure');
      const failureCb = jest.fn();
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
          type: ACTION_TYPES.FETCH_HEALTH_FACILITY_TYPES_REQUEST,
          failureCb
        }
      ).toPromise();
      expect(hfTypesSpy).toHaveBeenCalledWith();
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchHFTypesFailure(error)]);
    });
  });

  describe('Fetch Villages List from Health Facility: FETCH_VILLAGES_LIST_FROM_HF_REQUEST', () => {
    it('Fetch villages list and dispatch success', async () => {
      const countryId = 1;
      const districtId = 1;
      const chiefdomId = 1;
      const successCb = jest.fn();
      const villageListHF = jest
        .spyOn(hfService, 'fetchVillagesList')
        .mockImplementation(() => Promise.resolve({ data: { entity: villagesListFromHF } }) as AxiosPromise);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchVillagesListFromHFSagaRequest,
        {
          type: ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_REQUEST,
          countryId,
          districtId,
          chiefdomId,
          successCb
        }
      ).toPromise();
      expect(villageListHF).toHaveBeenCalledWith(countryId, districtId, chiefdomId, mockState.user.user.appTypes);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([
        hfActions.fetchVillagesListFromHFSuccess({
          data: { list: villagesListFromHF as any, hfTenantIds: [countryId] }
        })
      ]);
    });

    it('Fetch villages list and dispatch failure', async () => {
      const error = new Error('Failed to fetch villages list');
      const countryId = 1;
      const districtId = 1;
      const chiefdomId = 1;
      const failureCb = jest.fn();
      const villageListHF = jest.spyOn(hfService, 'fetchVillagesList').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchVillagesListFromHFSagaRequest,
        {
          type: ACTION_TYPES.FETCH_VILLAGES_LIST_FROM_HF_REQUEST,
          countryId,
          districtId,
          chiefdomId,
          failureCb
        }
      ).toPromise();
      expect(villageListHF).toHaveBeenCalledWith(countryId, districtId, chiefdomId, mockState.user.user.appTypes);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchVillagesListFromHFFailure(error)]);
    });
  });

  describe('Fetch Health Facility Users: FETCH_HEALTH_FACILITY_USER_LIST_REQUEST', () => {
    it('Fetch HF users list and dispatches success', async () => {
      const successCb = jest.fn();
      const fetchHFUsersListSpy = jest.spyOn(hfService, 'fetchHFUserList').mockImplementation(
        () =>
          Promise.resolve({
            data: { entityList: hfUsersList, totalCount: hfUsersList.length }
          }) as AxiosPromise
      );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchHFUserList,
        {
          ...(hfUsersRequest as any),
          successCb,
          type: ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_REQUEST
        }
      ).toPromise();
      expect(fetchHFUsersListSpy).toHaveBeenCalledWith({
        ...hfUsersRequest,
        appTypes: mockState.user.user.appTypes
      });
      expect(successCb).toHaveBeenCalled();
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
      const failureCb = jest.fn();
      const fetchHFUsersListSpy = jest
        .spyOn(hfService, 'fetchHFUserList')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchHFUserList,
        {
          ...(hfUsersRequest as any),
          failureCb,
          type: ACTION_TYPES.FETCH_HEALTH_FACILITY_USER_LIST_REQUEST
        }
      ).toPromise();
      expect(fetchHFUsersListSpy).toHaveBeenCalledWith({
        ...hfUsersRequest,
        appTypes: mockState.user.user.appTypes
      });
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchHFUserListFailure(error)]);
    });
  });

  describe('Fetch Health Facility district list: FETCH_DISTRICT_LIST_REQUEST_FOR_HF', () => {
    it('Fetch HF district list and dispatch success', async () => {
      const successCb = jest.fn();
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
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDistrictListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST_FOR_HF,
          countryId: 1,
          successCb
        }
      ).toPromise();
      expect(fetchDistrictListSpy).toHaveBeenCalledWith(1, mockState.user.user.appTypes);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([
        hfActions.fetchDistrictListSuccess({ list: hfDistrictList, total: hfDistrictList.length })
      ]);
    });

    it('Fetch HF district list and dispatch failure', async () => {
      const error = new Error('Failed to fetch district list');
      const failureCb = jest.fn();
      const fetchDistrictListSpy = jest
        .spyOn(hfService, 'fetchDistrictList')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchDistrictListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_DISTRICT_LIST_REQUEST_FOR_HF,
          countryId: 1,
          failureCb
        }
      ).toPromise();
      expect(fetchDistrictListSpy).toHaveBeenCalledWith(1, mockState.user.user.appTypes);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchDistrictListFailure(error)]);
    });
  });

  describe('Fetch Chiefdom for Health Facility: FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF', () => {
    it('Fetch chief dom and dispatch success', async () => {
      const successCb = jest.fn();
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
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchChiefdomListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF,
          countryId: hfChiefDomRequest.countryId,
          districtId: hfChiefDomRequest.districtId,
          successCb
        }
      ).toPromise();
      expect(chiefdomSpy).toHaveBeenCalledWith(
        hfChiefDomRequest.countryId,
        hfChiefDomRequest.districtId,
        mockState.user.user.appTypes
      );
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([
        hfActions.fetchChiefdomListSuccess({ list: hfChiefdomList, total: hfChiefdomList.length })
      ]);
    });

    it('Fetch chief dom and dispatch failure', async () => {
      const error = new Error('Failed to fetch chief dom');
      const failureCb = jest.fn();
      const chiefdomSpy = jest.spyOn(hfService, 'fetchChiefdomList').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchChiefdomListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_CHIEFDOM_LIST_REQUEST_FOR_HF,
          countryId: hfChiefDomRequest.countryId,
          districtId: hfChiefDomRequest.districtId,
          failureCb
        }
      ).toPromise();
      expect(chiefdomSpy).toHaveBeenCalledWith(
        hfChiefDomRequest.countryId,
        hfChiefDomRequest.districtId,
        mockState.user.user.appTypes
      );
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchChiefdomListFailure(error)]);
    });
  });

  describe('Fetch Village List for Health Facility: FETCH_VILLAGES_LIST_REQUEST_FOR_HF', () => {
    it('Fetch village list and dispatch success', async () => {
      const successCb = jest.fn();
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
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchVillagesListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_VILLAGES_LIST_REQUEST_FOR_HF,
          countryId: hfVillageRequest.countryId,
          districtId: hfVillageRequest.districtId,
          chiefdomId: hfVillageRequest.chiefdomId,
          successCb
        }
      ).toPromise();
      expect(hfVillageListSpy).toHaveBeenCalledWith(
        hfVillageRequest.countryId,
        hfVillageRequest.districtId,
        hfVillageRequest.chiefdomId,
        mockState.user.user.appTypes
      );
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([
        hfActions.fetchVillagesListSuccess({ list: hfVillageList as any, total: hfVillageList.length })
      ]);
    });

    it('Fetch village list and dispatch failure', async () => {
      const error = new Error('Failed to fetch village list');
      const failureCb = jest.fn();
      const hfVillageListSpy = jest
        .spyOn(hfService, 'fetchVillagesList')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchVillagesListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_VILLAGES_LIST_REQUEST_FOR_HF,
          countryId: hfVillageRequest.countryId,
          districtId: hfVillageRequest.districtId,
          chiefdomId: hfVillageRequest.chiefdomId,
          failureCb
        }
      ).toPromise();
      expect(hfVillageListSpy).toHaveBeenCalledWith(
        hfVillageRequest.countryId,
        hfVillageRequest.districtId,
        hfVillageRequest.chiefdomId,
        mockState.user.user.appTypes
      );
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchVillagesListFailure(error)]);
    });
  });

  describe('Fetch City List for Health Facility: FETCH_CITY_LIST_REQUEST_FOR_HF', () => {
    it('Fetch city list and dispatch success', async () => {
      const successCb = jest.fn();
      const hfCityListSpy = jest.spyOn(hfService, 'fetchCityList').mockImplementation(
        () =>
          Promise.resolve({
            data: { entity: [] }
          }) as unknown as AxiosPromise
      );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchCityListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_CITY_LIST_REQUEST_FOR_HF,
          searchTerm: '',
          appTypes: mockState.user.user.appTypes,
          successCb
        }
      ).toPromise();
      expect(hfCityListSpy).toHaveBeenCalledWith('', mockState.user.user.appTypes);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchCityListSuccess()]);
    });

    it('Fetch city list and dispatch failure', async () => {
      const error = new Error('Failed to fetch city list');
      const failureCb = jest.fn();
      const hfCityListSpy = jest.spyOn(hfService, 'fetchCityList').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchCityListSagaRequest,
        {
          type: ACTION_TYPES.FETCH_CITY_LIST_REQUEST_FOR_HF,
          searchTerm: '',
          appTypes: mockState.user.user.appTypes,
          successCb: jest.fn(),
          failureCb
        }
      ).toPromise();
      expect(hfCityListSpy).toHaveBeenCalledWith('', mockState.user.user.appTypes);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchCityListFailure(error)]);
    });
  });

  describe('Fetch Culture List from Health Facility: FETCH_CULTURE_LIST_REQUEST', () => {
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
      const hfCultureListSpy = jest
        .spyOn(hfService, 'fetchCultureList')
        .mockImplementation(() => Promise.reject(error));
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

  describe('Fetch Country List from Health Facility: FETCH_COUNTRY_LIST_REQUEST', () => {
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

  describe('Fetch Peer Supervisor Validation: FETCH_PEER_SUPERVISOR_VALIDATION', () => {
    it('Fetch peer supervisor and dispatches success', async () => {
      const { ids, tenantId, appTypes: requestAppTypes } = hfIdsTiRequestPayload;
      const successCb = jest.fn();
      const peerSupervisorValidationSpy = jest
        .spyOn(hfService, 'peerSupervisorValidation')
        .mockImplementation(() => Promise.resolve({ validate: true }) as unknown as AxiosPromise);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        peerSupervisorValidationSagaRequest,
        {
          type: ACTION_TYPES.FETCH_PEER_SUPERVISOR_VALIDATION,
          appTypes: requestAppTypes,
          ids,
          tenantId,
          successCb
        }
      ).toPromise();
      expect(peerSupervisorValidationSpy).toHaveBeenCalledWith({ ids, tenantId, appTypes: requestAppTypes });
      expect(successCb).toHaveBeenCalled();
    });

    it('Fetch peer supervisor and dispatches failure', async () => {
      const error = new Error('Failed to validate peer supervisor');
      const failureCb = jest.fn();
      const { ids, tenantId, appTypes: requestAppTypes } = hfIdsTiRequestPayload;
      const peerSupervisorValidationSpy = jest
        .spyOn(hfService, 'peerSupervisorValidation')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        peerSupervisorValidationSagaRequest,
        {
          type: ACTION_TYPES.FETCH_PEER_SUPERVISOR_VALIDATION,
          appTypes: requestAppTypes,
          ids,
          tenantId,
          failureCb
        }
      ).toPromise();
      expect(peerSupervisorValidationSpy).toHaveBeenCalledWith({ ids, tenantId, appTypes: requestAppTypes });
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchPeerSupervisorValidationsFailure(error)]);
    });
  });

  describe('Fetch Health Faciility Dashboard List: FETCH_HF_DASHBOARD_LIST_REQUEST', () => {
    it('Fetch HF Dashbaord list and dispatches success', async () => {
      const { skip, limit, countryId } = hfListRequestPayload;
      const successCb = jest.fn();
      const dashboardListSpy = jest
        .spyOn(hfService, 'fetchHealthFacilityList')
        .mockImplementation(
          () => Promise.resolve({ data: { entityList: hfDashboardList, totalCount: 10 } }) as AxiosPromise
        );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchHealthFacilityDashboardList,
        {
          type: ACTION_TYPES.FETCH_HF_DASHBOARD_LIST_REQUEST,
          skip,
          limit,
          countryId: String(countryId),
          successCb
        }
      ).toPromise();
      expect(dashboardListSpy).toHaveBeenCalledWith({
        skip,
        limit,
        countryId: String(countryId),
        tenantIds: [1]
      });
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([
        hfActions.fetchHFDashboardListSuccess({ siteDashboardList: hfDashboardList, total: 10 })
      ]);
    });

    it('Fetch HF Dashbaord list and dispatches failure', async () => {
      const error = new Error('Failed to fetch HF');
      const failureCb = jest.fn();
      const { skip, limit, countryId } = hfListRequestPayload;
      const peerSupervisorValidationSpy = jest
        .spyOn(hfService, 'fetchHealthFacilityList')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchHealthFacilityDashboardList,
        {
          type: ACTION_TYPES.FETCH_HF_DASHBOARD_LIST_REQUEST,
          skip,
          limit,
          countryId: String(countryId),
          failureCb
        }
      ).toPromise();
      expect(peerSupervisorValidationSpy).toHaveBeenCalledWith({
        skip,
        limit,
        countryId: String(countryId),
        tenantIds: [1]
      });
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchHFDashboardListFailure(error)]);
    });
  });

  describe('Fetch Unlinked Villages list: FETCH_UNLINKED_VILLAGES_REQUEST', () => {
    it('Fetch unlinked villages list and dispatch success', async () => {
      const countryId = 1;
      const districtId = 1;
      const chiefdomId = 1;
      const healthFacilityId = 1;
      const successCb = jest.fn();
      const unlinkedVillageListHF = jest
        .spyOn(hfService, 'fetchUnlinkedVillagesAPI')
        .mockImplementation(
          () => Promise.resolve({ data: { entity: villagesListFromHF }, totalCount: 2 }) as unknown as AxiosPromise
        );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchUnlinkedVillagesSagaRequest,
        {
          type: ACTION_TYPES.FETCH_UNLINKED_VILLAGES_REQUEST,
          countryId,
          districtId,
          chiefdomId,
          healthFacilityId,
          successCb
        }
      ).toPromise();
      expect(unlinkedVillageListHF).toHaveBeenCalledWith(
        countryId,
        districtId,
        chiefdomId,
        mockState.user.user.appTypes,
        healthFacilityId
      );
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([
        hfActions.fetchUnlinkedVillagesListSuccess({ list: villagesListFromHF as any, total: 2 })
      ]);
    });

    it('Fetch villages list and dispatch failure', async () => {
      const error = new Error('Failed to fetch villages list');
      const failureCb = jest.fn();
      const countryId = 1;
      const districtId = 1;
      const chiefdomId = 1;
      const healthFacilityId = 1;
      const unlinkedVillageListHF = jest
        .spyOn(hfService, 'fetchUnlinkedVillagesAPI')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action),
          getState: () => mockState
        },
        fetchUnlinkedVillagesSagaRequest,
        {
          type: ACTION_TYPES.FETCH_UNLINKED_VILLAGES_REQUEST,
          countryId,
          districtId,
          chiefdomId,
          healthFacilityId,
          failureCb
        }
      ).toPromise();
      expect(unlinkedVillageListHF).toHaveBeenCalledWith(
        countryId,
        districtId,
        chiefdomId,
        mockState.user.user.appTypes,
        healthFacilityId
      );
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchUnlinkedVillagesListFailure(error)]);
    });
  });
  describe('Fetch Villages List for Health Facility: FETCH_VILLAGES_LIST_USER_LINKED', () => {
    const tenantIds = [1];
    const userId = 1;
    const successCb = jest.fn();
    const failureCb = jest.fn();
    it('Fetch villages list and dispatch success', async () => {
      const villageListHF = jest
        .spyOn(hfService, 'fetchVillagesListfromHF')
        .mockImplementation(() => Promise.resolve({ data: { entity: villagesListFromHF } }) as AxiosPromise);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchVillagesListUserLinkedSagaRequest,
        {
          type: ACTION_TYPES.FETCH_VILLAGES_LIST_USER_LINKED,
          tenantIds,
          userId,
          successCb
        }
      ).toPromise();
      expect(villageListHF).toHaveBeenCalledWith(tenantIds, userId);
      expect(successCb).toHaveBeenCalledWith({ list: villagesListFromHF as any, hfTenantIds: tenantIds });
      expect(dispatched).toEqual([
        hfActions.fetchVillagesListFromHFSuccess({
          data: { list: villagesListFromHF as any, hfTenantIds: tenantIds }
        })
      ]);
    });
    it('Fetch villages list and dispatch success', async () => {
      const error = new Error('Failed to fetch villages list');
      const villageListHF = jest
        .spyOn(hfService, 'fetchVillagesListfromHF')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchVillagesListUserLinkedSagaRequest,
        {
          type: ACTION_TYPES.FETCH_VILLAGES_LIST_USER_LINKED,
          tenantIds,
          userId,
          failureCb
        }
      ).toPromise();
      expect(villageListHF).toHaveBeenCalledWith(tenantIds, userId);
      expect(failureCb).toHaveBeenCalled();
      expect(dispatched).toEqual([hfActions.fetchVillagesListFromHFFailure(error)]);
    });
  });
});
