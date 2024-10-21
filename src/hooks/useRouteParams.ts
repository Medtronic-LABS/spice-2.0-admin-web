import { useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import APPCONSTANTS from '../constants/appConstants';

/**
 * Custom hook to extract route parameters from the current pathname.
 */
const useRouteParams = ({ adminRoutes, superAdminRoutes, role, regionData }: any) => {
  const { pathname } = useLocation();
  // Custom hook to extract route parameters from the current pathname.
  const { regionId, tenantId, healthFacilityId } = useMemo(() => {
    // Finds the matched route based on the user's role.
    const matchedRoute = (
      role === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN ? [...adminRoutes] : [...superAdminRoutes]
    ).find(({ route, childRoutes }) => {
      return [...(childRoutes || []), route]
        .filter((v) => v)
        .some((newRoute) => matchPath(pathname, { path: newRoute, exact: true }));
    });
    // Extracts the route parameters from the matched route.
    if (matchedRoute) {
      const params = matchPath(pathname, { path: matchedRoute.route, exact: true })?.params || {};
      let childParams = [];
      if (!params) {
        childParams =
          matchedRoute.childRoutes?.map(
            (childRoute: any) => matchPath(pathname, { path: childRoute, exact: true })?.params || {}
          ) || [];
      }
      // Combines the child and parent route parameters.
      const allParams = [...childParams, params].filter((param) => Object.keys(param).length > 0);

      return {
        regionId: allParams[0]?.regionId || regionData?.id,
        tenantId: allParams[0]?.tenantId || regionData?.tenantId,
        healthFacilityId: allParams[0]?.healthFacilityId
      };
    }

    return {};
  }, [pathname, regionData, role, adminRoutes, superAdminRoutes]);

  return { regionId, tenantId, healthFacilityId };
};

export default useRouteParams;
