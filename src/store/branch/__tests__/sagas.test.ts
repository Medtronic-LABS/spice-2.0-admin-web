import { runSaga } from 'redux-saga';
import {
  fetchBranchListSaga,
  createBranchSaga,
  updateBranchSaga,
  fetchBranchSummarySaga,
  fetchBranchesByUnionSaga
} from '../sagas';
import * as branchService from '../../../services/branchAPI';
import * as branchActions from '../actions';
import * as ACTION_TYPES from '../actionTypes';
import { AxiosResponse } from 'axios';

const fetchBranchListPayload = {
  countryId: 1,
  limit: 10,
  skip: 0,
  searchTerm: '',
  districtIds: [],
  chiefdomIds: []
};

const mockBranches = [
  {
    id: 1,
    name: 'Branch A',
    code: 'BR001',
    currentAccountCode: 'ACC001',
    district: { id: 1, name: 'District 1' },
    chiefdom: { id: 1, name: 'Chiefdom 1' }
  }
];

const createBranchPayload = {
  name: 'Branch A',
  code: 'BR001',
  currentAccountCode: 'ACC001',
  districtId: 1,
  chiefdomId: 1,
  skPositionCount: 0,
  ssPositionCount: 0,
  poPositionCount: 0,
  foPositionCount: 0
};

const updateBranchPayload = {
  id: 1,
  ...createBranchPayload
};

const mockBranchSummary = {
  id: 1,
  name: 'Branch A',
  code: 'BR001',
  currentAccountCode: 'ACC001',
  district: { id: 1, name: 'District 1' },
  chiefdom: { id: 1, name: 'Chiefdom 1' }
};

describe('Branch sagas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchBranchListSaga', () => {
    it('fetches branch list and dispatches success with entityList', async () => {
      const successCb = jest.fn();
      const fetchSpy = jest.spyOn(branchService, 'fetchBranchList').mockResolvedValue({
        data: { entityList: mockBranches, totalCount: 1 }
      } as AxiosResponse);

      const dispatched: any[] = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchBranchListSaga,
        {
          type: ACTION_TYPES.FETCH_BRANCH_LIST_REQUEST,
          payload: fetchBranchListPayload,
          successCb,
          failureCb: undefined
        }
      ).toPromise();

      expect(fetchSpy).toHaveBeenCalledWith(fetchBranchListPayload);
      expect(successCb).toHaveBeenCalledWith({ branches: mockBranches, totalCount: 1 });
      expect(dispatched).toEqual([
        branchActions.fetchBranchListSuccess({ branches: mockBranches, totalCount: 1 })
      ]);
    });

    it('uses data.list when entityList is not present', async () => {
      jest.spyOn(branchService, 'fetchBranchList').mockResolvedValue({
        data: { list: mockBranches, totalCount: 1 }
      } as AxiosResponse);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        fetchBranchListSaga,
        {
          type: ACTION_TYPES.FETCH_BRANCH_LIST_REQUEST,
          payload: fetchBranchListPayload,
          successCb: undefined,
          failureCb: undefined
        }
      ).toPromise();

      expect(dispatched).toEqual([
        branchActions.fetchBranchListSuccess({ branches: mockBranches, totalCount: 1 })
      ]);
    });

    it('dispatches failure and calls failureCb on error', async () => {
      const error = new Error('Fetch failed');
      const failureCb = jest.fn();
      jest.spyOn(branchService, 'fetchBranchList').mockRejectedValue(error);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        fetchBranchListSaga,
        {
          type: ACTION_TYPES.FETCH_BRANCH_LIST_REQUEST,
          payload: fetchBranchListPayload,
          successCb: undefined,
          failureCb
        }
      ).toPromise();

      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([branchActions.fetchBranchListFailure(error)]);
    });
  });

  describe('createBranchSaga', () => {
    it('creates branch and dispatches success', async () => {
      const successCb = jest.fn();
      const createSpy = jest.spyOn(branchService, 'createBranch').mockResolvedValue({} as AxiosResponse);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        createBranchSaga,
        {
          type: ACTION_TYPES.CREATE_BRANCH_REQUEST,
          payload: createBranchPayload,
          successCb,
          failureCb: undefined
        }
      ).toPromise();

      expect(createSpy).toHaveBeenCalledWith(createBranchPayload);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([branchActions.createBranchSuccess()]);
    });

    it('dispatches failure and calls failureCb on error', async () => {
      const error = new Error('Create failed');
      const failureCb = jest.fn();
      jest.spyOn(branchService, 'createBranch').mockRejectedValue(error);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        createBranchSaga,
        {
          type: ACTION_TYPES.CREATE_BRANCH_REQUEST,
          payload: createBranchPayload,
          successCb: undefined,
          failureCb
        }
      ).toPromise();

      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([branchActions.createBranchFailure(error)]);
    });
  });

  describe('updateBranchSaga', () => {
    it('updates branch and dispatches success', async () => {
      const successCb = jest.fn();
      const updateSpy = jest.spyOn(branchService, 'updateBranch').mockResolvedValue({} as AxiosResponse);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        updateBranchSaga,
        {
          type: ACTION_TYPES.UPDATE_BRANCH_REQUEST,
          payload: updateBranchPayload,
          successCb,
          failureCb: undefined
        }
      ).toPromise();

      expect(updateSpy).toHaveBeenCalledWith(updateBranchPayload);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([branchActions.updateBranchSuccess()]);
    });

    it('dispatches failure and calls failureCb on error', async () => {
      const error = new Error('Update failed');
      const failureCb = jest.fn();
      jest.spyOn(branchService, 'updateBranch').mockRejectedValue(error);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        updateBranchSaga,
        {
          type: ACTION_TYPES.UPDATE_BRANCH_REQUEST,
          payload: updateBranchPayload,
          successCb: undefined,
          failureCb
        }
      ).toPromise();

      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([branchActions.updateBranchFailure(error)]);
    });
  });

  describe('fetchBranchSummarySaga', () => {
    it('fetches branch summary and dispatches success', async () => {
      const successCb = jest.fn();
      const branchId = 1;
      const fetchSpy = jest.spyOn(branchService, 'fetchBranchById').mockResolvedValue({
        data: { entity: mockBranchSummary }
      } as AxiosResponse);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        fetchBranchSummarySaga,
        {
          type: ACTION_TYPES.FETCH_BRANCH_SUMMARY_REQUEST,
          branchId,
          successCb,
          failureCb: undefined
        }
      ).toPromise();

      expect(fetchSpy).toHaveBeenCalledWith(branchId);
      expect(successCb).toHaveBeenCalledWith(mockBranchSummary);
      expect(dispatched).toEqual([branchActions.fetchBranchSummarySuccess(mockBranchSummary)]);
    });

    it('dispatches failure and calls failureCb on error', async () => {
      const error = new Error('Fetch summary failed');
      const failureCb = jest.fn();
      const branchId = 1;
      jest.spyOn(branchService, 'fetchBranchById').mockRejectedValue(error);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        fetchBranchSummarySaga,
        {
          type: ACTION_TYPES.FETCH_BRANCH_SUMMARY_REQUEST,
          branchId,
          successCb: undefined,
          failureCb
        }
      ).toPromise();

      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([branchActions.fetchBranchSummaryFailure(error)]);
    });
  });

  describe('fetchBranchesByUnionSaga', () => {
    it('fetches branches by unions and dispatches success with entityList', async () => {
      const payload = { unionIds: [1, 2, 3] };
      const successCb = jest.fn();
      const fetchSpy = jest.spyOn(branchService, 'fetchBranchesByUnions').mockResolvedValue({
        data: { entityList: mockBranches }
      } as AxiosResponse);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        fetchBranchesByUnionSaga,
        {
          type: ACTION_TYPES.FETCH_BRANCHES_BY_UNION_REQUEST,
          payload,
          successCb,
          failureCb: undefined
        }
      ).toPromise();

      expect(fetchSpy).toHaveBeenCalledWith(payload);
      expect(successCb).toHaveBeenCalledWith(mockBranches);
      expect(dispatched).toEqual([branchActions.fetchBranchesByUnionSuccess(mockBranches)]);
    });

    it('uses empty array when entityList is not present', async () => {
      const payload = { unionIds: [1] };
      jest.spyOn(branchService, 'fetchBranchesByUnions').mockResolvedValue({
        data: {}
      } as AxiosResponse);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        fetchBranchesByUnionSaga,
        {
          type: ACTION_TYPES.FETCH_BRANCHES_BY_UNION_REQUEST,
          payload,
          successCb: undefined,
          failureCb: undefined
        }
      ).toPromise();

      expect(dispatched).toEqual([branchActions.fetchBranchesByUnionSuccess([])]);
    });

    it('passes districtIds and chiefdomIds when provided', async () => {
      const payload = { unionIds: [1], districtIds: [2, 3], chiefdomIds: [4] };
      const fetchSpy = jest.spyOn(branchService, 'fetchBranchesByUnions').mockResolvedValue({
        data: { entityList: mockBranches }
      } as AxiosResponse);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        fetchBranchesByUnionSaga,
        {
          type: ACTION_TYPES.FETCH_BRANCHES_BY_UNION_REQUEST,
          payload,
          successCb: undefined,
          failureCb: undefined
        }
      ).toPromise();

      expect(fetchSpy).toHaveBeenCalledWith(payload);
      expect(dispatched).toEqual([branchActions.fetchBranchesByUnionSuccess(mockBranches)]);
    });

    it('dispatches failure and calls failureCb on error', async () => {
      const error = new Error('Fetch branches by union failed');
      const failureCb = jest.fn();
      const payload = { unionIds: [1, 2] };
      jest.spyOn(branchService, 'fetchBranchesByUnions').mockRejectedValue(error);

      const dispatched: any[] = [];
      await runSaga(
        { dispatch: (action) => dispatched.push(action) },
        fetchBranchesByUnionSaga,
        {
          type: ACTION_TYPES.FETCH_BRANCHES_BY_UNION_REQUEST,
          payload,
          successCb: undefined,
          failureCb
        }
      ).toPromise();

      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([branchActions.fetchBranchesByUnionFailure(error)]);
    });
  });
});
