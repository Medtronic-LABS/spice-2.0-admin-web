import * as COMMON_TYPES from './actionTypes';
import {
  IFetchSideMenuPayload,
  IFetchSideMenuRequest,
  IFetchSideMenuSuccess,
  IFetchSideMenuFailure,
  IFetchSideMenuResponse,
  ISetSideMenu,
  ISetSideMenuPayload,
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

export const setSideMenu = (payload: ISetSideMenuPayload): ISetSideMenu => ({
  type: COMMON_TYPES.SET_SIDEMENU,
  payload
});

export const clearSideMenu = (): IClearSideMenu => ({
  type: COMMON_TYPES.CLEAR_SIDEMENU
});
