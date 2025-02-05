import React, { useEffect } from 'react';
import { Field, useForm } from 'react-final-form';

import TextInput from '../../components/formFields/TextInput';
import {
  composeValidators,
  convertToNumber,
  required,
  validateText,
  minLength,
  validateCountryCode
} from '../../utils/validation';
import { useDispatch } from 'react-redux';
import { clearAppType, setAppType } from '../../store/user/actions';
import localStorageServices from '../../global/localStorageServices';
import { APP_TYPE_NAME } from '../../constants/appConstants';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

const appTypes = [
  { name: 'Community', _id: 'COMMUNITY' },
  { name: 'Non Community', _id: 'NON_COMMUNITY' }
];

/**
 * Renders the fields for region form
 * @returns {React.ReactElement}
 */
const RegionForm = (): React.ReactElement => {
  const form = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !form.getState()?.values?.region?.phoneNumberCode?.length ||
      form?.getState()?.errors?.region?.phoneNumberCode
    ) {
      form.getState()?.values?.users?.forEach((user: any, index: number) => {
        form.change(`users[${index}].countryCode`, undefined);
      });
    } else {
      const regionCountryCode = form.getState()?.values?.region?.phoneNumberCode;
      form.getState()?.values?.users?.forEach((user: any, index: number) => {
        form.change(`users[${index}].countryCode`, regionCountryCode);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getState()?.values?.region?.phoneNumberCode]);

  // cleating app type when component mounts
  useEffect(() => {
    dispatch(clearAppType());
    localStorageServices.deleteItem(APP_TYPE_NAME);
    form.change(`region.appTypes`, [appTypes[0]._id]);
    handleAppTypeClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAppTypeClick = () => {
    setTimeout(() => {
      const selectedAppTypes = form.getState()?.values?.region?.appTypes || [];
      dispatch(setAppType(selectedAppTypes));
    }, 0);
  };

  const {
    region: { s: regionSName }
  } = useAppTypeConfigs();

  return (
    <div className='row gx-1dot25'>
      <div className='col-sm-6 col-12'>
        <Field
          name='region.name'
          type='text'
          validate={composeValidators(required, validateText, minLength(2))}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label={`${regionSName} Name`}
              errorLabel={`${regionSName.toLowerCase()} name`}
              capitalize={true}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      <div className='col-sm-6 col-12'>
        <Field
          name='region.phoneNumberCode'
          type='text'
          validate={composeValidators(required, validateCountryCode)}
          parse={convertToNumber}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='Country Code'
              errorLabel='country code'
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
    </div>
  );
};

export default RegionForm;
