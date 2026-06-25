import React, { type ComponentType, type ReactNode } from 'react';
import {
  Route as ReactRouterRoute,
  Routes,
  useLocation,
} from 'react-router-dom';

export { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';

import { matchPathCompat, useHistoryCompat } from '../utils/routerCompat';

interface LegacyRouteProps {
  path?: string;
  exact?: boolean;
  component?: ComponentType<any>;
  render?: (props: any) => ReactNode;
  children?: ReactNode | ((props: any) => ReactNode);
}

const getRoutePath = (path = '*', exact = false) => {
  if (exact || path === '*' || path.endsWith('*')) {
    return path;
  }

  if (path === '/') {
    return '/*';
  }

  return path.endsWith('/') ? `${path}*` : `${path}/*`;
};

const LegacyRouteElement = ({ path = '*', exact = false, component: Component, render, children }: LegacyRouteProps) => {
  const location = useLocation();
  const history = useHistoryCompat();
  const match =
    path === '*'
      ? {
          params: {},
          path,
          url: location.pathname,
          isExact: true,
        }
      : matchPathCompat(location.pathname, { path, exact });

  if (!match) {
    return null;
  }

  const routeProps = {
    history,
    location,
    match,
  };

  if (Component) {
    return <Component {...routeProps} />;
  }

  if (typeof render === 'function') {
    return <>{render(routeProps)}</>;
  }

  if (typeof children === 'function') {
    return <>{children(routeProps)}</>;
  }

  return <>{children}</>;
};

export const LegacyRoute = ({ path = '*', exact = false, component, render, children }: LegacyRouteProps) => (
  <Routes>
    <ReactRouterRoute
      path={getRoutePath(path, exact)}
      element={
        <LegacyRouteElement path={path} exact={exact} component={component} render={render}>
          {children}
        </LegacyRouteElement>
      }
    />
  </Routes>
);
