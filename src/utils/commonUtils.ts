import React from 'react';
import { saveAs } from 'file-saver';
import APPCONSTANTS, { NAMING_VARIABLES } from '../constants/appConstants';
import CryptoJS from 'crypto-js';
import { IHFUserGet, IUserRole } from '../store/healthFacility/types';

const getEncryptionKey = () => {
  return CryptoJS.PBKDF2(process.env.REACT_APP_CRYPTR_SECRET_KEY as string, APPCONSTANTS.ENCRYPTION.SALT, {
    keySize: APPCONSTANTS.ENCRYPTION.KEYLEN / 32,
    iterations: APPCONSTANTS.ENCRYPTION.ITERATION
  });
};

export const decryptData = (password: string) => {
  const key = getEncryptionKey();
  const iv = CryptoJS.enc.Utf8.parse(APPCONSTANTS.ENCRYPTION.IV);
  return CryptoJS.AES.decrypt(password, CryptoJS.enc.Utf8.parse(key as any), { iv }).toString(CryptoJS.enc.Utf8);
};

export const encryptData = (value: string) => {
  const key = getEncryptionKey();
  const iv = CryptoJS.enc.Utf8.parse(APPCONSTANTS.ENCRYPTION.IV);
  return CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(key as any), { iv }).toString();
};

/**
 * Appends zero before given number if number of digitd is less that minimumIntegerDigits
 * @param num
 * @param minimumIntegerDigits
 * @returns {string}
 */
export const appendZeroBefore = (num: number, minimumIntegerDigits: number): string =>
  (Number(num) || 0).toLocaleString('en-US', {
    minimumIntegerDigits,
    useGrouping: false
  });

/**
 * Resets all the fields whose name contains given substring,
 * @param param0
 * @param state
 * @param utils
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
 * A utility function to stop the event from propogating up on DOM
 * @param e
 */
export const stopPropogation = (e: React.BaseSyntheticEvent) => {
  try {
    e.stopPropagation();
  } catch (error) {
    console.error(error);
  }
};

export const fileDownload = async (data: any, fileName: string, fileType: string, fileExtension?: string) => {
  const blob = new Blob([data], { type: fileType });
  return saveAs(blob, fileName + (fileExtension ? fileExtension : ''), { autoBom: false });
};

export const convertDate = (date: Date | string) => {
  function pad(s: any) {
    return s < 10 ? '0' + s : s;
  }
  const d = new Date(date);
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
};

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

export const addResRiskToUserPayload = (payload: any, redRiskId: number | null = null) => {
  return payload.map((user: { redRisk: any; roleIds: any[] }) => ({
    ...user,
    roleIds: user.redRisk
      ? [...new Set([...user.roleIds, redRiskId])]
      : user.roleIds?.filter((roleId: number) => roleId !== redRiskId)
  }));
};

export const formatRoles = (user: IHFUserGet) => {
  return `${(user.roles || [])
    ?.filter((filteredUserRole: IUserRole) => filteredUserRole.name !== NAMING_VARIABLES.redRisk)
    ?.map((userRole: IUserRole) => userRole.displayName)
    .join(',')}`;
};
