import { RouteComponentProps } from 'react-router';
import { Route, Switch, Redirect } from 'react-router-dom';

import { PROTECTED_ROUTES, PUBLIC_ROUTES } from './constants/route';
import Login from './containers/authentication/Login';
import { AppLayout } from './components/appLayout/AppLayout';

import APPCONSTANTS from './constants/appConstants';
import { useSelector } from 'react-redux';
import { getIsLoggedInSelector, roleSelector, userDataSelector } from './store/user/selectors';
import Region from './containers/region/Region';

interface IRoute {
  path: string;
  exact: boolean;
  component: React.FunctionComponent<any> | React.ComponentClass<any>;
}

interface IProtectedRoute extends IRoute {
  authorisedRoles?: string[];
}

export const { SUPER_USER, SUPER_ADMIN, ADMIN } = APPCONSTANTS.ROLES;
export const SU_SA = [SUPER_ADMIN, SUPER_USER];
export const SU_SA_A = [...SU_SA, ADMIN];
const protectedRoutes: IProtectedRoute[] = (() => {
  return [
    {
      path: PROTECTED_ROUTES.home,
      exact: true,
      component: Region,
      authorisedRoles: SU_SA_A
    }
  ];
})();

const publicRoutes = [
  {
    path: PUBLIC_ROUTES.login,
    exact: true,
    component: Login
  },
  {
    path: PUBLIC_ROUTES.forgotPassword,
    exact: true,
    component: (<></>) as unknown as React.FunctionComponent<any>
  },
  {
    path: PUBLIC_ROUTES.resetPassword,
    exact: true,
    component: (<></>) as unknown as React.FunctionComponent<any>
  },
  {
    path: PUBLIC_ROUTES.privacyPolicy,
    exact: true,
    component: (<></>) as unknown as React.FunctionComponent<any>
  }
];
export const AppRoutes = () => {
  const isLoggedIn = useSelector(getIsLoggedInSelector);
  const role = useSelector(roleSelector);
  const userData = useSelector(userDataSelector);
  const {
    country: { id: regionId, tenantId }
  } = userData;

  return isLoggedIn ? (
    <AppLayout>
      <Switch>
        {protectedRoutes.map((route: IProtectedRoute, index: number) => {
          return route.authorisedRoles?.includes(role) ? (
            <Route
              path={route.path}
              exact={route.exact}
              key={index}
              render={(routeProps: RouteComponentProps<any>) => (
                <route.component key={routeProps.location.key} {...routeProps} />
              )}
            />
          ) : null;
        })}
        <Redirect
          exact={true}
          to={PROTECTED_ROUTES.home
            .replace(':regionId', regionId?.toString())
            .replace(':tenantId', tenantId?.toString())}
        />
      </Switch>
    </AppLayout>
  ) : (
    <Switch>
      {publicRoutes.map((route: any, index: number) => (
        <Route
          path={route.path}
          exact={route.exact}
          key={index}
          render={(routeProps: RouteComponentProps<any>) => (
            <route.component key={routeProps.location.key} {...routeProps} />
          )}
        />
      ))}
      <Redirect exact={true} to={PUBLIC_ROUTES.login} />
    </Switch>
  );
};
