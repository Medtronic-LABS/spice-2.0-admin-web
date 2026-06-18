import { lazy, Suspense, useEffect, useRef, type ComponentType, type LazyExoticComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { PROTECTED_ROUTES, PUBLIC_ROUTES } from './constants/route';
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
import Loader from './components/loader/Loader';
import { goToUrl } from './utils/routeUtil';
import { useRouteComponentProps } from './utils/routerCompat';

type RouteComponent = ComponentType<any> | LazyExoticComponent<ComponentType<any>>;

const lazyRoute = (loadComponent: () => Promise<{ default: ComponentType<any> }>): LazyExoticComponent<ComponentType<any>> =>
  lazy(loadComponent);

const Login = lazyRoute(() => import('./containers/authentication/Login'));
const Region = lazyRoute(() => import('./containers/region/Region'));
const RegionDashboard = lazyRoute(() => import('./containers/region/RegionDashboard'));
const CreateRegion = lazyRoute(() => import('./containers/createRegion/CreateRegion'));
const ForgotPassword = lazyRoute(() => import('./containers/authentication/ForgotPassword'));
const ResetPassword = lazyRoute(() => import('./containers/authentication/ResetPassword'));
const HealthFacilityList = lazyRoute(() => import('./containers/healthFacility/HealthFacilityList'));
const HealthFacilitySummary = lazyRoute(() => import('./containers/healthFacility/HealthFacilitySummary'));
const CreateHealthFacility = lazyRoute(() => import('./containers/createHealthFacility/CreateHealthFacility'));
const MedicationList = lazyRoute(() => import('./containers/medication/MedicationList'));
const AddMedication = lazyRoute(() => import('./containers/medication/AddMedication'));
const MyProfile = lazyRoute(() => import('./containers/myProfile/MyProfile'));
const LabTestList = lazyRoute(() => import('./containers/labtest/LabtestList'));
const LabTestCustomizationLayout = lazyRoute(() => import('./containers/labtest/LabTestCustomizationLayout'));
const LandingPage = lazyRoute(() => import('./containers/landingPage/LandingPage'));
const DeactivatedRecords = lazyRoute(() => import('./containers/deactivatedRecords/DeactivatedRecords'));
const DistrictList = lazyRoute(() => import('./containers/district/DistrictList'));
const CreateDistrict = lazyRoute(() => import('./containers/createDistrict/CreateDistrict'));
const DistrictSummary = lazyRoute(() => import('./containers/district/DistrictSummary'));
const DistrictDashboard = lazyRoute(() => import('./containers/district/DistrictDashboard'));
const LockedUsers = lazyRoute(() => import('./containers/lockedUsers/LockedUsers'));
const UserList = lazyRoute(() => import('./containers/user/UserList'));
const Admins = lazyRoute(() => import('./containers/admins/AdminList'));
const ChiefdomDashboard = lazyRoute(() => import('./containers/chiefdom/ChiefdomDashboard'));
const CreateChiefdom = lazyRoute(() => import('./containers/createChiefdom/CreateChiefdom'));
const ChiefdomList = lazyRoute(() => import('./containers/chiefdom/ChiefdomList'));
const ChiefdomSummary = lazyRoute(() => import('./containers/chiefdom/ChiefdomSummary'));
const RegionCustomization = lazyRoute(() => import('./containers/region/RegionCustomization'));
const RegionFormCustomization = lazyRoute(() => import('./containers/region/RegionFormCustomization'));
const ProgramList = lazyRoute(() => import('./containers/program/ProgramList'));
const ProgramForm = lazyRoute(() => import('./containers/program/CreateProgram'));
const WorkflowCustomization = lazyRoute(() => import('./containers/workflow/WorkflowCustomization'));
const WorkflowFormCustomization = lazyRoute(() => import('./containers/workflow/WorkflowFormCustomization'));
const HealthFacilityDashboard = lazyRoute(() => import('./containers/healthFacility/HealthFacilityDashboard'));
const PrivacyPolicy = lazyRoute(() => import('./containers/privacyPolicy/PrivacyPolicy'));
const BranchList = lazyRoute(() => import('./containers/branch/BranchList'));
const BranchSummary = lazyRoute(() => import('./containers/branch/BranchSummary'));
interface IRoute {
  path: string;
  exact: boolean;
  component: RouteComponent;
}

interface IProtectedRoute extends IRoute {
  authorisedRoles?: string[];
}

const RouteElement = ({ route }: { route: IRoute }) => {
  const routeProps = useRouteComponentProps(route.path, route.exact);

  return <route.component key={routeProps.location.key} {...routeProps} />;
};

export const { SUPER_USER, SUPER_ADMIN, HEALTH_FACILITY_ADMIN, REGION_ADMIN, DISTRICT_ADMIN, CHIEFDOM_ADMIN, AREA_MANAGER, DIVISIONAL_MANAGER, HO } =
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
export const AM_DM_HO = [AREA_MANAGER, DIVISIONAL_MANAGER, HO];
export const SU_SA_AM_DM_HO = [...SU_SA, ...AM_DM_HO];
export const SU_SA_RA_AM_DM_HO = [...SU_SA_RA, ...AM_DM_HO];
export const SU_SA_RA_DA_CDA_HFA_AM_DM_HO = [...SU_SA_RA_DA_CDA_HFA, ...AM_DM_HO];

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
      authorisedRoles: SU_SA_AM_DM_HO
    },
    {
      path: PROTECTED_ROUTES.region,
      exact: true,
      component: Region,
      authorisedRoles: SU_SA_RA_AM_DM_HO
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
      authorisedRoles: SU_SA_RA_DA_CDA_HFA_AM_DM_HO
    },
    {
      path: PROTECTED_ROUTES.healthFacilityByRegion,
      exact: true,
      component: HealthFacilityList,
      authorisedRoles: SU_SA_AM_DM_HO
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
      authorisedRoles: SU_SA_AM_DM_HO
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
      authorisedRoles: SU_SA_AM_DM_HO
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
    },
    {
      path: PROTECTED_ROUTES.branchByRegion,
      exact: true,
      component: BranchList,
      authorisedRoles: SU_SA_RA
    },
    {
      path: PROTECTED_ROUTES.branchSummary,
      exact: true,
      component: BranchSummary,
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
      <Suspense fallback={<Loader />}>
        <Routes>
          {protectedRoutes.map((route: IProtectedRoute, index: number) =>
            route.authorisedRoles?.includes(role) || route.path === PROTECTED_ROUTES.landingPage ? (
              <Route path={route.path} key={index} element={<RouteElement route={route} />} />
            ) : null
          )}
          <Route path='*' element={<Navigate replace={true} to={PROTECTED_ROUTES.landingPage} />} />
        </Routes>
      </Suspense>
    </AppLayout>
  ) : (
    <Suspense fallback={<Loader />}>
      <Routes>
        {publicRoutes.map((route: any, index: number) => (
          <Route path={route.path} key={index} element={<RouteElement route={route} />} />
        ))}
        <Route path='*' element={<Navigate replace={true} to={PUBLIC_ROUTES.login} />} />
      </Routes>
    </Suspense>
  );
};
