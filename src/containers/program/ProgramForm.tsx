import { useEffect } from 'react';
import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../../components/formFields/TextInput';
import SelectInput from '../../components/formFields/SelectInput';
import Checkbox from '../../components/formFields/Checkbox';
import { healthFacilityLoadingSelector } from '../../store/healthFacility/selectors';
import { IProgramFormValues } from '../../store/program/types';
import { composeValidators, required, minLength, validateEntityName } from '../../utils/validation';
import { fetchHFDropdownRequest } from '../../store/program/actions';
import { countryIdSelector } from '../../store/user/selectors';
import sessionStorageServices from '../../global/sessionStorageServices';
import APPCONSTANTS from '../../constants/appConstants';
import { siteListDropdownSelector } from '../../store/program/selectors';

interface IProgramFormProps {
  form: FormApi<{ program: IProgramFormValues }>;
  tenantId: string;
  isEdit?: boolean;
}

/**
 * Form for Program Form
 * @param param0
 * @returns {React.ReactElement}
 */
const ProgramForm = (props: IProgramFormProps): React.ReactElement => {
  const { tenantId, isEdit = false } = props;
  const countryId = useSelector(countryIdSelector);
  const countryIdValue = countryId?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID);
  const dispatch = useDispatch();

  const hfListDropdown = useSelector(siteListDropdownSelector);
  const hfListLoading = useSelector(healthFacilityLoadingSelector);
  useEffect(() => {
    if (tenantId !== hfListDropdown.countryId) {
      dispatch(fetchHFDropdownRequest({ tenantId, countryId: countryIdValue }));
    }
  }, [dispatch, tenantId, hfListDropdown.countryId, countryIdValue, hfListDropdown]);

  return (
    <div className='row gx-1dot25'>
      <div className='col-12 col-md-6'>
        <Field
          name='program.name'
          type='text'
          validate={composeValidators(required, minLength(2), validateEntityName)}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='Program Name'
              disabled={isEdit}
              errorLabel='program name'
              error={(meta.touched && meta.error) || undefined}
              capitalize={true}
            />
          )}
        />
      </div>
      <div className='col-lg-6 col-6'>
        <Field
          name='program.healthFacility'
          type='text'
          validate={required}
          render={({ input, meta }) => (
            <SelectInput
              {...(input as any)}
              label='Health Facility'
              errorLabel='health facility'
              valueKey='id'
              labelKey='name'
              isMulti={true}
              isModel={isEdit}
              options={hfListDropdown.list}
              loadingOptions={hfListLoading}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      {isEdit && (
        <div className='col-6'>
          <Field
            name='program.active'
            type='checkbox'
            render={({ input }) => <Checkbox switchCheckbox={true} label='Status' {...input} />}
          />
        </div>
      )}
    </div>
  );
};

export default ProgramForm;
