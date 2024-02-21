import { RouteComponentProps } from 'react-router';
import { Route, Switch, Redirect } from 'react-router-dom';

import { HOME_PAGE_BY_ROLE, PROTECTED_ROUTES, PUBLIC_ROUTES } from './constants/route';
import Login from './containers/authentication/Login';
import { AppLayout } from './components/appLayout/AppLayout';

import APPCONSTANTS from './constants/appConstants';
import { useSelector } from 'react-redux';
import { getIsLoggedInSelector, roleSelector, userDataSelector } from './store/user/selectors';
import Region from './containers/region/Region';
import ForgotPassword from './containers/authentication/ForgotPassword';
import ResetPassword from './containers/authentication/ResetPassword';
import HealthFacilityList from './containers/healthFacility/HealthFacilityList';
import HealthFacilitySummary from './containers/healthFacility/HealthFacilitySummary';

interface IRoute {
  path: string;
  exact: boolean;
  component: React.FunctionComponent<any> | React.ComponentClass<any>;
}

interface IProtectedRoute extends IRoute {
  authorisedRoles?: string[];
}

export const { SUPER_USER, SUPER_ADMIN, SITE_ADMIN } = APPCONSTANTS.ROLES;
export const SU_SA = [SUPER_ADMIN, SUPER_USER];
export const SU_SA_A = [...SU_SA, SITE_ADMIN];

const protectedRoutes: IProtectedRoute[] = (() => {
  return [
    {
      path: PROTECTED_ROUTES.region,
      exact: true,
      component: Region,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.healthFacility,
      exact: true,
      component: HealthFacilityList,
      authorisedRoles: SU_SA_A
    },
    {
      path: PROTECTED_ROUTES.healthFacilitySummary,
      exact: true,
      component: HealthFacilitySummary,
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
    component: ForgotPassword
  },
  {
    path: PUBLIC_ROUTES.resetPassword,
    exact: true,
    component: ResetPassword
  }
];
export const AppRoutes = () => {
  const isLoggedIn = useSelector(getIsLoggedInSelector);
  const role = useSelector(roleSelector);
  const data = useSelector(userDataSelector);
  const {
    country: { id: regionId, tenantId }
  } = data;

  return !isLoggedIn ? (
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
  ) : isLoggedIn && regionId && tenantId ? (
    <AppLayout>
      <Switch>
        {protectedRoutes.map((route: IProtectedRoute, index: number) =>
          route.authorisedRoles?.includes(role) ? (
            <Route
              path={route.path}
              exact={route.exact}
              key={index}
              render={(routeProps: RouteComponentProps<any>) => (
                <route.component key={routeProps.location.key} {...routeProps} />
              )}
            />
          ) : null
        )}
        <Redirect
          exact={true}
          to={HOME_PAGE_BY_ROLE[role]
            .replace(':regionId', regionId?.toString())
            .replace(':tenantId', tenantId?.toString())}
        />
      </Switch>
    </AppLayout>
  ) : (
    <></>
  );
};
