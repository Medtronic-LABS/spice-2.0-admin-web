import React, { useCallback, useEffect, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { matchPath, useLocation } from 'react-router';

import { ReactComponent as HomeIcon } from '../../assets/images/home.svg';
import { HOME_PAGE_BY_ROLE, PROTECTED_ROUTES } from '../../constants/route';
import { useDispatch, useSelector } from 'react-redux';
import { roleSelector, userDataSelector } from '../../store/user/selectors';
import APPCONSTANTS from '../../constants/appConstants';

import styles from './Breadcrumb.module.scss';
import sessionStorageServices from '../../global/sessionStorageServices';

interface ISection {
  route: string;
  label: string;
  appendParent?: boolean;
}

const superAdminRoutes = [PROTECTED_ROUTES.region];

const customBreadcrumbs = [{ route: '', label: 'Add Medication', appendParent: true }];

/**
 * Dynamic breadcrumb for application
 * @returns {React.ReactElement}
 */
const Breadcrumb = (): React.ReactElement => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const region = useSelector(userDataSelector).country;
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

  const showRegion =
    (role !== APPCONSTANTS.ROLES.SUPER_ADMIN ||
      APPCONSTANTS.ROLES.SUPER_USER ||
      superAdminRoutes.includes(activeRoute)) &&
    activeRoute.includes(':regionId');

  const sections: ISection[] = useMemo(() => {
    const result = [];
    if (customBreadcrumb && !customBreadcrumb.appendParent) {
      // we have a custom breadcrumb for certain routes
      // this if block executes when current route is one of customBreadcrumb routes
      result.push(customBreadcrumb);
      return result; // function execution ends here
    }
    if (region?.name && showRegion) {
      result.push({
        label: region.name,
        route: PROTECTED_ROUTES.region.replace(':regionId', region.id).replace(':tenantId', region.tenantId)
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
  }, [customBreadcrumb, region, showRegion]);

  const dispatchData = useCallback((routeObject: any, name: string) => {
    return {
      id: routeObject[`:${routeObject.name}Id`],
      tenantId: routeObject[':tenantId'],
      name
    };
  }, []);

  const urlRouteIdDispatch = useCallback((label: any, routeInitArray?: string[], currentRouteArr?: any[]) => {
    let routeObject: any = {};
    if (routeInitArray && currentRouteArr && routeInitArray.length === currentRouteArr.length) {
      routeInitArray?.forEach((route: string, i: number) => {
        routeObject = { ...routeObject, [i === 1 ? 'name' : route]: currentRouteArr[i] };
      });
      if (routeObject.name === APPCONSTANTS.ROUTE_NAMES.REGION) {
        // dispatch(setRegionDetails(dispatchData(routeObject, label)));
      }
    }
  }, []);

  const dataPersistOnRefresh = useCallback(() => {
    const storedBC = sessionStorageServices.getItem('breadCrumbs');
    if (storedBC) {
      const breadCrumbs = JSON.parse(storedBC);
      breadCrumbs.forEach((bc: ISection) => {
        const isCustomPath = Boolean(
          customBreadcrumbs.find(({ route }) => Boolean(matchPath(bc.route, { path: route, exact: true })))
        );
        if (!isCustomPath) {
          const routeMatch = Object.values(PROTECTED_ROUTES).find((route) =>
            Boolean(matchPath(bc.route, { path: route, exact: true }))
          );
          const routeInitArray = routeMatch?.split('/');
          const currentRouteArr = bc.route?.split('/');

          urlRouteIdDispatch(bc.label, routeInitArray, currentRouteArr);
        }
      });
      sessionStorageServices.deleteItem('breadCrumbs');
    }
  }, [urlRouteIdDispatch]);

  // const prevPathname = useRef(pathname);
  // Clearing the region/account/ou/site data in reducer, to prevent showing wrong data in breadcrumb
  useEffect(() => {
    // if (prevPathname.current !== pathname) {
    //   const prevRoute = {
    //     isRegionRoute: Boolean(
    //       superAdminRoutes.find((route) => Boolean(matchPath(prevPathname.current, { path: route, exact: true })))
    //     )
    //   };
    //   const currRoute = {
    //     isRegionRoute: Boolean(
    //       superAdminRoutes.find((route) => Boolean(matchPath(pathname, { path: route, exact: true })))
    //     )
    //   };
    //   prevPathname.current = pathname;
    // }
    dataPersistOnRefresh();
  }, [dataPersistOnRefresh, dispatch, dispatchData, pathname, region]);

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
    // dispatch(clearRegionDetail());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${styles.breadcrumb} d-flex align-items-center`}>
      <Link
        className={`${styles.homeIcon} d-inline-flex align-items-center justify-content-center me-0dot75 lh-0`}
        onClick={clearData}
        to={HOME_PAGE_BY_ROLE[role].replace(':regionId', region?.id).replace(':tenantId', region?.tenantId)}
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
