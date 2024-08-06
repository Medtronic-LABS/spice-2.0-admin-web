import { Field } from 'react-final-form';
import SelectInput from '../../formFields/SelectInput';
import { required } from '../../../utils/validation';
import APPCONSTANTS from '../../../constants/appConstants';
import Checkbox from '../../formFields/Checkbox';

export const SiteUserForm = ({
  index,
  name,
  isError,
  isCultureListLoading,
  cultureList,
  timezoneList,
  isTmezoneListLoading,
  fields,
  isSiteUser,
  selectedAdmins,
  countyDetails,
  subCountyDetails,
  isAdminForm
}: any) => {
  const { ACCOUNT_ADMIN, HEALTH_FACILITY_ADMIN, SUB_COUNTY_ADMIN, REGION_ADMIN, SUPER_ADMIN } = APPCONSTANTS.ROLES;

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
          {fields?.value[index]?.roleName?.value !== 'SITE_ADMIN' && (
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
          {[ACCOUNT_ADMIN, HEALTH_FACILITY_ADMIN, SUB_COUNTY_ADMIN].includes(selectedAdmins) && (
            <div className='col-sm-6 col-12'>
              <Field
                name={`${name}.county`}
                type='text'
                validate={required}
                render={({ input, meta }) => (
                  <SelectInput
                    {...(input as any)}
                    label='County'
                    errorLabel='county'
                    labelKey='name'
                    valueKey='id'
                    options={countyDetails.list}
                    loadingOptions={countyDetails.loaing}
                    error={isError(meta)}
                    isModel={true}
                  />
                )}
              />
            </div>
          )}
          {[HEALTH_FACILITY_ADMIN, SUB_COUNTY_ADMIN].includes(selectedAdmins) && (
            <div className='col-sm-6 col-12'>
              <Field
                name={`${name}.subCounty`}
                type='text'
                validate={required}
                render={({ input, meta }) => (
                  <SelectInput
                    {...(input as any)}
                    label='Sub County'
                    errorLabel='subCounty'
                    labelKey='name'
                    valueKey='id'
                    options={subCountyDetails.list}
                    loadingOptions={subCountyDetails.loading}
                    error={isError(meta)}
                    isModel={true}
                  />
                )}
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
