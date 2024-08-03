import { useMemo } from 'react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import styles from './SideMenu.module.scss';
import { roleSelector, userDataSelector } from '../../store/user/selectors';
import useRouteParams from '../../hooks/useRouteParams';

interface ISideMenuItem {
  label: string;
  route: string;
  disabled?: boolean;
  childRoutes?: string[];
  collapsible?: boolean;
}

interface ISideMenuProps {
  className?: string;
}

const superAdminRoutes: ISideMenuItem[] = [
  {
    label: 'Region',
    route: PROTECTED_ROUTES.region,
    disabled: false
  },
  {
    label: 'County',
    route: PROTECTED_ROUTES.accountByRegion,
    collapsible: true,
    disabled: false
  },
  {
    label: 'Medication Database',
    route: PROTECTED_ROUTES.medicationByRegion,
    disabled: true
  },
  {
    label: 'Lab Test Database',
    route: PROTECTED_ROUTES.labtestList,
    disabled: true
  },
  {
    label: 'Health Facility',
    route: PROTECTED_ROUTES.healthFacilityBySuperAdmin,
    disabled: true,
    childRoutes: [PROTECTED_ROUTES.healthFacilitySummary]
  },
  {
    label: 'Users',
    route: PROTECTED_ROUTES.usersBySuperAdmin,
    disabled: false
  },
  {
    label: 'Admins',
    route: PROTECTED_ROUTES.adminBySuperAdmin,
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
  const regionData = useSelector(userDataSelector).country;

  const { regionId, tenantId, healthFacilityId, hfTenantId } = useRouteParams({
    adminRoutes,
    superAdminRoutes,
    role,
    regionData
  });

  const sideMenu = useMemo(() => {
    let choosenRoutes: ISideMenuItem[] = [];
    const pathParams: Array<[string, string]> = [];
    const newMenu = [
      ...(role === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN ? [...adminRoutes] : [...superAdminRoutes])
    ].map((routes) => ({ ...routes, childRoutes: [...(routes.childRoutes || [])] }));
    choosenRoutes = newMenu;
    pathParams.push(
      [':regionId', regionId],
      [':healthFacilityId', healthFacilityId],
      [':tenantId', tenantId],
      [':hfTenantId', hfTenantId]
    );
    return choosenRoutes.map((menu: ISideMenuItem) => {
      menu = { ...menu };
      pathParams.forEach(([paramName, paramValue]) => {
        if (paramValue) {
          menu.route = menu.route.replace(paramName, paramValue);
          menu.childRoutes?.forEach((childRoute, i) => {
            if (menu.childRoutes?.length) {
              menu.childRoutes[i] = childRoute.replace(paramName, paramValue);
            }
          });
        }
      });
      return menu;
    });
  }, [role, regionId, healthFacilityId, tenantId, hfTenantId]);

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
