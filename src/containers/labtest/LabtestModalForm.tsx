import React from 'react';
import { Field } from 'react-final-form';
import TextInput from '../../components/formFields/TextInput';
import { composeValidators, containsOnlyLettersAndNumbers, minLength, required } from '../../utils/validation';
import { FormApi } from 'final-form';

/**
 * Interface for LabtestModalForm props
 */
interface ILabtestModalFormProps {
  /** Flag indicating if the form is in edit mode */
  isEdit: boolean;
  /** Form API instance */
  form: FormApi | undefined;
}

/**
 * LabtestModalForm component for rendering the lab test form fields
 * @param {ILabtestModalFormProps} props - The component props
 * @returns {React.ReactElement} The rendered form fields
 */
const LabtestModalForm = ({ isEdit = false, form }: ILabtestModalFormProps): React.ReactElement => {
  return (
    <>
      <div className='row gx-1dot25'>
        {/* Lab Test Name field */}
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
        {/* Code field */}
        <div className='col-12 col-lg-6'>
          <Field
            name='codeDetails.code'
            type='text'
            validate={composeValidators(required, containsOnlyLettersAndNumbers)}
            render={({ input, meta }) => (
              <TextInput {...input} label='Code' errorLabel='code' error={(meta.touched && meta.error) || undefined} />
            )}
          />
        </div>
        {/* URL field */}
        <div className='col-12 col-lg-6'>
          <Field
            name='codeDetails.url'
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
