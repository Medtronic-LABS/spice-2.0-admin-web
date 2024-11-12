import { useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { Route, Switch, Redirect } from 'react-router-dom';

import { PROTECTED_ROUTES, PUBLIC_ROUTES } from './constants/route';
import Login from './containers/authentication/Login';
import { AppLayout } from './components/appLayout/AppLayout';

import APPCONSTANTS from './constants/appConstants';
import { useSelector } from 'react-redux';
import {
  getIsLoggedInSelector,
  roleSelector,
  userDataSelector,
  initializingSelector,
  getIsLoggingInSelector,
  getIsLoggingOutSelector,
  loadingSelector
} from './store/user/selectors';
import Region from './containers/region/Region';
import RegionDashboard from './containers/region/RegionDashboard';
import CreateRegion from './containers/createRegion/CreateRegion';
import ForgotPassword from './containers/authentication/ForgotPassword';
import ResetPassword from './containers/authentication/ResetPassword';
import HealthFacilityList from './containers/healthFacility/HealthFacilityList';
import HealthFacilitySummary from './containers/healthFacility/HealthFacilitySummary';
import CreateHealthFacility from './containers/createHealthFacility/CreateHealthFacility';
import MedicationList from './containers/medication/MedicationList';
import AddMedication from './containers/medication/AddMedication';
import MyProfile from './containers/myProfile/MyProfile';
import LabTestList from './containers/labtest/LabtestList';
import LabTestCustomizationLayout from './containers/labtest/LabTestCustomizationLayout';
import LandingPage from './containers/landingPage/LandingPage';
import Loader from './components/loader/Loader';
import { goToUrl } from './utils/routeUtil';
import DeactivatedRecords from './containers/deactivatedRecords/DeactivatedRecords';
import DistrictList from './containers/district/DistrictList';
import CreateDistrict from './containers/createDistrict/CreateDistrict';
import DistrictSummary from './containers/district/DistrictSummary';
import DistrictDashboard from './containers/district/DistrictDashboard';
import LockedUsers from './containers/lockedUsers/LockedUsers';
import UserList from './containers/user/UserList';
import Admins from './containers/admins/AdminList';
import ChiefdomDashboard from './containers/chiefdom/ChiefdomDashboard';
import CreateChiefdom from './containers/createChiefdom/CreateChiefdom';
import ChiefdomList from './containers/chiefdom/ChiefdomList';
import ChiefdomSummary from './containers/chiefdom/ChiefdomSummary';
import RegionCustomization from './containers/region/RegionCustomization';
import RegionFormCustomization from './containers/region/RegionFormCustomization';
import ProgramList from './containers/program/ProgramList';
import ProgramForm from './containers/program/CreateProgram';
import WorkflowCustomization from './containers/workflow/WorkflowCustomization';
import WorkflowFormCustomization from './containers/workflow/WorkflowFormCustomization';
import HealthFacilityDashboard from './containers/healthFacility/HealthFacilityDashboard';
import PrivacyPolicy from './containers/privacyPolicy/PrivacyPolicy';
interface IRoute {
  path: string;
  exact: boolean;
  component: React.FunctionComponent<any> | React.ComponentClass<any>;
}

interface IProtectedRoute extends IRoute {
  authorisedRoles?: string[];
}

export const { SUPER_USER, SUPER_ADMIN, HEALTH_FACILITY_ADMIN, REGION_ADMIN, DISTRICT_ADMIN, CHIEFDOM_ADMIN } =
  APPCONSTANTS.ROLES;
export const { REPORT_ADMIN, SPICE_INSIGHTS_DEVELOPER, SPICE_INSIGHTS_USER, FACILITY_REPORT_ADMIN } =
  APPCONSTANTS.COMMUNITY_ROLES;
export const SU_SA = [SUPER_ADMIN, SUPER_USER];
export const SU_SA_RA = [...SU_SA, REGION_ADMIN];
export const SU_SA_RA_DA = [...SU_SA_RA, DISTRICT_ADMIN];
export const SU_SA_HFA = [...SU_SA, HEALTH_FACILITY_ADMIN];
export const SU_SA_RA_DA_CDA = [...SU_SA_RA_DA, CHIEFDOM_ADMIN];
export const CDA_HFA = [CHIEFDOM_ADMIN, HEALTH_FACILITY_ADMIN];
export const SU_SA_RA_DA_CDA_HFA = [...SU_SA_RA_DA_CDA, HEALTH_FACILITY_ADMIN];
export const A = [HEALTH_FACILITY_ADMIN];

const communityRoutes = [
  {
    path: PROTECTED_ROUTES.healthFacilityByAdmin,
    exact: true,
    component: HealthFacilityList,
    authorisedRoles: A
  },
  {
    path: PROTECTED_ROUTES.userByRegion,
    exact: true,
    component: UserList,
    authorisedRoles: SU_SA
  },
  {
    path: PROTECTED_ROUTES.userByHealthFacility,
    exact: true,
    component: UserList,
    authorisedRoles: A
  }
];

/**
 * Protected routes configuration.
 */
const protectedRoutes: IProtectedRoute[] = (() => {
  return [
    ...communityRoutes,
    {
      path: PROTECTED_ROUTES.landingPage,
      exact: true,
      component: LandingPage
    },
    {
      path: PROTECTED_ROUTES.profile,
      exact: true,
      component: MyProfile,
      authorisedRoles: Object.values(APPCONSTANTS.ROLES)
    },
    {
      path: PROTECTED_ROUTES.deactivatedRecords,
      exact: true,
      component: DeactivatedRecords,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.lockedUsers,
      exact: true,
      component: LockedUsers,
      authorisedRoles: Object.values(APPCONSTANTS.ROLES)
    },
    {
      path: PROTECTED_ROUTES.regionDashboard,
      exact: true,
      component: RegionDashboard,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.region,
      exact: true,
      component: Region,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.createRegion,
      exact: true,
      component: CreateRegion,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.districtDashboard,
      exact: true,
      component: DistrictDashboard,
      authorisedRoles: [REGION_ADMIN]
    },
    {
      path: PROTECTED_ROUTES.districtByRegion,
      exact: true,
      component: DistrictList,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.createDistrictByRegion,
      exact: true,
      component: CreateDistrict,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.districtSummary,
      exact: true,
      component: DistrictSummary,
      authorisedRoles: SU_SA_RA_DA
    },
    {
      path: PROTECTED_ROUTES.chiefdomDashboard,
      exact: true,
      component: ChiefdomDashboard,
      authorisedRoles: [DISTRICT_ADMIN]
    },
    {
      path: PROTECTED_ROUTES.chiefdomSummary,
      exact: true,
      component: ChiefdomSummary,
      authorisedRoles: SU_SA_RA_DA_CDA
    },
    {
      path: PROTECTED_ROUTES.chiefdomByRegion,
      exact: true,
      component: ChiefdomList,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.chiefdomByDistrict,
      exact: true,
      component: ChiefdomList,
      authorisedRoles: SU_SA_RA_DA
    },
    {
      path: PROTECTED_ROUTES.createChiefdomByRegion,
      exact: true,
      component: CreateChiefdom,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.createChiefdomByDistrict,
      exact: true,
      component: CreateChiefdom,
      authorisedRoles: SU_SA_RA_DA
    },
    {
      path: PROTECTED_ROUTES.healthFacilityDashboard,
      exact: true,
      component: HealthFacilityDashboard,
      authorisedRoles: CDA_HFA
    },
    {
      path: PROTECTED_ROUTES.createChiefdomByDistrict,
      exact: true,
      component: CreateChiefdom,
      authorisedRoles: SU_SA_RA_DA
    },
    {
      path: PROTECTED_ROUTES.healthFacilityDashboard,
      exact: true,
      component: HealthFacilityDashboard,
      authorisedRoles: CDA_HFA
    },
    {
      path: PROTECTED_ROUTES.healthFacilitySummary,
      exact: true,
      component: HealthFacilitySummary,
      authorisedRoles: SU_SA_RA_DA_CDA_HFA
    },
    {
      path: PROTECTED_ROUTES.healthFacilityByRegion,
      exact: true,
      component: HealthFacilityList,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.healthFacilityByDistrict,
      exact: true,
      component: HealthFacilityList,
      authorisedRoles: SU_SA_RA_DA
    },
    {
      path: PROTECTED_ROUTES.healthFacilityByChiefdom,
      exact: true,
      component: HealthFacilityList,
      authorisedRoles: SU_SA_RA_DA_CDA
    },
    {
      path: PROTECTED_ROUTES.createHealthFacilityByRegion,
      exact: true,
      component: CreateHealthFacility,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.createHealthFacilityByDistrict,
      exact: true,
      component: CreateHealthFacility,
      authorisedRoles: SU_SA_RA_DA
    },
    {
      path: PROTECTED_ROUTES.createHealthFacilityByChiefdom,
      exact: true,
      component: CreateHealthFacility,
      authorisedRoles: SU_SA_RA_DA_CDA
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
      path: PROTECTED_ROUTES.userByRegion,
      exact: true,
      component: UserList,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.userByDistrict,
      exact: true,
      component: UserList,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.userByChiefdom,
      exact: true,
      component: UserList,
      authorisedRoles: SU_SA_RA_DA
    },
    {
      path: PROTECTED_ROUTES.userByHealthFacility,
      exact: true,
      component: UserList,
      authorisedRoles: SU_SA_RA_DA_CDA_HFA
    },
    {
      path: PROTECTED_ROUTES.adminByRegion,
      exact: true,
      component: Admins,
      authorisedRoles: SU_SA
    },
    {
      path: PROTECTED_ROUTES.adminByDistrict,
      exact: true,
      component: Admins,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.adminByChiefdom,
      exact: true,
      component: Admins,
      authorisedRoles: SU_SA_RA_DA
    },
    {
      path: PROTECTED_ROUTES.adminByHealthFacility,
      exact: true,
      component: Admins,
      authorisedRoles: SU_SA_RA_DA_CDA
    },
    {
      path: PROTECTED_ROUTES.createMedication,
      exact: true,
      component: AddMedication,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.medicationByRegion,
      exact: false,
      component: MedicationList,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.labTestByRegion,
      exact: false,
      component: LabTestList,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.customizeLabTest,
      exact: true,
      component: LabTestCustomizationLayout,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.programByRegion,
      exact: true,
      component: ProgramList,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.createProgramByRegion,
      exact: true,
      component: ProgramForm,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.workflowByRegion,
      exact: true,
      component: WorkflowCustomization,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.workflowCustomization,
      exact: true,
      component: WorkflowFormCustomization,
      authorisedRoles: SU_SA_RA
    }
  ];
})();

/**
 * Public routes configuration.
 */
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
  },
  {
    path: PUBLIC_ROUTES.privacyPolicy,
    exact: true,
    component: PrivacyPolicy
  }
];
/**
 * AppRoutes component that handles routing for the application.
 */
export const AppRoutes = () => {
  const intializaing = useSelector(initializingSelector);
  const loggingIn = useSelector(getIsLoggingInSelector);
  const loggingOut = useSelector(getIsLoggingOutSelector);
  const loading = useSelector(loadingSelector);
  const isLoggedIn = useSelector(getIsLoggedInSelector);
  const role = useSelector(roleSelector);
  const data = useSelector(userDataSelector);

  const params = new URLSearchParams(document.location.search);
  const url = useRef(params.get('next') || '');

  /**
   * Redirects to the next URL if the user is logged in.
   */
  useEffect(() => {
    if (isLoggedIn && url.current) {
      goToUrl(url.current);
    }
  }, [data, isLoggedIn, url]);

  if ((isLoggedIn && url.current) || loggingIn || loggingOut || loading || intializaing) {
    return <Loader />;
  }

  return isLoggedIn ? (
    <AppLayout>
      <Switch>
        {protectedRoutes.map((route: IProtectedRoute, index: number) =>
          route.authorisedRoles?.includes(role) || route.path === PROTECTED_ROUTES.landingPage ? (
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
        <Redirect exact={true} to={PROTECTED_ROUTES.landingPage} />
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
