import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  login,
  logout,
  fetchLoggedInUser,
  fetchUserRoles,
  changePasswordReq,
  fetchLockedUsers,
  fetchTimezoneList,
  fetchUserByEmail,
  fetchUserById,
  forgotPassword,
  getUsername,
  resetPasswordReq,
  unlockUsers,
  updatePassword,
  updateUser,
  validatePhoneNumber,
  fetchCommunityListRequest
} from '../userAPI';
import APPCONSTANTS from '../../constants/appConstants';

describe('User APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('login sends a POST request to /auth-service/session with correct data', async () => {
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

  it('logout sends a GET request to /auth-service/logout with correct token header', async () => {
    const token = 'token';

    mockAxios.onPost('/auth-service/logout').reply(200, {});

    await logout();

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/auth-service/logout');
  });

  it('fetchLoggedInUser sends a POST request to /user-service/user/profile', async () => {
    mockAxios.onPost('/user-service/user/profile').reply(200, {});

    await fetchLoggedInUser();

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/profile');
  });

  it('forgotPassword sends a POST request to /user-service/user/forgot-password/{reqObj}/{APPCONSTANTS.APP_TYPE} with correct data', async () => {
    const username = 'test@example.com';

    mockAxios.onPost(`/user-service/user/forgot-password/${username}/${APPCONSTANTS.APP_TYPE}`).reply(200, {});

    await forgotPassword(username);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe(
      `/user-service/user/forgot-password/${username}/${APPCONSTANTS.APP_TYPE}`
    );
  });

  it(`resetPasswordReq sends a POST request
    to /user-service/user/reset-password/{token} with correct data`, async () => {
    const data = { email: 'test@example.com', password: 'newpassword' };
    const token = 'token';

    mockAxios.onPost(`/user-service/user/reset-password/${token}`).reply(200, {});

    await resetPasswordReq(data, token);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe(`/user-service/user/reset-password/${token}`);
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it(`changePasswordReq sends a POST request
    to user-service/user/change-user-password with the correct data`, async () => {
    const data = { userId: 1, newPassword: 'newpass' };
    mockAxios.onPost('user-service/user/change-user-password').reply(200, {});

    await changePasswordReq(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('user-service/user/change-user-password');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it('updatePassword sends a POST request to user-service/user/change-password with the correct data', async () => {
    const data = { userId: 1, oldPassword: 'oldpass', newPassword: 'newpass' };
    mockAxios.onPost('user-service/user/change-password').reply(200, {});

    await updatePassword(data);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('user-service/user/change-password');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(data);
  });

  it(`getUsername sends a POST request
    to /user-service/user/verify-token/{token} with the correct headers`, async () => {
    const token = 'abcd';
    mockAxios.onPost(`/user-service/user/verify-token/${token}`).reply(200, {});

    await getUsername(token);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe(`/user-service/user/verify-token/${token}`);
  });

  it('fetchTimezoneList sends a GET request to the /spice-service/timezone', async () => {
    mockAxios.onGet('/spice-service/timezone').reply(200, {});

    await fetchTimezoneList();

    expect(mockAxios.history.get.length).toBe(1);
    expect(mockAxios.history.get[0].url).toBe('/spice-service/timezone');
  });

  it('fetchUserByEmail sends a POST request to /user-service/user/validate-user with correct data', async () => {
    const email = 'test@test.com';
    const parentOrgId = '456';
    const ignoreTenantId = '789';
    const appTypes: string[] = [];

    mockAxios.onPost('/user-service/user/validate-user').reply(200, {});

    await fetchUserByEmail({ email, appTypes, parentOrganizationId: parentOrgId });

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/validate-user');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      email,
      parentOrganizationId: parentOrgId,
      appTypes
    });
  });

  it('fetchUserById sends a POST request to /user-service/user/details/:id with correct data', async () => {
    const id = '123';

    mockAxios.onPost(`/user-service/user/details/${id}`).reply(200, {});

    await fetchUserById({ id } as any);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe(`user-service/user/details/${id}`);
  });

  it('updateUser sends a POST request to /user-service/user/update with correct data', async () => {
    const payload = { id: '123', firstName: 'John', lastName: 'Doe' } as any;

    mockAxios.onPost('/user-service/user/update').reply(200, {});

    await updateUser(payload);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/update');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(payload);
  });

  it('fetchLockedUsers sends a POST request to /user-service/user/locked-users with correct data', async () => {
    const tenantId = 123;
    const skip = 0;
    const limit = 10;
    const search = 'John';
    const expectedData = { tenantId, skip, limit, searchTerm: search };

    mockAxios.onPost('/user-service/user/locked-users').reply(200, {});

    await fetchLockedUsers(tenantId, skip, limit, search);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/locked-users');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(expectedData);
  });

  it('fetchLockedUsers sends a POST request to /user-service/user/locked-users without search', async () => {
    const tenantId = 123;
    const skip = 0;
    const limit = 10;
    const expectedData = { tenantId, skip, limit, searchTerm: '' };

    mockAxios.onPost('/user-service/user/locked-users').reply(200, {});

    await fetchLockedUsers(tenantId, skip, limit);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/locked-users');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(expectedData);
  });

  it('unlockUsers sends a POST request to /user-service/user/unlock with correct data', async () => {
    const id = '123';
    const expectedData = { id };

    mockAxios.onPost('/user-service/user/unlock').reply(200, {});

    await unlockUsers(id);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/unlock');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(expectedData);
  });

  it(`validatePhoneNumber sends a POST request
    to /user-service/user/validate-phonenumber with correct data`, async () => {
    const phoneNumber = '2345678901';
    const id = 1;
    const countryCode = '2';

    mockAxios.onPost('/user-service/user/validate-phonenumber').reply(200, {});

    await validatePhoneNumber(phoneNumber, id, countryCode);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/validate-phonenumber');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      phoneNumber,
      id,
      countryCode
    });
  });

  it('fetchUserRoles sends a POST request to /user-service/user/roles-list with correct data', async () => {
    const countryId = 2;

    mockAxios.onPost('/user-service/user/roles-list').reply(200, {});

    await fetchUserRoles(countryId);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/user-service/user/roles-list');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ countryId });
  });

  it('fetchCommunityListRequest sends a POST request to /admin-service/community-units with correct data', async () => {
    const countryId = 2;

    mockAxios.onPost('/admin-service/community-units').reply(200, {});

    await fetchCommunityListRequest(countryId);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/community-units');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ countryId });
  });
});
