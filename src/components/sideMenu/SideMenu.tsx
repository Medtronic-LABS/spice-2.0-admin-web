import { memo, useCallback, useEffect, useState } from 'react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { routesWithSideMenu } from '../../constants/route';
import styles from './SideMenu.module.scss';
import { fetchSideMenuRequest } from '../../store/common/actions';
import { getLoadingSelector, getSideMenuSelector } from '../../store/common/selectors';
import { loadingSelector as userLoadingSelector } from '../../store/user/selectors';
import { getLoadingSelector as regionLoadingSelector } from '../../store/region/selectors';
import { healthFacilityLoadingSelector, workflowLoadingSelector } from '../../store/healthFacility/selectors';
import { ISideMenu } from '../../store/common/types';
import Loader from '../loader/Loader';
import { countryIdSelector, roleSelector } from '../../store/user/selectors';
import APPCONSTANTS, { APP_TYPE, NAMING_VARIABLES, SIDE_MENU_FETCHING_HIERARCHY } from '../../constants/appConstants';
import toastCenter from '../../utils/toastCenter';
import sessionStorageServices from '../../global/sessionStorageServices';
import { getMedicationLoadingSelector } from '../../store/medication/selectors';
import { labtestLoadingSelector } from '../../store/labTest/selectors';
import { districtLoadingSelector } from '../../store/district/selectors';
import { chiefdomLoadingSelector } from '../../store/chiefdom/selectors';
import { programLoadingSelector } from '../../store/program/selectors';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

type RouteModuleNames = 'region' | 'district' | 'chiefdom' | 'health-facility';
interface ISideMenuProps {
  className?: string;
}

/**
 * SideMenu component
 * Renders the side menu
 * @param {ISideMenuProps} props - Component props
 * @returns {React.ReactElement} The rendered SideMenu component
 */
const SideMenu = memo(({ className }: ISideMenuProps) => {
  const dispatch = useDispatch();
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
  const countryIdValue = Number(countryId?.id) || Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID));
  const countryTenantId = Number(sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_TENANT_ID));
  const role = useSelector(roleSelector);

  const { list }: { list: any } = useSelector(getSideMenuSelector);
  const currentModule: RouteModuleNames = pathname.split('/')[1];
  const { route: currentRoute } =
    routesWithSideMenu.find(({ route }) => matchPath(pathname, { path: route, exact: true })) || {};
  const { regionId, districtId, chiefdomId, healthFacilityId, tenantId } = matchPath(pathname, {
    path: currentRoute,
    exact: true
  })?.params as any;

  /**
   * Fetches the side menu
   */
  const fetchSideMenu = useCallback(
    () =>
      dispatch(
        fetchSideMenuRequest({
          countryId: regionId || countryIdValue || null,
          roleName: role,
          appTypes,
          failureCb: () => {
            toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.FETCH_SIDEMENU_ERROR);
          }
        })
      ),
    [appTypes, countryIdValue, dispatch, regionId, role]
  );

  /**
   * Gets the tenant ID based on the app type and role
   * @returns {number} The tenant ID
   */
  const getTenentId = (): number => {
    if (
      appTypes.includes(APP_TYPE.NON_COMMUNITY) ||
      (appTypes.includes(APP_TYPE.COMMUNITY) && (regionId || role === APPCONSTANTS.ALL_ROLES.HEALTH_FACILITY_ADMIN))
    ) {
      return tenantId;
    }
    return countryTenantId;
  };

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
        ':tenantId': getTenentId()
      };
      choosenRoutes = choosenRoutes.map((menu: ISideMenu) => {
        menu = { ...menu };
        if (menu?.route) {
          Object.entries(routeVariableValues).forEach(([key, value]) => {
            menu.route = menu?.route?.replace(key, value);
          });
        }
        return menu;
      });
      setFetchedSideMenu(choosenRoutes);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appTypes, chiefdomId, countryIdValue, countryTenantId, districtId, healthFacilityId, regionId, tenantId]
  );

  /**
   * Fetches the side menu and formats the menu items
   */
  useEffect(() => {
    if (!Object.keys(list || []).length) {
      fetchSideMenu();
    } else {
      let menuBy;
      if (currentModule === APPCONSTANTS.ROUTE_NAMES.REGION && role === APPCONSTANTS.ALL_ROLES.REGION_ADMIN) {
        menuBy = APPCONSTANTS.BY_REGION_DETAILS;
      } else {
        menuBy = SIDE_MENU_FETCHING_HIERARCHY[currentModule];
      }
      formatMenuItems([...(list[menuBy] || [])]);
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
