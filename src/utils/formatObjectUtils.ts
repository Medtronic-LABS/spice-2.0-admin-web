import { IUserFormValues } from '../components/userForm/UserForm';
import APPCONSTANTS, { NAMING_VARIABLES } from '../constants/appConstants';
import { IAdminEditFormValues } from '../containers/chiefdom/ChiefdomSummary';
import { IBranch, ICreateBranchRequestPayload, IUpdateBranchRequestPayload } from '../store/branch/types';
import { IHFUserGet, IHFUserPost } from '../store/healthFacility/types';
import { IEditUserDetail, IUserPayload } from '../store/user/types';

export type UserFormDataItem = IHFUserGet | IHFUserPost;
export type AdminFormDataItem = IHFUserGet | IAdminEditFormValues | IUserFormValues | IEditUserDetail;
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
 * @param {IHFUserGet[]} params.userFormData - Array of user form data
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
  userFormData: UserFormDataItem[];
  countryId: number | string;
  tenantId?: number | string;
  isHFCreate?: boolean;
  spiceRolesGroup?: Array<{ name: string; id: number }>;
}) => {

  const resolveTenantId = (user: any): number | undefined => {
    if (tenantId) return Number(tenantId);
    if (user?.healthfacility?.tenantId) return Number(user.healthfacility.tenantId);
    if (user?.tenantId) return Number(user.tenantId);
    return undefined;
  };

  const adjustRoleIds = (user: any, roleIds: number[], isHFAdmin: boolean) => {
    const redRiskData = (spiceRolesGroup ?? []).find(
      roleData => roleData.name === NAMING_VARIABLES.redRisk
    );

    if (!redRiskData?.id) return roleIds;

    if (user?.redRisk && !isHFAdmin) {
      return [...new Set([...roleIds, redRiskData.id])];
    }

    return roleIds.filter(id => id !== redRiskData.id);
  };

  return userFormData.map((user: any) => {
    const isHFAdmin = user?.roles?.some(
      (role: any) => role.name === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN
    );

    const isSpiceExists = user?.roles?.some(
      (role: any) => role.groupName === APPCONSTANTS.spiceRoleGrouped.spice
    );

    let roleIds: number[] = (user.roles || []).map(
      (role: { id: number }) => role.id
    );
    roleIds = adjustRoleIds(user, roleIds, isHFAdmin);
    const branches = user?.branches ? (Array.isArray(user.branches) ? user.branches : [user.branches]) : [];
    
    const userPayload: IUserPayload = {
      appTypes,
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      gender: user.gender,
      username: user.username,
      phoneNumber: user.phoneNumber,
      email: user.email,
      culture: user?.culture || null,
      countryCode: user?.countryCode?.phoneNumberCode || null,
      country: { id: Number(countryId) },
      tenantId: isSpiceExists ? resolveTenantId(user) : undefined,
      supervisorId: Number(user.supervisor?.id) || null,
      roleIds: [...new Set(roleIds)],
      branches: branches
        .filter((b: IBranch) => b && typeof b.id === 'number')
        .map((b: IBranch) => b.id),
      villageIds: [
        ...(Array.isArray(user?.villages) ? user.villages : []),
        ...(Array.isArray(user?.existingVillages) ? user.existingVillages : [])
      ]
        .filter((v): v is { id: number } => v && typeof v.id === 'number')
        .map(v => v.id),
      village: user?.village,
      timezone: user?.timezone?.id ? user.timezone : null,
      district: user?.district,
      chiefdom: user?.chiefdom,
      designation: user?.designation?.id
        ? { name: user.designation.name, id: user.designation.id }
        : null,
      reportUserOrganizationIds: (Array.isArray(user?.reportUserOrganization)
        ? user.reportUserOrganization
        : []
      ).map(({ tenantId }: { tenantId: number }) => tenantId),
      insightUserOrganizationIds: (Array.isArray(user?.insightUserOrganization)
        ? user.insightUserOrganization
        : []
      ).map(({ tenantId }: { tenantId: number }) => tenantId)
    };

    if (user?.id) {
      userPayload.id = Number(user.id);
    }

    if (!isHFAdmin) {
      userPayload.redRisk = user?.redRisk ?? null;
    }

    return userPayload;
  });
};

/**
 * Generates an admin payload from user form data.
 * @param {Object} params - The parameters for generating the payload
 * @param {IHFUserGet[]} params.userFormData - Array of user form data
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
  userFormData: AdminFormDataItem[];
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
      email: user.email.trim(),
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

    const isSpiceExists = user?.roles?.some(
      (role: { groupName: string }) => role.groupName === APPCONSTANTS.spiceRoleGrouped.spice
    );
    // if spice doesn't exists in user, then remove tenantId
    if (!isSpiceExists) {
      userPayload.tenantId = undefined;
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

/**
 * SS user item as received from API/form (with nested ssId and subVillage objects).
 */
export interface ISSUserInputItem {
  ssId?: { id?: number; name?: string; [key: string]: any };
  name?: string;
  phoneNumber?: string;
  subVillages?: Array<{ id?: number; [key: string]: any }>;
}

/**
 * SS user payload item as required by API (flat ssId string and subVillageIds string array).
 */
export interface ISSUserPayloadItem {
  name: string;
  phoneNumber: string;
  ssId: string;
  subVillageIds: string[];
}

/**
 * Transforms an array of SS users from API/form shape to the payload shape.
 * Maps ssId -> ssId.name and subVillage -> subVillage[].id as strings.
 *
 * @param ssUsers - Array of SS user objects with nested ssId and subVillage
 * @returns Array of payload objects with name, phoneNumber, ssId (string), subVillageIds (string[])
 */
export const getSSUsersPayload = (ssUsers: ISSUserInputItem[]): ISSUserPayloadItem[] => {
  if (!Array.isArray(ssUsers)) {
    return [];
  }
  return ssUsers.map((item) => ({
    name: item.name ?? '',
    phoneNumber: item.phoneNumber ?? '',
    ssId: item.ssId?.name ?? '',
    subVillageIds: (item.subVillages ?? []).map((sv) => String(sv.id ?? ''))
  }));
};

const toPositionCount = (v: string | number | null | undefined): number | null => {
  if (v === '' || v == null) return null;
  const n = Number(typeof v === 'string' ? v.replaceAll(/\D/g, '') : v);
  return Number.isNaN(n) ? 0 : n;
};

export const mapBranchToCreatePayload = (branch: IBranch): ICreateBranchRequestPayload => ({
  name: branch.name,
  code: branch.code,
  currentAccountCode: branch.currentAccountCode,
  districtId: branch.district?.id ?? 0,
  chiefdomId: branch.chiefdom?.id ?? 0,
  skPositionCount: toPositionCount(branch.skPositionCount),
  ssPositionCount: toPositionCount(branch.ssPositionCount),
  poPositionCount: toPositionCount(branch.poPositionCount),
  foPositionCount: toPositionCount(branch.foPositionCount),
});

export const mapBranchToUpdatePayload = (branch: IBranch): IUpdateBranchRequestPayload => ({
  ...mapBranchToCreatePayload(branch),
  id: branch.id, // guaranteed for edit flow
});