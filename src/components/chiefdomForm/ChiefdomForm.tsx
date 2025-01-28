import { FormApi } from 'final-form';
import React, { useEffect } from 'react';
import { Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import APPCONSTANTS from '../../constants/appConstants';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { fetchDistrictDetailReq, fetchDistrictOptionsRequest } from '../../store/district/actions';
import {
  districtLoadingSelector,
  districtOptionsLoadingSelector,
  districtOptionsSelector,
  districtSelector
} from '../../store/district/selectors';
import { roleSelector } from '../../store/user/selectors';
import { composeValidators, required, validateEntityName } from '../../utils/validation';
import TagInput from '../formBuilder/components/fieldUI/TagInput';
import SelectInput from '../formFields/SelectInput';
import TextInput from '../formFields/TextInput';

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

  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = useAppTypeConfigs();

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

  /**
   * Fetches district details when necessary conditions are met
   */
  useEffect(() => {
    if (showDistrictField && !isEdit && districtId && district?.id !== districtId) {
      dispatch(
        fetchDistrictDetailReq({
          tenantId,
          id: districtId
        })
      );
    }
  }, [district?.id, districtId, dispatch, isEdit, showDistrictField, tenantId]);

  /**
   * Auto-selects the district in the form when conditions are met
   */
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
              label={`${chiefdomSName} Name`}
              errorLabel={`${chiefdomSName.toLocaleLowerCase()} name`}
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
                  label={districtSName}
                  errorLabel={districtSName.toLocaleLowerCase()}
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
            render={({ input }) => {
              return <TagInput {...input} label={`Villages`} fromChiefDom={true} required={false} />;
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChiefdomForm;
