import { Field } from 'react-final-form';
import { useSelector } from 'react-redux';
import SelectInput from '../../formFields/SelectInput';
import { branchesByUnionSelector, branchLoadingByUnionSelector } from '../../../store/branch/selectors';

interface BranchTaggingFieldsProps {
  name: string;
  isError: (meta: any) => string | undefined;
  isHFCreate?: boolean;
}

const BranchTaggingFields = ({ name, isError, isHFCreate }: BranchTaggingFieldsProps) => {
  const branches = useSelector(branchesByUnionSelector);
  const branchesLoading = useSelector(branchLoadingByUnionSelector);

  return (
    <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
      <Field
        name={`${name}.branches`}
        type='text'
        render={({ input, meta }) => (
          <SelectInput
            {...(input as any)}
            label='Branch'
            errorLabel='branch'
            labelKey='name'
            valueKey='id'
            options={branches || []}
            loadingOptions={branchesLoading}
            error={isError(meta)}
            isModel={true}
            required={false}
          />
        )}
      />
    </div>
  );
};

export default BranchTaggingFields;
