import { runSaga } from 'redux-saga';
import {
  fetchProgramList,
  fetchProgramDetailsRequest,
  createProgram,
  updateProgramDetailsRequest,
  deleteProgram,
  fetchSitesForDropdown
} from '../sagas';
import * as programService from '../../../services/programAPI';
import * as programActions from '../actions';
import * as ACTION_TYPES from '../actionTypes';
import { AxiosPromise } from 'axios';
import PROGRAM_MOCK_DATA from '../../../tests/mockData/programMockDataConstants';

const programListRequestPayload = PROGRAM_MOCK_DATA.PROGRAM_LIST_REQUEST_PAYLOAD;
const programListResponseData = PROGRAM_MOCK_DATA.PROGRAM_LIST;
const programCreateRequestPayload = PROGRAM_MOCK_DATA.PROGRAM_CREATE_REQUEST_PAYLOAD;
const programUpdateRequestPayload = PROGRAM_MOCK_DATA.PROGRAM_UPDATE_REQUEST_PAYLOAD;
const programDeleteRequestPayload = PROGRAM_MOCK_DATA.PROGRAM_TI_ID_PAYLOAD;
const programfetchDetailResponsePayload = PROGRAM_MOCK_DATA.PROGRAM_DETAIL_RESPONSE_PAYLOAD;

describe('Fetch Program List in Region', () => {
  it('Fetch all medication list and dispatches success', async () => {
    const fetchProgramListSpy = jest.spyOn(programService, 'fetchProgramList').mockImplementation(
      () =>
        Promise.resolve({
          data: { entityList: programListResponseData, totalCount: 10, limit: 10 }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchProgramList,
      { data: programListRequestPayload, type: ACTION_TYPES.FETCH_PROGRAM_LIST_REQUEST }
    ).toPromise();
    expect(fetchProgramListSpy).toHaveBeenCalledWith(programListRequestPayload);
    expect(dispatched).toEqual([
      programActions.fetchProgramListSuccess({ programs: programListResponseData, total: 10, limit: 10 })
    ]);
  });

  it('Fails to fetch all medication and dispatches failure', async () => {
    const error = new Error('Failed to fetch medication');
    const fetchProgramListSpy = jest
      .spyOn(programService, 'fetchProgramList')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchProgramList,
      { data: programListRequestPayload, type: ACTION_TYPES.FETCH_PROGRAM_LIST_REQUEST }
    ).toPromise();
    expect(fetchProgramListSpy).toHaveBeenCalledWith(programListRequestPayload);
    expect(dispatched).toEqual([programActions.fetchProgramListFailure(error)]);
  });
});

describe('Create Program in Region', () => {
  it('Create program and dispatches success', async () => {
    const createProgramSpy = jest
      .spyOn(programService, 'saveProgram')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createProgram,
      {
        data: programCreateRequestPayload,
        type: ACTION_TYPES.CREATE_PROGRAM_REQUEST,
        successCb: () => null,
        failureCb: (e: Error) => null
      }
    ).toPromise();
    expect(createProgramSpy).toHaveBeenCalledWith(programCreateRequestPayload);
    expect(dispatched).toEqual([programActions.createProgramSuccess()]);
  });

  it('Create program and dispatches failure', async () => {
    const error = new Error('Failed to create program');
    const createProgramSpy = jest.spyOn(programService, 'saveProgram').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      createProgram,
      {
        data: programCreateRequestPayload,
        type: ACTION_TYPES.CREATE_PROGRAM_REQUEST,
        successCb: () => null,
        failureCb: (e: Error) => null
      }
    ).toPromise();
    expect(createProgramSpy).toHaveBeenCalledWith(programCreateRequestPayload);
    expect(dispatched).toEqual([programActions.createProgramFail(error)]);
  });
});

describe('Update Program in Region', () => {
  it('Update program and dispatches success', async () => {
    const updateProgramSpy = jest
      .spyOn(programService, 'updateProgramDetails')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateProgramDetailsRequest,
      {
        data: programUpdateRequestPayload,
        type: ACTION_TYPES.UPDATE_PROGRAM_REQUEST,
        successCb: () => null,
        failureCb: (e) => null
      }
    ).toPromise();
    expect(updateProgramSpy).toHaveBeenCalledWith(programUpdateRequestPayload);
    expect(dispatched).toEqual([programActions.updateProgramSuccess()]);
  });

  it('Update program and dispatches failure', async () => {
    const error = new Error('Failed to update program');
    const successCb = jest.fn();
    const failureCb = jest.fn();
    const updateProgramSpy = jest
      .spyOn(programService, 'updateProgramDetails')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      updateProgramDetailsRequest,
      {
        data: programUpdateRequestPayload,
        type: ACTION_TYPES.UPDATE_PROGRAM_REQUEST,
        successCb,
        failureCb
      }
    ).toPromise();
    expect(updateProgramSpy).toHaveBeenCalledWith(programUpdateRequestPayload);
    expect(failureCb).toHaveBeenCalled();
    expect(dispatched).toEqual([programActions.updateProgramFail()]);
  });
});

describe('Delete a Program in Region', () => {
  const successCb = jest.fn();
  const failureCb = jest.fn();
  it('Delete a medication and dispatches success', async () => {
    const deleteProgramSpy = jest
      .spyOn(programService, 'deleteProgram')
      .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteProgram,
      { ...programDeleteRequestPayload, type: ACTION_TYPES.DELETE_PROGRAM_REQUEST, successCb, failureCb }
    ).toPromise();
    expect(deleteProgramSpy).toHaveBeenCalledWith('1', '1');
    expect(successCb).toHaveBeenCalled();
    expect(dispatched).toEqual([programActions.deleteProgramSuccess()]);
  });

  it('Fails to delete a medication and dispatches failure', async () => {
    const error = new Error('Failed to delete medication');
    const deleteProgramSpy = jest
      .spyOn(programService, 'deleteProgram')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteProgram,
      { ...programDeleteRequestPayload, type: ACTION_TYPES.DELETE_PROGRAM_REQUEST, successCb, failureCb }
    ).toPromise();
    expect(failureCb).toHaveBeenCalled();
    expect(deleteProgramSpy).toHaveBeenCalledWith('1', '1');
    expect(dispatched).toEqual([programActions.deleteProgramFailure()]);
  });
});

describe('Fetch a Program Detail', () => {
  const successCb = jest.fn();
  const failureCb = jest.fn();
  it('Fetch a program detail and dispatches success', async () => {
    const fetchProgramDetailSpy = jest.spyOn(programService, 'fetchProgramDetails').mockImplementation(
      () =>
        Promise.resolve({
          data: { entity: programfetchDetailResponsePayload }
        }) as AxiosPromise
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchProgramDetailsRequest,
      { ...programDeleteRequestPayload, type: ACTION_TYPES.FETCH_PROGRAM_DETAILS_REQUEST, successCb, failureCb }
    ).toPromise();
    expect(fetchProgramDetailSpy).toHaveBeenCalledWith(programDeleteRequestPayload);
    expect(successCb).toHaveBeenCalledWith(programfetchDetailResponsePayload);
    expect(dispatched).toEqual([programActions.fetchProgramDetailsSuccess(programfetchDetailResponsePayload)]);
  });

  it('Fails to fetch program detail and dispatches failure', async () => {
    const error = new Error('Failed to fetch program');
    const fetchProgramDetailSpy = jest
      .spyOn(programService, 'fetchProgramDetails')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchProgramDetailsRequest,
      { ...programDeleteRequestPayload, type: ACTION_TYPES.FETCH_PROGRAM_DETAILS_REQUEST, successCb, failureCb }
    ).toPromise();
    expect(fetchProgramDetailSpy).toHaveBeenCalledWith(programDeleteRequestPayload);
    expect(failureCb).toHaveBeenCalled();
    expect(dispatched).toEqual([programActions.fetchProgramDetailsFailure()]);
  });
});

describe('Fetch Sites for Dropdown Saga', () => {
  it('should fetch site list and dispatch success', async () => {
    const siteListResponse = [{ id: '1', name: 'Site A', tenantId: '1' }];
    const tenantId = '1';
    const countryId = '1';
    const fetchHFForDropdownSpy = jest.spyOn(programService, 'getHFForDropdown').mockImplementation(
      () =>
        Promise.resolve({
          data: { entityList: siteListResponse }
        }) as AxiosPromise
    );

    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSitesForDropdown,
      {
        tenantId,
        countryId,
        type: 'FETCH_HF_DROPDOWN_REQUEST'
      }
    ).toPromise();

    expect(fetchHFForDropdownSpy).toHaveBeenCalledWith({ tenantId });
    expect(dispatched).toEqual([
      programActions.fetchSiteDropdownSuccess({
        list: siteListResponse,
        countryId
      })
    ]);
  });

  it('should handle failure and dispatch failure', async () => {
    const error = new Error('Failed to fetch sites');
    const tenantId = '1';
    const countryId = '1';
    const fetchHFForDropdownSpy = jest
      .spyOn(programService, 'getHFForDropdown')
      .mockImplementation(() => Promise.reject(error));

    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSitesForDropdown,
      {
        tenantId,
        countryId,
        type: 'FETCH_HF_DROPDOWN_REQUEST'
      }
    ).toPromise();

    expect(fetchHFForDropdownSpy).toHaveBeenCalledWith({ tenantId });
    expect(dispatched).toEqual([programActions.fetchSiteDropdownFailure(error)]);
  });
});
