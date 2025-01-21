import { useEffect } from 'react';
import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../../components/formFields/TextInput';
import SelectInput from '../../components/formFields/SelectInput';
import Checkbox from '../../components/formFields/Checkbox';
import { healthFacilityListSelector, healthFacilityLoadingSelector } from '../../store/healthFacility/selectors';
import { IProgramFormValues } from '../../store/program/types';
import { composeValidators, required, minLength, validateEntityName } from '../../utils/validation';
import { countryIdSelector } from '../../store/user/selectors';
import sessionStorageServices from '../../global/sessionStorageServices';
import APPCONSTANTS from '../../constants/appConstants';
import { clearHFList, fetchHFListRequest } from '../../store/healthFacility/actions';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

/**
 * Interface for ProgramForm props
 */
interface IProgramFormProps {
  form: FormApi<{ program: IProgramFormValues }>;
  tenantId: string;
  isEdit?: boolean;
}

/**
 * Form component for Program creation and editing
 * @param {IProgramFormProps} props - The component props
 * @returns {React.ReactElement} The rendered form
 */
const ProgramForm = (props: IProgramFormProps): React.ReactElement => {
  const { tenantId, isEdit = false } = props;
  const countryId = useSelector(countryIdSelector);
  const healthFacilityList = useSelector(healthFacilityListSelector);
  const countryIdValue = countryId?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID);
  const dispatch = useDispatch();
  const hfListLoading = useSelector(healthFacilityLoadingSelector);
  const {
    healthFacility: { s: healthFacilitySName }
  } = useAppTypeConfigs();

  // Fetch health facility list on component mount
  useEffect(() => {
    dispatch(
      fetchHFListRequest({
        countryId: countryIdValue,
        skip: 0,
        limit: null,
        tenantIds: [tenantId]
      })
    );
  }, [dispatch, tenantId, countryIdValue]);

  useEffect(() => {
    return () => {
      dispatch(clearHFList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='row gx-1dot25'>
      {/* Program Name Field */}
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
      {/* Health Facility Field */}
      <div className='col-lg-6 col-6'>
        <Field
          name='program.healthFacilities'
          type='text'
          validate={required}
          render={({ input, meta }) => (
            <SelectInput
              {...(input as any)}
              label={healthFacilitySName}
              errorLabel={healthFacilitySName.toLowerCase()}
              valueKey='id'
              labelKey='name'
              isMulti={true}
              isModel={isEdit}
              options={healthFacilityList}
              loadingOptions={hfListLoading}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      {/* Status Checkbox (only for edit mode) */}
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
