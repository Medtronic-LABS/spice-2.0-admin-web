import * as COMMON_TYPES from './actionTypes';

import { CommonActions, ICommanState } from './types';

export const initialState: ICommanState = {
  loading: false,
  sideMenu: {
    list: [],
    fetchedFor: ''
  },
  error: null
};

const regionReducer = (state = initialState, action = {} as CommonActions): ICommanState => {
  switch (action.type) {
    case COMMON_TYPES.FETCH_SIDEMENU_REQUEST:
      return {
        ...state,
        loading: true
      };
    case COMMON_TYPES.FETCH_SIDEMENU_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case COMMON_TYPES.SET_SIDEMENU:
      return {
        ...state,
        sideMenu: {
          list: action.payload.list,
          fetchedFor: action.payload?.fetchedFor || ''
        },
        loading: false
      };
    case COMMON_TYPES.CLEAR_SIDEMENU:
      return {
        ...state,
        sideMenu: initialState.sideMenu
      };
    default:
      return {
        ...state
      };
  }
};

export default regionReducer;
