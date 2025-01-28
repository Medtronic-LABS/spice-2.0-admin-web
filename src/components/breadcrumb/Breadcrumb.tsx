import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { matchPath, useLocation } from 'react-router';

import { ReactComponent as HomeIcon } from '../../assets/images/home.svg';
import { HOME_PAGE_BY_ROLE, PROTECTED_ROUTES } from '../../constants/route';
import { useDispatch, useSelector } from 'react-redux';
import { getRegionDetailsSelector } from '../../store/region/selectors';
import { districtSelector } from '../../store/district/selectors';
import { getChiefdomDetailSelector } from '../../store/chiefdom/selectors';
import { healthFacilitySelector } from '../../store/healthFacility/selectors';
import { roleSelector, getUserSuiteAccessSelector } from '../../store/user/selectors';
import { clearDistrictDetails, setDistrictDetails } from '../../store/district/actions';
import APPCONSTANTS from '../../constants/appConstants';

import styles from './Breadcrumb.module.scss';
import sessionStorageServices from '../../global/sessionStorageServices';
import { clearRegionDetail, setRegionDetail } from '../../store/region/actions';
import { clearChiefdomDetail, setChiefdomDetails } from '../../store/chiefdom/actions';
import { clearHFSummary, setHFSummary } from '../../store/healthFacility/actions';
import { clearSideMenu } from '../../store/common/actions';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

interface ISection {
  route: string;
  label: string;
  appendParent?: boolean;
}

const chiefdomRoutes = [
  PROTECTED_ROUTES.chiefdomSummary,
  PROTECTED_ROUTES.healthFacilityByChiefdom,
  PROTECTED_ROUTES.adminByChiefdom,
  PROTECTED_ROUTES.userByChiefdom,
  PROTECTED_ROUTES.createHealthFacilityByChiefdom
];

const districtRoutes = [
  PROTECTED_ROUTES.districtSummary,
  PROTECTED_ROUTES.chiefdomByDistrict,
  PROTECTED_ROUTES.healthFacilityByDistrict,
  PROTECTED_ROUTES.adminByDistrict,
  PROTECTED_ROUTES.userByDistrict,
  PROTECTED_ROUTES.createChiefdomByDistrict,
  PROTECTED_ROUTES.createHealthFacilityByDistrict
];

const regionRoutes = [
  PROTECTED_ROUTES.regionSummary,
  PROTECTED_ROUTES.districtByRegion,
  PROTECTED_ROUTES.chiefdomByRegion,
  PROTECTED_ROUTES.healthFacilityByRegion,
  PROTECTED_ROUTES.adminByRegion,
  PROTECTED_ROUTES.userByRegion,
  PROTECTED_ROUTES.createDistrictByRegion,
  PROTECTED_ROUTES.createChiefdomByRegion,
  PROTECTED_ROUTES.createHealthFacilityByRegion,
  PROTECTED_ROUTES.createMedication,
  PROTECTED_ROUTES.createLabTest,
  PROTECTED_ROUTES.medicationByRegion,
  PROTECTED_ROUTES.labTestByRegion,
  PROTECTED_ROUTES.programByRegion,
  PROTECTED_ROUTES.createProgramByRegion,
  PROTECTED_ROUTES.customizationByRegion,
  PROTECTED_ROUTES.accordianViewRegionCustomizationForm,
  PROTECTED_ROUTES.workflowCustomization,
  PROTECTED_ROUTES.workflowByRegion
];

const healthFacilityRoutes = [
  PROTECTED_ROUTES.healthFacilitySummary,
  PROTECTED_ROUTES.healthFacilityByRegion,
  PROTECTED_ROUTES.adminByHealthFacility,
  PROTECTED_ROUTES.userByHealthFacility
];

const dashboardRoutes = [
  // PROTECTED_ROUTES.regionDashboard,
  PROTECTED_ROUTES.districtDashboard,
  PROTECTED_ROUTES.chiefdomDashboard,
  PROTECTED_ROUTES.healthFacilityDashboard
];

/**
 * Dynamic breadcrumb for application
 * @returns {React.ReactElement}
 */
const Breadcrumb = (): React.ReactElement => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const region = useSelector(getRegionDetailsSelector);
  const district = useSelector(districtSelector);
  const chiefdom = useSelector(getChiefdomDetailSelector);
  const healthFacility = useSelector(healthFacilitySelector);
  const role = useSelector(roleSelector);
  const userSuiteAccess = useSelector(getUserSuiteAccessSelector);

  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    healthFacility: { s: healthFacilitySName }
  } = useAppTypeConfigs();

  const customBreadcrumbs = [
    { route: PROTECTED_ROUTES.createMedication, label: 'Add Medication', appendParent: true },
    { route: PROTECTED_ROUTES.createLabTest, label: 'Add Lab Test', appendParent: true },
    { route: PROTECTED_ROUTES.createRegion, label: 'Create Region', appendParent: true },
    { route: PROTECTED_ROUTES.createDistrictByRegion, label: `Create ${districtSName}`, appendParent: true },
    { route: PROTECTED_ROUTES.createChiefdomByRegion, label: `Create ${chiefdomSName}`, appendParent: true },
    { route: PROTECTED_ROUTES.createChiefdomByDistrict, label: `Create ${chiefdomSName}`, appendParent: true },
    {
      route: PROTECTED_ROUTES.createHealthFacilityByRegion,
      label: `Create ${healthFacilitySName}`,
      appendParent: true
    },
    {
      route: PROTECTED_ROUTES.createHealthFacilityByDistrict,
      label: `Create ${healthFacilitySName}`,
      appendParent: true
    },
    {
      route: PROTECTED_ROUTES.createHealthFacilityByChiefdom,
      label: `Create ${healthFacilitySName}`,
      appendParent: true
    },
    { route: PROTECTED_ROUTES.profile, label: 'Settings' },
    { route: PROTECTED_ROUTES.regionDashboard, label: 'Dashboard' },
    { route: PROTECTED_ROUTES.superAdmin, label: 'Super Admin' },
    { route: PROTECTED_ROUTES.deactivatedRecords, label: 'Deactivated Records' },
    { route: PROTECTED_ROUTES.lockedUsers, label: 'Locked Users' },
    { route: PROTECTED_ROUTES.legalTerms, label: 'Legal Terms' },
    { route: PROTECTED_ROUTES.createProgramByRegion, label: 'Create Program', appendParent: true },
    { route: PROTECTED_ROUTES.createLabTest, label: 'Create Lab Test', appendParent: true },
    { route: PROTECTED_ROUTES.editLabTest, label: 'Edit Lab Test', appendParent: true },
    { route: PROTECTED_ROUTES.accordianViewRegionCustomizationForm, label: 'Screening Form', appendParent: true },
    { route: PROTECTED_ROUTES.workflowCustomization, label: '', appendParent: true }
  ];

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
      if (
        Boolean(
          matchPath(pathname, {
            path: PROTECTED_ROUTES.accordianViewRegionCustomizationForm,
            exact: true
          }) ||
            matchPath(pathname, {
              path: PROTECTED_ROUTES.workflowCustomization,
              exact: true
            })
        )
      ) {
        const pathArray = pathname.split('/');
        const formName = decodeURIComponent(pathArray[4]);
        return {
          ...breadCrumb,
          label: `${formName.charAt(0).toUpperCase() + formName.slice(1)} Form`,
          route: pathname
        };
      } else {
        return { ...breadCrumb, route: pathname };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const showSite = activeRoute.includes(':healthFacilityId');
  const showOU =
    (role !== APPCONSTANTS.ROLES.CHIEFDOM_ADMIN || chiefdomRoutes.includes(activeRoute)) &&
    (showSite || activeRoute.includes(':chiefdomId'));
  const showDistrict =
    (role !== APPCONSTANTS.ROLES.DISTRICT_ADMIN || districtRoutes.includes(activeRoute)) &&
    (showOU || activeRoute.includes(':districtId'));
  const showRegion =
    (role !== APPCONSTANTS.ROLES.REGION_ADMIN || regionRoutes.includes(activeRoute)) &&
    (showDistrict || activeRoute.includes(':regionId'));

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
        route: PROTECTED_ROUTES.regionSummary.replace(':regionId', region.id).replace(':tenantId', region.tenantId)
      });
    }
    if (district?.name && showDistrict) {
      result.push({
        label: district.name,
        route: PROTECTED_ROUTES.districtSummary
          .replace(':districtId', district.id)
          .replace(':tenantId', district.tenantId)
      });
    }
    if (chiefdom?.name && showOU) {
      result.push({
        label: chiefdom.name,
        route: PROTECTED_ROUTES.chiefdomSummary
          .replace(':chiefdomId', chiefdom.id)
          .replace(':tenantId', chiefdom.tenantId)
      });
    }
    if (healthFacility?.name && showSite) {
      result.push({
        label: healthFacility.name,
        route: PROTECTED_ROUTES.healthFacilitySummary
          .replace(':healthFacilityId', healthFacility.id?.toString())
          .replace(':tenantId', healthFacility.tenantId?.toString())
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
    region.name,
    region.id,
    region.tenantId,
    showRegion,
    district.name,
    district.id,
    district.tenantId,
    showDistrict,
    chiefdom.name,
    chiefdom.id,
    chiefdom.tenantId,
    showOU,
    healthFacility.name,
    healthFacility.id,
    healthFacility.tenantId,
    showSite
  ]);

  const dispatchData = useCallback((routeObject: any, name: string) => {
    return {
      id: routeObject[`:${routeObject.name}Id`],
      tenantId: routeObject[':tenantId'],
      name
    };
  }, []);

  const urlRouteIdDispatch = useCallback(
    (label: any, routeInitArray?: string[], currentRouteArr?: any[]) => {
      let routeObject: any = {};
      if (routeInitArray && currentRouteArr && routeInitArray.length === currentRouteArr.length) {
        routeInitArray?.forEach((route: string, i: number) => {
          routeObject = { ...routeObject, [i === 1 ? 'name' : route]: currentRouteArr[i] };
        });
        if (routeObject.name === APPCONSTANTS.ROUTE_NAMES.REGION) {
          dispatch(setRegionDetail(dispatchData(routeObject, label)));
        }
        if (routeObject.name === APPCONSTANTS.ROUTE_NAMES.DISTRICT) {
          dispatch(setDistrictDetails(dispatchData(routeObject, label)));
        }
        if (routeObject.name === APPCONSTANTS.ROUTE_NAMES.CHIEFDOM) {
          dispatch(setChiefdomDetails(dispatchData(routeObject, label)));
        }
        if (routeObject.name === APPCONSTANTS.ROUTE_NAMES.HEALTHFACILITY) {
          dispatch(setHFSummary(dispatchData(routeObject, label)));
        }
      }
    },
    [dispatch, dispatchData]
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlRouteIdDispatch]);

  const prevPathname = useRef(pathname);
  // Clearing the region/district/ou/site data in reducer, to prevent showing wrong data in breadcrumb
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      const prevRoute = {
        isSiteRoute: Boolean(
          healthFacilityRoutes.find((route) => Boolean(matchPath(prevPathname.current, { path: route, exact: true })))
        ),
        isOURoute: Boolean(
          chiefdomRoutes.find((route) => Boolean(matchPath(prevPathname.current, { path: route, exact: true })))
        ),
        isDistrictRoute: Boolean(
          districtRoutes.find((route) => Boolean(matchPath(prevPathname.current, { path: route, exact: true })))
        ),
        isRegionRoute: Boolean(
          regionRoutes.find((route) => Boolean(matchPath(prevPathname.current, { path: route, exact: true })))
        ),
        isDashboardRoute: Boolean(
          dashboardRoutes.find((route) => Boolean(matchPath(prevPathname.current, { path: route, exact: true })))
        )
      };
      const currRoute = {
        isSiteRoute: Boolean(
          healthFacilityRoutes.find((route) => Boolean(matchPath(pathname, { path: route, exact: true })))
        ),
        isOURoute: Boolean(chiefdomRoutes.find((route) => Boolean(matchPath(pathname, { path: route, exact: true })))),
        isDistrictRoute: Boolean(
          districtRoutes.find((route) => Boolean(matchPath(pathname, { path: route, exact: true })))
        ),
        isRegionRoute: Boolean(
          regionRoutes.find((route) => Boolean(matchPath(pathname, { path: route, exact: true })))
        ),
        isDashboardRoute: Boolean(
          dashboardRoutes.find((route) => Boolean(matchPath(prevPathname.current, { path: route, exact: true })))
        )
      };
      if (!prevRoute.isDashboardRoute && currRoute.isDashboardRoute) {
        dispatch(clearDistrictDetails());
        dispatch(clearChiefdomDetail());
      }
      if ((prevRoute.isOURoute || prevRoute.isSiteRoute) && !currRoute.isOURoute && !currRoute.isSiteRoute) {
        dispatch(clearChiefdomDetail());
      }
      if (
        (prevRoute.isOURoute || prevRoute.isSiteRoute || prevRoute.isDistrictRoute) &&
        !currRoute.isOURoute &&
        !currRoute.isSiteRoute &&
        !currRoute.isDistrictRoute
      ) {
        dispatch(clearDistrictDetails());
      }
      prevPathname.current = pathname;
    }
    dataPersistOnRefresh();
  }, [district, dataPersistOnRefresh, dispatch, dispatchData, chiefdom, pathname, region, healthFacility]);

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
    dispatch(clearDistrictDetails());
    dispatch(clearChiefdomDetail());
    dispatch(clearHFSummary());
    dispatch(clearSideMenu());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectBasedOnUser = useCallback((currentUserRole: string, suiteAccess: string[]) => {
    if (suiteAccess.length > 1) {
      return PROTECTED_ROUTES.landingPage;
    } else {
      return HOME_PAGE_BY_ROLE[currentUserRole];
    }
  }, []);

  return (
    <div className={`${styles.breadcrumb} d-flex align-items-center`}>
      <Link
        className={`${styles.homeIcon} d-inline-flex align-items-center justify-content-center me-0dot75 lh-0`}
        onClick={clearData}
        to={redirectBasedOnUser(role, userSuiteAccess)}
      >
        <HomeIcon className='d-inline-block' aria-labelledby='Home' aria-label='Home' />
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
              data-testid={label}
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
