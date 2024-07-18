import React from 'react';
import { Field } from 'react-final-form';

import TextInput from '../../components/formFields/TextInput';
import {
  composeValidators,
  convertToNumber,
  required,
  validateText,
  minLength,
  validateCountryCode
} from '../../utils/validation';

/**
 * Renders the fields for region form
 * @returns {React.ReactElement}
 */
const RegionForm = (): React.ReactElement => {
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
              label='Region Name'
              errorLabel='region name'
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
