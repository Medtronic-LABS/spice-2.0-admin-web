import axios from 'axios';

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

export const fetchUserRoles = () =>
  axios({
    method: 'POST',
    url: '/user-service/user/roles-list'
  });
