import { Field } from 'react-final-form';
import useAppTypeConfigs from '../../../hooks/appTypeBasedConfigs';
import { required } from '../../../utils/validation';
import SelectInput from '../../formFields/SelectInput';
import MultiSelect from '../../multiSelect/MultiSelect';
import { useParams } from 'react-router-dom';
import { IMatchParams } from '../../../containers/user/UserList';

export const DynamicCHForm = ({
  index,
  form,
  name,
  isHF,
  isEdit,
  isProfile,
  peerSupervisors,
  peerSupervisorLoading,
  autoFetched,
  villagesLoading,
  villages,
  isError,
  isChaUser,
  isChpUser,
  isActivating,
  communityList,
  isHFCreate,
  showVillages
}: any) => {
  const {
    user: {
      supervisor: { label, error: supervisorError }
    }
  } = useAppTypeConfigs();
  const { healthFacilityId } = useParams<IMatchParams>();
  const mandatoryVillages = form.getState().values.users[index].existingVillages || [];

  return (
    <>
      {showVillages && (
        <>
          <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
            <Field
              name={`${name}.supervisor`}
              type='text'
              validate={required}
              render={({ input, meta }) => (
                <SelectInput
                  {...(input as any)}
                  {...(meta as any)}
                  label={label}
                  errorLabel={supervisorError}
                  labelKey='name'
                  valueKey='id'
                  disabled={isProfile}
                  menuPlacement={'auto'}
                  options={peerSupervisors[index]}
                  loadingOptions={peerSupervisorLoading}
                  error={isError(meta)}
                  isModel={true}
                />
              )}
            />
          </div>
          {(autoFetched[index] || (isEdit && isHF)) && showVillages && !!mandatoryVillages.length && (
            <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
              <Field
                name={`${name}.existingVillages`}
                type='text'
                validate={(value) => required(Array.isArray(value) ? value : [])}
                render={({ input }) => {
                  return (
                    <MultiSelect
                      {...(input as any)}
                      label='Existing Villages'
                      labelKey='name'
                      valueKey='id'
                      required={true}
                      isShowLabel={true}
                      isSelectAll={true}
                      isDefaultSelected={true}
                      placeholder=''
                      menuPlacement={'auto'}
                      isDisabled={false}
                      isModel={true}
                      isMulti={true}
                      isOptionDisabled={(option: any) => {
                        return autoFetched[index] || isActivating || isEdit
                          ? (mandatoryVillages || []).map((v: any) => v.id).includes(option.id)
                          : null;
                      }}
                      mandatoryOptions={autoFetched[index] || isActivating || isEdit ? mandatoryVillages : []}
                      options={mandatoryVillages || []}
                      loadingOptions={villagesLoading}
                    />
                  );
                }}
              />
            </div>
          )}
          <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
            <Field
              name={`${name}.villages`}
              type='text'
              validate={(value) => required(Array.isArray(value) ? value : [])}
              render={({ input, meta }) => {
                const hfTenantId = isHF ? healthFacilityId : form.getState().values.users[index]?.healthfacility?.id;
                const currentFormValue = form.getState().values.users[index];
                const allVillages = villages[index];
                const selectedVillages = currentFormValue?.selectedVillages || [];
                const currentHFVillages =
                  autoFetched[index] || isEdit
                    ? (allVillages || []).filter((v: any) =>
                        v.healthFacilityId && hfTenantId
                          ? Number(v.healthFacilityId) === Number(hfTenantId)
                          : !(selectedVillages || []).some((mv: any) => mv.id === v.id)
                      )
                    : allVillages;
                return (
                  <MultiSelect
                    {...(input as any)}
                    label='Assigned Villages'
                    errorLabel='assigned villages'
                    labelKey='name'
                    valueKey='id'
                    required={true}
                    isShowLabel={true}
                    isSelectAll={true}
                    isDefaultSelected={true}
                    placeholder=''
                    menuPlacement={'auto'}
                    isDisabled={isProfile || (!isHF && isEdit)}
                    isModel={true}
                    isMulti={true}
                    options={currentHFVillages || []}
                    loadingOptions={villagesLoading}
                    error={isError(meta)}
                  />
                );
              }}
            />
          </div>
        </>
      )}
      {isChaUser && (
        <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
          <Field
            name={`${name}.communityUnit`}
            type='text'
            render={({ input, meta }) => (
              <SelectInput
                {...(input as any)}
                label='Community Unit'
                errorLabel='community unit'
                required={false}
                labelKey='name'
                valueKey='id'
                options={communityList}
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
