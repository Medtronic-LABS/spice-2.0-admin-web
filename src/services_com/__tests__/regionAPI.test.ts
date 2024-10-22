import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { uploadFile, downloadFile, regionDetails } from '../regionAPI';

describe('Region Service', () => {
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('sends a POST request to /admin-service/region/upload-file with correct file data', async () => {
    const file = {} as any;
    const formData = new FormData();
    formData.append('file', file);

    mockAxios.onPost('/admin-service/region/upload-file').reply(200, {});

    await uploadFile(file);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/region/upload-file');
    expect(mockAxios.history.post[0].headers['Content-Type']).toBe('multipart/form-data');
    expect(mockAxios.history.post[0].data).toEqual(formData);
  });

  it('sends a POST request to /admin-service/region/download-file with correct data', async () => {
    mockAxios.onPost('/admin-service/region/download-file').reply(200, {});

    await downloadFile(1);

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].responseType).toBe('blob');
    expect(mockAxios.history.post[0].url).toBe('/admin-service/region/download-file');
  });

  it('sends a POST request to /admin-service/region-details', async () => {
    mockAxios.onPost('/admin-service/region-details').reply(200, {});

    await regionDetails(1, 10, 0, '');

    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe('/admin-service/region-details');
  });
});
