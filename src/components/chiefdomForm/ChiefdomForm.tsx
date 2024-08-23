import React, { useEffect } from 'react';
import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import SelectInput from '../formFields/SelectInput';
import TextInput from '../formFields/TextInput';
import { fetchDistrictListDetailReq, fetchDistrictOptionsRequest } from '../../store/district/actions';
import {
  districtOptionsLoadingSelector,
  districtOptionsSelector,
  districtSelector,
  districtLoadingSelector
} from '../../store/district/selectors';
import { composeValidators, required, validateEntityName } from '../../utils/validation';
import { roleSelector } from '../../store/user/selectors';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import TagInput from '../formBuilder/components/fieldUI/TagInput';

interface IChiefdomFormProps {
  nestingKey?: string;
  isEdit?: boolean;
  form?: FormApi<any>;
}

/**
 * Renders the fields for chiefdom form
 * @returns {React.ReactElement}
 */
const ChiefdomForm = ({ nestingKey, isEdit = false, form }: IChiefdomFormProps): React.ReactElement => {
  const dispatch = useDispatch();
  const districtOptions = useSelector(districtOptionsSelector);
  const districtOptionsLoading = useSelector(districtOptionsLoadingSelector);
  const { regionId, districtId, tenantId } = useParams<{ regionId?: string; districtId?: string; tenantId: string }>();

  const { district: districtModuleName, chiefdom: chiefdomModuleName } = NAME_CONSTANTS;

  useEffect(() => {
    if (regionId && tenantId && !isEdit) {
      dispatch(fetchDistrictOptionsRequest(tenantId));
    }
  }, [dispatch, regionId, tenantId, isEdit]);

  // Logic for district autoselecting when the route is createChiefdomByDistrict
  // route is createChiefdomByDistrict, if isEdit = false and the route contains districtId param
  const district = useSelector(districtSelector);
  const districtLoading = useSelector(districtLoadingSelector);
  const role = useSelector(roleSelector);
  const { ROLES } = APPCONSTANTS;
  const showDistrictField = ROLES.SUPER_ADMIN === role || ROLES.SUPER_USER === role || ROLES.REGION_ADMIN === role;
  useEffect(() => {
    if (showDistrictField && !isEdit && districtId && district?.id !== districtId) {
      dispatch(
        fetchDistrictListDetailReq({
          tenantId,
          id: districtId
        })
      );
    }
  }, [district?.id, districtId, dispatch, isEdit, showDistrictField, tenantId]);

  useEffect(() => {
    if (!isEdit && districtId) {
      const { values: formValues = {} } = form?.getState?.() || {};
      let districtFormValue = '';
      if (nestingKey) {
        districtFormValue = (nestingKey.split('.').reduce((a, b: string) => a[b], formValues) || {}).district;
      } else {
        districtFormValue = formValues.district;
      }
      if (!districtFormValue && district?.id.toString() === districtId) {
        form?.change(`${nestingKey ? nestingKey + '.' : ''}district`, district);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId, form, isEdit, nestingKey]);

  const nestingKeyName = `${nestingKey ? nestingKey + '.' : ''}name`;
  const nestingKeyDistrict = `${nestingKey ? nestingKey + '.' : ''}district`;

  return (
    <div className='row gx-1dot25'>
      <div className='col-12 col-md-6'>
        <Field
          name={nestingKeyName}
          type='text'
          validate={composeValidators(required, validateEntityName)}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label={`${chiefdomModuleName} Name`}
              errorLabel={`${chiefdomModuleName.toLocaleLowerCase()} name`}
              capitalize={true}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      {showDistrictField && (
        <div className='col-12 col-md-6'>
          <Field
            name={nestingKeyDistrict}
            type='text'
            validate={required}
            render={({ input, meta }) => {
              return (
                <SelectInput
                  {...(input as any)}
                  disabled={Boolean(districtId || isEdit)}
                  options={districtId || isEdit ? [] : districtOptions || []}
                  loadingOptions={districtOptionsLoading || districtLoading}
                  labelKey='name'
                  valueKey='id'
                  label={districtModuleName}
                  errorLabel={districtModuleName.toLocaleLowerCase()}
                  error={(meta.touched && meta.error) || undefined}
                />
              );
            }}
          />
        </div>
      )}
      {!isEdit && (
        <div className='col-12'>
          <Field
            name={'village'}
            type='text'
            validate={composeValidators(required, validateEntityName)}
            render={({ input, meta }) => {
              return (
                <TagInput
                  {...input}
                  label={`Villages`}
                  error={!input.value.length && meta.touched ? 'Please add the village name' : ''}
                />
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChiefdomForm;
