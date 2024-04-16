import { RouteComponentProps } from 'react-router';
import { Route, Switch, Redirect } from 'react-router-dom';

import { HOME_PAGE_BY_ROLE, PROTECTED_ROUTES, PUBLIC_ROUTES } from './constants/route';
import Login from './containers/authentication/Login';
import { AppLayout } from './components/appLayout/AppLayout';

import APPCONSTANTS from './constants/appConstants';
import { useSelector } from 'react-redux';
import { authTokenSelector, getIsLoggedInSelector, roleSelector, userDataSelector } from './store/user/selectors';
import Region from './containers/region/Region';
import ForgotPassword from './containers/authentication/ForgotPassword';
import ResetPassword from './containers/authentication/ResetPassword';
import HealthFacilityList from './containers/healthFacility/HealthFacilityList';
import HealthFacilitySummary from './containers/healthFacility/HealthFacilitySummary';
import CreateHealthFacility from './containers/healthFacility/CreateHealthFacility';
import UserList from './containers/user/UserList';
import MedicationList from './containers/medication/MedicationList';
import AddMedication from './containers/medication/AddMedication';
import MyProfile from './containers/myProfile/MyProfile';

interface IRoute {
  path: string;
  exact: boolean;
  component: React.FunctionComponent<any> | React.ComponentClass<any>;
}

interface IProtectedRoute extends IRoute {
  authorisedRoles?: string[];
}

export const { SUPER_USER, SUPER_ADMIN, SITE_ADMIN, PEER_SUPERVISOR } = APPCONSTANTS.ROLES;
export const SU_SA = [SUPER_ADMIN, SUPER_USER];
export const SU_SA_A_P = [...SU_SA, SITE_ADMIN, PEER_SUPERVISOR];
export const A_P = [SITE_ADMIN, PEER_SUPERVISOR];

const protectedRoutes: IProtectedRoute[] = (() => {
  return [
    {
      path: PROTECTED_ROUTES.region,
      exact: true,
      component: Region,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.healthFacilityBySuperAdmin,
      exact: true,
      component: HealthFacilityList,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.healthFacilitySummary,
      exact: true,
      component: HealthFacilitySummary,
      authorisedRoles: SU_SA_A_P
    },
    {
      path: PROTECTED_ROUTES.createHealthFacility,
      exact: true,
      component: CreateHealthFacility,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.healthFacilityByAdmin,
      exact: true,
      component: HealthFacilityList,
      authorisedRoles: A_P
    },
    {
      path: PROTECTED_ROUTES.usersBySuperAdmin,
      exact: true,
      component: UserList,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.usersByAdmin,
      exact: true,
      component: UserList,
      authorisedRoles: A_P
    },
    {
      path: PROTECTED_ROUTES.createMedication,
      exact: true,
      component: AddMedication,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.medicationByRegion,
      exact: false,
      component: MedicationList,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.profile,
      exact: true,
      component: MyProfile,
      authorisedRoles: SU_SA_A_P
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
  const token = useSelector(authTokenSelector);
  const role = useSelector(roleSelector);
  const data = useSelector(userDataSelector);
  const {
    country: { id: regionId, tenantId }
  } = data;

  return isLoggedIn && regionId && tenantId && !!token ? (
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
  ) : !isLoggedIn || !token ? (
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
  ) : null;
};
