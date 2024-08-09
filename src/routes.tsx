import { RouteComponentProps } from 'react-router';
import { Route, Switch, Redirect } from 'react-router-dom';

import { HOME_PAGE_BY_ROLE, PROTECTED_ROUTES, PUBLIC_ROUTES } from './constants/route';
import Login from './containers/authentication/Login';
import { AppLayout } from './components/appLayout/AppLayout';

import APPCONSTANTS from './constants/appConstants';
import { useSelector } from 'react-redux';
import { authTokenSelector, getIsLoggedInSelector, roleSelector } from './store/user/selectors';
import Region from './containers/region/Region';
import RegionDashboard from './containers/region/RegionDashboard';
import Dashboard from './containers/dashboard/Dashboard';
import CreateRegion from './containers/createRegion/CreateRegion';
import ForgotPassword from './containers/authentication/ForgotPassword';
import ResetPassword from './containers/authentication/ResetPassword';
import HealthFacilityList from './containers/healthFacility/HealthFacilityList';
import HealthFacilitySummary from './containers/healthFacility/HealthFacilitySummary';
import CreateHealthFacility from './containers/healthFacility/CreateHealthFacility';
import MedicationList from './containers/medication/MedicationList';
import AddMedication from './containers/medication/AddMedication';
import MyProfile from './containers/myProfile/MyProfile';
import LabTestList from './containers/labtest/LabtestList';
import LabTestCustomizationLayout from './containers/labtest/LabTestCustomizationLayout';
import DeactivatedRecords from './containers/deactivatedRecords/DeactivatedRecords';
import CountyList from './containers/county/CountyList';
import CreateAccount from './containers/createCounty/CreateCounty';
import CountySummary from './containers/county/CountySummary';
import CountyDashboard from './containers/county/CountyDashboard';
import LockedUsers from './containers/lockedUsers/LockedUsers';
import UserList from './containers/user/UserList';
import Admins from './containers/admins/AdminList';
import SubCountyDashboard from './containers/subCounty/SubCountyDashboard';
import CreateSubCounty from './containers/createSubCounty/CreateSubCounty';
import SubCountyList from './containers/subCounty/SubCountyList';
import SubCountySummary from './containers/subCounty/SubCountySummary';
import RegionCustomization from './containers/region/RegionCustomization';
import RegionFormCustomization from './containers/region/RegionFormCustomization';
interface IRoute {
  path: string;
  exact: boolean;
  component: React.FunctionComponent<any> | React.ComponentClass<any>;
}

interface IProtectedRoute extends IRoute {
  authorisedRoles?: string[];
}

export const { SUPER_USER, SUPER_ADMIN, HEALTH_FACILITY_ADMIN, REGION_ADMIN, ACCOUNT_ADMIN, SUB_COUNTY_ADMIN } =
  APPCONSTANTS.ROLES;
export const SU_SA = [SUPER_ADMIN, SUPER_USER];
export const SU_SA_RA = [...SU_SA, REGION_ADMIN];
export const SU_SA_RA_AA = [...SU_SA_RA, ACCOUNT_ADMIN];
export const SU_SA_HFA = [...SU_SA, HEALTH_FACILITY_ADMIN];
export const SU_SA_RA_AA_OUA = [...SU_SA_RA_AA, SUB_COUNTY_ADMIN];
export const OUA_SIA = [SUB_COUNTY_ADMIN, HEALTH_FACILITY_ADMIN];
export const SU_SA_RA_AA_OUA_HFA = [...SU_SA_RA_AA_OUA, HEALTH_FACILITY_ADMIN];
export const HFA = [HEALTH_FACILITY_ADMIN];

const protectedRoutes: IProtectedRoute[] = (() => {
  return [
    {
      path: PROTECTED_ROUTES.dashboard,
      exact: true,
      component: Dashboard,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.regionDashboard,
      exact: true,
      component: RegionDashboard,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.CountyDashboard,
      exact: true,
      component: CountyDashboard,
      authorisedRoles: [REGION_ADMIN]
    },
    {
      path: PROTECTED_ROUTES.SubCountyDashboard,
      exact: true,
      component: SubCountyDashboard,
      authorisedRoles: [ACCOUNT_ADMIN]
    },
    {
      path: PROTECTED_ROUTES.region,
      exact: true,
      component: Region,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.createRegion,
      exact: true,
      component: CreateRegion,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.countyByRegion,
      exact: true,
      component: CountyList,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.createCountyByRegion,
      exact: true,
      component: CreateAccount,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.countySummary,
      exact: true,
      component: CountySummary,
      authorisedRoles: SU_SA_RA_AA
    },
    {
      path: PROTECTED_ROUTES.createSubCountyByRegion,
      exact: true,
      component: CreateSubCounty,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.hfByRegion,
      exact: true,
      component: HealthFacilityList,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.createSubCountyByCounty,
      exact: true,
      component: CreateSubCounty,
      authorisedRoles: SU_SA_RA_AA
    },
    {
      path: PROTECTED_ROUTES.subCountyByRegion,
      exact: true,
      component: SubCountyList,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.subCountyByCounty,
      exact: true,
      component: SubCountyList,
      authorisedRoles: SU_SA_RA_AA
    },
    {
      path: PROTECTED_ROUTES.subCountySummary,
      exact: true,
      component: SubCountySummary,
      authorisedRoles: SU_SA_RA_AA_OUA
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
      authorisedRoles: SU_SA_HFA
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
      authorisedRoles: HFA
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
      authorisedRoles: HFA
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
      path: PROTECTED_ROUTES.labtestList,
      exact: false,
      component: LabTestList,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.profile,
      exact: true,
      component: MyProfile,
      authorisedRoles: Object.values(APPCONSTANTS.ROLES)
    },
    {
      path: PROTECTED_ROUTES.customizeLabTest,
      exact: true,
      component: LabTestCustomizationLayout,
      authorisedRoles: SU_SA_HFA
    },
    {
      path: PROTECTED_ROUTES.deactivatedRecords,
      exact: true,
      component: DeactivatedRecords,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.accordianViewRegionCustomizationForm,
      exact: true,
      component: RegionFormCustomization,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.customizationByRegion,
      exact: true,
      component: RegionCustomization,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.lockedUsers,
      exact: true,
      component: LockedUsers,
      authorisedRoles: SU_SA_RA_AA_OUA_HFA
    },
    {
      path: PROTECTED_ROUTES.adminBySuperAdmin,
      exact: true,
      component: Admins,
      authorisedRoles: SU_SA_RA_AA_OUA_HFA
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

  return isLoggedIn && !!token ? (
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
        <Redirect exact={true} to={HOME_PAGE_BY_ROLE[role]} />
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
