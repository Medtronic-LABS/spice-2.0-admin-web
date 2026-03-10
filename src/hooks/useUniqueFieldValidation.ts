import { FormApi } from 'final-form';
import { FieldMetaState } from 'react-final-form';
import { useCallback, useRef, useState } from 'react';
import toastCenter, { getErrorToastArgs } from '../utils/toastCenter';
import APPCONSTANTS from '../constants/appConstants';

export interface UseUniqueFieldValidationOptions {
  apiFn: (value: string) => Promise<{ data?: { unique?: boolean } }>;
  existsErrorMsg: string;
  notValidatedMsg: string;
  errorLabel: string;
  minLength: number;
  form: FormApi<any>;
  formName: string;
  fieldKey: string;
  isEdit: boolean;
  toastErrorMsg: string;
}

export interface UseUniqueFieldValidationReturn {
  getErrorMsg: (meta: FieldMetaState<string>) => string | undefined;
  getErrorLabel: (meta: FieldMetaState<string>) => string;
  validateExist: (value: string) => string | undefined;
  checkUniqueFn: (value: string, forceRetry?: boolean) => Promise<void>;
  loading: boolean;
  networkError: boolean;
  setNetworkError: (value: boolean) => void;
  submitEnabledStatusRef: React.MutableRefObject<boolean>;
  lastCheckedRef: React.MutableRefObject<string>;
}

/**
 * Shared hook for async "unique" validation (e.g. facility name, postal code).
 * Manages refs, loading/network error state, validators, and retry behavior.
 */
export function useUniqueFieldValidation(
  options: UseUniqueFieldValidationOptions
): UseUniqueFieldValidationReturn {
  const {
    apiFn,
    existsErrorMsg,
    notValidatedMsg,
    errorLabel,
    minLength,
    form,
    formName,
    fieldKey,
    isEdit,
    toastErrorMsg
  } = options;

  const lastCheckedRef = useRef<string>('');
  const errorRef = useRef<string>('');
  const submitEnabledStatusRef = useRef(true);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const getErrorMsg = useCallback(
    (meta: FieldMetaState<string>) => {
      if (networkError) {
        return notValidatedMsg;
      }
      return (meta.touched && (meta.error || '')) || undefined;
    },
    [networkError, notValidatedMsg]
  );

  const getErrorLabel = useCallback(
    (meta: FieldMetaState<string>) => {
      const shouldHideError =
        existsErrorMsg === meta.error ||
        networkError ||
        !meta.error ||
        meta.error === ' ';
      if (shouldHideError) {
        return '';
      }
      return errorLabel;
    },
    [existsErrorMsg, errorLabel, networkError]
  );

  const validateExist = useCallback(
    (value: string) => {
      const trimmed = value?.trim?.() || '';
      return (
        errorRef.current ||
        ((loading || !submitEnabledStatusRef.current) && lastCheckedRef.current !== trimmed ? ' ' : '')
      );
    },
    [loading]
  );

  const checkUniqueFn = useCallback(
    async (value: string, forceRetry?: boolean) => {
      const trimmed = value?.trim?.() || '';
      if (isEdit || !trimmed || trimmed.length < minLength) return;
      if (!forceRetry && lastCheckedRef.current === trimmed) return;
      try {
        setLoading(true);
        setNetworkError(false);
        const res = await apiFn(trimmed);
        const { unique } = (res?.data || {}) as { unique?: boolean };
        submitEnabledStatusRef.current = true;
        errorRef.current = unique === false ? existsErrorMsg : '';
        lastCheckedRef.current = trimmed;
        form.change?.(`${formName}.${fieldKey}`, trimmed + ' ');
        form.change?.(`${formName}.${fieldKey}`, trimmed);
      } catch (e: any) {
        setNetworkError(true);
        lastCheckedRef.current = '';
        toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, toastErrorMsg));
      } finally {
        setLoading(false);
      }
    },
    [
      apiFn,
      existsErrorMsg,
      fieldKey,
      form,
      formName,
      isEdit,
      minLength,
      toastErrorMsg
    ]
  );

  return {
    getErrorMsg,
    getErrorLabel,
    validateExist,
    checkUniqueFn,
    loading,
    networkError,
    setNetworkError,
    submitEnabledStatusRef,
    lastCheckedRef
  };
}
