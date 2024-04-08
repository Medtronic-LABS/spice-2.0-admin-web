import axios from 'axios';
import { IEditUserDetail, IFetchUserByIdRequest, IUpdateUserDetail } from '../store/user/types';

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

export const logout = (token: string) =>
  axios({
    method: 'POST',
    url: '/auth-service/logout',
    headers: { Authorization: token }
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

export const fetchUserByEmail = (email: string) =>
  axios({
    method: 'POST',
    url: '/user-service/user/validate-user',
    data: {
      email
    }
  });

export const validatePhoneNumber = (phoneNumber: string, id: number | null) =>
  axios({
    method: 'POST',
    url: '/user-service/user/validate-phonenumber',
    data: {
      phoneNumber,
      id
    }
  });

export const fetchUserRoles = () =>
  axios({
    method: 'POST',
    url: '/user-service/user/roles-list'
  });

export const fetchUserById = ({ id }: IFetchUserByIdRequest['payload']) =>
  axios({
    url: `user-service/user/details/${id}`,
    method: 'POST'
  });
