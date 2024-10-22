import React from 'react';
import { saveAs } from 'file-saver';
import APPCONSTANTS, { NAMING_VARIABLES } from '../constants/appConstants';
import CryptoJS from 'crypto-js';
import { IHFUserGet, IUserRole } from '../store/healthFacility/types';
import { IRoles, IUserPayload } from '../store/user/types';

export const jsonParse = (value: any) => {
  if (value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};

/**
 * Generates an encryption key using PBKDF2.
 * @return {CryptoJS.lib.WordArray} The generated encryption key
 */
const getEncryptionKey = () => {
  return CryptoJS.PBKDF2(process.env.REACT_APP_CRYPTR_SECRET_KEY as string, APPCONSTANTS.ENCRYPTION.SALT, {
    keySize: APPCONSTANTS.ENCRYPTION.KEYLEN / 32,
    iterations: APPCONSTANTS.ENCRYPTION.ITERATION
  });
};

/**
 * Decrypts the given password.
 * @param {string} password - The encrypted password to decrypt
 * @return {string} The decrypted password
 */
export const decryptData = (password: string) => {
  const key = getEncryptionKey();
  const iv = CryptoJS.enc.Utf8.parse(APPCONSTANTS.ENCRYPTION.IV);
  return CryptoJS.AES.decrypt(password, CryptoJS.enc.Utf8.parse(key as any), { iv }).toString(CryptoJS.enc.Utf8);
};

/**
 * Encrypts the given value.
 * @param {string} value - The value to encrypt
 * @return {string} The encrypted value
 */
export const encryptData = (value: string) => {
  const key = getEncryptionKey();
  const iv = CryptoJS.enc.Utf8.parse(APPCONSTANTS.ENCRYPTION.IV);
  return CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(key as any), { iv }).toString();
};

/**
 * Appends zero before given number if number of digits is less than minimumIntegerDigits.
 * @param {number} num - The number to format
 * @param {number} minimumIntegerDigits - The minimum number of digits
 * @return {string} The formatted number as a string
 */
export const appendZeroBefore = (num: number, minimumIntegerDigits: number): string =>
  (Number(num) || 0).toLocaleString('en-US', {
    minimumIntegerDigits,
    useGrouping: false
  });

/**
 * Resets all the fields whose name contains given substring.
 * @param {[string]} [subStrOfKey] - Substring to match in field names
 * @param {any} state - The current state object
 * @param {any} utils - Utility object containing resetFieldState method
 */
export const resetFields = ([subStrOfKey]: [string], state: any, utils: any) => {
  try {
    Object.keys(state.fields).forEach((key: string) => {
      if (key.includes(subStrOfKey)) {
        utils.resetFieldState(key);
      }
    });
  } catch (e) {
    console.error('Error removing form', e);
  }
};

/**
 * A utility function to stop the event from propagating up the DOM.
 * @param {React.BaseSyntheticEvent} e - The event to stop
 */
export const stopPropogation = (e: React.BaseSyntheticEvent) => {
  try {
    e.stopPropagation();
  } catch (error) {
    console.error(error);
  }
};

/**
 * Initiates a file download.
 * @param {any} data - The file data
 * @param {string} fileName - The name of the file
 * @param {string} fileType - The MIME type of the file
 * @param {string} [fileExtension] - Optional file extension
 */
export const fileDownload = async (data: any, fileName: string, fileType: string, fileExtension?: string) => {
  const blob = new Blob([data], { type: fileType });
  return saveAs(blob, fileName + (fileExtension ? fileExtension : ''), { autoBom: false });
};

/**
 * Converts a date to YYYY-MM-DD format.
 * @param {Date | string} date - The date to convert
 */
export const convertDate = (date: Date | string) => {
  function pad(s: any) {
    return s < 10 ? '0' + s : s;
  }
  const d = new Date(date);
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
};

/**
 * Formats a date string according to the specified format.
 * @param {string} date - The date string to format
 * @param {string} [format='YYY-MM-DD'] - The desired output format
 */
export const formatDate = (date: string, format: string = 'YYY-MM-DD') => {
  const dateArray = date.split(/\D/);
  let d = '';
  let m = '';
  let y = '';
  dateArray.forEach((part: string) => {
    if (part.length === 4) {
      y = part;
    } else if (part.length === 2 && Number(part) <= 12) {
      m = part;
    } else if (part.length === 2 && Number(part) > 12) {
      d = part;
    }
  });
  return format.replace('YYYY', y).replace('MM', m).replace('DD', d);
};

/**
 * Formats a country code by adding a '+' prefix.
 * @param {string} value - The country code to format
 */
export const formatCountryCode = (value: string) => (value ? `+${value}` : '');

/**
 * Formats a message by replacing occurrences of a specified text with a replacement text.
 *
 * @param {string} msg - The message to be formatted.
 * @param {string} replacementText - The text to replace the specified text with.
 * @param {string} [textToReplace='Module_Name'] - The text to be replaced in the message.
 * @returns {string} - The formatted message with the replacements applied.
 */
export const formatUserToastMsg = (
  msg: string,
  replacementText: string,
  textToReplace: string = 'Module_Name'
): string => {
  const replacements = [
    { regex: new RegExp(textToReplace, 'g'), replacement: replacementText }, // exact match
    { regex: new RegExp(textToReplace.toLowerCase(), 'g'), replacement: replacementText.toLowerCase() }, // lower case
    {
      regex: new RegExp(textToReplace.charAt(0).toUpperCase() + textToReplace.slice(1).toLowerCase(), 'g'),
      replacement: replacementText.charAt(0).toUpperCase() + replacementText.slice(1).toLowerCase()
    }, // capitalized
    { regex: new RegExp(textToReplace.toUpperCase(), 'g'), replacement: replacementText.toUpperCase() } // upper case
  ];
  replacements.forEach(({ regex, replacement }) => {
    msg = msg?.replace(regex, replacement);
  });
  return msg;
};

/**
 * Formats the roles of a user into a comma-separated string.
 * @param {IHFUserGet} user - The user object containing roles
 */
export const formatRoles = (user: IHFUserGet) => {
  return `${(user.roles || [])
    ?.filter((filteredUserRole: IUserRole) => filteredUserRole.name !== NAMING_VARIABLES.redRisk)
    ?.map((userRole: IUserRole) => userRole.displayName)
    .join(',')}`;
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
  isFromSummaryOrProfilePage = false
}: {
  userFormData: any[];
  countryId?: number | string;
  tenantId?: number | string | undefined;
  isFromList?: boolean;
  isFromSummaryOrProfilePage?: boolean;
}) => {
  const payload = userFormData.map((user: any) => {
    let roleIds: number[] = [];
    // for role, roles, roleIds
    let spiceInsightsIds: number[] = [];
    let spiceId: number[] = [];
    // add role in spiceId
    if (!isFromList) {
      // if not from admin list
      spiceId = [Array.isArray(user?.role) ? user.role[0]?.id : user?.role?.id];
    } else if (user.role) {
      spiceId =
        Array.isArray(user.roles) && user.roles.length
          ? (user.roles || [])
              .map((id: any) => {
                return Array.isArray(id) ? id.map((e: any) => e.id) : id.id;
              })
              .flat()
          : [user.role.id];
    }
    // add roles in spiceInsightIds
    if (user.roles) {
      spiceInsightsIds = user.roles
        ?.filter((role: IRoles) => role.groupName === APPCONSTANTS.spiceRoleGrouped.spiceInsights)
        ?.map((role: IRoles) => role.id);
    }
    roleIds = [...new Set([...spiceId, ...spiceInsightsIds])];

    const userPayload: any = {
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      gender: user.gender,
      username: user.username,
      phoneNumber: user.phoneNumber,
      // for create region countryCode will be come as free text
      countryCode: user?.countryCode?.phoneNumberCode || user?.countryCode,
      roleIds,
      timezone: user?.timezone
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
      userPayload.culture = user.culture;
    }
    return userPayload;
  });
  return payload;
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
  spiceRolesGroup = []
}: {
  userFormData: any[];
  countryId: number | string;
  tenantId?: number | string | undefined;
  isHFCreate?: boolean;
  spiceRolesGroup?: Array<{ name: string; id: number }>;
}) => {
  const payload = userFormData.map((user: any) => {
    let roleIds: number[] = [];
    // for role, roles, roleIds
    if (isHFCreate) {
      roleIds = Array.isArray(user.roles)
        ? (user.roles || [])
            .map((id: any) => {
              return Array.isArray(id) ? id.map((e: any) => e.id) : id.id;
            })
            .flat()
        : [user.role.id];
    } else {
      let spiceInsightsIds: number[] = [];
      let spiceId: number[] = [];
      // add role in spiceId
      if (user.role) {
        spiceId =
          Array.isArray(user.roles) && user.roles.length
            ? (user.roles || [])
                .map((id: any) => {
                  return Array.isArray(id) ? id.map((e: any) => e.id) : id.id;
                })
                .flat()
            : [user.role.id];
      }
      // add roles in spiceInsightIds
      if (user.roles) {
        spiceInsightsIds = user.roles
          ?.filter((role: IRoles) => role.groupName === APPCONSTANTS.spiceRoleGrouped.spiceInsights)
          ?.map((role: IRoles) => role.id);
      }
      roleIds = [...new Set([...spiceId, ...spiceInsightsIds])];
    }
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
      // if user has it's own tenantId(while edit) then send that tenentId
      payloadTenantId = user.tenantId;
    } else if (user?.healthfacility?.tenantId) {
      // if hf admin create or user create then send assigned hf tenantId
      payloadTenantId = Number(user?.healthfacility?.tenantId);
    } else if (tenantId) {
      // send URL tenantId from summary page
      payloadTenantId = Number(tenantId);
    }

    const userPayload: IUserPayload = {
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
      roleIds,
      villageIds: (Array.isArray(user?.villages) ? user.villages : []).map(({ id }: { id: number }) => id),
      village: user?.village,
      timezone: user?.timezone,
      district: user?.district,
      chiefdom: user?.chiefdom
    };
    // add id for edit
    if (user?.id) {
      userPayload.id = Number(user.id);
    }
    // add redrisk if not hf admin
    if (!isHFAdmin) {
      userPayload.redRisk = user?.redRisk;
    }

    return userPayload;
  });
  return payload;
};
