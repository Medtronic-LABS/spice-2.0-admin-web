import axios, { AxiosResponse } from 'axios';

import ApiError from './ApiError';
import ERRORS from '../constants/errors';
import APPCONSTANTS from '../constants/appConstants';
import sessionStorageServices from './sessionStorageServices';
import { fetchLoggedInUser, resetStore, sessionTimedout } from '../store/user/actions';
import { PUBLIC_ROUTES } from '../constants/route';

/**
 * Handles the response status and throws appropriate errors.
 * @param {AxiosResponse} response - The axios response object
 * @param {any} store - The Redux store
 * @return {AxiosResponse} The original response if status is OK
 * @throws {ApiError} Throws an ApiError with appropriate message and status code
 */
const responseStatusReturn = (response: AxiosResponse, store: any) => {
  const { status } = response;
  if (status > 205 && status !== 201) {
    switch (status) {
      case 500:
      case 502:
        throw new ApiError(ERRORS.SERVER_ERROR, 500);
      case 403:
        throw new ApiError({ ...response.data, name: '403', message: response.data.message }, 403);
      case 404:
        throw new ApiError(
          { ...response.data, name: '404', message: response.data.message, msg: ERRORS.SERVER_ERROR },
          404
        );
      case 401:
        if (response.config.url === '/auth-service/session') {
          throw new ApiError(
            { ...response.data, name: APPCONSTANTS.LOGIN_FAILED_TITLE, message: response.data.message },
            401
          );
        } else {
          store.dispatch(sessionTimedout(response.data.message || APPCONSTANTS.SESSION_EXPIRED));
          store.dispatch(resetStore());
          throw new ApiError(
            { ...response.data, name: APPCONSTANTS.ERROR, message: APPCONSTANTS.SESSION_EXPIRED },
            401
          );
        }
      case 409:
        throw new ApiError({ ...response.data, name: APPCONSTANTS.OOPS }, 409);
      case 406:
        throw new ApiError({ ...response.data, name: APPCONSTANTS.OOPS }, 406);
      case 400:
        throw new ApiError({ ...response.data, name: APPCONSTANTS.OOPS }, 400);
      case 432:
        throw new ApiError({ ...response.data, name: APPCONSTANTS.OOPS }, 432);
      case 408:
        throw new ApiError({ ...response.data, name: APPCONSTANTS.OOPS }, 408);
      case 412:
        throw new ApiError({ ...response.data, name: APPCONSTANTS.OOPS }, 412);
      default:
        throw new ApiError(response);
    }
  } else {
    return response;
  }
};

/**
 * Sets up axios interceptors for request and response handling.
 * @param {any} store - The Redux store
 */
export const setupInterceptors = (store: any) => {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.client = APPCONSTANTS.APP_TYPE;
  axios.defaults.validateStatus = () => true;
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(
    (request: any) => {
      const tenantId = store.getState().user.userTenantId;
      request.headers.tenantId = tenantId || sessionStorageServices.getItem(APPCONSTANTS.USER_TENANTID) || '0';
      return request;
    },
    (error: any) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => responseStatusReturn(response, store),
    (error) => {
      if (error && error?.message && error?.message !== ERRORS.NETWORK_ERROR.name) {
        return error;
      } else {
        throw new ApiError(ERRORS.NETWORK_ERROR);
      }
    }
  );

  // get logged in user while refresh expect privacy policy page
  if (document.location.pathname !== PUBLIC_ROUTES.privacyPolicy) {
    store.dispatch(fetchLoggedInUser());
  }
};
