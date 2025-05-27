import { Field } from 'react-final-form';
import useAppTypeConfigs from '../../../hooks/appTypeBasedConfigs';
import { required } from '../../../utils/validation';
import SelectInput from '../../formFields/SelectInput';
import MultiSelect from '../../multiSelect/MultiSelect';

export const DynamicCHForm = ({
  index,
  form,
  isProfile,
  name,
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
          {autoFetched[index] && showVillages && (
            <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
              <Field
                name={`${name}.existingVillages`}
                type='text'
                validate={(value) => required(Array.isArray(value) ? value : [])}
                render={({ input }) => {
                  const mandatoryVillages = form.getState().values.users[index].selectedVillages || [];
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
                        return autoFetched[index] || isActivating
                          ? (mandatoryVillages || []).map((v: any) => v.id).includes(option.id)
                          : null;
                      }}
                      mandatoryOptions={autoFetched[index] || isActivating ? mandatoryVillages : []}
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
                const currentFormValue = form.getState().values.users[index];
                const allVillages = villages[index];
                const selectedVillages = currentFormValue?.selectedVillages || [];
                const currentHFVillages = (allVillages || []).filter(
                  (v: any) => !(selectedVillages || []).some((mv: any) => mv.id === v.id)
                );
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
                    isDisabled={isProfile}
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
