import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import sessionStorageServices from '../../global/sessionStorageServices';
// import { roleSelector } from '../../store/user/selectors';

import styles from './SideMenu.module.scss';

interface ISideMenuItem {
  label: string;
  route: string;
  collapsible?: boolean;
}

interface ISideMenuProps {
  className?: string;
}

const regionRoutes: any[] = [];

const SideMenu = ({ className }: ISideMenuProps) => {
  const { pathname } = useLocation();

  const role = 'SUPER_ADMIN';

  // sidemenu collapse state handling
  const [isCollapsed, setIsCollapsed] = useState(
    sessionStorageServices.getItem(APPCONSTANTS.IS_SIDEMENU_COLLAPSED) !== 'false'
  );
  useEffect(() => {
    sessionStorageServices.setItem(APPCONSTANTS.IS_SIDEMENU_COLLAPSED, isCollapsed);
  }, [isCollapsed]);

  const { regionId, regionTenantId } = useMemo(() => {
    const matchedRoute = regionRoutes.find(({ route }) => matchPath(pathname, { path: route, exact: true }));
    if (matchedRoute) {
      const params = matchPath(pathname, { path: matchedRoute.route, exact: true })?.params as any;
      return { regionId: params?.regionId, regionTenantId: params?.tenantId };
    }
    return {};
  }, [pathname]);

  const [collapsibleMenus, nonCollapsibleMenus] = useMemo(() => {
    const collapsibleItems: ISideMenuItem[] = [];
    const nonCollapsibleItems: ISideMenuItem[] = [];
    let choosenRoutes: ISideMenuItem[] = [];
    const pathParams: Array<[string, string]> = [];
    if (regionId && regionTenantId) {
      choosenRoutes = [
        ...(role === APPCONSTANTS.ROLES.ADMIN
          ? regionRoutes.filter((route) => route.type === 'regionAdmin')
          : regionRoutes)
      ];
      pathParams.push([':regionId', regionId], [':tenantId', regionTenantId]);
    }
    choosenRoutes.forEach((menu: ISideMenuItem) => {
      menu = { ...menu };
      pathParams.forEach(([paramName, paramValue]) => {
        menu.route = menu.route.replace(paramName, paramValue);
      });
      if (menu.collapsible) {
        collapsibleItems.push(menu);
      } else {
        nonCollapsibleItems.push(menu);
      }
    });
    return [collapsibleItems, nonCollapsibleItems];
  }, [regionId, regionTenantId, role]);

  return (
    <div className={`${styles.sideMenu} py-0dot25 ${className}`}>
      {nonCollapsibleMenus.map(({ label, route, disabled }: any, i: number) => {
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
      {!isCollapsed &&
        collapsibleMenus.map(({ label, route, disabled }: any, i: number) => {
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
      {!!collapsibleMenus.length && (
        <div
          className={`d-block lh-1dot375 py-0dot625 ps-1 pe-1dot25 my-0dot25 pointer ${styles.menuItem} ${styles.showMore}`}
          onClick={(e) => {
            e.stopPropagation(); // to prevent menu closing in low resolution devices
            setIsCollapsed((prev) => !prev);
          }}
        >
          {isCollapsed ? 'Show More' : 'Show Less'}
        </div>
      )}
    </div>
  );
};

export default SideMenu;
