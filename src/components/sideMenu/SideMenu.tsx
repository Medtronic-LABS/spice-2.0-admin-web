import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import { roleSelector } from '../../store/user/selectors';

import styles from './SideMenu.module.scss';

interface ISideMenuItem {
  label: string;
  route: string;
  disabled?: boolean;
}

interface ISideMenuProps {
  className?: string;
}

const superAdminRoutes: ISideMenuItem[] = [
  {
    label: 'Region',
    route: PROTECTED_ROUTES.home,
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
    disabled: false
  },
  {
    label: 'Health Facility',
    route: '',
    disabled: false
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
    route: ''
  },
  {
    label: 'Users',
    route: ''
  }
];

const SideMenu = ({ className }: ISideMenuProps) => {
  const { pathname } = useLocation();

  const role = useSelector(roleSelector);

  const { regionId, regionTenantId } = useMemo(() => {
    const matchedRoute = superAdminRoutes.find(({ route }) => matchPath(pathname, { path: route, exact: true }));
    if (matchedRoute) {
      const params = matchPath(pathname, { path: matchedRoute.route, exact: true })?.params as any;
      return { regionId: params?.regionId, regionTenantId: params?.tenantId };
    }
    return {};
  }, [pathname]);

  const sideMenu = useMemo(() => {
    let choosenRoutes: ISideMenuItem[] = [];
    const pathParams: Array<[string, string]> = [];
    if (regionId && regionTenantId) {
      choosenRoutes = [...(role === APPCONSTANTS.ROLES.ADMIN ? adminRoutes : superAdminRoutes)];
      pathParams.push([':regionId', regionId], [':tenantId', regionTenantId]);
    }
    return choosenRoutes.map((menu: ISideMenuItem) => {
      menu = { ...menu };
      pathParams.forEach(([paramName, paramValue]) => {
        menu.route = menu.route.replace(paramName, paramValue);
      });
      return menu;
    });
  }, [regionId, regionTenantId, role]);

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
