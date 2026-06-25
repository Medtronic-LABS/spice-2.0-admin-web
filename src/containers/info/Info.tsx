import { useEffect, useState } from 'react';

import Logo from '../../assets/images/app-logo-name.png';
import { appEnv } from '../../config/env';

import styles from './Info.module.scss';
import APPCONSTANTS, { BACKEND_SERVICES } from '../../constants/appConstants';

interface IActuatorInfoResponse {
  git?: {
    commit?: string;
  };
}

export interface IServiceBuildRow {
  serviceName: string;
  commit: string;
}

const SERVICE_REPO_MAP: Record<string, string> = {
  'admin-service': 'spice-service',
  'auth-service': 'user-service',
  'cql-service': 'spice-service',
  'fhir-mapper': 'fhir-mapper',
  'fhir-server': 'fhir-server',
  'notification-service': 'notification-service',
  'offline-service': 'offline-service',
  'spice-service': 'spice-service',
  'spice-web': 'spice_web',
  'user-service': 'user-service'
};

const GITLAB_HOSTS = new Set(['uhis-staging.brac.net', 'uhis.brac.net']);

export const getCommitUrl = (
  serviceName: string,
  commitId: string,
  host: string = globalThis.location.host
): string | null => {
  if (commitId === APPCONSTANTS.NOT_AVAILABLE) {
    return null;
  }

  const repoName = SERVICE_REPO_MAP[serviceName];

  if (!repoName) {
    return null;
  }

  if (GITLAB_HOSTS.has(host)) {
    return `https://gitlab.brac.net/non-erp/${repoName}/-/commit/${commitId}`;
  }

  return `https://bitbucket.org/MDTLabs/${repoName}/commits/${commitId}`;
};

const getBackendBaseUrl = (): string => (appEnv.apiBaseUrl || '').replace(/\/$/, '');

const getServiceInfoUrl = (serviceName: string): string => {
  if (serviceName === APPCONSTANTS.APP_NAME) {
    return '/build-info.json';
  }
  const backendBaseUrl = getBackendBaseUrl();
  return backendBaseUrl ? `${backendBaseUrl}/${serviceName}/actuator/info` : `/${serviceName}/actuator/info`;
};

const toServiceRow = (serviceName: string, info?: IActuatorInfoResponse | null): IServiceBuildRow => ({
  serviceName,
  commit: info?.git?.commit ?? APPCONSTANTS.NOT_AVAILABLE
});

const fetchServiceInfo = async (serviceName: string): Promise<IServiceBuildRow> => {
  try {
    const response = await fetch(getServiceInfoUrl(serviceName));

    const info = response.ok ? ((await response.json()) as IActuatorInfoResponse) : undefined;

    return toServiceRow(serviceName, info);
  } catch {
    return toServiceRow(serviceName);
  }
};

const Info = () => {
  const [rows, setRows] = useState<IServiceBuildRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBuildInfo = async () => {
      setIsLoading(true);

      const [spiceWebInfo, ...backendResults] = await Promise.all([
        fetchServiceInfo(APPCONSTANTS.APP_NAME),
        ...BACKEND_SERVICES.map((serviceName) => fetchServiceInfo(serviceName))
      ]);

      if (isMounted) {
        setRows([spiceWebInfo, ...backendResults]);
        setIsLoading(false);
      }
    };

    loadBuildInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.infoContainer}>
      <div className='container'>
        <img src={Logo} alt='Spice Web' className={styles.logo} />
        <h1 className={styles.title}>Build Information</h1>
        <p className={styles.subtitle}>Deployment versions for Spice Web and Backend Services.</p>

        {isLoading ? (
          <p className={styles.loading}>Loading build information...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={`table table-bordered table-striped ${styles.buildTable}`}>
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Commit</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const commitUrl = getCommitUrl(row.serviceName, row.commit);

                  return (
                    <tr key={row.serviceName}>
                      <td>{row.serviceName}</td>
                      <td className={styles.commitCell}>
                        {commitUrl ? (
                          <a href={commitUrl} className={styles.commitLink} target='_blank' rel='noopener noreferrer'>
                            {row.commit}
                          </a>
                        ) : (
                          row.commit
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
