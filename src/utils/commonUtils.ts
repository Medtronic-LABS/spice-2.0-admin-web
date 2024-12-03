import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import React from 'react';
import APPCONSTANTS, { NAMING_VARIABLES } from '../constants/appConstants';
import { redRisk } from '../constants/roleConstants';
import { IHFUserGet, IUserRole } from '../store/healthFacility/types';

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

export const filterByAppTypes = (datas: any[], appTypes: string[]) => {
  const appTypesSet = new Set(appTypes); // Use a Set for faster lookup
  return datas.filter((data) => data.appTypes.some((appType: string) => appTypesSet.has(appType)));
};

export const decodeURIText = (text: string) => {
  try {
    return decodeURIComponent(text);
  } catch {
    return text; // Return the original text if decoding fails
  }
};

export const removeRedRiskFromRoleArray = (roleArray = []) => {
  return roleArray?.filter(
    (role: { name: string; displayName: string | null }) => role?.name !== redRisk && role?.displayName !== null
  );
};
