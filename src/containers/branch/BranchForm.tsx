import React, { useEffect, useRef } from 'react';
import { Field } from 'react-final-form';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';

import TextInput from '../../components/formFields/TextInput';
import SelectInput from '../../components/formFields/SelectInput';
import { required, composeValidators, validateEntityName } from '../../utils/validation';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { fetchChiefdomDropdownRequest } from '../../store/chiefdom/actions';
import { districtLoadingSelector, getDistrictListSelector } from '../../store/district/selectors';
import { chiefdomDropdownSelector, chiefdomDropdownLoadingSelector } from '../../store/chiefdom/selectors';
import { IDistrict } from '../../store/district/types';
import { FormApi } from 'final-form';
import { errorMsgs } from '../../constants/erroMsgs';

/** Validates non-negative number (>= 0) */
export const validateNonNegative = (value?: string | number): string | undefined => {
  if (value === '' || value === undefined || value === null) { return undefined; }
  const num = Number(value);
  if (Number.isNaN(num)) { return errorMsgs.INVALID_NO; }
  if (num < 0) { return errorMsgs.NEGATIVE_NO; }
  if (num > 999) { return errorMsgs.LIMIT_NO; }
  return undefined;
};

interface IBranchFormProps {
  isEdit?: boolean;
  form: FormApi<any>;
  formName?: string;
}

/**
 * Branch form component for add/edit
 */
const BranchForm = ({ form, formName = 'branch', isEdit = false }: IBranchFormProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const districtOptions = useSelector(getDistrictListSelector);
  const districtOptionsLoading = useSelector(districtLoadingSelector);
  const chiefdomOptions = useSelector(chiefdomDropdownSelector);
  const chiefdomOptionsLoading = useSelector(chiefdomDropdownLoadingSelector);

  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = useAppTypeConfigs();

  const handleDistrictChange = (value: IDistrict | null) => {
    if (value?.tenantId != null) {
      hasFetchedChiefdomForDistrictRef.current = true;
      dispatch(fetchChiefdomDropdownRequest({ tenantId: String(value.tenantId) }));
      return;
    }

    hasFetchedChiefdomForDistrictRef.current = false;
  };

  /**
   * Fetch chiefdom dropdown when district tenant is available (supports edit + add auto-select flows)
   */
  const districtTenantId = form.getState().values?.[formName]?.district?.tenantId ?? null;
  const hasFetchedChiefdomForDistrictRef = useRef(false);

  useEffect(() => {
    if (districtTenantId == null) {
      hasFetchedChiefdomForDistrictRef.current = false;
      return;
    }

    if (!hasFetchedChiefdomForDistrictRef.current) {
      hasFetchedChiefdomForDistrictRef.current = true;
      dispatch(fetchChiefdomDropdownRequest({ tenantId: String(districtTenantId) }));
    }
  }, [districtTenantId, dispatch]);

  return (
    <div className='row gx-1dot25'>
      <div className='col-12'>
        <Field
          name={`${formName}.name`}
          type='text'
          validate={composeValidators(required, validateEntityName)}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='Name'
              errorLabel='name'
              placeholder='Name'
              capitalize={true}
              error={meta.touched && typeof meta.error === 'string' ? meta.error : undefined}
            />
          )}
        />
      </div>
      <div className='col-12'>
        <Field
          name={`${formName}.code`}
          type='text'
          validate={required}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='Code'
              disabled={isEdit}
              errorLabel='code'
              placeholder='Code'
              error={meta.touched && typeof meta.error === 'string' ? meta.error : undefined}
            />
          )}
        />
      </div>
      <div className='col-12'>
        <Field
          name={`${formName}.currentAccountCode`}
          type='text'
          validate={required}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='Current Account Code'
              errorLabel='current account code'
              placeholder='Current Account Code'
              error={meta.touched && typeof meta.error === 'string' ? meta.error : undefined}
            />
          )}
        />
      </div>
      <div className='col-12 col-md-6'>
        <Field
          name={`${formName}.district`}
          validate={required}
          render={({ input, meta }) => (
            <SelectInput
              {...(input as any)}
              options={districtOptions || []}
              loadingOptions={districtOptionsLoading}
              labelKey='name'
              valueKey='id'
              label={districtSName}
              errorLabel={districtSName.toLowerCase()}
              error={meta.touched && typeof meta.error === 'string' ? meta.error : undefined}
              onChange={(value) => {
                input.onChange(value);
                form.change(`${formName}.chiefdom`, undefined);
                handleDistrictChange(value);
              }}
            />
          )}
        />
      </div>
      <div className='col-12 col-md-6'>
        <Field
          name={`${formName}.chiefdom`}
          validate={required}
          render={({ input, meta }) => (
            <SelectInput
              {...(input as any)}
              options={chiefdomOptions || []}
              loadingOptions={chiefdomOptionsLoading}
              labelKey='name'
              valueKey='id'
              label={chiefdomSName}
              errorLabel={chiefdomSName.toLowerCase()}
              error={meta.touched && typeof meta.error === 'string' ? meta.error : undefined}
              onChange={(value) => {
                input.onChange(value);
              }}
            />
          )}
        />
      </div>
      <div className='col-12 col-md-6'>
        <Field
          name={`${formName}.skPositionCount`}
          format={(v) => (v === undefined || v === null ? '' : String(v))}
          validate={validateNonNegative}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              value={input.value ?? ''}
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              label='SK Position Count'
              required={false}
              error={meta.touched && typeof meta.error === 'string' ? meta.error : undefined}
              onKeyDown={(e) => {
                if (e.key.length === 1 && !/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                  e.preventDefault();
                }
              }}
            />
          )}
        />
      </div>
      <div className='col-12 col-md-6'>
        <Field
          name={`${formName}.ssPositionCount`}
          format={(v) => (v === undefined || v === null ? '' : String(v))}
          validate={validateNonNegative}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              value={input.value ?? ''}
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              label='SS Position Count'
              required={false}
              error={meta.touched && typeof meta.error === 'string' ? meta.error : undefined}
              onKeyDown={(e) => {
                if (e.key.length === 1 && !/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                  e.preventDefault();
                }
              }}
            />
          )}
        />
      </div>
      <div className='col-12 col-md-6'>
        <Field
          name={`${formName}.poPositionCount`}
          format={(v) => (v === undefined || v === null ? '' : String(v))}
          validate={validateNonNegative}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              value={input.value ?? ''}
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              label='PO Position Count'
              required={false}
              error={meta.touched && typeof meta.error === 'string' ? meta.error : undefined}
              onKeyDown={(e) => {
                if (e.key.length === 1 && !/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                  e.preventDefault();
                }
              }}
            />
          )}
        />
      </div>
      <div className='col-12 col-md-6'>
        <Field
          name={`${formName}.foPositionCount`}
          format={(v) => (v === undefined || v === null ? '' : String(v))}
          validate={validateNonNegative}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              value={input.value ?? ''}
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              label='FO Position Count'
              required={false}
              error={meta.touched && typeof meta.error === 'string' ? meta.error : undefined}
              onKeyDown={(e) => {
                if (e.key.length === 1 && !/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                  e.preventDefault();
                }
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default BranchForm;
