import { Field } from 'react-final-form';
import SelectInput from '../../formFields/SelectInput';
import { required } from '../../../utils/validation';
import { NAMING_VARIABLES } from '../../../constants/appConstants';
import Checkbox from '../../formFields/Checkbox';
import useFieldVisibility from '../../../hooks/useFieldVisibility';
import useAppTypeConfigs from '../../../hooks/appTypeBasedConfigs';
import { useDispatch, useSelector } from 'react-redux';
import { loadingSelector, timezoneListSelector } from '../../../store/user/selectors';
import { useEffect } from 'react';
import { fetchCultureListRequest, fetchTimezoneListRequest } from '../../../store/user/actions';
import { filterByAppTypes } from '../../../utils/commonUtils';

export const SiteUserForm = (props: any) => {
  const dispatch = useDispatch();

  const timezoneList = useSelector(timezoneListSelector);
  const isTimezoneListLoading = useSelector(loadingSelector);

  const {
    index,
    name,
    isError,
    cultureList,
    isCultureListLoading,
    isSiteUser,
    selectedAdmins,
    districtDetails,
    chiefdomDetails,
    isAdminForm,
    assignedHFListHFAdmin,
    hfLoading,
    formDetails,
    role,
    isHFAdminSelected,
    isHFCreate,
    isEdit,
    isProfile,
    reportUserOnlyInAdminList // cfr user only from admin list
  } = props;
  const { form, formName } = formDetails;
  const isHFSelected =
    isSiteUser || isHFCreate ? isHFAdminSelected(form?.getState()?.values?.users?.[index]?.role) : [];
  const { showCulture, showRedRisk, showDistrict, showChiefdom, showHealthFacility } = useFieldVisibility(
    isSiteUser,
    isAdminForm,
    selectedAdmins,
    role,
    formDetails,
    index,
    isHFSelected
  );

  const {
    appTypes,
    user: {
      timezone: { available: isTimezoneAvailable },
      culture: { available: isCultureAvailable },
      redrisk: { available: isRedRisk }
    },
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    healthFacility: { s: healthfacilitySName }
  } = useAppTypeConfigs();

  useEffect(() => {
    if (!(timezoneList || []).length && isTimezoneAvailable) {
      dispatch(fetchTimezoneListRequest());
    }
    if (!(cultureList || []).length && isCultureAvailable) {
      dispatch(fetchCultureListRequest());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimezoneAvailable]);

  return (
    <>
      {isTimezoneAvailable && (
        <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
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
                options={timezoneList || []}
                loadingOptions={isTimezoneListLoading}
                error={isError(meta)}
                isModel={true}
              />
            )}
          />
        </div>
      )}
      {isCultureAvailable && showCulture && (
        <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
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
                options={filterByAppTypes(cultureList, appTypes) || []}
                loadingOptions={isCultureListLoading}
                error={isError(meta)}
                isModel={true}
                isMandatoryAutoPopulate={true}
              />
            )}
          />
        </div>
      )}
      {isRedRisk && showRedRisk && (
        <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6'} `}>
          <Field
            name={`${name}.redRisk`}
            type='checkbox'
            render={({ input }) => <Checkbox switchCheckbox={true} label='Red Risk' {...input} />}
          />
        </div>
      )}
      {showDistrict && (
        <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
          <Field
            name={`${name}.${NAMING_VARIABLES.district}`}
            type='text'
            validate={required}
            render={({ input, meta }) => (
              <SelectInput
                {...(input as any)}
                label={districtSName}
                errorLabel={districtSName}
                labelKey='name'
                valueKey='id'
                options={districtDetails.list}
                loadingOptions={districtDetails.loading}
                error={isError(meta)}
                disabled={isEdit && !reportUserOnlyInAdminList} // disable when admin edit
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
        <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
          <Field
            name={`${name}.${NAMING_VARIABLES.chiefdom}`}
            type='text'
            validate={required}
            render={({ input, meta }) => (
              <SelectInput
                {...(input as any)}
                label={chiefdomSName}
                errorLabel={chiefdomSName}
                labelKey='name'
                valueKey='id'
                options={chiefdomDetails.list}
                loadingOptions={chiefdomDetails.loading}
                error={isError(meta)}
                isModel={true}
                disabled={isEdit && !reportUserOnlyInAdminList} // disable when admin edit
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
        <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
          <Field
            name={`${name}.${NAMING_VARIABLES.healthFacility}`}
            type='text'
            validate={required}
            render={({ input, meta }) => (
              <SelectInput
                {...(input as any)}
                label={`Assigned ${healthfacilitySName}`}
                errorLabel={`assigned ${healthfacilitySName.toLowerCase()}`}
                labelKey='name'
                valueKey='id'
                disabled={isProfile && !reportUserOnlyInAdminList}
                options={assignedHFListHFAdmin}
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
