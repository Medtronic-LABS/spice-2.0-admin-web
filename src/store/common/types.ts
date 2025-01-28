import * as ACTION_TYPES from './actionTypes';

interface IRouteItem {
  name: string;
  order: number;
  displayName: string;
  route: string;
}

interface IDynamicSideMenu {
  [key: string]: IRouteItem[];
}
export interface ILabelName {
  region: {
    s: string;
    p: string;
  };
  district: {
    s: string;
    p: string;
  };
  chiefdom: {
    s: string;
    p: string;
  };
  healthFacility: {
    s: string;
    p: string;
  };
}
export interface ICommanState {
  loading: boolean;
  sideMenu: {
    list: IDynamicSideMenu | [];
  };
  labelName: ILabelName | null;
  labelNameLoading: boolean;
  error: string | null | Error;
}

export interface IFetchSideMenuPayload {
  countryId?: number;
  roleName: string;
  appTypes?: string[];
  successCb?: (payload: any) => void;
  failureCb?: (error: any) => void;
}

export interface IFetchSideMenuResponse {
  list: any;
}

export interface ISideMenu {
  route?: string;
  displayName: string;
  name: string;
  order: number;
}

export interface IFetchLabelNamePayload {
  countryId: number;
  successCb?: (payload: any) => void;
  failureCb?: (error: any) => void;
}

export interface IFetchLabelNameResponse {
  list: any;
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

export interface IClearSideMenu {
  type: typeof ACTION_TYPES.CLEAR_SIDEMENU;
}

export interface ISetLabelName {
  type: typeof ACTION_TYPES.SET_LABELNAME;
  values: ILabelName;
}

export interface IClearLabelName {
  type: typeof ACTION_TYPES.CLEAR_LABELNAME;
}

export type CommonActions =
  | IFetchSideMenuRequest
  | IFetchSideMenuSuccess
  | IFetchSideMenuFailure
  | IClearSideMenu
  | ISetLabelName
  | IClearLabelName;
