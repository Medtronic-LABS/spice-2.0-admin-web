import React, { useEffect } from 'react';
import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import SelectInput from '../formFields/SelectInput';
import TextInput from '../formFields/TextInput';
import { fetchCountyListDetailReq, fetchCountyOptionsRequest } from '../../store/county/actions';
import {
  countyOptionsLoadingSelector,
  countyOptionsSelector,
  countySelector,
  countyLoadingSelector
} from '../../store/county/selectors';
import { composeValidators, required, validateEntityName } from '../../utils/validation';
import { roleSelector } from '../../store/user/selectors';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';

interface ISubCountyFormProps {
  nestingKey?: string;
  isEdit?: boolean;
  form?: FormApi<any>;
}

/**
 * Renders the fields for subCounty form
 * @returns {React.ReactElement}
 */
const SubCountyForm = ({ nestingKey, isEdit = false, form }: ISubCountyFormProps): React.ReactElement => {
  const dispatch = useDispatch();
  const countyOptions = useSelector(countyOptionsSelector);
  const countyOptionsLoading = useSelector(countyOptionsLoadingSelector);
  const { regionId, countyId, tenantId } = useParams<{ regionId?: string; countyId?: string; tenantId: string }>();

  const { county: countyModuleName, subCounty: subCountyModuleName } = NAME_CONSTANTS;

  useEffect(() => {
    if (regionId && tenantId && !isEdit) {
      dispatch(fetchCountyOptionsRequest(tenantId));
    }
  }, [dispatch, regionId, tenantId, isEdit]);

  // Logic for county autoselecting when the route is createSubCountyByCounty
  // route is createSubCountyByCounty, if isEdit = false and the route contains countyId param
  const county = useSelector(countySelector);
  const countyLoading = useSelector(countyLoadingSelector);
  const role = useSelector(roleSelector);
  const { ROLES } = APPCONSTANTS;
  const showCountyField = ROLES.SUPER_ADMIN === role || ROLES.SUPER_USER === role || ROLES.REGION_ADMIN === role;
  useEffect(() => {
    if (showCountyField && !isEdit && countyId && county?.id !== countyId) {
      dispatch(
        fetchCountyListDetailReq({
          tenantId,
          id: countyId
        })
      );
    }
  }, [county?.id, countyId, dispatch, isEdit, showCountyField, tenantId]);

  useEffect(() => {
    if (!isEdit && countyId) {
      const { values: formValues = {} } = form?.getState?.() || {};
      let countyFormValue = '';
      if (nestingKey) {
        countyFormValue = (nestingKey.split('.').reduce((a, b: string) => a[b], formValues) || {}).county;
      } else {
        countyFormValue = formValues.county;
      }
      if (!countyFormValue && county?.id.toString() === countyId) {
        form?.change(`${nestingKey ? nestingKey + '.' : ''}county`, county);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countyId, form, isEdit, nestingKey]);

  const nestingKeyName = `${nestingKey ? nestingKey + '.' : ''}name`;
  const nestingKeyCounty = `${nestingKey ? nestingKey + '.' : ''}county`;

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
              label={`${subCountyModuleName} Name`}
              errorLabel={`${subCountyModuleName.toLocaleLowerCase()} name`}
              capitalize={true}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      {showCountyField && (
        <div className='col-12 col-md-6'>
          <Field
            name={nestingKeyCounty}
            type='text'
            validate={required}
            render={({ input, meta }) => {
              return (
                <SelectInput
                  {...(input as any)}
                  disabled={Boolean(countyId || isEdit)}
                  options={countyId || isEdit ? [] : countyOptions || []}
                  loadingOptions={countyOptionsLoading || countyLoading}
                  labelKey='name'
                  valueKey='id'
                  label={countyModuleName}
                  errorLabel={countyModuleName.toLocaleLowerCase()}
                  error={(meta.touched && meta.error) || undefined}
                />
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SubCountyForm;
