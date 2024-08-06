import { FormApi } from 'final-form';
import React from 'react';
import { Field } from 'react-final-form';

import TextInput from '../../components/formFields/TextInput';
import { required, composeValidators, validateEntityName } from '../../utils/validation';
import { NAME_CONSTANTS } from '../../constants/appConstants';

/**
 * Renders the fields for county form
 * @returns {React.ReactElement}
 */
const CountyForm = ({ form }: { form: FormApi<any> }): React.ReactElement => {
  const moduleName = NAME_CONSTANTS.county;
  return (
    <div className='row gx-1dot25'>
      <div className='col-12'>
        <Field
          name='county.name'
          type='text'
          validate={composeValidators(required, validateEntityName)}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label={`${moduleName} Name`}
              errorLabel={`${moduleName.toLowerCase()} name`}
              placeholder='Name'
              capitalize={true}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
    </div>
  );
};

export default CountyForm;
