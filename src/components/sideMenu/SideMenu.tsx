import { memo, useCallback, useEffect } from 'react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  PROTECTED_ROUTES,
  SIDE_MENU_MAPPER,
  regionRoutesWithSideMenu,
  districtRoutesWithSideMenu,
  chiefdomWithSideMenu,
  hfWithSideMenu
} from '../../constants/route';
import styles from './SideMenu.module.scss';
import { fetchSideMenuRequest, clearSideMenu, setSideMenu } from '../../store/common/actions';
import { getLoadingSelector, getSideMenuSelector } from '../../store/common/selectors';
import { ISideMenu } from '../../store/common/types';
import Loader from '../loader/Loader';
import { countryIdSelector, roleSelector } from '../../store/user/selectors';
import APPCONSTANTS, { NAMING_VARIABLES } from '../../constants/appConstants';
import toastCenter from '../../utils/toastCenter';

interface ISideMenuProps {
  className?: string;
}

const SideMenu = memo(({ className }: ISideMenuProps) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const sideMenuLoading = useSelector(getLoadingSelector);
  const countryId = useSelector(countryIdSelector);
  const countryIdValue = countryId?.id;

  const sideMenuLoading = useSelector(getLoadingSelector);
  const countryId = useSelector(countryIdSelector);
  const countryIdValue = countryId?.id;
  const role = useSelector(roleSelector);

  const { list: sideMenuList } = useSelector(getSideMenuSelector);

  const [name, route] =
    Object.entries(PROTECTED_ROUTES).find(([key, value]: [string, string]) =>
      matchPath(pathname, { path: value, exact: true })
    ) || [];
  const { regionId, districtId, chiefdomId, healthFacilityId, tenantId } = matchPath(pathname, {
    path: route,
    exact: true
  })?.params as any;

  let formName: string = '';
  if (role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER) {
    formName = NAMING_VARIABLES.country;
  } else if (role === APPCONSTANTS.ROLES.REGION_ADMIN) {
    formName = NAMING_VARIABLES.district;
  } else if (role === APPCONSTANTS.ROLES.DISTRICT_ADMIN) {
    formName = NAMING_VARIABLES.chiefdom;
  } else if (role === APPCONSTANTS.ROLES.CHIEFDOM_ADMIN || role === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN) {
    formName = NAMING_VARIABLES.healthFacility;
  }

  const fetchSideMenu = useCallback(
    () =>
      dispatch(
        fetchSideMenuRequest({
          countryId: regionId || countryIdValue || null,
          tenantId,
          formName,
          successCb: (payload: any) => {
            const {
              list: rawSideMenu,
              routeIds: { id: routeId, tenantId: routeTenantId }
            } = payload;

            const sideMenuWithRoute = [...rawSideMenu]?.map((menu: ISideMenu) => {
              menu = { ...menu };
              const menuName = menu.name;
              const routeObj = Object.entries(SIDE_MENU_MAPPER).find(([key]) => key === menuName);
              menu.route = routeObj?.[1];
              return menu;
            });

            let choosenRoutes: ISideMenu[] = [...sideMenuWithRoute];
            const pathParams: Array<[string, string]> = [];
            if (role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER) {
              pathParams.push([':regionId', regionId || routeId], [':tenantId', routeTenantId || tenantId]);
            }
            if (role === APPCONSTANTS.ROLES.REGION_ADMIN) {
              pathParams.push([':districtId', districtId || routeId], [':tenantId', routeTenantId || tenantId]);
            }
            if (role === APPCONSTANTS.ROLES.DISTRICT_ADMIN) {
              pathParams.push([':chiefdomId', chiefdomId || routeId], [':tenantId', routeTenantId || tenantId]);
            }
            if (role === APPCONSTANTS.ROLES.CHIEFDOM_ADMIN || role === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN) {
              pathParams.push(
                [':healthFacilityId', healthFacilityId || routeId],
                [':tenantId', routeTenantId || tenantId]
              );
            }
            choosenRoutes = choosenRoutes.map((menu: ISideMenu) => {
              menu = { ...menu };
              pathParams.forEach(([paramName, paramValue]) => {
                menu.route = menu?.route?.replace(paramName, paramValue);
              });
              return menu;
            });
            dispatch(
              setSideMenu({
                list: choosenRoutes
              })
            );
          },
          failureCb: () => {
            toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.FETCH_SIDEMENU_ERROR);
          }
        })
      ),
    [chiefdomId, countryIdValue, dispatch, districtId, formName, healthFacilityId, regionId, role, tenantId]
  );

  useEffect(() => {
    if (!sideMenuList.length && tenantId) {
      fetchSideMenu();
    }
  }, [dispatch, fetchSideMenu, role, sideMenuList.length, tenantId]);

  useEffect(() => {
    return () => {
      if (role === APPCONSTANTS.ROLES.SUPER_ADMIN || role === APPCONSTANTS.ROLES.SUPER_USER) {
        dispatch(clearSideMenu());
      }
    };
  }, []);

  const checkActive = (currentRoute: string, currentRouteName: string) => {
    const isCurrentRouteActive = matchPath(pathname, { exact: true, path: currentRoute });
    if (isCurrentRouteActive) {
      return true;
    } else {
      if (
        regionRoutesWithSideMenu.find((regionRoute) => matchPath(pathname, { path: regionRoute, exact: true })) &&
        currentRouteName.includes('REGION_BY')
      ) {
        return true;
      }
      if (
        districtRoutesWithSideMenu.find((districtRoute) => matchPath(pathname, { path: districtRoute, exact: true })) &&
        (currentRouteName.includes('DISTRICT_BY') || currentRouteName === 'DISTRICT_SUMMARY')
      ) {
        return true;
      }
      if (
        chiefdomWithSideMenu.find((chiefdomRoute) => matchPath(pathname, { path: chiefdomRoute, exact: true })) &&
        (currentRouteName.includes('CHIEFDOM_BY') || currentRouteName === 'CHIEFDOM_SUMMARY')
      ) {
        return true;
      }
      if (
        hfWithSideMenu.find((hfRoute) => matchPath(pathname, { path: hfRoute, exact: true })) &&
        (currentRouteName.includes('HEALTH_FACILITY_BY') || currentRouteName === 'HEALTH_FACILITY_SUMMARY')
      ) {
        return true;
      }
    }
  };

  return (
    <>
      {sideMenuLoading && <Loader />}
      <div className={`${styles.sideMenu} py-0dot25 ${className}`}>
        {[...sideMenuList]?.map(({ displayName, disabled, ...rest }: any, i: number) => {
          const isActive = checkActive(rest.route, rest.name);
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
