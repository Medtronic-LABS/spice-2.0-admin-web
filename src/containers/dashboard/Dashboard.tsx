import React from 'react';
import admin from '../../assets/images/admin-dasboard.svg';
import report from '../../assets/images/reports.svg';
import insights from '../../assets/images/insights.svg';
import styles from './Dashboard.module.scss';
import { PROTECTED_ROUTES } from '../../constants/route';
import useRouteParams from '../../hooks/useRouteParams';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { roleSelector, userDataSelector } from '../../store/user/selectors';
import { Link } from 'react-router-dom';

interface ISideMenuItem {
  label: string;
  route: string;
  disabled?: boolean;
  childRoutes?: string[];
}

const LandingDashboard = (): React.ReactElement => {
  const { pathname } = useLocation();
  const role = useSelector(roleSelector);
  const regionData = useSelector(userDataSelector).country;
  const superAdminRoutes: ISideMenuItem[] = [
    {
      label: 'Region',
      route: PROTECTED_ROUTES.region,
      disabled: false
    },
    {
      label: 'Medication Database',
      route: PROTECTED_ROUTES.medicationByRegion,
      disabled: false
    },
    {
      label: 'Lab Test Database',
      route: '',
      disabled: true
    },
    {
      label: 'Health Facility',
      route: PROTECTED_ROUTES.healthFacilityBySuperAdmin,
      disabled: false,
      childRoutes: [PROTECTED_ROUTES.healthFacilitySummary]
    },
    {
      label: 'Users',
      route: PROTECTED_ROUTES.usersBySuperAdmin,
      disabled: false
    }
  ];

  const adminRoutes: ISideMenuItem[] = [
    {
      label: 'Health Facility',
      route: PROTECTED_ROUTES.healthFacilityByAdmin,
      childRoutes: [PROTECTED_ROUTES.healthFacilitySummary]
    },
    {
      label: 'Users',
      route: PROTECTED_ROUTES.usersByAdmin
    }
  ];

  const { regionId, tenantId, healthFacilityId, hfTenantId } = useRouteParams({
    adminRoutes,
    superAdminRoutes,
    role,
    regionData
  });
  const dashboardMenu = [
    { name: 'Admin', logo: admin, link: PROTECTED_ROUTES.regionDashboard },
    { name: 'Reports', logo: report, link: PROTECTED_ROUTES.region },
    { name: 'Insights', logo: insights, link: PROTECTED_ROUTES.region }
  ];

  return (
    <div className='container my-2'>
      <div className='row justify-content-start'>
        {dashboardMenu.map((detail: { name: string; logo: string; link: string }, index: number) => (
          <div key={index} className={`col-12 col-sm-6 col-md-4 col-lg-3 mx-3 my-2 ${styles.cardCustom}`} role='button'>
            <Link to={detail.link}>
              <div
                className={`card-body text-center d-flex flex-column align-items-center justify-content-center ${styles.cardBody}`}
              >
                <img src={detail.logo} alt={detail.name} className={`mb-3 ${styles.dashboardIcon}`} />
                <h5 className={styles.cardTitle}>{detail.name.toUpperCase()}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingDashboard;
