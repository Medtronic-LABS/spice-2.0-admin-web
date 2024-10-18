import { runSaga } from 'redux-saga';
import { AxiosPromise, AxiosResponse } from 'axios';
import * as labtestService from '../../../services/labtestAPI';
import * as labTestActions from '../actions';
import * as ACTION_TYPES from '../actionTypes';
import {
  deleteLabtest,
  fetchLabTest,
  fetchLabTestCustomizationSaga,
  fetchUnitList,
  labTestCustomizationSaga,
  validateLabtest
} from '../sagas';
import * as LAB_TEST_MOCK_DATA from '../../../tests/mockData/labTestDataConstants';

const setupTest = async ({
  mockResponse,
  actionType,
  sagaPayloadMockData,
  expectedActions,
  serviceAPI,
  sagaFn,
  includeSuccessCb = false,
  includeFailureCb = false,
  expectedSuccessCbValue,
  expectedError
}: {
  mockResponse: any;
  actionType: string;
  sagaPayloadMockData?: any;
  expectedActions: any[];
  serviceAPI: any;
  sagaFn: any;
  includeSuccessCb?: boolean;
  includeFailureCb?: boolean;
  expectedSuccessCbValue?: any;
  expectedError?: any;
}) => {
  const labTestSpy = jest.spyOn(labtestService, serviceAPI).mockImplementation(() => mockResponse);
  const dispatched: any = [];
  const successCb = jest.fn();
  const failureCb = jest.fn();
  const sagaPayload: any = {
    type: actionType,
    data: sagaPayloadMockData
  };
  if (includeSuccessCb) {
    sagaPayload.successCb = successCb;
  }
  if (includeFailureCb) {
    sagaPayload.failureCb = failureCb;
  }

  await runSaga(
    {
      dispatch: (action) => dispatched.push(action)
    },
    sagaFn,
    sagaPayload
  ).toPromise();

  expect(labTestSpy).toHaveBeenCalledWith(sagaPayloadMockData);
  if (!expectedError || expectedError instanceof Error) {
    expect(dispatched).toEqual(expectedActions);
  }
  if (includeSuccessCb) {
    expect(successCb).toHaveBeenCalledWith(expectedSuccessCbValue);
  }

  if (includeFailureCb && expectedError instanceof Error) {
    expect(failureCb).toHaveBeenCalledWith(expectedError);
  } else {
    expect(failureCb).not.toHaveBeenCalled();
  }
};

describe('Fetch Lab Test Request: FETCH_LABTEST_REQUEST', () => {
  it('should fetch lab test and return data, dispatch success', async () => {
    const mockResponse = Promise.resolve({
      data: {
        entityList: LAB_TEST_MOCK_DATA.LABTEST_FETCH_RESPONSE.labtests,
        totalCount: LAB_TEST_MOCK_DATA.LABTEST_FETCH_RESPONSE.total
      }
    }) as AxiosPromise;

    const expectedActions = [
      labTestActions.fetchLabtestsSuccess({
        labtests: LAB_TEST_MOCK_DATA.LABTEST_FETCH_RESPONSE.labtests,
        total: LAB_TEST_MOCK_DATA.LABTEST_FETCH_RESPONSE.total
      })
    ];

    await setupTest({
      mockResponse,
      actionType: ACTION_TYPES.FETCH_LABTEST_REQUEST,
      sagaPayloadMockData: LAB_TEST_MOCK_DATA.LABTEST_FETCH_PAYLOAD,
      expectedActions,
      serviceAPI: 'fetchLabTest',
      sagaFn: fetchLabTest
    });
  });

  it('should fetch lab test with empty data, dispatch success', async () => {
    const mockResponse = Promise.resolve({
      data: {
        entityList: undefined,
        totalCount: 0
      }
    }) as AxiosPromise;

    const expectedActions = [
      labTestActions.fetchLabtestsSuccess({
        labtests: [],
        total: 0
      })
    ];

    await setupTest({
      mockResponse,
      actionType: ACTION_TYPES.FETCH_LABTEST_REQUEST,
      sagaPayloadMockData: LAB_TEST_MOCK_DATA.LABTEST_FETCH_PAYLOAD,
      expectedActions,
      serviceAPI: 'fetchLabTest',
      sagaFn: fetchLabTest
    });
  });

  it('should fetch lab test and dispatch failure on error (instanceof Error)', async () => {
    const error = new Error('Failed to fetch labtest');
    const mockResponse = Promise.reject(error);

    const expectedActions = [labTestActions.fetchLabtestsFailure(error)];

    await setupTest({
      mockResponse,
      actionType: ACTION_TYPES.FETCH_LABTEST_REQUEST,
      sagaPayloadMockData: LAB_TEST_MOCK_DATA.LABTEST_FETCH_PAYLOAD,
      expectedActions,
      serviceAPI: 'fetchLabTest',
      sagaFn: fetchLabTest,
      includeFailureCb: true,
      expectedError: error
    });
  });

  it('should fetch lab test and dispatch failure on error (string)', async () => {
    const error = 'Failed to fetch labtest';
    const mockResponse = Promise.reject(error);

    const expectedActions: any[] = [];

    await setupTest({
      mockResponse,
      actionType: ACTION_TYPES.FETCH_LABTEST_REQUEST,
      sagaPayloadMockData: LAB_TEST_MOCK_DATA.LABTEST_FETCH_PAYLOAD,
      expectedActions,
      serviceAPI: 'fetchLabTest',
      sagaFn: fetchLabTest,
      includeFailureCb: true,
      expectedError: error
    });
  });
});

describe('Fetch Lab Test Customization Request: FETCH_LABTEST_CUSTOMIZATION_REQUEST', () => {
  it('Fetches Lab Test and dispatches success', async () => {
    const successCb = jest.fn();
    const fetchLabTestSpy = jest.spyOn(labtestService, 'fetchLabtestCustomization').mockImplementation(() =>
      Promise.resolve({
        data: { entity: LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE }
      } as AxiosResponse)
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTestCustomizationSaga,
      {
        type: ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_REQUEST,
        ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD,
        successCb
      }
    ).toPromise();
    expect(fetchLabTestSpy).toHaveBeenCalledWith({ ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD });
    const payload = {
      ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE,
      formInput: JSON.parse(LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE.formInput)
    };
    expect(successCb).toHaveBeenCalledWith({ ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE });
    expect(dispatched).toEqual([labTestActions.fetchLabTestCustomizationSuccess({ payload })]);
  });

  it('Fetches Lab Test and dispatches instance of error', async () => {
    const failureCb = jest.fn();
    const error = new Error('Failed to fetch lab test');
    const fetchLabTestSpy = jest
      .spyOn(labtestService, 'fetchLabtestCustomization')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTestCustomizationSaga,
      {
        type: ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_REQUEST,
        ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD,
        failureCb
      }
    ).toPromise();
    expect(fetchLabTestSpy).toHaveBeenCalledWith({ ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD });
    expect(failureCb).toHaveBeenCalledWith(error);
    expect(dispatched).toEqual([labTestActions.fetchLabTestCustomizationFailure(error)]);
  });

  it('Fetches Lab Test and dispatches error', async () => {
    const failureCb = jest.fn();
    const error = 'Failed to fetch lab test';
    const fetchLabTestSpy = jest
      .spyOn(labtestService, 'fetchLabtestCustomization')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchLabTestCustomizationSaga,
      {
        type: ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_REQUEST,
        ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD,
        failureCb
      }
    ).toPromise();
    expect(fetchLabTestSpy).toHaveBeenCalledWith({ ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD });
    expect(failureCb).not.toHaveBeenCalledWith(error);
    expect(dispatched).not.toEqual([labTestActions.fetchLabTestCustomizationFailure(error)]);
  });
});

describe('Delete Lab Test Request: DELETE_LABTEST_REQUEST', () => {
  it('Delete Lab Test and dispatches success', async () => {
    const successCb = jest.fn();
    const id = 1;
    const deleteLabTestSpy = jest
      .spyOn(labtestService, 'deleteLabtest')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteLabtest,
      {
        type: ACTION_TYPES.DELETE_LABTEST_REQUEST,
        id,
        successCb
      }
    ).toPromise();
    expect(deleteLabTestSpy).toHaveBeenCalledWith({ id });
    expect(successCb).toHaveBeenCalled();
    expect(dispatched).toEqual([labTestActions.deleteLabtestSuccess()]);
  });

  it('Delete Lab Test and dispatches instance of error', async () => {
    const failureCb = jest.fn();
    const id = 1;
    const error = new Error('Failed to delete lab test');
    const deleteLabTestSpy = jest
      .spyOn(labtestService, 'deleteLabtest')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteLabtest,
      {
        type: ACTION_TYPES.DELETE_LABTEST_REQUEST,
        id,
        failureCb
      }
    ).toPromise();
    expect(deleteLabTestSpy).toHaveBeenCalledWith({ id });
    expect(failureCb).toHaveBeenCalledWith(error);
    expect(dispatched).toEqual([labTestActions.deleteLabtestFail(error)]);
  });

  it('Delete Lab Test and dispatches error', async () => {
    const failureCb = jest.fn();
    const id = 1;
    const error = 'Failed to delete lab test';
    const deleteLabTestSpy = jest
      .spyOn(labtestService, 'deleteLabtest')
      .mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      deleteLabtest,
      {
        type: ACTION_TYPES.DELETE_LABTEST_REQUEST,
        id,
        failureCb
      }
    ).toPromise();
    expect(deleteLabTestSpy).toHaveBeenCalledWith({ id });
    expect(failureCb).not.toHaveBeenCalledWith(error);
  });
});

describe('Lab Test Customization Saga: LABTEST_CUSTOMIZATION_REQUEST', () => {
  it('Update Lab test customization and dispatches success', async () => {
    const successCb = jest.fn();
    const addLabTestCustomizationSpy = jest
      .spyOn(labtestService, 'updateLabTestCustomization')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));

    const dispatched: any = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      {
        type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST,
        data: { ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE },
        successCb
      }
    ).toPromise();

    expect(addLabTestCustomizationSpy).toHaveBeenCalledWith({
      ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE
    });
    expect(dispatched).toEqual([labTestActions.labtestCustomizationSuccess()]);
    expect(successCb).toHaveBeenCalled();
  });

  it('Update Lab test customization and throw instances of error', async () => {
    const failureCb = jest.fn();
    const error = new Error('Failed to customize lab test');
    const addLabTestCustomizationSpy = jest
      .spyOn(labtestService, 'updateLabTestCustomization')
      .mockImplementation(() => Promise.reject(error));

    const dispatched: any = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      {
        type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST,
        data: { ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE },
        failureCb
      }
    ).toPromise();

    expect(addLabTestCustomizationSpy).toHaveBeenCalledWith({
      ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE
    });
    expect(dispatched).toEqual([labTestActions.labtestCustomizationFailure(error)]);
    expect(failureCb).toHaveBeenCalledWith(error);
  });

  it('Update Lab test customization and throw error', async () => {
    const failureCb = jest.fn();
    const error = 'Failed to customize lab test';
    const addLabTestCustomizationSpy = jest
      .spyOn(labtestService, 'updateLabTestCustomization')
      .mockImplementation(() => Promise.reject(error));

    const dispatched: any = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      {
        type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST,
        data: { ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE },
        failureCb
      }
    ).toPromise();

    expect(addLabTestCustomizationSpy).toHaveBeenCalledWith({
      ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE
    });
    expect(dispatched).not.toEqual([labTestActions.labtestCustomizationFailure(error)]);
    expect(failureCb).not.toHaveBeenCalledWith(error);
  });

  it('Create Lab test customization updates and dispatches success', async () => {
    const successCb = jest.fn();
    const updateLabTestCustomizationSpy = jest
      .spyOn(labtestService, 'addLabTestCustomization')
      .mockImplementation(() => Promise.resolve({} as AxiosResponse));

    const dispatched: any = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      {
        type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST,
        data: { ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE, id: 0 },
        successCb
      }
    ).toPromise();

    expect(updateLabTestCustomizationSpy).toHaveBeenCalledWith({
      ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE,
      id: 0
    });
    expect(dispatched).toEqual([labTestActions.labtestCustomizationSuccess()]);
    expect(successCb).toHaveBeenCalled();
  });
  it('Create Lab test customization and throw instances of error', async () => {
    const failureCb = jest.fn();
    const error = new Error('Failed to customize lab test');
    const addLabTestCustomizationSpy = jest
      .spyOn(labtestService, 'addLabTestCustomization')
      .mockImplementation(() => Promise.reject(error));

    const dispatched: any = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      {
        type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST,
        data: { ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE, id: 0 },
        failureCb
      }
    ).toPromise();

    expect(addLabTestCustomizationSpy).toHaveBeenCalledWith({
      ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE,
      id: 0
    });
    expect(dispatched).toEqual([labTestActions.labtestCustomizationFailure(error)]);
    expect(failureCb).toHaveBeenCalledWith(error);
  });

  it('Create Lab test customization and error', async () => {
    const failureCb = jest.fn();
    const error = 'Failed to customize lab test';
    const addLabTestCustomizationSpy = jest
      .spyOn(labtestService, 'addLabTestCustomization')
      .mockImplementation(() => Promise.reject(error));

    const dispatched: any = [];

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      labTestCustomizationSaga,
      {
        type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST,
        data: { ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE, id: 0 },
        failureCb
      }
    ).toPromise();

    expect(addLabTestCustomizationSpy).toHaveBeenCalledWith({
      ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_RESPONSE,
      id: 0
    });
    expect(dispatched).not.toEqual([labTestActions.labtestCustomizationFailure(error)]);
    expect(failureCb).not.toHaveBeenCalledWith(error);
  });
});

describe('Fetch Unit List Request: FETCH_UNIT_LIST_REQUEST', () => {
  it('Fetch unit list and dispatches success', async () => {
    const unitListSpy = jest.spyOn(labtestService, 'fetchUnitList').mockImplementation(() =>
      Promise.resolve({
        data: [LAB_TEST_MOCK_DATA.UNIT_LIST_RESPONSE]
      } as AxiosResponse)
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUnitList
    ).toPromise();
    expect(unitListSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([labTestActions.fetchUnitListSuccess([LAB_TEST_MOCK_DATA.UNIT_LIST_RESPONSE])]);
  });

  it('Fetch unit list and dispatches instance of error', async () => {
    const error = new Error('Failed to fetch unit list');
    const unitListSpy = jest.spyOn(labtestService, 'fetchUnitList').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUnitList
    ).toPromise();
    expect(unitListSpy).toHaveBeenCalledWith();
    expect(dispatched).toEqual([labTestActions.fetchUnitListFail(error)]);
  });

  it('Fetch unit list and dispatches error', async () => {
    const error = 'Failed to fetch unit list';
    const unitListSpy = jest.spyOn(labtestService, 'fetchUnitList').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchUnitList
    ).toPromise();
    expect(unitListSpy).toHaveBeenCalledWith();
    expect(dispatched).not.toEqual([labTestActions.fetchUnitListFail(error as any)]);
  });
});

describe('Validate Labtest Request: VALIDATE_LABTEST_REQUEST', () => {
  it('Validate unit list and dispatches success', async () => {
    const successCb = jest.fn();
    const validateSpy = jest.spyOn(labtestService, 'validateLabtest').mockImplementation(() =>
      Promise.resolve({
        ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD
      } as unknown as AxiosResponse)
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      validateLabtest,
      {
        type: ACTION_TYPES.VALIDATE_LABTEST_REQUEST,
        ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD,
        countryId: 1,
        successCb
      }
    ).toPromise();
    expect(validateSpy).toHaveBeenCalledWith({ ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD, countryId: 1 });
    expect(dispatched).toEqual([labTestActions.validateLabtestSuccess()]);
    expect(successCb).toHaveBeenCalled();
  });

  it('Validate unit list and dispatches instanceof error', async () => {
    const failureCb = jest.fn();
    const error = new Error('Failed to fetch unit list');
    const validateSpy = jest.spyOn(labtestService, 'validateLabtest').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      validateLabtest,
      {
        type: ACTION_TYPES.VALIDATE_LABTEST_REQUEST,
        ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD,
        countryId: 1,
        failureCb
      }
    ).toPromise();
    expect(validateSpy).toHaveBeenCalledWith({ ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD, countryId: 1 });
    expect(dispatched).toEqual([labTestActions.validateLabtestFailure(error)]);
    expect(failureCb).toHaveBeenCalled();
  });

  it('Validate unit list and dispatches error', async () => {
    const failureCb = jest.fn();
    const error = 'Failed to fetch unit list';
    const validateSpy = jest.spyOn(labtestService, 'validateLabtest').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      validateLabtest,
      {
        type: ACTION_TYPES.VALIDATE_LABTEST_REQUEST,
        ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD,
        countryId: 1,
        failureCb
      }
    ).toPromise();
    expect(validateSpy).toHaveBeenCalledWith({ ...LAB_TEST_MOCK_DATA.LABTEST_CUSTOMIZATION_PAYLOAD, countryId: 1 });
    expect(dispatched).not.toEqual([labTestActions.validateLabtestFailure(error as any)]);
    expect(failureCb).not.toHaveBeenCalled();
  });
});
