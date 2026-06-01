import { memo, useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PROTECTED_ROUTES, routesWithSideMenu } from '../../constants/route';
import styles from './SideMenu.module.scss';
import { fetchSideMenuRequest } from '../../store/common/actions';
import { getLoadingSelector, getSideMenuSelector } from '../../store/common/selectors';
import { loadingSelector as userLoadingSelector } from '../../store/user/selectors';
import { getLoadingSelector as regionLoadingSelector } from '../../store/region/selectors';
import { healthFacilityLoadingSelector, workflowLoadingSelector } from '../../store/healthFacility/selectors';
import { ISideMenu } from '../../store/common/types';
import Loader from '../loader/Loader';
import { countryIdSelector, formDataIdSelector, roleSelector, tenantIdSelector } from '../../store/user/selectors';
import APPCONSTANTS, { APP_TYPE, NAMING_VARIABLES, SIDE_MENU_FETCHING_HIERARCHY } from '../../constants/appConstants';
import toastCenter from '../../utils/toastCenter';
import sessionStorageServices from '../../global/sessionStorageServices';
import { getMedicationLoadingSelector } from '../../store/medication/selectors';
import { labtestLoadingSelector } from '../../store/labTest/selectors';
import { districtLoadingSelector } from '../../store/district/selectors';
import { chiefdomLoadingSelector } from '../../store/chiefdom/selectors';
import { programLoadingSelector } from '../../store/program/selectors';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { useAppDispatch } from '../../store/hooks';
import { matchPathCompat as matchPath } from '../../utils/routerCompat';

type RouteModuleNames = 'region' | 'district' | 'chiefdom' | 'health-facility' | 'branch';
interface ISideMenuProps {
  className?: string;
}

const toTenantId = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

/**
 * SideMenu component
 * Renders the side menu
 * @param {ISideMenuProps} props - Component props
 * @returns {React.ReactElement} The rendered SideMenu component
 */
const SideMenu = memo(({ className }: ISideMenuProps) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const [fetchedSideMenu, setFetchedSideMenu] = useState<ISideMenu[]>([]);

  const regionLoading = useSelector(regionLoadingSelector);
  const districtLoading = useSelector(districtLoadingSelector);
  const chiefdomLoading = useSelector(chiefdomLoadingSelector);
  const hfLoading = useSelector(healthFacilityLoadingSelector);
  const medicationLoading = useSelector(getMedicationLoadingSelector);
  const labTestLoading = useSelector(labtestLoadingSelector);
  const workflowLoading = useSelector(workflowLoadingSelector);
  const userLoading = useSelector(userLoadingSelector);
  const programLoading = useSelector(programLoadingSelector);
  const { appTypes } = useAppTypeConfigs();

  const sideMenuLoading = useSelector(getLoadingSelector);
  const { healthFacility } = NAMING_VARIABLES;

  const getLoading = useCallback(
    () =>
      regionLoading ||
      districtLoading ||
      chiefdomLoading ||
      hfLoading ||
      medicationLoading ||
      labTestLoading ||
      workflowLoading ||
      userLoading ||
      programLoading
        ? false
        : sideMenuLoading,
    [
      regionLoading,
      districtLoading,
      chiefdomLoading,
      hfLoading,
      medicationLoading,
      labTestLoading,
      workflowLoading,
      userLoading,
      programLoading,
      sideMenuLoading
    ]
  );
  const countryId = useSelector(countryIdSelector);
  const userFormDataId = useSelector(formDataIdSelector);
  const countryIdValue =
    toTenantId(countryId?.id) ||
    toTenantId(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID)) ||
    toTenantId(userFormDataId);
  const countryTenantId = toTenantId(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_TENANT_ID));
  const userTenantId = useSelector(tenantIdSelector);
  const userTenantIdValue =
    toTenantId(userTenantId) || toTenantId(sessionStorageServices.getItem(APPCONSTANTS.USER_TENANTID));
  const role = useSelector(roleSelector);

  const { list }: { list: any } = useSelector(getSideMenuSelector);
  const currentModule: RouteModuleNames = pathname.split('/')[1];
  const { route: currentRoute } =
    routesWithSideMenu.find(({ route }) => matchPath(pathname, { path: route, exact: true })) || {};
  const { regionId, districtId, chiefdomId, healthFacilityId, tenantId, branchId } = matchPath(pathname, {
    path: currentRoute,
    exact: true
  })?.params as any;

  /**
   * Fetches the side menu
   */
  const fetchSideMenu = useCallback(
    () => {
      const resolvedCountryId = toTenantId(regionId) || countryIdValue;
      dispatch(
        fetchSideMenuRequest({
          countryId: resolvedCountryId,
          roleName: role,
          ...(appTypes?.length ? { appTypes } : {}),
          failureCb: () => {
            toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.FETCH_SIDEMENU_ERROR);
          }
        })
      );
    },
    [appTypes, countryIdValue, dispatch, regionId, role]
  );

  /**
   * Gets the tenant ID based on the app type and role
   * @returns {number} The tenant ID
   */
  const getTenentId = useCallback((): number => {
    const routeTenantId = toTenantId(tenantId);
    if (
      appTypes.includes(APP_TYPE.NON_COMMUNITY) ||
      (appTypes.includes(APP_TYPE.COMMUNITY) && (regionId || role === APPCONSTANTS.ALL_ROLES.HEALTH_FACILITY_ADMIN))
    ) {
      return routeTenantId || userTenantIdValue || countryTenantId || 0;
    }
    return routeTenantId || countryTenantId || userTenantIdValue || 0;
  }, [appTypes, countryTenantId, regionId, role, tenantId, userTenantIdValue]);

  const getTenantIdForRoute = useCallback(
    (route?: string): number => {
      const defaultTenantId = getTenentId();
      if (!route?.includes(':tenantId')) {
        return defaultTenantId;
      }
      const isRegionScopedRoute = route.startsWith('/region/:regionId/:tenantId');
      if (isRegionScopedRoute) {
        return countryTenantId || defaultTenantId;
      }
      return defaultTenantId;
    },
    [countryTenantId, getTenentId]
  );

  const getContextAwareRoute = useCallback(
    (route?: string) => {
      if (!route) {
        return route;
      }
      const isRegionAdminDistrictContext =
        role === APPCONSTANTS.ALL_ROLES.REGION_ADMIN &&
        currentModule === APPCONSTANTS.ROUTE_NAMES.DISTRICT &&
        Boolean(districtId);
      if (!isRegionAdminDistrictContext) {
        return route;
      }

      if (route === PROTECTED_ROUTES.healthFacilityByRegion) {
        return PROTECTED_ROUTES.healthFacilityByDistrict;
      }
      if (route === PROTECTED_ROUTES.userByRegion) {
        return PROTECTED_ROUTES.userByDistrict;
      }
      if (route === PROTECTED_ROUTES.adminByRegion) {
        return PROTECTED_ROUTES.adminByDistrict;
      }
      return route;
    },
    [currentModule, districtId, role]
  );

  /**
   * Formats the menu items
   * @param {ISideMenu[]} rawMenu - The raw menu items
   * @returns {ISideMenu[]} The formatted menu items
   */
  const formatMenuItems = useCallback(
    (rawMenu: ISideMenu[]) => {
      let choosenRoutes: ISideMenu[] = [...rawMenu];
      const routeVariableValues = {
        ':regionId': regionId || countryIdValue, // for community and non-community
        ':districtId': districtId,
        ':chiefdomId': chiefdomId,
        ':healthFacilityId': healthFacilityId,
        ':branchId': branchId,
        ':tenantId': getTenentId()
      };
      choosenRoutes = choosenRoutes.map((menu: ISideMenu) => {
        menu = { ...menu };
        const contextAwareRoute = getContextAwareRoute(menu?.route);
        if (contextAwareRoute) {
          const routeVariableValues = {
            ':regionId': regionId || countryIdValue, // for community and non-community
            ':districtId': districtId,
            ':chiefdomId': chiefdomId,
            ':healthFacilityId': healthFacilityId,
            ':tenantId': getTenantIdForRoute(contextAwareRoute)
          };
          menu.route = contextAwareRoute;
          Object.entries(routeVariableValues).forEach(([key, value]) => {
            menu.route = menu?.route?.replace(key, value);
          });
        }
        return menu;
      });
      setFetchedSideMenu(choosenRoutes);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appTypes, chiefdomId, countryIdValue, countryTenantId, districtId, healthFacilityId, regionId, branchId, tenantId, userTenantIdValue, getContextAwareRoute, getTenantIdForRoute]
  );

  /**
   * Fetches the side menu and formats the menu items
   */
  useEffect(() => {
    if (!Object.keys(list || []).length) {
      fetchSideMenu();
    } else {
      let menuBy: string | undefined;
      if (currentModule === APPCONSTANTS.ROUTE_NAMES.REGION && role === APPCONSTANTS.ALL_ROLES.REGION_ADMIN) {
        menuBy = APPCONSTANTS.BY_REGION_DETAILS;
      } else {
        menuBy = SIDE_MENU_FETCHING_HIERARCHY[currentModule];
      }
      const fallbackMenuKeys = [
        menuBy,
        SIDE_MENU_FETCHING_HIERARCHY.region,
        APPCONSTANTS.BY_REGION_DETAILS
      ].filter(Boolean) as string[];
      const menuKey =
        fallbackMenuKeys.find(
          (key) => Array.isArray(list?.[key]) && list[key].some((menuItem: ISideMenu) => Boolean(menuItem?.route))
        ) ||
        Object.keys(list || {}).find(
          (key) => Array.isArray(list?.[key]) && list[key].some((menuItem: ISideMenu) => Boolean(menuItem?.route))
        );
      formatMenuItems([...(list?.[menuKey as string] || [])]);
    }
  }, [fetchSideMenu, formatMenuItems, list, currentModule, role]);

  const getActiveStatus = (route: any, displayName: string) => {
    const pathSegments = pathname.split('/');
    if (matchPath(pathname, { exact: true, path: route })) {
      return true;
    } else if (
      // for community admin login
      appTypes.includes(APP_TYPE.COMMUNITY) &&
      displayName === healthFacility &&
      pathSegments.includes(APPCONSTANTS.ROUTE_NAMES.HEALTHFACILITY) &&
      !pathSegments.includes('user')
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {getLoading() && <Loader />}
      <div className={`${styles.sideMenu} py-0dot25 ${className}`} data-testid='side-menu-component'>
        {[...fetchedSideMenu]?.map(({ displayName, disabled, ...rest }: any, i: number) => {
          const isActive = getActiveStatus(rest.route, displayName);
          return (
            <NavLink
              to={rest.route}
              key={`displayName_${i}`}
              className={`d-block lh-1dot375 py-0dot625 ps-1 pe-1dot25 my-0dot25 pointer ${styles.menuItem} ${
                isActive ? styles.selected : ''
              } ${disabled ? 'no-pointer-events' : ''}`}
            >
              {displayName}
            </NavLink>
          );
        })}
      </div>
    </>
  );
});

export default SideMenu;
