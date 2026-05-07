import { Field, useField } from 'react-final-form';
import { useSelector } from 'react-redux';
import SelectInput from '../../formFields/SelectInput';
import MultiSelect from '../../multiSelect/MultiSelect';
import { branchesByUnionSelector, branchLoadingByUnionSelector } from '../../../store/branch/selectors';
import { getRoleFlags } from '../userFormUtils';
import { required } from '../../../utils/validation';

interface IBranchTaggingFieldsProps {
  name: string;
  isError: (meta: any) => string | undefined;
  isHFCreate?: boolean;
  index: number;
}

const BranchTaggingFields = ({ name, isError, isHFCreate, index }: IBranchTaggingFieldsProps) => {
  const branches = useSelector(branchesByUnionSelector);
  const branchesLoading = useSelector(branchLoadingByUnionSelector);
  const {
    input: { value: spiceRole }
  } = useField(`users.${index}.role`, { subscription: { value: true } });
  const roleFlags = getRoleFlags(spiceRole);
  const { isPoSelected, isFoSelected, isShastiyaKormiSelected, isAreaManagerSelected, isDivisionalManagerSelected } =
    roleFlags;
  const isManagerSelected = isAreaManagerSelected || isDivisionalManagerSelected;
  const isOrganizerSelected = isPoSelected || isFoSelected;

  if (!isShastiyaKormiSelected && !isManagerSelected && !isOrganizerSelected) {
    return null;
  }

  return (
    <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
      <Field
        name={`${name}.branches`}
        type='text'
        validate={(isManagerSelected || isOrganizerSelected) ? required : undefined}
        render={({ input, meta }) =>
          // Manager roles always use multi-select, including users with both manager and SK roles.
          (isManagerSelected || isOrganizerSelected) ? (
            <MultiSelect
              {...(input as any)}
              label='Branches'
              errorLabel='branches'
              labelKey='name'
              valueKey='id'
              options={branches || []}
              loadingOptions={branchesLoading}
              error={isError(meta)}
              isModel={true}
              required={true}
              isShowLabel={true}
              isSelectAll={true}
              isDefaultSelected={true}
              placeholder=''
              menuPlacement={'auto'}
              isDisabled={false}
              isMulti={true}
            />
          ) : (
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
          )
        }
      />
    </div>
  );
};

export default BranchTaggingFields;
