import * as COMMON_TYPES from './actionTypes';
import {
  IFetchSideMenuPayload,
  IFetchSideMenuRequest,
  IFetchSideMenuSuccess,
  IFetchSideMenuFailure,
  IFetchSideMenuResponse,
  IClearSideMenu
} from './types';

export const fetchSideMenuRequest = (payload: IFetchSideMenuPayload): IFetchSideMenuRequest => ({
  type: COMMON_TYPES.FETCH_SIDEMENU_REQUEST,
  payload
});

export const fetchSideMenuSuccess = (payload: IFetchSideMenuResponse): IFetchSideMenuSuccess => ({
  type: COMMON_TYPES.FETCH_SIDEMENU_SUCCESS,
  payload
});

export const fetchSideMenuFailure = (error: Error): IFetchSideMenuFailure => ({
  type: COMMON_TYPES.FETCH_SIDEMENU_FAILURE,
  error
});

export const clearSideMenu = (): IClearSideMenu => ({
  type: COMMON_TYPES.CLEAR_SIDEMENU
});
