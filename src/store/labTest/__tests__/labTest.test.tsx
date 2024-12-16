import {
  fetchLabTest,
  deleteLabtest,
  fetchUnitList,
  fetchLabTestCustomizationSaga,
  labTestCustomizationSaga,
  validateLabtest
} from '../sagas';
import { runSaga } from 'redux-saga';
import * as labtestService from '../../../services/labtestAPI';
import * as ACTION_TYPES from '../actionTypes';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/labTestDataConstants';
import { AxiosResponse } from 'axios';
import * as labTestAction from '../actions';

const labTestDetailsRequestMockData = MOCK_DATA_CONSTANTS.FETCH_LAB_TEST_REQUEST_PAYLOAD;
const labTestCustomizedRequestMockData = MOCK_DATA_CONSTANTS.FETCH_LAB_TEST_CUSTOMIZATION_REQUEST;
const updateLabTestCustomizationRequestMockData = MOCK_DATA_CONSTANTS.FETCH_LAB_TEST_CUSTOMIZATION_UPDATE_REQUEST;
const labTestDetailsMockData = MOCK_DATA_CONSTANTS.FETCH_LAB_TEST_RESPONSE_PAYLOAD;

describe('labTest Saga and Actioon', () => {
  it('fetchLab Request', async () => {
    const { total } = labTestDetailsMockData;
    const fetchLabTestSpy = jest.spyOn(labtestService, 'fetchLabTest').mockImplementation(() => {
      return Promise.resolve({ data: { entityList: undefined, totalCount: total } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTest,
      { data: { ...labTestDetailsRequestMockData } as any, type: ACTION_TYPES.FETCH_LABTEST_REQUEST }
    ).toPromise();
    expect(fetchLabTestSpy).toHaveBeenCalledWith({ countryId: 1, limit: 10, searchTerm: '', skip: 0 });
    expect(dispatched).toEqual([labTestAction.fetchLabtestsSuccess({ ...labTestDetailsMockData, labtests: [] })]);
  });
  it('fetchLab successfully with valid labtest result', async () => {
    const { labtests, total } = labTestDetailsMockData;
    const fetchLabTestSpy = jest.spyOn(labtestService, 'fetchLabTest').mockImplementation(() => {
      return Promise.resolve({ data: { entityList: labtests, totalCount: total } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTest,
      { data: { ...labTestDetailsRequestMockData } as any, type: ACTION_TYPES.FETCH_LABTEST_REQUEST }
    ).toPromise();
    expect(fetchLabTestSpy).toHaveBeenCalledWith({ countryId: 1, limit: 10, searchTerm: '', skip: 0 });
    expect(dispatched).toEqual([labTestAction.fetchLabtestsSuccess(labTestDetailsMockData)]);
  });

  it('fetchLab successfully with labtest result as undefined', async () => {
    const { total } = labTestDetailsMockData;
    const fetchLabTestSpy = jest.spyOn(labtestService, 'fetchLabTest').mockImplementation(() => {
      return Promise.resolve({ data: { entityList: undefined, totalCount: total } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTest,
      { data: { ...labTestDetailsRequestMockData } as any, type: ACTION_TYPES.FETCH_LABTEST_REQUEST }
    ).toPromise();
    expect(fetchLabTestSpy).toHaveBeenCalledWith({ countryId: 1, limit: 10, searchTerm: '', skip: 0 });
    expect(dispatched).toEqual([labTestAction.fetchLabtestsSuccess({ labtests: [], total })]);
  });

  it('fetchLab Failure with instance of error', async () => {
    const error: Error = new Error('Unable to fetchLab. Please try after sometime.');
    const fetchLabTestSpy = jest.spyOn(labtestService, 'fetchLabTest').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTest,
      { data: { ...labTestDetailsRequestMockData } as any, type: ACTION_TYPES.FETCH_LABTEST_REQUEST }
    ).toPromise();
    expect(fetchLabTestSpy).toHaveBeenCalledWith({ countryId: 1, limit: 10, searchTerm: '', skip: 0 });
    expect(dispatched).toEqual([labTestAction.fetchLabtestsFailure(error)]);
  });

  it('fetchLab Failure without instance of error', async () => {
    const error = 'Unable to fetchLab. Please try after sometime.';
    const fetchLabTestSpy = jest.spyOn(labtestService, 'fetchLabTest').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTest,
      { data: { ...labTestDetailsRequestMockData } as any, type: ACTION_TYPES.FETCH_LABTEST_REQUEST }
    ).toPromise();
    expect(fetchLabTestSpy).toHaveBeenCalledWith({ countryId: 1, limit: 10, searchTerm: '', skip: 0 });
  });

  it('delete labTest', async () => {
    const deleteLabTestSpy = jest.spyOn(labtestService, 'deleteLabtest').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteLabtest,
      { id: 1 as any, type: ACTION_TYPES.DELETE_LABTEST_REQUEST }
    ).toPromise();
    expect(deleteLabTestSpy).toHaveBeenCalledWith({ id: 1 });
    expect(dispatched).toEqual([labTestAction.deleteLabtestSuccess()]);
  });

  it('delete labTest error with instance of error', async () => {
    const error: Error = new Error('Unable to Delete.');
    const deleteLabTestSpy = jest.spyOn(labtestService, 'deleteLabtest').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteLabtest,
      { id: 1 as any, type: ACTION_TYPES.DELETE_LABTEST_REQUEST }
    ).toPromise();
    expect(deleteLabTestSpy).toHaveBeenCalledWith({ id: 1 });
    expect(dispatched).toEqual([labTestAction.deleteLabtestFail(error)]);
  });

  it('delete labTest error without instance of error', async () => {
    const error = 'Unable to Delete.';
    const deleteLabTestSpy = jest.spyOn(labtestService, 'deleteLabtest').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteLabtest,
      { id: 1 as any, type: ACTION_TYPES.DELETE_LABTEST_REQUEST }
    ).toPromise();
    expect(deleteLabTestSpy).toHaveBeenCalledWith({ id: 1 });
  });

  it('fetchUnitList successfully', async () => {
    const fetchUnitListTestSpy = jest.spyOn(labtestService, 'fetchUnitList').mockImplementation(() => {
      return Promise.resolve({ data: [{ id: '1', unit: '' }] } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUnitList
    ).toPromise();
    expect(fetchUnitListTestSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([labTestAction.fetchUnitListSuccess([{ id: '1', unit: '' }])]);
  });

  it('fetchUnitList Fail with instance of error', async () => {
    const error: Error = new Error('Unable to fetchUnitList.');
    const fetchUnitListTestSpy = jest.spyOn(labtestService, 'fetchUnitList').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUnitList
    ).toPromise();
    expect(fetchUnitListTestSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([labTestAction.fetchUnitListFail(error)]);
  });

  it('fetchUnitList Fail without instance of error', async () => {
    const error = 'Unable to fetchUnitList.';
    const fetchUnitListTestSpy = jest.spyOn(labtestService, 'fetchUnitList').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUnitList
    ).toPromise();
    expect(fetchUnitListTestSpy).toHaveBeenCalledWith();
  });

  it('fetchLabTestCustomizationSaga successfully', async () => {
    const fetchUnitListTestSpy = jest.spyOn(labtestService, 'fetchLabtestCustomization').mockImplementation(() => {
      return Promise.resolve({ data: { entity: labTestCustomizedRequestMockData } } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTestCustomizationSaga,
      { name: '', type: ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_REQUEST }
    ).toPromise();
    expect(fetchUnitListTestSpy).toHaveBeenCalledWith({ name: '' });
    expect(dispatched).toEqual([
      labTestAction.fetchLabTestCustomizationSuccess({
        payload: MOCK_DATA_CONSTANTS.FETCH_LAB_TEST_CUSTOMIZATION_RESPONSE
      })
    ]);
  });

  it('fetchLabTestCustomizationSaga Failure with instance of error', async () => {
    const error: Error = new Error('Unable to fetchLabTestCustomizationSaga.');
    const fetchUnitListTestSpy = jest.spyOn(labtestService, 'fetchLabtestCustomization').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTestCustomizationSaga,
      { name: '', type: ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_REQUEST }
    ).toPromise();
    expect(fetchUnitListTestSpy).toHaveBeenCalledWith({ name: '' });
    expect(dispatched).toEqual([labTestAction.fetchLabTestCustomizationFailure(error)]);
  });

  it('fetchLabTestCustomizationSaga Failure without instance of error', async () => {
    const error = 'Unable to fetchLabTestCustomizationSaga.';
    const fetchUnitListTestSpy = jest.spyOn(labtestService, 'fetchLabtestCustomization').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTestCustomizationSaga,
      { name: '', type: ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_REQUEST }
    ).toPromise();
    expect(fetchUnitListTestSpy).toHaveBeenCalledWith({ name: '' });
  });

  it('labTestCustomizationSaga successfully', async () => {
    const labTestCustomizationSagaSpy = jest.spyOn(labtestService, 'addLabTestCustomization').mockImplementation(() => {
      return Promise.resolve({ data: labTestCustomizedRequestMockData } as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      { data: { ...labTestCustomizedRequestMockData }, type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST }
    ).toPromise();
    expect(labTestCustomizationSagaSpy).toHaveBeenCalledWith({ ...labTestCustomizedRequestMockData });
    expect(dispatched).toEqual([labTestAction.labtestCustomizationSuccess()]);
  });

  it('labTestCustomizationSaga Failure with instance of error', async () => {
    const error: Error = new Error('Unable to add.');
    const labTestCustomizationSagaSpy = jest.spyOn(labtestService, 'addLabTestCustomization').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      { data: { ...labTestCustomizedRequestMockData }, type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST }
    ).toPromise();
    expect(labTestCustomizationSagaSpy).toHaveBeenCalledWith({ ...labTestCustomizedRequestMockData });
    expect(dispatched).toEqual([labTestAction.labtestCustomizationFailure(error)]);
  });

  it('labTestCustomizationSaga Failure without instance of error', async () => {
    const error = 'Unable to add.';
    const labTestCustomizationSagaSpy = jest.spyOn(labtestService, 'addLabTestCustomization').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      { data: { ...labTestCustomizedRequestMockData }, type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST }
    ).toPromise();
    expect(labTestCustomizationSagaSpy).toHaveBeenCalledWith({ ...labTestCustomizedRequestMockData });
  });

  it('labTestCustomizationSaga update successfully', async () => {
    const labTestCustomizationSagaSpy = jest
      .spyOn(labtestService, 'updateLabTestCustomization')
      .mockImplementation(() => {
        return Promise.resolve({ data: updateLabTestCustomizationRequestMockData } as AxiosResponse);
      });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      { data: { ...updateLabTestCustomizationRequestMockData }, type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST }
    ).toPromise();
    expect(labTestCustomizationSagaSpy).toHaveBeenCalledWith({ ...updateLabTestCustomizationRequestMockData });
    expect(dispatched).toEqual([labTestAction.labtestCustomizationSuccess()]);
  });
  it('labTestCustomizationSaga update Failure', async () => {
    const error: Error = new Error('Unable to Update.');
    const labTestCustomizationSagaSpy = jest
      .spyOn(labtestService, 'updateLabTestCustomization')
      .mockImplementation(() => {
        return Promise.reject(error);
      });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      { data: { ...updateLabTestCustomizationRequestMockData }, type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST }
    ).toPromise();
    expect(labTestCustomizationSagaSpy).toHaveBeenCalledWith({ ...updateLabTestCustomizationRequestMockData });
    expect(dispatched).toEqual([labTestAction.labtestCustomizationFailure(error)]);
  });
  it('validateLabtest successfully', async () => {
    const validateLabtestSagaSpy = jest.spyOn(labtestService, 'validateLabtest').mockImplementation(() => {
      return Promise.resolve({} as AxiosResponse);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      validateLabtest,
      { name: '', countryId: 1, type: ACTION_TYPES.VALIDATE_LABTEST_REQUEST }
    ).toPromise();
    expect(validateLabtestSagaSpy).toHaveBeenCalledWith({ name: '', countryId: 1 });
    expect(dispatched).toEqual([labTestAction.validateLabtestSuccess()]);
  });
  it('validateLabtest Failure with instance of error', async () => {
    const error: Error = new Error('Unable to Validate.');
    const validateLabtestSagaSpy = jest.spyOn(labtestService, 'validateLabtest').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      validateLabtest,
      { name: '', countryId: 1, type: ACTION_TYPES.VALIDATE_LABTEST_REQUEST }
    ).toPromise();
    expect(validateLabtestSagaSpy).toHaveBeenCalledWith({ name: '', countryId: 1 });
    expect(dispatched).toEqual([labTestAction.validateLabtestFailure(error)]);
  });

  it('validateLabtest Failure without instance of error', async () => {
    const error = 'Unable to Validate.';
    const validateLabtestSagaSpy = jest.spyOn(labtestService, 'validateLabtest').mockImplementation(() => {
      return Promise.reject(error);
    });
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      validateLabtest,
      { name: '', countryId: 1, type: ACTION_TYPES.VALIDATE_LABTEST_REQUEST }
    ).toPromise();
    expect(validateLabtestSagaSpy).toHaveBeenCalledWith({ name: '', countryId: 1 });
  });
});
