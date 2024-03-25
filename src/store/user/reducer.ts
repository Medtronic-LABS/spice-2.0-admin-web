import APPCONSTANTS from '../../constants/appConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import * as USERTYPES from './actionTypes';

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
  suiteAccess: []
});

// This should be function instead of object,
// so that the isLoggedIn will be recomputed when RESET_STATE action is dispatched
const initialStateGetter: () => IUserState = () => ({
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
  timezoneList: [],
  errorMessage: '',
  showLoader: false,
  countryList: [],
  lockedUsers: [],
  totalLockedUsers: 0,
  userTenantId: '',
  cultureList: []
});

const userReducer = (state = initialStateGetter(), action = {} as UserActions): IUserState => {
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
    case USERTYPES.RESET_STORE:
    default:
      return {
        ...state
      };
  }
};

export default userReducer;
