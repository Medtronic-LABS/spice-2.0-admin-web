import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { matchPath, useLocation } from 'react-router';

import { ReactComponent as HomeIcon } from '../../assets/images/home.svg';
import { PROTECTED_ROUTES } from '../../constants/route';
import { useDispatch, useSelector } from 'react-redux';
import { roleSelector } from '../../store/user/selectors';
import APPCONSTANTS from '../../constants/appConstants';

import styles from './Breadcrumb.module.scss';
import sessionStorageServices from '../../global/sessionStorageServices';
import { healthFacilitySelector } from '../../store/healthFacility/selectors';
import { clearHealthFaciliityDetail } from '../../store/healthFacility/actions';
import { getRegionDetailsSelector } from '../../store/region/selectors';
import { clearRegionDetail } from '../../store/region/actions';

interface ISection {
  route: string;
  label: string;
  appendParent?: boolean;
}

const superAdminRoutes = [PROTECTED_ROUTES.region, PROTECTED_ROUTES.healthFacilityBySuperAdmin];
const adminRoutes = [PROTECTED_ROUTES.healthFacilitySummary, PROTECTED_ROUTES.healthFacilityByAdmin];

const customBreadcrumbs = [
  { route: PROTECTED_ROUTES.createMedication, label: 'Add Medication', appendParent: true },
  { route: PROTECTED_ROUTES.createHealthFacility, label: 'Add Health Facility', appendParent: true },
  { route: PROTECTED_ROUTES.profile, label: 'Settings', appendParent: true },
  { route: PROTECTED_ROUTES.deactivatedRecords, label: 'Deactivated Records' },
  { route: PROTECTED_ROUTES.createAccountByRegion, label: 'Create County', appendParent: true },
  { route: PROTECTED_ROUTES.lockedUsers, label: 'Locked Users' }
];

/**
 * Dynamic breadcrumb for application
 * @returns {React.ReactElement}
 */
const Breadcrumb = (): React.ReactElement => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const region = useSelector(getRegionDetailsSelector);
  const healthFacility = useSelector(healthFacilitySelector);
  const role = useSelector(roleSelector);

  const activeRoute = useMemo(
    () =>
      Object.values(PROTECTED_ROUTES).find((route) => Boolean(matchPath(pathname, { path: route, exact: true }))) || '',
    [pathname]
  );
  const customBreadcrumb: ISection | undefined = useMemo(() => {
    const breadCrumb = customBreadcrumbs.find(({ route }) =>
      Boolean(matchPath(pathname, { path: route, exact: true }))
    );
    if (breadCrumb) {
      return { ...breadCrumb, route: pathname };
    }
  }, [pathname]);

  const showHealthFacility = activeRoute.includes(':healthFacilityId');
  const showRegion =
    ([APPCONSTANTS.ROLES.SUPER_ADMIN, APPCONSTANTS.ROLES.SUPER_USER].includes(role) ||
      superAdminRoutes.includes(activeRoute)) &&
    (showHealthFacility || activeRoute.includes(':regionId'));

  const sections: ISection[] = useMemo(() => {
    const result = [];
    if (customBreadcrumb && !customBreadcrumb.appendParent) {
      // we have a custom breadcrumb for certain routes
      // this block executes when current route is one of customBreadcrumb routes
      result.push(customBreadcrumb);
      return result;
    }
    if (region?.name && showRegion) {
      result.push({
        label: region.name,
        route: PROTECTED_ROUTES.region.replace(':regionId', region.id).replace(':tenantId', region.tenantId)
      });
    }
    if (healthFacility?.name && showHealthFacility) {
      result.push({
        label: healthFacility.name,
        route: PROTECTED_ROUTES.healthFacilitySummary
          .replace(':healthFacilityId', String(healthFacility.id))
          .replace(':hfTenantId', String(healthFacility.tenantId))
      });
    }
    if (customBreadcrumb && customBreadcrumb.appendParent) {
      // we have a custom breadcrumb for certain routes
      // this if block executes when current route is one of customBreadcrumb routes
      result.push(customBreadcrumb);
    }
    if (!result.length) {
      result.push({
        label: 'Home',
        route: '/'
      });
    }
    return result;
  }, [
    customBreadcrumb,
    healthFacility.id,
    healthFacility.name,
    healthFacility.tenantId,
    region.id,
    region.name,
    region.tenantId,
    showHealthFacility,
    showRegion
  ]);

  const dispatchData = useCallback((routeObject: any, name: string) => {
    return {
      id: routeObject[`:${routeObject.name}Id`],
      tenantId: routeObject[':tenantId'],
      name
    };
  }, []);

  const prevPathname = useRef(pathname);
  // Clearing the region/account/ou/site data in reducer, to prevent showing wrong data in breadcrumb
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      const prevRoute = {
        isRegionRoute: Boolean(
          superAdminRoutes.find((route) => Boolean(matchPath(prevPathname.current, { path: route, exact: true })))
        ),
        isAdminRoute: Boolean(
          adminRoutes.find((route) => Boolean(matchPath(prevPathname.current, { path: route, exact: true })))
        )
      };
      const currRoute = {
        isRegionRoute: Boolean(
          superAdminRoutes.find((route) => Boolean(matchPath(pathname, { path: route, exact: true })))
        ),
        isAdminRoute: Boolean(adminRoutes.find((route) => Boolean(matchPath(pathname, { path: route, exact: true }))))
      };
      if (prevRoute.isAdminRoute && currRoute.isRegionRoute) {
        dispatch(clearHealthFaciliityDetail());
      }
      prevPathname.current = pathname;
    }
  }, [dispatch, dispatchData, pathname, region]);

  const sessionStoreEvent = useCallback(() => {
    sessionStorageServices.setItem(`breadCrumbs`, `${JSON.stringify(sections)}`);
  }, [sections]);

  useEffect(() => {
    window.addEventListener('beforeunload', sessionStoreEvent);
    return () => {
      window.removeEventListener('beforeunload', sessionStoreEvent);
    };
  }, [sessionStoreEvent]);

  const clearData = useCallback(() => {
    dispatch(clearRegionDetail());
    // clear county, sub county and facility details
  }, []);

  return (
    <div className={`${styles.breadcrumb} d-flex align-items-center`}>
      <Link
        className={`${styles.homeIcon} d-inline-flex align-items-center justify-content-center me-0dot75 lh-0`}
        to={'/home'}
        onClick={clearData}
      >
        <HomeIcon className='d-inline-block' aria-labelledby='Home' />
      </Link>
      <div>
        {sections.map(({ label, route }, i) => (
          <React.Fragment key={label}>
            {!!i && <span className='subtle-color mx-0dot25 align-baseline'>/</span>}
            <NavLink
              to={route}
              activeClassName={`fs-1dot5 fw-bold no-pointer-events ${styles.active}`}
              className={`align-baseline ${styles.breadcrumbLink}`}
              isActive={() => i === sections.length - 1}
            >
              {label}
            </NavLink>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
