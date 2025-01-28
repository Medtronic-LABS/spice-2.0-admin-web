import APPCONSTANTS, { NAMING_VARIABLES } from '../constants/appConstants';
import { IUserPayload } from '../store/user/types';

/**
 * Constructs a payload for health facility data.
 * This function formats the health facility object by extracting necessary fields
 * and organizing them into the structure expected by the API.
 *
 * @param {Object} hf - The health facility data object.
 * @param {number | string} countryId - The country ID associated with the health facility.
 *
 * @returns {Object} - The formatted health facility data payload.
 */
export const formatHealthFacility = (hf: any, countryId: number | string, appTypes: string[]) => {
  const postData = {
    id: hf.id,
    appTypes,
    name: hf.name.trim(),
    type: hf.type.name,
    phuFocalPersonName: hf.phuFocalPersonName,
    phuFocalPersonNumber: hf.phuFocalPersonNumber,
    address: hf.address,
    district: hf.district,
    chiefdom: hf.chiefdom,
    cityName: hf?.city?.name || null,
    latitude: hf.latitude,
    longitude: hf.longitude,
    postalCode: hf.postalCode,
    country: { id: countryId },
    language: hf.language.name,
    parentTenantId: hf.chiefdom?.tenantId,
    tenantId: hf.tenantId,
    linkedSupervisorIds: (hf.peerSupervisors || []).map(({ id }: { id: number }) => id),
    linkedVillageIds: (hf.linkedVillages || []).map(({ id }: { id: number }) => id),
    customizedWorkflowIds: hf.customizedWorkflows || [],
    clinicalWorkflowIds: hf.clinicalWorkflows
  };
  return postData;
};

/**
 * Generates a user payload from user form data.
 * @param {Object} params - The parameters for generating the payload
 * @param {any[]} params.userFormData - Array of user form data
 * @param {number | string} params.countryId - The country ID
 * @param {number | string} [params.tenantId] - The tenant ID
 * @param {boolean} [params.isHFCreate=false] - Flag indicating if it's a health facility creation
 * @param {Array<{ name: string; id: number }>} [params.spiceRolesGroup=[]] - Array of spice role groups
 */
export const getUserPayload = ({
  userFormData,
  countryId,
  tenantId,
  isHFCreate = false,
  spiceRolesGroup = [],
  appTypes
}: {
  appTypes: string[];
  userFormData: any[];
  countryId: number | string;
  tenantId?: number | string | undefined;
  isHFCreate?: boolean;
  spiceRolesGroup?: Array<{ name: string; id: number }>;
}) => {
  const payload = userFormData.map((user: any) => {
    let roleIds: number[] = (user.roles || []).map((role: any) => role.id);
    const isHFAdmin = user?.roles?.some((role: any) => role.name === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN);

    // add or remove redrisk roleId from roleIds array
    const redRiskData = spiceRolesGroup?.find(
      (roleData: { name: string }) => NAMING_VARIABLES.redRisk === roleData.name
    );
    if (redRiskData?.id) {
      roleIds =
        user?.redRisk && !isHFAdmin
          ? [...new Set([...roleIds, redRiskData?.id])]
          : roleIds?.filter((roleId: number) => roleId !== redRiskData?.id);
    }
    // for tenantId
    let payloadTenantId = Number(user?.tenantId || tenantId); // By default add user tenantId or tenentId from URL
    if (user?.tenantId) {
      // if user has it's own tenantId(while edit) then send that tenantId
      payloadTenantId = Number(user.tenantId);
    }
    if (user?.healthfacility?.tenantId) {
      // if hf admin create or user create then send assigned hf tenantId
      payloadTenantId = Number(user.healthfacility.tenantId);
    }
    if (tenantId) {
      // send URL tenantId from summary page
      payloadTenantId = Number(tenantId);
    }
    const userPayload: IUserPayload = {
      appTypes,
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      gender: user.gender,
      username: user.username,
      phoneNumber: user.phoneNumber,
      culture: user?.culture || null,
      countryCode: user?.countryCode?.phoneNumberCode || null,
      country: { id: Number(countryId) },
      tenantId: payloadTenantId,
      supervisorId: Number(user.supervisor?.id) || null,
      roleIds: [...new Set(roleIds)],
      villageIds: (Array.isArray(user?.villages) ? user.villages : []).map(({ id }: { id: number }) => id),
      village: user?.village,
      timezone: user?.timezone?.id ? user?.timezone : null,
      district: user?.district,
      chiefdom: user?.chiefdom,
      designation: user?.designation?.id ? { name: user?.designation?.name, id: user?.designation?.id } : null,
      reportUserOrganizationIds: (Array.isArray(user?.reportUserOrganization) ? user.reportUserOrganization : []).map(
        ({ tenantId: hfTenantId }: { tenantId: number }) => hfTenantId
      ),
      insightUserOrganizationIds: (Array.isArray(user?.insightUserOrganization)
        ? user.insightUserOrganization
        : []
      ).map(({ tenantId: hfTenantId }: { tenantId: number }) => hfTenantId)
    };
    // add id for edit
    if (user?.id) {
      userPayload.id = Number(user.id);
    }
    // add redrisk if not hf admin
    if (!isHFAdmin) {
      userPayload.redRisk = user?.redRisk ?? null;
    }

    return userPayload;
  });
  return payload;
};

/**
 * Generates an admin payload from user form data.
 * @param {Object} params - The parameters for generating the payload
 * @param {any[]} params.userFormData - Array of user form data
 * @param {number | string} [params.countryId] - The country ID
 * @param {number | string} [params.tenantId] - The tenant ID
 * @param {boolean} [params.isFromList=false] - Flag indicating if the request is from a list
 * @param {boolean} [params.isFromSummaryOrProfilePage=false]
 * Flag indicating if the request is from a summary or profile page
 */
export const getAdminPayload = ({
  userFormData,
  countryId,
  tenantId,
  isFromList = false,
  isFromSummaryOrProfilePage = false,
  appTypes
}: {
  appTypes: string[];
  userFormData: any[];
  countryId?: number | string;
  tenantId?: number | string | undefined;
  isFromList?: boolean;
  isFromSummaryOrProfilePage?: boolean;
}) => {
  const payload = userFormData.map((user: any) => {
    const roleIds: number[] = (user.roles || []).map((role: any) => role.id);
    const userPayload: any = {
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      gender: user.gender,
      username: user.username,
      phoneNumber: user.phoneNumber,
      // for create region countryCode will be come as free text
      countryCode: user?.countryCode?.phoneNumberCode || user?.countryCode,
      roleIds: [...new Set(roleIds)],
      timezone: user?.timezone?.id ? user?.timezone : null,
      designation: user?.designation?.id ? { name: user?.designation?.name, id: user?.designation?.id } : null,
      reportUserOrganizationIds: (Array.isArray(user?.reportUserOrganization) ? user.reportUserOrganization : []).map(
        ({ tenantId: hfTenantId }: { tenantId: number }) => hfTenantId
      ),
      insightUserOrganizationIds: (Array.isArray(user?.insightUserOrganization)
        ? user.insightUserOrganization
        : []
      ).map(({ tenantId: hfTenantId }: { tenantId: number }) => hfTenantId)
    };

    const hasRole = (roleName: string) => user?.roles?.some((role: { name: string }) => role.name === roleName);

    const isSuperAdmin = hasRole(APPCONSTANTS.ROLES.SUPER_ADMIN);
    const isHFAdmin = hasRole(APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN);
    const isChiefdomAdmin = hasRole(APPCONSTANTS.ROLES.CHIEFDOM_ADMIN);
    const isDistrictAdmin = hasRole(APPCONSTANTS.ROLES.DISTRICT_ADMIN);
    const isRegionAdmin = hasRole(APPCONSTANTS.ROLES.REGION_ADMIN);

    // for tenantId
    let payloadTenantId = user.tenantId || Number(tenantId); // By default add user tenantId or tenentId from URL
    if (isSuperAdmin) {
      // if superadmin then send null
      payloadTenantId = null;
    } else if (user.tenantId) {
      // send existing tenantId while edit
      payloadTenantId = Number(user.tenantId);
    } else if (isRegionAdmin && tenantId) {
      // if region admin then send tenantId from URL
      payloadTenantId = Number(tenantId);
    } else if (isDistrictAdmin && user?.district?.tenantId) {
      // if district admin then send district tenantId
      payloadTenantId = Number(user.district.tenantId);
    } else if (isChiefdomAdmin && user?.chiefdom?.tenantId) {
      // if chiefdom admin then send chiefdom tenantId
      payloadTenantId = Number(user.chiefdom.tenantId);
    } else if (isHFAdmin && user?.healthfacility?.tenantId) {
      // if hf admin then send hf tenentId
      payloadTenantId = Number(user?.healthfacility?.tenantId);
    }
    if (payloadTenantId) {
      userPayload.tenantId = payloadTenantId;
    }
    // add district only for HF, chiefdom, district except from summary page
    if ((isHFAdmin || isChiefdomAdmin || isDistrictAdmin) && user?.district && !isFromSummaryOrProfilePage) {
      userPayload.district = user?.district;
    }
    // add chiefdom only for hf and chiefdom admins except from summary page
    if ((isHFAdmin || isChiefdomAdmin) && user?.chiefdom && !isFromSummaryOrProfilePage) {
      userPayload.chiefdom = user?.chiefdom;
    }
    // add id for edit
    if (user?.id) {
      userPayload.id = Number(user.id);
    }
    // add country if not superAdmin
    if (!isSuperAdmin && countryId) {
      userPayload.country = { id: Number(countryId) };
    }
    // add culture for hf admin
    if (isHFAdmin && user?.culture) {
      userPayload.culture = user?.culture || null;
    }
    return userPayload;
  });
  return payload;
};
