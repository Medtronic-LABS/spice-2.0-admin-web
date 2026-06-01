import { Field } from 'react-final-form';
import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/hooks';

import { useParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import useAppTypeConfigs from '../../../hooks/appTypeBasedConfigs';
import { IMatchParams } from '../../../containers/user/UserList';
import { fetchSubVillagesRequest, fetchSubVillagesSuccess } from '../../../store/region/actions';
import { required } from '../../../utils/validation';
import SelectInput from '../../formFields/SelectInput';
import useUserFormUtils from '../userFormUtils';
import MultiSelect from '../../multiSelect/MultiSelect';
import toastCenter, { getErrorToastArgs } from '../../../utils/toastCenter';
import APPCONSTANTS from '../../../constants/appConstants';
import { IVillages } from '../../../store/healthFacility/types';
import { IRoles } from '../../../store/user/types';
import { shastiyaKormiRole } from '../../../constants/roleConstants';
import { fetchBranchesByUnionRequest } from '../../../store/branch/actions';

// Stable empty array to avoid new reference when not in HF create (prevents infinite loop in useMemo/useEffect)
const EMPTY_VILLAGES: IVillages[] = [];

const extractVillageIds = (value: IVillages[]): number[] => {
  let values: IVillages[];
  if (Array.isArray(value)) {
    values = value;
  } else if (value) {
    values = [value];
  } else {
    values = [];
  }

  return values
    .map((v: any) => Number(v?.id))
    .filter((id): id is number => !Number.isNaN(id));
};

export const DynamicCHForm = ({
  index,
  form,
  name,
  spiceRoleList,
  isHF,
  isEdit,
  isProfile,
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
  const dispatch = useAppDispatch();
  const { isCHPCHWSelected } = useUserFormUtils();
  const { healthFacilityId } = useParams<IMatchParams>();
  const { village: { p: villagePName } } = useAppTypeConfigs();
  const isShastiyaKormiSelected = useMemo(
    () => spiceRoleList.some((r: IRoles) => r?.name === shastiyaKormiRole),
    [spiceRoleList]
  );

  const fetchSubVillages = useCallback(
    (villageIds: number[]) => {
      if (isShastiyaKormiSelected) {
        dispatch(
          fetchSubVillagesRequest({
            villageIds,
            failureCb: (e) => {
              toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.SUBVILLAGES_FETCH_FAIL));
            }
          })
        );
        dispatch(
          fetchBranchesByUnionRequest({
            payload: { unionIds: villageIds },
            failureCb: (e) => {
              toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.BRANCHES_BY_UNIONS_FETCH_FAIL));
            }
          })
        );
      }
    },
    [dispatch, isShastiyaKormiSelected]
  );

  // Memoize form values to prevent unnecessary re-renders
  const formValues = useMemo(() => form.getState().values.users[index], [form, index]);
  const healthFacilityLinkedVillages = form.getState().values?.healthFacility?.linkedVillages;
  const mandatoryVillages = useMemo(() => formValues?.existingVillages || [], [formValues?.existingVillages]);

  // When creating user from HF create flow, use linked villages from the health facility form.
  // When editing (!isHFCreate), use stable EMPTY_VILLAGES so dependency doesn't change every render.
  const linkedVillagesFromHF = useMemo(() => {
    if (!isHFCreate) {
      return EMPTY_VILLAGES;
    }

    return Array.isArray(healthFacilityLinkedVillages) ? healthFacilityLinkedVillages : EMPTY_VILLAGES;
  }, [healthFacilityLinkedVillages, isHFCreate]);

  // Memoize the current HF villages calculation
  const currentHFVillages = useMemo(() => {
    if (isHFCreate) {
      return linkedVillagesFromHF;
    }
    const hfTenantId = isHF ? healthFacilityId : formValues?.healthfacility?.[0]?.formDataId;
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
    isHFCreate,
    linkedVillagesFromHF,
    autoFetched,
    index,
    isEdit,
    isHF,
    healthFacilityId,
    formValues?.healthfacility?.[0]?.formDataId,
    villages,
    formValues?.selectedVillages
  ]);

  // In edit mode, on mount fetch sub-villages for already selected villages
  const hasFetchedSubVillagesForEdit = useRef(false);
  useEffect(() => {
    if (!isEdit) {
      hasFetchedSubVillagesForEdit.current = false;
      return;
    }
    const selected = formValues?.selectedVillages;
    if (!selected?.length || hasFetchedSubVillagesForEdit.current) { return; }
    const villageIds = extractVillageIds(selected);
    if (villageIds.length > 0) {
      hasFetchedSubVillagesForEdit.current = true;
      fetchSubVillages(villageIds);
    }
  }, [isEdit, formValues?.selectedVillages, fetchSubVillages]);

  // When there is only one option, the field is auto-filled and onChange may not run —
  // fetch sub-villages for that village
  useEffect(() => {
    if (currentHFVillages?.length === 1) {
      const villageId = currentHFVillages[0]?.id;
      if (villageId != null) {
        fetchSubVillages([Number(villageId)]);
      }
    }
  }, [currentHFVillages, fetchSubVillages]);

  const debouncedFetchSubVillages = useMemo(
    () =>
      debounce((villageIds: number[]) => {
        fetchSubVillages(villageIds);
      }, APPCONSTANTS.SUB_VILLAGES_DEBOUNCE_MS),
    [fetchSubVillages]
  );

  useEffect(() => () => debouncedFetchSubVillages.cancel(), [debouncedFetchSubVillages]);

  // Memoize the edit disabled state
  const isEditDisabled = useMemo(() => {
    const selectedRoles = formValues?.selectedRoles || [];
    return isEdit && isCHPCHWSelected(selectedRoles);
  }, [isEdit, isCHPCHWSelected, formValues?.selectedRoles]);

  // Memoize the existing villages field render function
  const renderExistingVillagesField = useCallback(
    ({ input }: any) => (
      <MultiSelect
        {...input}
        label={`Existing ${villagePName}`}
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
    [autoFetched, index, isActivating, isEdit, mandatoryVillages, villagePName, villagesLoading]
  );

  // Memoize the assigned villages field render function
  const renderAssignedVillagesField = useCallback(
    ({ input, meta }: any) => (
      <MultiSelect
        {...input}
        label={`Assigned ${villagePName}`}
        errorLabel={`assigned ${villagePName.toLowerCase()}`}
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
        onChange={(value: any) => {
          input.onChange(value);
          const villageIds = extractVillageIds(value);
          if (villageIds.length > 0) {
            debouncedFetchSubVillages(villageIds);
          } else {
            debouncedFetchSubVillages.cancel();
            dispatch(fetchSubVillagesSuccess([]));
          }
        }}
      />
    ),
    [currentHFVillages, debouncedFetchSubVillages, dispatch, isEditDisabled, isHF, isProfile, isError, villagePName, villagesLoading]
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
