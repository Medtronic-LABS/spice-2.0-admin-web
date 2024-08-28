import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { roleSelector, userDataSelector, getUserSuiteAccessSelector } from '../../store/user/selectors';
import { useHistory } from 'react-router';
import { HOME_PAGE_BY_ROLE } from '../../constants/route';
import { ReactComponent as AdminPortalLogo } from '../../assets/images/admin.svg';
import { ReactComponent as ReportingPortalLogo } from '../../assets/images/reports.svg';

import APPCONSTANTS from '../../constants/appConstants';
import styles from './LandingPage.module.scss';
import styles from './LandingPage.module.scss';
import { Link } from 'react-router-dom';

const { ADMIN, CFR } = APPCONSTANTS.SUITE_ACCESS;

export interface ISpiceSuite {
  id: number;
  name: string;
  icon: any;
  hasDomain: boolean;
  domainUrl?: string;
  suiteAccessName: string;
}

const LandingPage = (): React.ReactElement => {
  const history = useHistory();
  const role = useSelector(roleSelector);
  const userSuiteAccess = useSelector(getUserSuiteAccessSelector);
  const userData = useSelector(userDataSelector);
  const {
    country: { id: regionId, tenantId }
  } = userData;

  const [suites, setSuites] = useState<ISpiceSuite[]>([]);

  const spiceSuites: ISpiceSuite[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Admin',
        icon: AdminPortalLogo,
        hasDomain: false,
        suiteAccessName: ADMIN,
        domainUrl:
          HOME_PAGE_BY_ROLE[role]
            ?.replace(':regionId', regionId?.toString())
            .replace(':tenantId', tenantId?.toString()) || '',
        disabled: false
      },
      {
        id: 2,
        name: 'Reports',
        icon: ReportingPortalLogo,
        hasDomain: true,
        suiteAccessName: CFR,
        domainUrl: process.env.REACT_APP_CFR_WEB_URL,
        disabled: false
      },
      {
        id: 3,
        name: 'Insights',
        icon: InsightsLogo,
        hasDomain: true,
        suiteAccessName: INSIGHTS,
        domainUrl: undefined
      }
    ],
    [regionId, tenantId, role]
  );

  useEffect(() => {
    const authorisedSuites: ISpiceSuite[] = spiceSuites.filter(
      (suite: ISpiceSuite) => userSuiteAccess.includes(suite.suiteAccessName) || suite.name === 'Insights'
    );
    if (authorisedSuites.length === 1) {
      const { hasDomain, domainUrl } = authorisedSuites[0];
      hasDomain ? goToUrl(domainUrl) : history.push(domainUrl);
    }
    setSuites(authorisedSuites);
  }, [history, userSuiteAccess, spiceSuites]);

  const renderCardContent = (data: ISpiceSuite) => {
    const { name, icon: IconComponent } = data;
    return (
      <>
        <div className='row p-2'>
          <IconComponent className={styles.cardIcon} aria-labelledby={`${name} logo`} />
        </div>
        <div className={`row ${styles.reportCardText} pb-1`}>
          <p>{name}</p>
        </div>
      </>
    );
  };

  return (
    <div className={`position-relative ${styles.landingPageContainer}`}>
      <div className='row justify-content-center'>
        {suites.map((data) => (
          <div className={`card ${styles.customCard}`} key={`suite-${data.id}`}>
            {!data.hasDomain ? (
              <Link to={data.domainUrl} children={renderCardContent(data)} />
            ) : (
              <a href={data.domainUrl} target='_blank' rel='noreferrer' children={renderCardContent(data)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
