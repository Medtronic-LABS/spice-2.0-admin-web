import { Field } from 'react-final-form';
import { useMemo, useCallback } from 'react';
import useAppTypeConfigs from '../../../hooks/appTypeBasedConfigs';
import { required } from '../../../utils/validation';
import SelectInput from '../../formFields/SelectInput';
import MultiSelect from '../../multiSelect/MultiSelect';
import { useParams } from 'react-router-dom';
import { IMatchParams } from '../../../containers/user/UserList';
import useUserFormUtils from '../userFormUtils';

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
  const { isCHPCHWSelected } = useUserFormUtils();
  const { healthFacilityId } = useParams<IMatchParams>();

  // Memoize form values to prevent unnecessary re-renders
  const formValues = useMemo(() => form.getState().values.users[index], [form, index]);
  const mandatoryVillages = useMemo(() => formValues?.existingVillages || [], [formValues?.existingVillages]);

  // Memoize the current HF villages calculation
  const currentHFVillages = useMemo(() => {
    const hfTenantId = isHF ? healthFacilityId : formValues?.healthfacility?.id;
    const allVillages = villages[index];
    const selectedVillages = formValues?.selectedVillages || [];

    if (autoFetched[index] || isEdit) {
      return (allVillages || []).filter((v: any) =>
        v.healthFacilityId && hfTenantId
          ? Number(v.healthFacilityId) === Number(hfTenantId)
          : !(selectedVillages || []).some((mv: any) => mv.id === v.id)
      );
    }
    return allVillages;
  }, [
    autoFetched,
    index,
    isEdit,
    isHF,
    healthFacilityId,
    formValues?.healthfacility?.id,
    villages,
    formValues?.selectedVillages
  ]);

  // Memoize the edit disabled state
  const isEditDisabled = useMemo(() => {
    const selectedRoles = formValues?.selectedRoles || [];
    return isEdit && isCHPCHWSelected(selectedRoles);
  }, [isEdit, isCHPCHWSelected, formValues?.selectedRoles]);

  // Memoize the supervisor field render function
  const renderSupervisorField = useCallback(
    ({ input, meta }: any) => (
      <SelectInput
        {...input}
        {...meta}
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
    ),
    [index, isError, isProfile, label, peerSupervisorLoading, peerSupervisors, supervisorError]
  );

  // Memoize the existing villages field render function
  const renderExistingVillagesField = useCallback(
    ({ input }: any) => (
      <MultiSelect
        {...input}
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
    ),
    [autoFetched, index, isActivating, isEdit, mandatoryVillages, villagesLoading]
  );

  // Memoize the assigned villages field render function
  const renderAssignedVillagesField = useCallback(
    ({ input, meta }: any) => (
      <MultiSelect
        {...input}
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
        isDisabled={isProfile || (!isHF && isEditDisabled)}
        isModel={true}
        isMulti={true}
        options={currentHFVillages || []}
        loadingOptions={villagesLoading}
        error={isError(meta)}
      />
    ),
    [currentHFVillages, isEditDisabled, isHF, isProfile, isError, villagesLoading]
  );

  // Memoize the community unit field render function
  const renderCommunityUnitField = useCallback(
    ({ input, meta }: any) => (
      <SelectInput
        {...input}
        label='Community Unit'
        errorLabel='community unit'
        required={false}
        labelKey='name'
        valueKey='id'
        options={communityList}
        error={isError(meta)}
        isModel={true}
      />
    ),
    [communityList, isError]
  );

  if (!showVillages) {
    return null;
  }

  return (
    <>
      <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
        <Field name={`${name}.supervisor`} type='text' validate={required} render={renderSupervisorField} />
      </div>
      {(autoFetched[index] || (isEdit && isHF)) && showVillages && !!mandatoryVillages.length && (
        <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
          <Field
            name={`${name}.existingVillages`}
            type='text'
            validate={(value) => required(Array.isArray(value) ? value : [])}
            render={renderExistingVillagesField}
          />
        </div>
      )}
      <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
        <Field
          name={`${name}.villages`}
          type='text'
          validate={(value) => required(Array.isArray(value) ? value : [])}
          render={renderAssignedVillagesField}
        />
      </div>
      {isChaUser && (
        <div className={`${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `}>
          <Field name={`${name}.communityUnit`} type='text' render={renderCommunityUnitField} />
        </div>
      )}
    </>
  );
};
