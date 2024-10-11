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
import APPCONSTANTS, { SIDE_MENU_FETCHING_HIERARCHY } from '../../constants/appConstants';
import toastCenter from '../../utils/toastCenter';
import sessionStorageServices from '../../global/sessionStorageServices';
import { getMedicationLoadingSelector } from '../../store/medication/selectors';
import { labtestLoadingSelector } from '../../store/labTest/selectors';
import { districtLoadingSelector } from '../../store/district/selectors';
import { chiefdomLoadingSelector } from '../../store/chiefdom/selectors';
import { programLoadingSelector } from '../../store/program/selectors';

type RouteModuleNames = 'region' | 'district' | 'chiefdom' | 'health-facility';
interface ISideMenuProps {
  className?: string;
}

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

  const { list } = useSelector(getSideMenuSelector);
  const currentModule: RouteModuleNames = pathname.split('/')[1];
  const { route: currentRoute } =
    routesWithSideMenu.find(({ route }) => matchPath(pathname, { path: route, exact: true })) || {};
  const { regionId, districtId, chiefdomId, healthFacilityId, tenantId } = matchPath(pathname, {
    path: currentRoute,
    exact: true
  })?.params as any;

  const fetchSideMenu = useCallback(
    () =>
      dispatch(
        fetchSideMenuRequest({
          countryId: regionId || countryIdValue || null,
          roleName: role,
          failureCb: () => {
            toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.FETCH_SIDEMENU_ERROR);
          }
        })
      ),
    [countryIdValue, dispatch, regionId, role]
  );

  const formatMenuItems = useCallback(
    (rawMenu: ISideMenu[]) => {
      let choosenRoutes: ISideMenu[] = [...rawMenu];
      const routeVariableValues = {
        ':regionId': regionId,
        ':districtId': districtId,
        ':chiefdomId': chiefdomId,
        ':healthFacilityId': healthFacilityId,
        ':tenantId': tenantId
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
    [chiefdomId, districtId, healthFacilityId, regionId, tenantId]
  );

  useEffect(() => {
    if (!Object.keys(list).length) {
      fetchSideMenu();
    } else {
      const menuBy = SIDE_MENU_FETCHING_HIERARCHY[currentModule];
      formatMenuItems([...list[menuBy]]);
    }
  }, [fetchSideMenu, formatMenuItems, list, currentModule]);

  return (
    <>
      {getLoading() && <Loader />}
      <div className={`${styles.sideMenu} py-0dot25 ${className}`}>
        {[...fetchedSideMenu]?.map(({ displayName, disabled, ...rest }: any, i: number) => {
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
