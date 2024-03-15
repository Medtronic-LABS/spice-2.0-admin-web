import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { matchPath, useLocation } from 'react-router-dom';
import { PROTECTED_ROUTES } from '../../constants/route';
import { roleSelector } from '../../store/user/selectors';
import { stopPropogation } from '../../utils/commonUtils';
import Breadcrumb from '../breadcrumb/Breadcrumb';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import SideMenu from '../sideMenu/SideMenu';
import styles from './AppLayout.module.scss';

interface IAppLayout {
  children: string | React.ReactElement | React.ReactElement[];
}

const routesWithSideMenu: any[] = [
  { route: PROTECTED_ROUTES.region },
  { route: PROTECTED_ROUTES.usersBySuperAdmin },
  { route: PROTECTED_ROUTES.healthFacilityBySuperAdmin, childRoutes: [PROTECTED_ROUTES.healthFacilitySummary] }
];

const routesWithoutBreadcrumb: any[] = [
  { route: PROTECTED_ROUTES.region },
  { route: PROTECTED_ROUTES.usersByAdmin },
  { route: PROTECTED_ROUTES.healthFacilityBySuperAdmin }
];

const header = (
  isBCDisabled: boolean,
  menuTogglable: boolean,
  sideMenuDisabled: boolean,
  styleVisible: any,
  setIsMenuVisible: any
) => {
  return (
    !isBCDisabled && (
      <header className={`${styles.header} mb-1dot375 d-flex align-items-center`}>
        {menuTogglable && !sideMenuDisabled && (
          <div
            className={`me-0dot5 ${styles.menuIcon} ${styleVisible}`}
            onClick={(e) => {
              stopPropogation(e);
              setIsMenuVisible((prevState: any) => !prevState);
            }}
          >
            <div />
            <div />
            <div />
          </div>
        )}
        <Breadcrumb />
      </header>
    )
  );
};

export const AppLayout = ({ children }: IAppLayout) => {
  const role = useSelector(roleSelector);
  const { pathname } = useLocation();
  const isSideMenuDisabled = useMemo(
    () =>
      !Boolean(
        routesWithSideMenu.find(
          ({ route, childRoutes, disabledRoles }) =>
            [...(childRoutes || []), route].some((newRoute) => matchPath(pathname, { path: newRoute, exact: true })) &&
            !disabledRoles?.includes(role)
        )
      ),
    [pathname, role]
  );

  const isBreadcrumbDisabled = useMemo(
    () => Boolean(routesWithoutBreadcrumb.find((route) => matchPath(pathname, { path: route, exact: true }))),
    [pathname]
  );

  const initializingApp = false;

  // menu toggling in low resolution device
  const menuEnabledResolution = 1100;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMenuTogglable, setIsMenuTogglable] = useState(window.innerWidth <= menuEnabledResolution);

  useEffect(() => {
    function onResize() {
      const nxtIsMenuTogglable = window.innerWidth <= 1100;
      if (isMenuTogglable !== nxtIsMenuTogglable) {
        setIsMenuTogglable(nxtIsMenuTogglable);
        setIsMenuVisible(false);
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMenuTogglable]);
  useEffect(() => {
    function closeMenuOnBlur() {
      setIsMenuVisible(false);
    }
    if (isMenuTogglable && isMenuVisible) {
      window.addEventListener('click', closeMenuOnBlur);
      return () => window.removeEventListener('click', closeMenuOnBlur);
    }
  }, [isMenuTogglable, isMenuVisible]);

  const pyChange = isBreadcrumbDisabled ? '' : 'py-1dot875';
  const pxForSideMenu = isSideMenuDisabled ? '' : 'px-3dot125';
  const isStyleVisible = isMenuVisible ? styles.visible : '';
  const isSideMenuWidth = isSideMenuDisabled ? 'w-100' : '';

  return (
    <div className={`position-relative ${pyChange} ${styles.layout} ${pxForSideMenu} d-flex justify-content-center`}>
      {!initializingApp && (
        <div className={`px-md-3 px-1  ${styles.contentCenter}`}>
          {header(isBreadcrumbDisabled, isMenuTogglable, isSideMenuDisabled, isStyleVisible, setIsMenuVisible)}
          <div className={`row gx-1dot25 ${styles.body}`}>
            {!isSideMenuDisabled && (
              <div className={`col-auto ${styles.sidemenu} ${isMenuTogglable && styles.togglable} ${isStyleVisible}`}>
                <SideMenu className={styles.customSidemenuClass} />
              </div>
            )}
            <div className={`col ${isSideMenuWidth}`}>
              <ErrorBoundary pathname={pathname}>{children}</ErrorBoundary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
