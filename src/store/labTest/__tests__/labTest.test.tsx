import { runSaga } from 'redux-saga';
import { AxiosPromise } from 'axios';
import * as labtestService from '../../../services/labtestAPI';
import * as labTestActions from '../actions';
import * as ACTION_TYPES from '../actionTypes';
import { fetchLabTest } from '../sagas';
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

  expect(labTestSpy).toHaveBeenCalledWith(LAB_TEST_MOCK_DATA.LABTEST_FETCH_PAYLOAD);
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
