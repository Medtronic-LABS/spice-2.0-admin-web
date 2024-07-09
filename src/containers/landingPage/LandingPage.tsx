import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { roleSelector, userDataSelector, getUserSuiteAccessSelector } from '../../store/user/selectors';
import { useHistory } from 'react-router';
import { HOME_PAGE_BY_ROLE } from '../../constants/route';
import { ReactComponent as AdminPortalLogo } from '../../assets/images/admin.svg';
import { ReactComponent as ReportingPortalLogo } from '../../assets/images/reports.svg';

import APPCONSTANTS from '../../constants/appConstants';
import styles from './LandingPage.module.scss'
import { Link } from 'react-router-dom';

const { ADMIN, CFR } = APPCONSTANTS.SUITE_ACCESS;

export interface ISpiceSuite {
  id: number,
  name: string,
  icon: any,
  hasDomain: boolean,
  domainUrl?: string,
  suiteAccessName: string;
}

const spiceSuites: ISpiceSuite[] = [
  {
    id: 1,
    name: 'Admin',
    icon: AdminPortalLogo,
    hasDomain: false,
    suiteAccessName: ADMIN
  },
  {
    id: 2,
    name: 'Reports',
    icon: ReportingPortalLogo,
    hasDomain: true,
    suiteAccessName: CFR,
    domainUrl: process.env.REACT_APP_CFR_URL
  }
];

const LandingPage = (): React.ReactElement => {

  const history = useHistory();
  const role = useSelector(roleSelector);
  const userSuiteAccess = useSelector(getUserSuiteAccessSelector);
  const userData = useSelector(userDataSelector);
  const { country: { id: regionId, tenantId } } = userData;

  const spiceHomeUrl = useMemo(() =>
    HOME_PAGE_BY_ROLE[role].replace(':regionId', regionId?.toString())
      .replace(':tenantId', tenantId?.toString()),
    [role, regionId, tenantId]
  )

  const [suites, setSuites] = useState<ISpiceSuite[]>([]);

  useEffect(
    () => {
      const authorisedSuites: ISpiceSuite[] = spiceSuites.filter((suite: ISpiceSuite) =>
        userSuiteAccess.includes(suite.suiteAccessName)
      );
      if (authorisedSuites.length === 1) {
        history.push(spiceHomeUrl);
      }
      setSuites(authorisedSuites);
    },
    [history, spiceHomeUrl, userSuiteAccess]
  );

  const renderCardContent = (data: ISpiceSuite) => {
    const { name, icon: IconComponent } = data;
    return <>
      <div className='row p-2'>
        <IconComponent className='card-icon' aria-labelledby={`${name} logo`}  />
      </div>
      <div className={`row ${styles.report_card_text} py-1`}>
        <p>{name}</p>
      </div>
    </>
  }

  return (
    <div className={`position-relative ${styles.landingPageContainer}`}>
      <div className='row'>
        {suites.map((data) => (
          <div className={`card ${styles.customCard}`} key={`suite-${data.id}`}>
            {!data.hasDomain
              ?
              <Link to={spiceHomeUrl} children={renderCardContent(data)} />
              :
              <a href={data.domainUrl} target='_blank' rel="noreferrer" children={renderCardContent(data)} />
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
