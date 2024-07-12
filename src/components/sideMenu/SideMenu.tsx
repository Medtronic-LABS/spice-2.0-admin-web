import { useMemo } from 'react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import { PROTECTED_ROUTES } from '../../constants/route';

import styles from './SideMenu.module.scss';
import { useSelector } from 'react-redux';
import { roleSelector, userDataSelector } from '../../store/user/selectors';
import APPCONSTANTS from '../../constants/appConstants';
import useRouteParams from '../../hooks/useRouteParams';

interface ISideMenuItem {
  label: string;
  route: string;
  disabled?: boolean;
  childRoutes?: string[];
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
    label: 'Medication Database',
    route: PROTECTED_ROUTES.medicationByRegion,
    disabled: false
  },
  {
    label: 'Lab Test Database',
    route: PROTECTED_ROUTES.labtestList,
    disabled: false
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

const SideMenu = ({ className }: ISideMenuProps) => {
  const { pathname } = useLocation();
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
    <div className={`${styles.sideMenu} py-0dot25 ${className}`}>
      {sideMenu.map(({ label, route, disabled, childRoutes }: any, i: number) => {
        let isActive = false;
        const params = matchPath(pathname, { path: route, exact: true }) as any;
        let childParams: any[] = [];
        if (!params) {
          childParams = (childRoutes || [])
            ?.map((childRoute: any) => matchPath(pathname, { path: childRoute, exact: true })?.params as any)
            .filter((param: any) => param);
          isActive = !!childParams.length;
        } else {
          isActive = !!params;
        }
        return (
          <NavLink
            to={route}
            key={`label_${i}`}
            className={`d-block lh-1dot375 py-0dot625 ps-1 pe-1dot25 my-0dot25 pointer ${styles.menuItem} ${
              isActive ? styles.selected : ''
            } ${disabled ? 'no-pointer-events' : ''}`}
          >
            {label}
          </NavLink>
        );
      })}
    </div>
  );
};

export default SideMenu;
