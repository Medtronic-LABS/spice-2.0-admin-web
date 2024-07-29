import React from 'react';
import { Field } from 'react-final-form';
import TextInput from '../../components/formFields/TextInput';
import { composeValidators, containsOnlyLettersAndNumbers, minLength, required } from '../../utils/validation';
import { FormApi } from 'final-form';

const LabtestModalForm = ({ isEdit = false, form }: { isEdit: boolean; form: FormApi | undefined }) => {
  return (
    <>
      <div className='row gx-1dot25'>
        <div className='col-12 col-lg-6'>
        <div className='col-12 col-lg-6'>
          <Field
            name='testName'
            type='text'
            validate={composeValidators(required, minLength(2))}
            render={({ input, meta }) => (
              <TextInput
                {...input}
                label={'Lab Test Name'}
                errorLabel='lab test name'
                capitalize={true}
                error={(meta.touched && meta.error) || undefined}
              />
            )}
          />
        </div>
        <div className='col-12 col-lg-6'>
          <Field
            name='codeDetails.code'
            type='text'
            validate={composeValidators(required)}
            render={({ input, meta }) => (
              <TextInput {...input} label='Code' errorLabel='code' error={(meta.touched && meta.error) || undefined} />
            )}
          />
        </div>
        <div className='col-12 col-lg-6'>
          <Field
            name='url'
            type='text'
            validate={composeValidators(required)}
            render={({ input, meta }) => (
              <TextInput {...input} label='URL' errorLabel='url' error={(meta.touched && meta.error) || undefined} />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default LabtestModalForm;
