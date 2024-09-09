import { Field } from 'react-final-form';
import SelectInput from '../../formFields/SelectInput';
import { required } from '../../../utils/validation';
import { NAMING_VARIABLES, NAME_CONSTANTS } from '../../../constants/appConstants';
import Checkbox from '../../formFields/Checkbox';
import useFieldVisibility from '../../../hooks/useFieldVisibility';

export const SiteUserForm = (props: any) => {
  const {
    index,
    name,
    isError,
    isCultureListLoading,
    cultureList,
    timezoneList,
    isTmezoneListLoading,
    isSiteUser,
    selectedAdmins,
    districtDetails,
    chiefdomDetails,
    isAdminForm,
    healthFacilityList,
    hfLoading,
    formDetails,
    role
  } = props;

  const { showCulture, showRedRisk, showDistrict, showChiefdom, showHealthFacility } = useFieldVisibility(
    isSiteUser,
    isAdminForm,
    selectedAdmins,
    role,
    formDetails,
    index
  );
  const { form, formName } = formDetails;

  return (
    <>
      <div className='col-sm-6 col-12'>
        <Field
          name={`${name}.timezone`}
          type='text'
          validate={required}
          render={({ input, meta }) => (
            <SelectInput
              {...(input as any)}
              label='Timezone'
              errorLabel='timezone'
              labelKey='description'
              valueKey='id'
              options={timezoneList}
              loadingOptions={isTmezoneListLoading}
              error={isError(meta)}
              isModel={true}
            />
          )}
        />
      </div>
      {showCulture && (
        <div className='col-sm-6 col-12'>
          <Field
            name={`${name}.culture`}
            type='text'
            render={({ input, meta }) => (
              <SelectInput
                {...(input as any)}
                label='Culture'
                errorLabel='culture'
                required={false}
                labelKey='name'
                valueKey='id'
                options={cultureList}
                loadingOptions={isCultureListLoading}
                error={isError(meta)}
                isModel={true}
              />
            )}
          />
        </div>
      )}
      {showRedRisk && (
        <div className='col-6'>
          <Field
            name={`${name}.redRisk`}
            type='checkbox'
            render={({ input }) => <Checkbox switchCheckbox={true} label='Red Risk' {...input} />}
          />
        </div>
      )}
      {showDistrict && (
        <div className='col-sm-6 col-12'>
          <Field
            name={`${name}.${NAMING_VARIABLES.district}`}
            type='text'
            validate={required}
            render={({ input, meta }) => (
              <SelectInput
                {...(input as any)}
                label={NAME_CONSTANTS.district.s}
                errorLabel={NAME_CONSTANTS.district.s}
                labelKey='name'
                valueKey='id'
                options={districtDetails.list}
                loadingOptions={districtDetails.loading}
                error={isError(meta)}
                isModel={true}
                onChange={(value: any) => {
                  form.change(`${formName}[0].chiefdom`, undefined);
                  form.change(`${formName}[0].healthfacility`, undefined);
                  input.onChange(value);
                }}
              />
            )}
          />
        </div>
      )}
      {showChiefdom && (
        <div className='col-sm-6 col-12'>
          <Field
            name={`${name}.${NAMING_VARIABLES.chiefdom}`}
            type='text'
            validate={required}
            render={({ input, meta }) => (
              <SelectInput
                {...(input as any)}
                label={NAME_CONSTANTS.chiefdom.s}
                errorLabel={NAME_CONSTANTS.chiefdom.s}
                labelKey='name'
                valueKey='id'
                options={chiefdomDetails.list}
                loadingOptions={chiefdomDetails.loading}
                error={isError(meta)}
                isModel={true}
                onChange={(value: any) => {
                  form.change(`${formName}[0].healthfacility`, undefined);
                  input.onChange(value);
                }}
              />
            )}
          />
        </div>
      )}
      {showHealthFacility && (
        <div className='col-sm-6 col-12'>
          <Field
            name={`${name}.${NAMING_VARIABLES.healthFacility}`}
            type='text'
            validate={required}
            render={({ input, meta }) => (
              <SelectInput
                {...(input as any)}
                label='Assigned Health Facility'
                errorLabel='assigned health facility'
                labelKey='name'
                valueKey='id'
                options={healthFacilityList}
                loadingOptions={hfLoading}
                error={isError(meta)}
                isModel={true}
              />
            )}
          />
        </div>
      )}
    </>
  );
};
