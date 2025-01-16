import * as COMMON_TYPES from './actionTypes';

import { CommonActions, ICommanState } from './types';

export const initialState: ICommanState = {
  loading: false,
  sideMenu: {
    list: []
  },
  labelName: null,
  labelNameLoading: false,
  error: null
};

const regionReducer = (state = initialState, action = {} as CommonActions): ICommanState => {
  switch (action.type) {
    case COMMON_TYPES.FETCH_SIDEMENU_REQUEST:
      return {
        ...state,
        loading: true,
        sideMenu: {
          ...state.sideMenu
        }
      };
    case COMMON_TYPES.FETCH_SIDEMENU_SUCCESS:
      return {
        ...state,
        loading: false,
        sideMenu: {
          list: action.payload.list
        }
      };
    case COMMON_TYPES.FETCH_SIDEMENU_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case COMMON_TYPES.CLEAR_SIDEMENU:
      return {
        ...state,
        sideMenu: initialState.sideMenu
      };
    case COMMON_TYPES.SET_LABELNAME:
      return {
        ...state,
        labelName: action.values
      };
    case COMMON_TYPES.CLEAR_LABELNAME:
      return {
        ...state,
        labelNameLoading: false,
        labelName: null
      };
    default:
      return {
        ...state
      };
  }
};

export default regionReducer;
