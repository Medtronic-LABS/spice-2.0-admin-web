import { Field } from 'react-final-form';
import SelectInput from '../../formFields/SelectInput';
import { required } from '../../../utils/validation';

interface BranchTaggingFieldsProps {
  name: string;
  form: any;
  isError: (meta: any) => string | undefined;
  isHFCreate?: boolean;
}

const BranchTaggingFields = ({
  name,
  form,
  isError,
  isHFCreate
}: BranchTaggingFieldsProps) => {
  return (
    <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
      <Field
        name={`${name}.branch`}
        type='text'
        validate={required}
        render={({ input, meta }) => (
          <SelectInput
            {...(input as any)}
            label='Branch'
            errorLabel='branch'
            labelKey='name'
            valueKey='id'
            error={isError(meta)}
            isModel={true}
          />
        )}
      />
    </div>
  );
};

export default BranchTaggingFields;

