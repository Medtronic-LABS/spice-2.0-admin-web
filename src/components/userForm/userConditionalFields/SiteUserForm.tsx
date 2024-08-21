import { Field } from 'react-final-form';
import SelectInput from '../../formFields/SelectInput';
import { required } from '../../../utils/validation';
import APPCONSTANTS, { NAMING_VARIABLES, NAME_CONSTANTS } from '../../../constants/appConstants';
import Checkbox from '../../formFields/Checkbox';

export const SiteUserForm = ({
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
  formDetails
}: any) => {
  const { DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN } = APPCONSTANTS.ROLES;
  const { chiefdom: chiefdomModuleName, district } = NAMING_VARIABLES;

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
      {isSiteUser ? (
        <>
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
          {formDetails.fields?.value[index]?.roleName?.value !== APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN && (
            <div className='col-6'>
              <Field
                name={`${name}.redRisk`}
                type='checkbox'
                render={({ input }) => <Checkbox switchCheckbox={true} label='Red Risk' {...input} />}
              />
            </div>
          )}
        </>
      ) : !isAdminForm ? (
        <>
          {[DISTRICT_ADMIN, HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN].includes(selectedAdmins) && (
            <div className='col-sm-6 col-12'>
              <Field
                name={`${name}.${district}`}
                type='text'
                validate={required}
                render={({ input, meta }) => (
                  <SelectInput
                    {...(input as any)}
                    label={NAME_CONSTANTS.district}
                    errorLabel={NAME_CONSTANTS.district}
                    labelKey='name'
                    valueKey='id'
                    options={districtDetails.list}
                    loadingOptions={districtDetails.loaing}
                    error={isError(meta)}
                    isModel={true}
                  />
                )}
              />
            </div>
          )}
          {[HEALTH_FACILITY_ADMIN, CHIEFDOM_ADMIN].includes(selectedAdmins) && (
            <div className='col-sm-6 col-12'>
              <Field
                name={`${name}.${chiefdomModuleName}`}
                type='text'
                validate={required}
                render={({ input, meta }) => (
                  <SelectInput
                    {...(input as any)}
                    label={NAME_CONSTANTS.chiefdom}
                    errorLabel={NAME_CONSTANTS.chiefdom}
                    labelKey='name'
                    valueKey='id'
                    options={chiefdomDetails.list}
                    loadingOptions={chiefdomDetails.loading}
                    error={isError(meta)}
                    isModel={true}
                  />
                )}
              />
            </div>
          )}
          {selectedAdmins === APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN && (
            <div className='col-sm-6 col-12'>
              <Field
                name={`${name}.${NAMING_VARIABLES.healthFacility}`}
                type='text'
                validate={required}
                render={({ input, meta }) => {
                  return (
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
                  );
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div />
      )}
    </>
  );
};
