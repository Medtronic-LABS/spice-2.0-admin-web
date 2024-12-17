import axios from 'axios';
import { IFetchUserByIdRequest, IUpdateUserDetail } from '../store/user/types';
import APPCONSTANTS from '../constants/appConstants';

export const login = (username: string, password: string) => {
  const data = new FormData();
  data.append('username', username);
  data.append('password', password);
  return axios({
    method: 'POST',
    url: '/auth-service/session',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const logout = () =>
  axios({
    method: 'POST',
    url: '/auth-service/logout'
    // headers: { Authorization: token }
  });

export const fetchLoggedInUser = () =>
  axios({
    method: 'POST',
    url: '/user-service/user/profile'
  });

export const updateUser = (payload: IUpdateUserDetail) =>
  axios({
    method: 'POST',
    url: '/user-service/user/update',
    data: payload
  });

export const fetchUserByEmail = ({
  email,
  tenantId,
  parentOrganizationId,
  ignoreTenantId,
  isSiteUsers,
  appTypes
}: {
  appTypes: string[];
  email: string;
  tenantId?: number | undefined;
  parentOrganizationId?: string;
  ignoreTenantId?: string;
  isSiteUsers?: boolean;
}) =>
  axios({
    method: 'POST',
    url: '/user-service/user/validate-user',
    data: {
      appTypes,
      email,
      parentOrganizationId,
      ignoreTenantId,
      isSiteUsers,
      tenantId
    }
  });

export const validatePhoneNumber = (phoneNumber: string, id: number | null, countryCode: string | undefined) =>
  axios({
    method: 'POST',
    url: '/user-service/user/validate-phonenumber',
    data: {
      phoneNumber,
      countryCode,
      id
    }
  });

export const fetchUserRoles = (countryId: number | null) =>
  axios({
    method: 'POST',
    url: '/user-service/user/roles-list',
    data: { countryId }
  });

export const fetchUserById = ({ id }: IFetchUserByIdRequest['payload']) =>
  axios({
    url: `user-service/user/details/${id}`,
    method: 'POST'
  });

export const changePasswordReq = (data: { userId: number; newPassword: string }) =>
  axios({
    method: 'POST',
    url: `user-service/user/change-user-password`,
    data: {
      ...data
    }
  });

export const updatePassword = (data: { userId: number; oldPassword: string; newPassword: string }) =>
  axios({
    method: 'post',
    url: `user-service/user/change-password`,
    data: {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      userId: data.userId
    }
  });

export const forgotPassword = (username: string) =>
  axios({
    method: 'post',
    url: `/user-service/user/forgot-password/${username}/${APPCONSTANTS.APP_TYPE}`
  });

export const resetPasswordReq = (data: { email: string; password: string }, token: string) =>
  axios({
    method: 'post',
    url: `/user-service/user/reset-password/${token}`,
    data: {
      ...data
    }
  });

export const getUsername = (token: string) =>
  axios({
    method: 'post',
    url: `/user-service/user/verify-token/${token}`
  });

export const fetchTimezoneList = () =>
  axios({
    method: 'GET',
    url: '/spice-service/timezone'
  });

export const fetchLockedUsers = (
  tenantId: number,
  skip: number,
  limit: number | null,
  search?: string,
  role?: string
) =>
  axios({
    method: 'POST',
    url: '/user-service/user/locked-users',
    data: {
      tenantId,
      skip,
      limit,
      roleType: role,
      searchTerm: search || ''
    }
  });

export const unlockUsers = (id: string) =>
  axios({
    method: 'POST',
    url: '/user-service/user/unlock',
    data: { id }
  });

export const fetchCommunityListRequest = (countryId: number) =>
  axios({
    method: 'POST',
    url: '/admin-service/community-units',
    data: { countryId }
  });

export const fetchDesignationListRequest = (countryId: number) =>
  axios({
    method: 'GET',
    url: `/admin-service/designation/list/${countryId}`
  });

export const fetchTermsConditionsAPI = (countryId: number) =>
  axios({
    method: 'POST',
    url: '/admin-service/terms-and-conditions/details',
    data: { countryId }
  });
export const updateTermsConditionsAPI = ({
  userId,
  isTermsAndConditionAccepted
}: {
  userId: number;
  isTermsAndConditionAccepted: boolean;
}) =>
  axios({
    method: 'POST',
    url: '/user-service/user/terms-and-conditions/update',
    data: { userId, isTermsAndConditionAccepted }
  });
