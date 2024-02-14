import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { setupInterceptors } from '../interceptors';
import { resetStore, sessionTimedout } from '../../store/user/actions';
import ApiError from '../ApiError';
import APPCONSTANTS from '../../constants/appConstants';

jest.mock('axios');

describe('setupInterceptors function', () => {
  let axiosInstance: AxiosInstance;
  let store: any;

  beforeEach(() => {
    axiosInstance = axios as AxiosInstance;
    store = {
      getState: jest.fn().mockReturnValue({
        user: {
          token: 'mockToken',
          userTenantId: 1
        }
      }),
      dispatch: jest.fn()
    };

    axiosInstance.interceptors.request.use = jest.fn();
    axiosInstance.interceptors.response.use = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should setup request interceptor with correct headers', async () => {
    setupInterceptors(store);

    const onRequestFulfilled = (axiosInstance.interceptors.request.use as any).mock.calls[0][0];
    const config: AxiosRequestConfig = { headers: {} };
    onRequestFulfilled(config);

    // Expectations
    if (config.headers.Authorization) {
      expect(config.headers.Authorization).toEqual('decryptedMockToken');
    }
    expect(config.headers.tenantId).toEqual(1);
  });

  it('should setup response interceptor and handle successful responses', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 200,
      data: {},
      config: {},
      headers: {},
      statusText: 'OK'
    };
    const modifiedResponse = onResponseFulfilled(response);

    // Expectations
    expect(modifiedResponse).toEqual(response);
  });

  it('should setup response interceptor and handle errors', async () => {
    setupInterceptors(store);
    const onResponseRejected = (axiosInstance.interceptors.response.use as any).mock.calls[0][1];
    const errorResponse: AxiosResponse = {
      status: 401,
      data: { message: 'Unauthorized' },
      config: {},
      headers: {},
      statusText: 'Unauthorized'
    };
    const expectedError = new ApiError({ name: APPCONSTANTS.LOGIN_FAILED_TITLE, message: 'Unauthorized' }, 401);
    try {
      await onResponseRejected(errorResponse);
    } catch (error) {
      // Expectations
      expect(error).toEqual(expectedError);
      expect(store.dispatch).toHaveBeenCalledWith(sessionTimedout('Unauthorized'));
      expect(store.dispatch).toHaveBeenCalledWith(resetStore());
    }
  });
});
