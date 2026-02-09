import { AxiosResponse } from 'axios';
import { FormApi } from 'final-form';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import APPCONSTANTS from '../../constants/appConstants';
import ApiError from '../../global/ApiError';
import styles from './TextInput.module.scss';
import { fetchUserByUsername } from '../../services/userAPI';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { composeValidators, required } from '../../utils/validation';
import TextInput from './TextInput';
import { IHFUserGet } from '../../store/healthFacility/types';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

interface IUsernameFieldProps {
  isEdit: boolean | undefined;
  name: string;
  form: FormApi<any>;
  formName: string;
  index: number;
  clearEmail?: boolean;
  isDisabled?: boolean | undefined;
  enableAutoPopulate?: boolean;
  onFindExistingUser?: (user: any) => void;
  parentOrgId?: string;
  ignoreTenantId?: string;
  isHF?: boolean;
  isHFCreate?: boolean;
  isSiteUser?: boolean;
  entityName?: string;
}

const UsernameField = forwardRef(
  (
    {
      isEdit,
      name,
      form,
      formName,
      index,
      clearEmail = false,
      isDisabled = false,
      enableAutoPopulate,
      onFindExistingUser,
      parentOrgId,
      ignoreTenantId,
      isHF = false,
      isHFCreate = false,
      isSiteUser = false
    }: IUsernameFieldProps,
    ref
  ) => {
  const [disabled, setDisabled] = useState(false);
  const submitEnabledStatus = useRef(true);
  const currentUsername = useRef(
    (() => {
      try {
        return form?.getState().values[formName][index]?.username || '';
      } catch (e) {
        console.error(e);
        return '';
      }
    })()
  );

  const [loading, setLoading] = useState(false);
  const errorValue = useRef<string>('');
  const errorCode = useRef<number | null>(null);
  const [isNetworkError, setNetworkError] = useState(false);
  const lastCheckedUsername = useRef<string>(currentUsername.current);
  const alreadyExistError = APPCONSTANTS.USERNAME_ALREADY_EXISTS_ERR_MSG || APPCONSTANTS.EMAIL_ALREADY_EXISTS_ERR_MSG;
  const lastOrgId = useRef<string | undefined>(parentOrgId);
  const lastIgnoreTenantId = useRef<string | undefined>(ignoreTenantId);
  const cfrError = APPCONSTANTS.CFR_ERR_MSG;
  const differentOrgError = APPCONSTANTS.EMAIL_ALREADY_EXISTS_IN_ORG_ERR_MSG;
  const duplicationError = APPCONSTANTS.USERNAME_DUPLICATION_ERR_MSG || `Multiple users can't have same username`;
  const siteAdminError = APPCONSTANTS.HEALTH_FACILITY_ADMIN_PERMISSION_ERR_MSG;
  const { isCommunity, appTypes } = useAppTypeConfigs();

  useImperativeHandle(
    ref,
    () => ({
      resetUsernameField: () => {
        lastCheckedUsername.current = '';
        errorValue.current = '';
        setDisabled(false);
        currentUsername.current = '';
      }
    }),
    []
  );

  const validateIsUsernameExist = useCallback(
    (username: string) =>
      errorValue.current ||
      (!submitEnabledStatus.current && lastCheckedUsername.current !== username
        ? ' ' // blank space is given as error to block submission till the user already exist validation is completed
        : ''),
    [errorValue]
  );

  const clearUsernameFn = useCallback(() => {
    if (clearEmail) {
      lastCheckedUsername.current = '';
      errorValue.current = '';
      setDisabled(false);
      currentUsername.current = '';
    }
  }, [clearEmail]);

  const validateDuplication = useCallback(
    (value: string) => {
      try {
        if (!value || lastCheckedUsername.current !== value) {
          return '';
        }
        let smallestDuplicateIndex: number = -1;
        const users = form?.getState().values[formName];
        let count = 0;
        users.forEach(({ username }: IHFUserGet, i: number) => {
          if (username && username.toLowerCase() === (value || '').toLowerCase()) {
            if (smallestDuplicateIndex < 0) {
              smallestDuplicateIndex = i;
            }
            count++;
          }
        });
        return count > 1 && smallestDuplicateIndex !== index ? duplicationError : '';
      } catch (e) {
        console.error(e);
        return '';
      }
    },
    [form, formName, duplicationError, index]
  );

  const isValidUsername = (username?: string, checkSameUsernameAgain?: boolean) => {
    return username && username.trim() && (lastCheckedUsername.current !== username || checkSameUsernameAgain);
  };

  const fetchUserByUsernameResFn = useCallback(
    (res: AxiosResponse<any>, username: string) => {
      const {
        data: { entity: data }
      } = res;
      if (enableAutoPopulate && data?.username === username) {
        onFindExistingUser?.(data);
        setDisabled(true);
        errorValue.current = '';
      } else if (!enableAutoPopulate) {
        errorValue.current = data !== null ? alreadyExistError : '';
      } else if (!data?.username) {
        errorValue.current = '';
      }
      setLoading(false);
      lastCheckedUsername.current = username;
      form.change?.(`${name}.username`, username + ' '); // to trigger onchange space added
      form.change?.(`${name}.username`, username);
    },
    [alreadyExistError, enableAutoPopulate, form, name, onFindExistingUser]
  );

  const validateUser = useCallback(
    async (username: string, checkSameUsernameAgain?: boolean) => {
      try {
        if (!isValidUsername(username, checkSameUsernameAgain)) {
          return;
        }
        setLoading(true);
        const isAdminFetched = !(isHF || isHFCreate) && isSiteUser;
        const usernameFetchPayload = isCommunity
          ? {
              username: username, // API uses email parameter but we pass username
              appTypes
            }
          : {
              appTypes,
              username: username, // API uses email parameter but we pass username
              parentOrganizationId: parentOrgId,
              ignoreTenantId,
              isSiteUsers: isAdminFetched
            };
        await fetchUserByUsername(usernameFetchPayload).then((res) => {
          submitEnabledStatus.current = true;
          fetchUserByUsernameResFn(res, username);
        });

        setNetworkError(false);
      } catch (e: any) {
        setLoading(false);
        if (
          e instanceof ApiError &&
          (e.statusCode === 406 || e.statusCode === 409 || e.statusCode === 400 || e.statusCode === 412)
        ) {
          let newError = '';
          if (e.statusCode === 400) {
            newError = cfrError;
          } else if (e.statusCode === 406) {
            newError = differentOrgError;
          } else if (e.statusCode === 412) {
            newError = siteAdminError;
          } else if (e.statusCode === 409) {
            errorCode.current = e.statusCode;
            newError = e.message;
          } else {
            newError = alreadyExistError;
          }
          errorValue.current = newError;
          setNetworkError(false);
          form.change?.(`${name}.username`, username + ' '); // to trigger onchange space added
          form.change?.(`${name}.username`, username);
          lastCheckedUsername.current = username;
        } else {
          setNetworkError(true);
          lastCheckedUsername.current = '';
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, ''));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      parentOrgId,
      ignoreTenantId,
      fetchUserByUsernameResFn,
      form,
      name,
      cfrError,
      differentOrgError,
      siteAdminError,
      alreadyExistError
    ]
  );

  useEffect(() => {
    if (!isCommunity && (lastOrgId.current !== parentOrgId || lastIgnoreTenantId.current !== ignoreTenantId)) {
      lastOrgId.current = parentOrgId;
      lastIgnoreTenantId.current = ignoreTenantId;
      validateUser(currentUsername.current, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentOrgId, validateUser, ignoreTenantId]);

  return (
    <Field
      name={`${name}.username`}
      type='text'
      validate={composeValidators(required, validateIsUsernameExist, validateDuplication)}
      render={({ input, meta }: FieldRenderProps<string>) => {
        return (
          <TextInput
            {...input}
            onBlur={(event) => {
              clearUsernameFn();
              input.onBlur(event);
              submitEnabledStatus.current = false;
              validateUser(input.value);
            }}
            onChange={(event) => {
              if (!(isEdit || (isDisabled === undefined ? disabled : isDisabled))) {
                submitEnabledStatus.current = false;
                currentUsername.current = event.target.value.trim();
                setNetworkError(false);
                input.onChange(event);
              }
            }}
            showLoader={loading}
            label='Username'
            errorLabel={
              [alreadyExistError, cfrError, differentOrgError, siteAdminError, ' '].includes(meta.error) ||
              isNetworkError ||
              errorCode.current === 409
                ? ''
                : 'username'
            }
            disabled={isEdit || (isDisabled && disabled)}
            error={isNetworkError ? 'Username is not validated.' : meta.touched && (meta.error || '')}
            helpertext={
              isNetworkError ? (
                <div>
                  <span className={styles.validateErrorText} onClick={() => validateUser(input.value, true)}>
                    Validate username
                  </span>
                </div>
              ) : (
                <></>
              )
            }
          />
        );
      }}
      />
    );
  }
);

UsernameField.displayName = 'UsernameField';

export default UsernameField;
