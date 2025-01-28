import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { setupInterceptors } from '../interceptors';
import { resetStore, sessionTimedout } from '../../store/user/actions';
import ApiError from '../ApiError';
import APPCONSTANTS from '../../constants/appConstants';
import sessionStorageServices from '../sessionStorageServices';
import ERRORS from '../../constants/errors';

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

    expect(modifiedResponse).toEqual(response);
  });

  it('should handle 500 server error', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 500,
      data: {},
      config: {},
      headers: {},
      statusText: 'Internal Server Error'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle 401 unauthorized for auth service', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 401,
      data: { message: 'Invalid credentials' },
      config: { url: '/auth-service/session' },
      headers: {},
      statusText: 'Unauthorized'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle 401 unauthorized for other services', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 401,
      data: { message: null },
      config: { url: '/some-other-service' },
      headers: {},
      statusText: 'Unauthorized'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
    expect(store.dispatch).toHaveBeenCalledWith(sessionTimedout(APPCONSTANTS.SESSION_EXPIRED));
    expect(store.dispatch).toHaveBeenCalledWith(resetStore());
  });

  it('should handle other error status codes 409', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 409,
      data: { message: 'Conflict error' },
      config: {},
      headers: {},
      statusText: 'Conflict'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle other error status codes 403', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 403,
      data: { message: 'Forbidden' },
      config: {},
      headers: {},
      statusText: 'Forbidden'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle other error status codes 404', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 404,
      data: { message: 'Not Found' },
      config: {},
      headers: {},
      statusText: 'Not Found'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle other error status codes 406', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 406,
      data: { message: 'Not Acceptable' },
      config: {},
      headers: {},
      statusText: 'Not Acceptable'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle other error status codes 400', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 400,
      data: { message: 'Bad Request' },
      config: {},
      headers: {},
      statusText: 'Bad Request'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle other error status codes 432', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 432,
      data: { message: 'Session expired' },
      config: {},
      headers: {},
      statusText: 'Session expired'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle other error status codes 408', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 408,
      data: { message: 'Request timeout' },
      config: {},
      headers: {},
      statusText: 'Request timeout'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle other error status codes 412', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 412,
      data: { message: 'Precondition failed' },
      config: {},
      headers: {},
      statusText: 'Precondition failed'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should handle default error', async () => {
    setupInterceptors(store);

    const onResponseFulfilled = (axiosInstance.interceptors.response.use as any).mock.calls[0][0];
    const response: AxiosResponse = {
      status: 413,
      data: { message: 'Precondition failed' },
      config: {},
      headers: {},
      statusText: 'Precondition failed'
    };

    expect(() => onResponseFulfilled(response)).toThrow(ApiError);
  });

  it('should reject request interceptor errors', async () => {
    setupInterceptors(store);

    const onRequestRejected = (axiosInstance.interceptors.request.use as any).mock.calls[0][1];
    const error = new Error('Request failed');

    await expect(onRequestRejected(error)).rejects.toEqual(error);
  });

  it('should set validateStatus to always return true', () => {
    setupInterceptors(store);

    expect(axios.defaults.validateStatus!(200)).toBe(true);
    expect(axios.defaults.validateStatus!(400)).toBe(true);
    expect(axios.defaults.validateStatus!(500)).toBe(true);
  });

  describe('request interceptor tenantId header', () => {
    it('should use store tenantId when available', async () => {
      const localStore = {
        getState: jest.fn().mockReturnValue({
          user: { userTenantId: '123' }
        }),
        dispatch: jest.fn()
      };

      setupInterceptors(localStore);
      const onRequestFulfilled = (axiosInstance.interceptors.request.use as any).mock.calls[0][0];
      const config: AxiosRequestConfig = { headers: {} };

      onRequestFulfilled(config);
      expect(config.headers.tenantId).toBe('123');
    });

    it('should use sessionStorage tenantId when store value is null', async () => {
      const localStore = {
        getState: jest.fn().mockReturnValue({
          user: { userTenantId: null }
        }),
        dispatch: jest.fn()
      };

      jest.spyOn(sessionStorageServices, 'getItem').mockReturnValue('456');

      setupInterceptors(localStore);
      const onRequestFulfilled = (axiosInstance.interceptors.request.use as any).mock.calls[0][0];
      const config: AxiosRequestConfig = { headers: {} };

      onRequestFulfilled(config);
      expect(config.headers.tenantId).toBe('456');
    });

    it('should use default "0" when both store and sessionStorage are empty', async () => {
      const localStore = {
        getState: jest.fn().mockReturnValue({
          user: { userTenantId: null }
        }),
        dispatch: jest.fn()
      };

      jest.spyOn(sessionStorageServices, 'getItem').mockReturnValue(null);

      setupInterceptors(localStore);
      const onRequestFulfilled = (axiosInstance.interceptors.request.use as any).mock.calls[0][0];
      const config: AxiosRequestConfig = { headers: {} };

      onRequestFulfilled(config);
      expect(config.headers.tenantId).toBe('0');
    });
  });

  describe('response interceptor error handling', () => {
    it('should return error when error has message not equal to NETWORK_ERROR', async () => {
      setupInterceptors(store);

      const onResponseRejected = (axiosInstance.interceptors.response.use as any).mock.calls[0][1];
      const error = {
        message: 'Some other error'
      };

      const result = onResponseRejected(error);
      expect(result).toEqual(error);
    });

    it('should throw ApiError when error message is NETWORK_ERROR', async () => {
      setupInterceptors(store);

      const onResponseRejected = (axiosInstance.interceptors.response.use as any).mock.calls[0][1];
      const error = {
        message: ERRORS.NETWORK_ERROR.name
      };

      expect(() => onResponseRejected(error)).toThrow(ApiError);
    });

    it('should throw ApiError when error is undefined', async () => {
      setupInterceptors(store);

      const onResponseRejected = (axiosInstance.interceptors.response.use as any).mock.calls[0][1];

      expect(() => onResponseRejected(undefined)).toThrow(ApiError);
    });
  });
});
