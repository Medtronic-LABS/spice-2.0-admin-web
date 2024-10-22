import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { login, logout, fetchLoggedInUser, fetchUserRoles } from '../userAPI';

describe('User Service', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('sends a POST request to /auth-service/session with correct data', async () => {
    const username = 'user';
    const password = 'pass';
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    mockAxios.onPost('/auth-service/session').reply(200, {});

    await login(username, password);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/auth-service/session');
    expect(mockAxios.history.post[0].headers['Content-Type']).toBe('multipart/form-data');
    expect(mockAxios.history.post[0].data).toEqual(formData);
  });

  it('sends a GET request to /auth-service/logout with correct token header', async () => {
    const token = 'token';

    mockAxios.onPost('/auth-service/logout').reply(200, {});

    await logout(token);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/auth-service/logout');
    expect(mockAxios.history.post[0].headers.Authorization).toBe(token);
  });

  it('sends a POST request to /user-service/user/profile', async () => {
    mockAxios.onPost('/user-service/user/profile').reply(200, {});

    await fetchLoggedInUser();

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/profile');
  });

  it('sends a POST request to /user-service/user/roles-list', async () => {
    mockAxios.onPost('/user-service/user/roles-list').reply(200, {});

    await fetchUserRoles();

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/roles-list');
  });
});
