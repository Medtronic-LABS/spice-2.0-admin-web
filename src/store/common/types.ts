import * as ACTION_TYPES from './actionTypes';

export interface ICommanState {
  loading: boolean;
  sideMenu: {
    list: ISideMenu[];
    regionId?: string;
  };
  error: string | null | Error;
}

export interface IFetchSideMenuPayload {
  countryId?: string;
  tenantId: string;
  formName: string;
  successCb?: (payload: any) => void;
  failureCb?: (error: any) => void;
}

export interface IFetchSideMenuResponse {
  list: ISideMenu[];
  routeIds: {
    id: string;
    tenantId: string;
  };
}

export interface ISideMenu {
  route?: string;
  displayName: string;
  name: string;
  order: number;
}

export interface ISetSideMenuPayload {
  list: ISideMenu[];
  regionId?: string;
}

/*
  Declare all interface with type for redux actions
*/

export interface IFetchSideMenuRequest {
  type: typeof ACTION_TYPES.FETCH_SIDEMENU_REQUEST;
  payload: IFetchSideMenuPayload;
}

export interface IFetchSideMenuSuccess {
  type: typeof ACTION_TYPES.FETCH_SIDEMENU_SUCCESS;
  payload: IFetchSideMenuResponse;
}

export interface IFetchSideMenuFailure {
  type: typeof ACTION_TYPES.FETCH_SIDEMENU_FAILURE;
  error: Error;
}

export interface ISetSideMenu {
  type: typeof ACTION_TYPES.SET_SIDEMENU;
  payload: ISetSideMenuPayload;
}

export interface IClearSideMenu {
  type: typeof ACTION_TYPES.CLEAR_SIDEMENU;
}

export type CommonActions =
  | IFetchSideMenuRequest
  | IFetchSideMenuSuccess
  | IFetchSideMenuFailure
  | ISetSideMenu
  | IClearSideMenu;
