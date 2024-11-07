import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { matchPath, useLocation } from 'react-router-dom';
import { APP_TYPE_NAME } from '../../constants/appConstants';
import { PROTECTED_ROUTES, routesWithSideMenu } from '../../constants/route';
import localStorageService from '../../global/localStorageServices';
import { getAppTypeSelector, initializingSelector, roleSelector } from '../../store/user/selectors';
import { stopPropogation } from '../../utils/commonUtils';
import Breadcrumb from '../breadcrumb/Breadcrumb';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import SideMenu from '../sideMenu/SideMenu';
import styles from './AppLayout.module.scss';

interface IAppLayout {
  children: string | React.ReactElement | React.ReactElement[];
}

const routesWithoutBreadcrumb = [
  PROTECTED_ROUTES.regionDashboard,
  PROTECTED_ROUTES.districtDashboard,
  PROTECTED_ROUTES.chiefdomDashboard,
  PROTECTED_ROUTES.healthFacilityDashboard,
  PROTECTED_ROUTES.landingPage
];

/**
 * Renders the header component with breadcrumb and menu toggle.
 * @param {boolean} isBCDisabled - Whether the breadcrumb is disabled.
 * @param {boolean} menuTogglable - Whether the menu is togglable.
 * @param {boolean} sideMenuDisabled - Whether the side menu is disabled.
 * @param {string} styleVisible - CSS class for visibility.
 * @param {Function} setIsMenuVisible - Function to set menu visibility.
 */
const header = (
  isBCDisabled: boolean,
  menuTogglable: boolean,
  sideMenuDisabled: boolean,
  styleVisible: any,
  setIsMenuVisible: any,
  BreadcrumbFC: () => React.ReactElement<any>
) => {
  return !isBCDisabled ? (
    <header className={`${styles.header} mb-1dot375 d-flex align-items-center`}>
      {menuTogglable && !sideMenuDisabled && (
        <div
          data-testid='menu-icon'
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
      {BreadcrumbFC ? BreadcrumbFC() : <></>}
    </header>
  ) : (
    <></>
  );
};

/**
 * Main AppLayout component that wraps the application content.
 * @param {IAppLayout} props - The props for the AppLayout component.
 * @param {string | React.ReactElement | React.ReactElement[]} props.children - The child components to render.
 */
export const AppLayout = ({ children }: IAppLayout) => {
  const role = useSelector(roleSelector);
  const { pathname } = useLocation();
  /**
   * Determines if the side menu should be disabled based on the current route and user role.
   * @returns {boolean} True if the side menu should be disabled, false otherwise.
   */
  const appTypes = useSelector(getAppTypeSelector);
  const isSideMenuDisabled = useMemo(
    () =>
      !Boolean(
        routesWithSideMenu.find(
          ({ route, disabledRoles }: any) =>
            matchPath(pathname, { path: route, exact: true }) && !disabledRoles?.includes(role)
        )
      ),
    [pathname, role]
  );
  /**
   * Determines if the breadcrumb should be disabled based on the current route.
   * @returns {boolean} True if the breadcrumb should be disabled, false otherwise.
   */

  const isSideMenuDisabledForCommunity = useMemo(
    () =>
      !Boolean(
        routesWithSideMenu.find(
          ({ route, disabledRoles }) =>
            [route].filter((v) => v).some((newRoute) => matchPath(pathname, { path: newRoute, exact: true })) &&
            !disabledRoles?.includes(role)
        )
      ),
    [pathname, role]
  );

  const isBreadcrumbDisabled = useMemo(
    () => Boolean(routesWithoutBreadcrumb.find((route) => matchPath(pathname, { path: route, exact: true }))),
    [pathname]
  );

  const initializingApp = useSelector(initializingSelector);

  // menu toggling in low resolution device
  const menuEnabledResolution = 1100;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMenuTogglable, setIsMenuTogglable] = useState(window.innerWidth <= menuEnabledResolution);

  /**
   * Handles window resize events to toggle menu visibility.
   */
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
  /**
   * Closes the menu when clicking outside of it.
   */
  useEffect(() => {
    function closeMenuOnBlur() {
      setIsMenuVisible(false);
    }
    if (isMenuTogglable && isMenuVisible) {
      window.addEventListener('click', closeMenuOnBlur);
      return () => window.removeEventListener('click', closeMenuOnBlur);
    }
  }, [isMenuTogglable, isMenuVisible]);

  const sessionStoreEvent = useCallback(() => {
    localStorageService.setItem(APP_TYPE_NAME, `${JSON.stringify(appTypes)}`);
  }, [appTypes]);

  useEffect(() => {
    window.addEventListener('beforeunload', sessionStoreEvent);
    return () => {
      window.removeEventListener('beforeunload', sessionStoreEvent);
    };
  }, [sessionStoreEvent]);

  const pyChange = isBreadcrumbDisabled ? '' : 'py-1dot875';
  const pxForSideMenu = isSideMenuDisabled || isSideMenuDisabledForCommunity ? '' : 'px-3dot125';
  const isStyleVisible = isMenuVisible ? styles.visible : '';
  const isSideMenuWidth = isSideMenuDisabled ? 'w-100' : '';

  return (
    <div className={`position-relative ${pyChange} ${styles.layout} ${pxForSideMenu} d-flex justify-content-center`}>
      {!initializingApp && (
        <div className={`px-md-3 px-1  ${styles.contentCenter}`}>
          {header(isBreadcrumbDisabled, isMenuTogglable, isSideMenuDisabled, isStyleVisible, setIsMenuVisible, () => (
            <Breadcrumb />
          ))}
          <div className={`row gx-1dot25 ${styles.body}`}>
            {!isSideMenuDisabled && (
              <div
                data-testid='side-menu'
                className={`col-auto ${styles.sidemenu} ${isMenuTogglable && styles.togglable} ${isStyleVisible}`}
              >
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
