import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getSideMenu } from '../commomAPI';

describe('Common APIs', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });
  it('getSideMenu sends a POST request to /spice-service/static-data/menu with correct data', async () => {
    const params: any = {
      countryId: 1,
      roleName: 'SUPER_ADMIN'
    };

    mockAxios.onPost('/spice-service/static-data/menu').reply(200, {});

    await getSideMenu(params);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/spice-service/static-data/menu');
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(params);
  });
});
