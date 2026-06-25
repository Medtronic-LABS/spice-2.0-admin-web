import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import APPCONSTANTS, { BACKEND_SERVICES } from '../../../constants/appConstants';
import Info, { getCommitUrl } from '../Info';

jest.mock('../../../assets/images/app-logo-name.png', () => 'logo.png');

jest.mock('../../../config/env', () => ({
  appEnv: {
    apiBaseUrl: '/',
  },
}));

const buildActuatorResponse = (name: string, commit = `${name}-commit`) => ({
  ok: true,
  json: async () => ({
    git: { commit },
  }),
});

describe('Info', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;

    mockFetch.mockImplementation((url: string) => {
      if (url === '/build-info.json') {
        return Promise.resolve(buildActuatorResponse(APPCONSTANTS.APP_NAME, 'spice-web-commit'));
      }

      if (url === '/user-service/actuator/info') {
        return Promise.resolve(buildActuatorResponse('user-service'));
      }

      if (url === '/auth-service/actuator/info') {
        return Promise.reject(new Error('Service unavailable'));
      }

      return Promise.resolve({ ok: false });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading state before build information is fetched', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(<Info />);

    expect(screen.getByText('Loading build information...')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders page header content', async () => {
    render(<Info />);

    expect(screen.getByAltText('Spice Web')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Build Information' })).toBeInTheDocument();
    expect(screen.getByText('Deployment versions for Spice Web and Backend Services.')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('renders table headers after data is loaded', async () => {
    render(<Info />);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    expect(screen.getByRole('columnheader', { name: 'Service Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Commit' })).toBeInTheDocument();
  });

  it('fetches spice-web and backend actuator endpoints', async () => {
    render(<Info />);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('/build-info.json');

    BACKEND_SERVICES.forEach((serviceName) => {
      expect(mockFetch).toHaveBeenCalledWith(`/${serviceName}/actuator/info`);
    });
  });

  it('displays spice-web build information from build-info.json', async () => {
    render(<Info />);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const spiceWebRow = screen.getByRole('row', { name: /spice-web/i });

    expect(within(spiceWebRow).getByText('spice-web')).toBeInTheDocument();
    expect(within(spiceWebRow).getByRole('link', { name: 'spice-web-commit' })).toHaveAttribute(
      'href',
      'https://bitbucket.org/MDTLabs/spice_web/commits/spice-web-commit'
    );
  });

  it('displays successful backend service build information', async () => {
    render(<Info />);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const userServiceRow = screen.getByRole('row', { name: /user-service/i });

    expect(within(userServiceRow).getByText('user-service')).toBeInTheDocument();
    expect(within(userServiceRow).getByRole('link', { name: 'user-service-commit' })).toHaveAttribute(
      'href',
      'https://bitbucket.org/MDTLabs/user-service/commits/user-service-commit'
    );
  });

  it('displays N/A when a backend service request fails', async () => {
    render(<Info />);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const authServiceRow = screen.getByRole('row', { name: /auth-service/i });
    const cells = within(authServiceRow).getAllByRole('cell');

    expect(cells[0]).toHaveTextContent('auth-service');
    expect(cells[1]).toHaveTextContent(APPCONSTANTS.NOT_AVAILABLE);
    expect(within(authServiceRow).queryByRole('link')).not.toBeInTheDocument();
  });

  it('displays N/A when a backend service responds with a non-ok status', async () => {
    render(<Info />);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const adminServiceRow = screen.getByRole('row', { name: /admin-service/i });
    const cells = within(adminServiceRow).getAllByRole('cell');

    expect(cells[0]).toHaveTextContent('admin-service');
    expect(cells[1]).toHaveTextContent(APPCONSTANTS.NOT_AVAILABLE);
    expect(within(adminServiceRow).queryByRole('link')).not.toBeInTheDocument();
  });

  it('links commits to GitLab on staging and production hosts', () => {
    expect(getCommitUrl('spice-web', 'abc123', 'uhis.brac.net')).toBe(
      'https://gitlab.brac.net/non-erp/spice_web/-/commit/abc123'
    );
    expect(getCommitUrl('spice-web', 'abc123', 'uhis-staging.brac.net')).toBe(
      'https://gitlab.brac.net/non-erp/spice_web/-/commit/abc123'
    );
  });

  it('links commits to Bitbucket on other hosts', () => {
    expect(getCommitUrl('spice-web', 'abc123', 'localhost')).toBe(
      'https://bitbucket.org/MDTLabs/spice_web/commits/abc123'
    );
  });

  it('maps auth-service commits to the user-service repository', () => {
    expect(getCommitUrl('auth-service', 'auth-commit-id', 'localhost')).toBe(
      'https://bitbucket.org/MDTLabs/user-service/commits/auth-commit-id'
    );
  });

  it('returns null when commit is unavailable', () => {
    expect(getCommitUrl('spice-web', APPCONSTANTS.NOT_AVAILABLE, 'localhost')).toBeNull();
  });

  it('renders one row for spice-web and each backend service', async () => {
    render(<Info />);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const rows = screen.getAllByRole('row');

    expect(rows).toHaveLength(1 + BACKEND_SERVICES.length + 1);
  });
});
