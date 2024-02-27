import { useMemo } from 'react';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import { PROTECTED_ROUTES } from '../../constants/route';

import styles from './SideMenu.module.scss';
import { useSelector } from 'react-redux';
import { roleSelector } from '../../store/user/selectors';
import APPCONSTANTS from '../../constants/appConstants';

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
    label: 'Health Facility Workflows',
    route: '',
    disabled: false
  },
  {
    label: 'Medication Database',
    route: '',
    disabled: false
  },
  {
    label: 'Lab Test Database',
    route: '',
    disabled: true
  },
  {
    label: 'Health Facility',
    route: PROTECTED_ROUTES.healthFacilityBySuperAdmin,
    disabled: false,
    childRoutes: [PROTECTED_ROUTES.healthFacilitySummary]
  },
  {
    label: 'Users',
    route: '',
    disabled: false
  }
];
const adminRoutes: ISideMenuItem[] = [
  {
    label: 'Health Facility',
    route: PROTECTED_ROUTES.healthFacilityByAdmin
  },
  {
    label: 'Users',
    route: ''
  }
];

const SideMenu = ({ className }: ISideMenuProps) => {
  const { pathname } = useLocation();
  const role = useSelector(roleSelector);

  const { regionId, regionTenantId, healthFacilityId } = useMemo(() => {
    const matchedRoute = (role === APPCONSTANTS.ROLES.SITE_ADMIN ? adminRoutes : superAdminRoutes).find(
      ({ route, childRoutes }) => {
        return [...(childRoutes || []), route].some((newRoute) => matchPath(pathname, { path: newRoute, exact: true }));
      }
    );
    if (matchedRoute) {
      const params = matchPath(pathname, { path: matchedRoute.route, exact: true })?.params as any;
      return {
        regionId: params?.regionId,
        regionTenantId: params?.tenantId,
        healthFacilityId: params?.healthFacilityId
      };
    }
    return {};
  }, [pathname, role]);

  const sideMenu = useMemo(() => {
    let choosenRoutes: ISideMenuItem[] = [];
    const pathParams: Array<[string, string]> = [];
    if (regionId || healthFacilityId) {
      choosenRoutes = [...(role === 'SITE_ADMIN' ? adminRoutes : superAdminRoutes)];
      pathParams.push([':regionId', regionId], [':healthFacilityId', healthFacilityId], [':tenantId', regionTenantId]);
    }
    return choosenRoutes.map((menu: ISideMenuItem) => {
      menu = { ...menu };
      pathParams.forEach(([paramName, paramValue]) => {
        menu.route = menu.route.replace(paramName, paramValue);
      });
      return menu;
    });
  }, [healthFacilityId, regionId, regionTenantId, role]);

  return (
    <div className={`${styles.sideMenu} py-0dot25 ${className}`}>
      {sideMenu.map(({ label, route, disabled }: any, i: number) => {
        const isActive = matchPath(pathname, { exact: true, path: route });
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
