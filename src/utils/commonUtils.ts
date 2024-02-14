import React from 'react';
import { saveAs } from 'file-saver';
import APPCONSTANTS from '../constants/appConstants';
import CryptoJS from 'crypto-js';

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
