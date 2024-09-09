import { memo, useCallback, useEffect } from 'react';
import { NavLink, matchPath, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SIDE_MENU_MAPPER, routesWithSideMenu } from '../../constants/route';
import styles from './SideMenu.module.scss';
import { fetchSideMenuRequest, setSideMenu } from '../../store/common/actions';
import { getLoadingSelector, getSideMenuSelector } from '../../store/common/selectors';
import { loadingSelector as userLoadingSelector } from '../../store/user/selectors';
import { getLoadingSelector as regionLoadingSelector } from '../../store/region/selectors';
import { healthFacilityLoadingSelector, workflowLoadingSelector } from '../../store/healthFacility/selectors';
import { ISideMenu } from '../../store/common/types';
import Loader from '../loader/Loader';
import { countryIdSelector, roleSelector } from '../../store/user/selectors';
import APPCONSTANTS, { SIDE_MENU_FETCHING_HIERARCHY } from '../../constants/appConstants';
import toastCenter from '../../utils/toastCenter';
import sessionStorageServices from '../../global/sessionStorageServices';
import { getMedicationLoadingSelector } from '../../store/medication/selectors';
import { labtestLoadingSelector } from '../../store/labTest/selectors';
import { districtLoadingSelector } from '../../store/district/selectors';
import { chiefdomLoadingSelector } from '../../store/chiefdom/selectors';
import { programLoadingSelector } from '../../store/program/selectors';

interface ISideMenuProps {
  className?: string;
}
type ModuleNames = 'region' | 'district' | 'chiefdom' | 'health-facility';

const SideMenu = memo(({ className }: ISideMenuProps) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const regionLoading = useSelector(regionLoadingSelector);
  const districtLoading = useSelector(districtLoadingSelector);
  const chiefdomLoading = useSelector(chiefdomLoadingSelector);
  const hfLoading = useSelector(healthFacilityLoadingSelector);
  const medicationLoading = useSelector(getMedicationLoadingSelector);
  const labTestLoading = useSelector(labtestLoadingSelector);
  const workflowLoading = useSelector(workflowLoadingSelector);
  const userLoading = useSelector(userLoadingSelector);
  const programLoading = useSelector(programLoadingSelector);

  const sideMenuLoading = useSelector(getLoadingSelector);

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
  const role = useSelector(roleSelector);

  const { list: sideMenuList, fetchedFor } = useSelector(getSideMenuSelector);
  const currentModule: ModuleNames = pathname.split('/')[1];
  const { route: currentRoute } =
    routesWithSideMenu.find(({ route }) => matchPath(pathname, { path: route, exact: true })) || {};
  const { regionId, districtId, chiefdomId, healthFacilityId, tenantId } = matchPath(pathname, {
    path: currentRoute,
    exact: true
  })?.params as any;
  let fetchingFor: string;
  if (role === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN) {
    fetchingFor = role;
  } else {
    fetchingFor = SIDE_MENU_FETCHING_HIERARCHY[currentModule];
  }

  const fetchSideMenu = useCallback(
    () =>
      dispatch(
        fetchSideMenuRequest({
          countryId: regionId || countryIdValue || null,
          roleName: fetchingFor,
          successCb: (payload: any) => {
            const { list: rawSideMenu, roleName: menuFetchedFor } = payload;

            const sideMenuWithRoute = [...rawSideMenu]?.map((menu: ISideMenu) => {
              menu = { ...menu };
              const menuName = menu.name;
              const routeObj = Object.entries(SIDE_MENU_MAPPER).find(([key]) => key === menuName);
              menu.route = routeObj?.[1];
              return menu;
            });

            let choosenRoutes: ISideMenu[] = [...sideMenuWithRoute];
            const pathParams: Array<[string, string]> = [];
            if (menuFetchedFor === SIDE_MENU_FETCHING_HIERARCHY.region) {
              pathParams.push([':regionId', regionId], [':tenantId', tenantId]);
            }
            if (menuFetchedFor === SIDE_MENU_FETCHING_HIERARCHY.district) {
              pathParams.push([':districtId', districtId], [':tenantId', tenantId]);
            }
            if (menuFetchedFor === SIDE_MENU_FETCHING_HIERARCHY.chiefdom) {
              pathParams.push([':chiefdomId', chiefdomId], [':tenantId', tenantId]);
            }
            if (
              menuFetchedFor === SIDE_MENU_FETCHING_HIERARCHY['health-facility'] ||
              menuFetchedFor === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN
            ) {
              pathParams.push([':healthFacilityId', healthFacilityId], [':tenantId', tenantId]);
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
                list: choosenRoutes,
                fetchedFor: menuFetchedFor
              })
            );
          },
          failureCb: () => {
            toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.FETCH_SIDEMENU_ERROR);
          }
        })
      ),
    [chiefdomId, countryIdValue, dispatch, districtId, fetchingFor, healthFacilityId, regionId, tenantId]
  );

  useEffect(() => {
    if (!sideMenuList.length || fetchingFor !== fetchedFor) {
      fetchSideMenu();
    }
  }, [dispatch, fetchSideMenu, fetchedFor, fetchingFor, sideMenuList.length]);

  return (
    <>
      {getLoading() && <Loader />}
      <div className={`${styles.sideMenu} py-0dot25 ${className}`}>
        {[...sideMenuList]?.map(({ displayName, disabled, ...rest }: any, i: number) => {
          const isActive = matchPath(pathname, { exact: true, path: rest.route });
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
