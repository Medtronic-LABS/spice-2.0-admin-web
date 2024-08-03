import APPCONSTANTS from '../../constants/appConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import MOCK_DATA_CONSTANTS from '../../tests/mockData/userDataConstants';
import * as USERTYPES from './actionTypes';
import { communityListSelector } from './selectors';

import { UserActions, IUserState, IUser } from './types';

const userInitialStateGetter = (): IUser => ({
  email: '',
  firstName: '',
  lastName: '',
  userId: '',
  role: APPCONSTANTS.ROLES.SUPER_ADMIN,
  roleDetail: {},
  tenantId: '',
  formDataId: '',
  country: {},
  suiteAccess: [],
  countryId: undefined
});

// This should be function instead of object,
// so that the isLoggedIn will be recomputed when RESET_STATE action is dispatched
const initialStateGetter = () =>
  ({
    defaultRole: [],
    token: '',
    isLoggedIn: Boolean(sessionStorageServices.getItem(APPCONSTANTS.AUTHTOKEN)),
    loggingIn: false,
    loggingOut: false,
    user: userInitialStateGetter(),
    userRoles: {},
    isRolesLoading: false,
    error: null,
    loading: false,
    cultureListLoading: false,
    initializing: false,
    isPasswordSet: false,
    email: '',
    errorMessage: '',
    showLoader: false,
    userTenantId: '',
    timezoneList: [],
    cultureList: [],
    communityList: []
  } as unknown as IUserState);

const userReducer = (state: IUserState = initialStateGetter(), action = {} as any) => {
  switch (action.type) {
    case USERTYPES.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true
      };
    case USERTYPES.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        isLoggedIn: true,
        user: action.payload,
        error: null
      };
    case USERTYPES.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        isLoggedIn: false,
        user: userInitialStateGetter(),
        error: action.payload.error
      };
    case USERTYPES.LOGOUT_REQUEST:
      return {
        ...state,
        loggingOut: true
      };
    case USERTYPES.LOGOUT_SUCCESS:
    case USERTYPES.LOGOUT_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        loggingOut: false
      };
    case USERTYPES.FETCH_LOGGED_IN_USER_REQUEST:
      return {
        ...state,
        initializing: true
      };
    case USERTYPES.FETCH_LOGGED_IN_USER_SUCCESS:
      return {
        ...state,
        initializing: false,
        user: action.payload
      };
    case USERTYPES.FETCH_LOGGED_IN_USER_FAILURE:
      return {
        ...state,
        initializing: false
      };
    case USERTYPES.FETCH_USER_ROLES_REQUEST:
      return {
        ...state,
        isRolesLoading: true
      };
    case USERTYPES.FETCH_USER_ROLES_SUCCESS:
      return {
        ...state,
        isRolesLoading: false,
        userRoles: action.payload
      };
    case USERTYPES.FETCH_USER_ROLES_FAILURE:
      return {
        ...state,
        isRolesLoading: false
      };
    case USERTYPES.SESSION_TIMEDOUT:
      sessionStorageServices.clearAllItem();
      return {
        ...state,
        isLoggedIn: false,
        errorMessage: action.message
      };
    case USERTYPES.AUTH_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case USERTYPES.ADD_USER_TENANT_ID:
      return {
        ...state,
        userTenantId: action.payload
      };
    case USERTYPES.REMOVE_TOKEN:
      return {
        ...state,
        token: ''
      };
    case USERTYPES.CHANGE_PASSWORD_REQUEST:
    case USERTYPES.CHANGE_OWN_PASSWORD_REQUEST:
    case USERTYPES.FETCH_USER_BY_ID_REQUEST:
    case USERTYPES.USER_FORGOT_PASSWORD_REQUEST:
    case USERTYPES.RESET_PASSWORD_REQUEST:
    case USERTYPES.GET_USERNAME_FOR_PASSWORD_RESET:
      return {
        ...state,
        loading: true
      };
    case USERTYPES.CHANGE_PASSWORD_FAILURE:
    case USERTYPES.CHANGE_PASSWORD_SUCCESS:
    case USERTYPES.CHANGE_OWN_PASSWORD_FAILURE:
    case USERTYPES.CHANGE_OWN_PASSWORD_SUCCESS:
    case USERTYPES.FETCH_USER_BY_ID_FAILURE:
    case USERTYPES.USER_FORGOT_PASSWORD_SUCCESS:
    case USERTYPES.USER_FORGOT_PASSWORD_FAILURE:
    case USERTYPES.RESET_PASSWORD_FAILURE:
    case USERTYPES.RESET_PASSWORD_SUCCESS:
    case USERTYPES.GET_USERNAME_FOR_PASSWORD_RESET_FAIL:
      return {
        ...state,
        loading: false
      };
    case USERTYPES.GET_USERNAME_FOR_PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case USERTYPES.FETCH_USER_BY_ID_SUCCESS: {
      if (state.user.userId === action.data.userId) {
        return {
          ...state,
          user: { ...state.user, ...action.data },
          loading: false
        };
      }
      return {
        ...state,
        loading: false
      };
    }
    case USERTYPES.FETCH_TIMEZONE_LIST_SUCCESS:
      return {
        ...state,
        timezoneList: action.payload
      };
    case USERTYPES.FETCH_COUNTRY_LIST_SUCCESS:
      return {
        ...state,
        countryList: action.payload
      };
    case USERTYPES.FETCH_CULTURE_LIST_SUCCESS:
      return {
        ...state,
        cultureListLoading: false,
        cultureList: action.payload
      };
    case USERTYPES.FETCH_COMMUNITY_LIST_REQUEST:
      return {
        ...state,
        communityListLoading: true,
        communityList: action.payload
      };
    case USERTYPES.FETCH_COMMUNITY_LIST_SUCCESS:
      return {
        ...state,
        communityListLoading: true,
        communityList: action.payload.entityList
      };
    case USERTYPES.UPDATE_PASSWORD_REQUEST:
    case USERTYPES.CREATE_PASSWORD_REQUEST:
    case USERTYPES.FETCH_LOCKED_USERS_REQUEST:
    case USERTYPES.UNLOCK_USERS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case USERTYPES.FETCH_LOCKED_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        lockedUsers: action.payload.lockedUsers,
        totalLockedUsers: action.payload.totalCount
      };
    case USERTYPES.UNLOCK_USERS_SUCCESS:
    case USERTYPES.UNLOCK_USERS_FAILURE:
    case USERTYPES.CHANGE_PASSWORD_FAIL:
    case USERTYPES.UPDATE_PASSWORD_FAIL:
    case USERTYPES.UPDATE_PASSWORD_SUCCESS:
    case USERTYPES.CREATE_PASSWORD_SUCCESS:
    case USERTYPES.CREATE_PASSWORD_FAIL:
    case USERTYPES.FETCH_LOCKED_USERS_FAILURE:
    case USERTYPES.FETCH_USER_BY_EMAIL:
      return {
        ...state,
        showLoader: true,
        loading: false
      };
    case USERTYPES.FETCH_USER_BY_EMAIL_SUCCESS:
    case USERTYPES.FETCH_USER_BY_EMAIL_FAIL:
      return {
        ...state,
        showLoader: false
      };
    case USERTYPES.REMOVE_USER_TENANT_ID:
      return {
        ...state,
        userTenantId: ''
      };
    case USERTYPES.FETCH_CULTURE_LIST_REQUEST:
      return {
        ...state,
        cultureListLoading: true
      };
    case USERTYPES.RESET_STORE:
    case USERTYPES.FETCH_TIMEZONE_LIST_REQUEST:
    case USERTYPES.FETCH_TIMEZONE_LIST_FAILURE:
    case USERTYPES.FETCH_COUNTRY_LIST_REQUEST:
    case USERTYPES.FETCH_COUNTRY_LIST_FAILURE:
    case USERTYPES.FETCH_CULTURE_LIST_FAILURE:
    default:
      return {
        ...state
      };
  }
};

export default userReducer;
