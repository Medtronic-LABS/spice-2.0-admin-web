import { AxiosResponse } from 'axios';
import { FormApi } from 'final-form';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import APPCONSTANTS from '../../constants/appConstants';
import ApiError from '../../global/ApiError';
import styles from './TextInput.module.scss';

import { fetchUserByEmail } from '../../services/userAPI';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { composeValidators, required, validateEmail } from '../../utils/validation';
import TextInput from './TextInput';
import { IHFUserGet } from '../../store/healthFacility/types';

const EmailField = forwardRef(
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
      tenantId
    }: {
      isEdit: boolean | undefined;
      name: string;
      form: FormApi<any>;
      formName: string;
      clearEmail?: boolean;
      isDisabled?: boolean | undefined;
      index: number;
      entityName?: string;
      enableAutoPopulate?: boolean;
      onFindExistingUser?: (user: any) => void;
      tenantId?: number;
    },
    ref
  ) => {
    const [disabled, setDisabled] = useState(false);
    const submitEnabledStatus = useRef(true);
    const currentEmail = useRef(
      (() => {
        try {
          return form?.getState().values[formName][index].email;
        } catch (e) {
          console.error(e);
          return '';
        }
      })()
    );

    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState('');
    const errorValue = useRef<string>('');
    const [isNetworkError, setNetworkError] = useState(false);
    const lastCheckedEmail = useRef<string>(currentEmail.current);
    const alreadyExistError = APPCONSTANTS.EMAIL_ALREADY_EXISTS_ERR_MSG;
    const emrError = APPCONSTANTS.EMR_ERR_MSG;
    const differentOrgError = APPCONSTANTS.EMAIL_ALREADY_EXISTS_IN_ORG_ERR_MSG;
    const duplicationError = APPCONSTANTS.EMAIL_DUPLICATION_ERR_MSG;
    const siteAdminError = APPCONSTANTS.SITE_ADMIN_PERMISSION_ERR_MSG;

    useImperativeHandle(
      ref,
      () => ({
        resetEmailField: () => {
          lastCheckedEmail.current = '';
          errorValue.current = '';
          setDisabled(false);
        }
      }),
      [errorValue, setDisabled]
    );

    const validateIsEmailExist = useCallback(
      (email: string) =>
        errorValue.current ||
        (!submitEnabledStatus.current && lastCheckedEmail.current !== email
          ? ' ' // blank space is given as error to block submition till the user already exist validation is completed
          : ''),
      [errorValue]
    );

    const clearEmailFn = useCallback(() => {
      if (clearEmail) {
        lastCheckedEmail.current = '';
        errorValue.current = '';
        setDisabled(false);
        currentEmail.current = '';
      }
    }, [clearEmail]);

    const validateDuplication = useCallback(
      (value: string) => {
        try {
          if (lastCheckedEmail.current !== value) {
            return '';
          }
          let smallestDuplicateIndex: number = -1;
          const users = form?.getState().values[formName];
          let count = 0;
          users.forEach(({ username }: IHFUserGet, i: number) => {
            if (username.toLowerCase() === (value || '').toLowerCase()) {
              if (smallestDuplicateIndex < 0) {
                smallestDuplicateIndex = i;
              }
              count++;
            }
          });
          return count > 1 && smallestDuplicateIndex !== index ? duplicationError : '';
        } catch (e) {
          console.error(e);
        }
      },
      [form, formName, duplicationError, index]
    );

    const isValidEmail = (email?: string, checkSameEmailAgain?: boolean) => {
      return email && !validateEmail(email) && (lastCheckedEmail.current !== email || checkSameEmailAgain);
    };

    const fetchUserByEmailResFn = useCallback(
      (res: AxiosResponse<any>, email: string) => {
        const {
          data: { entity: data }
        } = res;
        if (enableAutoPopulate && data?.username === email) {
          onFindExistingUser?.(data);
          setDisabled(true);

          errorValue.current = '';
        } else if (!enableAutoPopulate) {
          errorValue.current = data !== null ? alreadyExistError : '';
        } else if (!data?.username) {
          errorValue.current = '';
        }
        setLoading(false);
        lastCheckedEmail.current = email;
        form.change?.(`${name}.email`, email + ' '); // to trigger onchange space added
        form.change?.(`${name}.email`, email);
      },
      [alreadyExistError, enableAutoPopulate, form, name, onFindExistingUser]
    );

    const validateUser = useCallback(
      async (email: string, checkSameEmailAgain?: boolean) => {
        try {
          if (!isValidEmail(email, checkSameEmailAgain)) {
            return;
          }
          setLoading(true);
          await fetchUserByEmail(email, tenantId).then((res) => {
            submitEnabledStatus.current = true;
            fetchUserByEmailResFn(res, email);
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
              newError = emrError;
            } else if (e.statusCode === 406) {
              newError = differentOrgError;
            } else if (e.statusCode === 412) {
              newError = siteAdminError;
            } else {
              newError = alreadyExistError;
            }
            errorValue.current = newError;
            form.change?.(`${name}.email`, email + ' '); // to trigger onchange space added
            form.change?.(`${name}.email`, email);
            lastCheckedEmail.current = email;
          } else {
            setNetworkError(true);
            lastCheckedEmail.current = '';
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, ''));
          }
        }
      },
      [tenantId, fetchUserByEmailResFn, form, name, emrError, differentOrgError, siteAdminError, alreadyExistError]
    );
    return (
      <Field
        name={`${name}.username`}
        type='text'
        validate={composeValidators(required, validateEmail, validateIsEmailExist, validateDuplication)}
        render={({ input, meta }: FieldRenderProps<string>) => {
          return (
            <TextInput
              {...input}
              onBlur={(event) => {
                clearEmailFn();
                input.onBlur(event);
                submitEnabledStatus.current = false;
                validateUser(input.value);
              }}
              onChange={(event) => {
                if (!(isEdit || (isDisabled === undefined ? disabled : isDisabled))) {
                  submitEnabledStatus.current = false;
                  currentEmail.current = event.target.value.trim();
                  setNetworkError(false);
                  input.onChange(event);
                }
              }}
              lowerCase={true}
              showLoader={loading}
              label='Email ID'
              errorLabel={
                [alreadyExistError, emrError, differentOrgError, siteAdminError, ' '].includes(meta.error) ||
                isNetworkError
                  ? ''
                  : 'email ID'
              }
              disabled={isEdit || (isDisabled === undefined ? disabled : isDisabled)}
              error={isNetworkError ? 'Email ID is not validated.' : meta.touched && (meta.error || '')}
              helpertext={
                isNetworkError ? (
                  <div>
                    <span className={styles.validateErrorText} onClick={() => validateUser(input.value, true)}>
                      Validate email
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

export default EmailField;
