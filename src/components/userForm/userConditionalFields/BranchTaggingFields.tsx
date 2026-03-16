import { Field } from 'react-final-form';
import { useSelector } from 'react-redux';
import SelectInput from '../../formFields/SelectInput';
import { IRoles } from '../../../store/user/types';
import { branchesByUnionSelector, branchLoadingSelector } from '../../../store/branch/selectors';

interface BranchTaggingFieldsProps {
  name: string;
  form: any;
  spiceRoleList: IRoles[];
  isError: (meta: any) => string | undefined;
  isHFCreate?: boolean;
}

const BranchTaggingFields = ({ name, form, spiceRoleList, isError, isHFCreate }: BranchTaggingFieldsProps) => {
  const branches = useSelector(branchesByUnionSelector);
  const branchesLoading = useSelector(branchLoadingSelector);

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
