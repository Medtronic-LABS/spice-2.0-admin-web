import { goToUrl } from '../routeUtil';

describe('goToUrl', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock the location object with only the replace function
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        replace: jest.fn()
      }
    });
  });

  afterEach(() => {
    // Restore the original location object after each test
    window.location = originalLocation;
  });

  it('should call window.location.replace with the provided URL', () => {
    const url = 'https://example.com';
    goToUrl(url);
    expect(window.location.replace).toHaveBeenCalledWith(url);
  });

  it('should default to "/" if no URL is provided', () => {
    goToUrl();
    expect(window.location.replace).toHaveBeenCalledWith('/');
  });
});
