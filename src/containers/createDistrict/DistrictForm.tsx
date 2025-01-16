import React from 'react';
import { Field } from 'react-final-form';

import TextInput from '../../components/formFields/TextInput';
import { required, composeValidators, validateEntityName } from '../../utils/validation';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

/**
 * District Form component
 */
const DistrictForm = (): React.ReactElement => {
  const {
    district: { s: districtSName }
  } = useAppTypeConfigs();
  return (
    <div className='row gx-1dot25'>
      <div className='col-12'>
        <Field
          name='district.name'
          type='text'
          validate={composeValidators(required, validateEntityName)}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label={`${districtSName} Name`}
              errorLabel={`${districtSName.toLowerCase()} name`}
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

export default DistrictForm;
