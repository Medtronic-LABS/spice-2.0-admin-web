import { goToUrl } from '../routeUtil';

describe('goToUrl', () => {
  const replaceSpy = jest.fn();
  const locationRef = { replace: replaceSpy };

  beforeEach(() => {
    replaceSpy.mockClear();
  });

  it('should call window.location.replace with the provided URL', () => {
    const url = 'https://example.com';
    goToUrl(url, locationRef);
    expect(replaceSpy).toHaveBeenCalledWith(url);
  });

  it('should default to "/" if no URL is provided', () => {
    goToUrl(undefined, locationRef);
    expect(replaceSpy).toHaveBeenCalledWith('/');
  });
});
