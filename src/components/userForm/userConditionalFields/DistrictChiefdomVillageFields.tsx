import { FormApi } from 'final-form';
import { useEffect, useMemo } from 'react';
import { Field, useField } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SelectInput from '../../formFields/SelectInput';
import MultiSelect from '../../multiSelect/MultiSelect';
import APPCONSTANTS from '../../../constants/appConstants';
import useAppTypeConfigs from '../../../hooks/appTypeBasedConfigs';
import { fetchBranchesByUnionRequest } from '../../../store/branch/actions';
import { districtLoadingSelector, getDistrictListSelector } from '../../../store/district/selectors';
import { fetchDistrictListRequest } from '../../../store/district/actions';
import { fetchChiefdomListRequest, fetchVillagesListRequest } from '../../../store/healthFacility/actions';
import {
  chiefdomListSelector,
  chiefdomLoadingSelector,
  villagesListSelector,
  villagesLoadingSelector
} from '../../../store/healthFacility/selectors';
import { IVillages } from '../../../store/healthFacility/types';
import { countryIdSelector } from '../../../store/user/selectors';
import toastCenter, { getErrorToastArgs } from '../../../utils/toastCenter';
import sessionStorageServices from '../../../global/sessionStorageServices';
import { getRoleFlags } from '../userFormUtils';
import { required } from '../../../utils/validation';

interface IDistrictChiefdomVillageFieldsProps {
  form: FormApi<any>;
  name: string;
  isError: (meta: any) => string | undefined;
  isHFCreate?: boolean;
  index: number;
}

interface IWithId {
  id: number;
}

const extractIds = (data?: IWithId | IWithId[]): number[] => {
  if (Array.isArray(data)) {
    return data
      .map(item => Number(item.id))
      .filter(num => Number.isFinite(num));
  }

  const id = Number(data?.id);
  return Number.isFinite(id) ? [id] : [];
};

const DistrictChiefdomVillageFields = ({
  form,
  name,
  isError,
  isHFCreate,
  index
}: IDistrictChiefdomVillageFieldsProps) => {
  const dispatch = useDispatch();
  const { tenantId, regionId } = useParams<{ tenantId: string, regionId: string }>();
  const country = useSelector(countryIdSelector);
  const countryId = Number(regionId || country?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID));
  const districtList = useSelector(getDistrictListSelector);
  const districtLoading = useSelector(districtLoadingSelector);
  const chiefdomList = useSelector(chiefdomListSelector);
  const chiefdomLoading = useSelector(chiefdomLoadingSelector);
  const villages = useSelector(villagesListSelector);
  const villagesLoading = useSelector(villagesLoadingSelector);

  // Subscribe only to role and location fields for this user row.
  const {
    input: { value: spiceRole }
  } = useField(`${name}.role`, { subscription: { value: true } });
  const {
    input: { value: selectedDistricts }
  } = useField(`${name}.districts`, { subscription: { value: true } });
  const {
    input: { value: selectedChiefdoms }
  } = useField(`${name}.chiefdoms`, { subscription: { value: true } });
  const {
    input: { value: selectedVillages }
  } = useField(`${name}.villages`, { subscription: { value: true } });
  const roleFlags = getRoleFlags(spiceRole);

  const {
    isPoSelected,
    isFoSelected,
    isAreaManagerSelected,
    isDivisionalManagerSelected,
    isHESelected
  } = roleFlags;
  const isOrganizerSelected = isPoSelected || isFoSelected;
  const isManagerSelected = isAreaManagerSelected || isDivisionalManagerSelected;

  const selectedDistrictIds = useMemo(
    () => extractIds(selectedDistricts),
    [selectedDistricts]
  );
  const selectedChiefdomIds = useMemo(
    () => extractIds(selectedChiefdoms),
    [selectedChiefdoms]
  );
  const selectedVillageIds = useMemo(
    () => extractIds(selectedVillages),
    [selectedVillages]
  );

  // District fetch
  useEffect(() => {
    if (countryId) {
      dispatch(fetchDistrictListRequest({ countryId, tenantId, isActive: true }));
    }
  }, [countryId, dispatch, tenantId]);

  // Chiefdom fetch
  useEffect(() => {
    if (selectedDistrictIds.length && countryId) {
      dispatch(fetchChiefdomListRequest({ countryId, districtIds: selectedDistrictIds }));
    }
  }, [countryId, dispatch, selectedDistrictIds]);

  // Villages fetch
  useEffect(() => {
    if (selectedChiefdomIds.length && countryId && isOrganizerSelected) {
      dispatch(
        fetchVillagesListRequest({
          countryId,
          chiefdomIds: selectedChiefdomIds,
          successCb: (list: IVillages[]) => {
            if (!list.length) {
              toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.NO_VILLAGE_PRESENT);
            }
          },
          failureCb: (error: Error) => {
            toastCenter.error(...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.VILLAGES_FETCH_FAIL));
          }
        })
      );
    }
  }, [
    countryId,
    dispatch,
    isOrganizerSelected,
    selectedChiefdomIds
  ]);

  // Branches fetch by region filters
  useEffect(() => {
    const noRoleSelected = !isManagerSelected && !isOrganizerSelected;
    const managerInvalid = isManagerSelected && selectedDistrictIds.length === 0;
    const poFoInvalid = isOrganizerSelected && selectedVillageIds.length === 0;

    if (noRoleSelected || managerInvalid || poFoInvalid) {
      return;
    }
    const requestPayload: {
      districtIds?: number[];
      chiefdomIds?: number[];
      unionIds?: number[];
    } = {};

    if (isManagerSelected && selectedDistrictIds.length) {
      requestPayload.districtIds = selectedDistrictIds;
    }
    if (isAreaManagerSelected && selectedChiefdomIds.length) {
      requestPayload.chiefdomIds = selectedChiefdomIds;
    }
    if (isOrganizerSelected && selectedVillageIds.length) {
      requestPayload.unionIds = selectedVillageIds;
    }
    dispatch(
      fetchBranchesByUnionRequest({
        payload: requestPayload,
        failureCb: (e) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.BRANCHES_BY_UNIONS_FETCH_FAIL));
        }
      })
    );
  }, [
    dispatch,
    isOrganizerSelected,
    isAreaManagerSelected,
    isManagerSelected,
    selectedChiefdomIds,
    selectedDistrictIds,
    selectedVillageIds
  ]);

  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    village: { p: villagePName }
  } = useAppTypeConfigs();
  const colClass = `${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `;

  if (!isOrganizerSelected && !isManagerSelected && !isHESelected) {
    return null;
  }

  return (
    <>
      <div className={colClass}>
        <Field
          name={`${name}.districts`}
          type='text'
          validate={required}
          render={({ input, meta }) =>
            isFoSelected || isAreaManagerSelected || isDivisionalManagerSelected || isHESelected ? (
              <MultiSelect
                {...(input as any)}
                label={districtSName}
                errorLabel={districtSName.toLowerCase()}
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
                options={districtList || []}
                loadingOptions={districtLoading}
                error={isError(meta)}
                onChange={(value: any) => {
                  form.change(`${name}.chiefdoms`, undefined);
                  form.change(`${name}.villages`, undefined);
                  form.change(`${name}.branches`, undefined);
                  input.onChange(value);
                }}
              />
            ) : (
              <SelectInput
                {...(input as any)}
                label={districtSName}
                errorLabel={districtSName.toLowerCase()}
                labelKey='name'
                valueKey='id'
                options={districtList || []}
                loadingOptions={districtLoading}
                error={isError(meta)}
                isModel={true}
                required={true}
                onChange={(value: any) => {
                  form.change(`${name}.chiefdoms`, undefined);
                  form.change(`${name}.villages`, undefined);
                  form.change(`${name}.branches`, undefined);
                  input.onChange(value);
                }}
              />
            )
          }
        />
      </div>
      {(isOrganizerSelected || isAreaManagerSelected || isHESelected) && (
        <div className={colClass}>
          <Field
            name={`${name}.chiefdoms`}
            type='text'
            validate={required}
            render={({ input, meta }) =>
              isFoSelected || isAreaManagerSelected || isHESelected ? (
                <MultiSelect
                  {...(input as any)}
                  label={chiefdomSName}
                  errorLabel={chiefdomSName.toLowerCase()}
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
                  options={chiefdomList || []}
                  loadingOptions={chiefdomLoading}
                  error={isError(meta)}
                  onChange={(value: any) => {
                    form.change(`${name}.villages`, undefined);
                    form.change(`${name}.branches`, undefined);
                    input.onChange(value);
                  }}
                />
              ) : (
                <SelectInput
                  {...(input as any)}
                  label={chiefdomSName}
                  errorLabel={chiefdomSName.toLowerCase()}
                  labelKey='name'
                  valueKey='id'
                  options={chiefdomList || []}
                  loadingOptions={chiefdomLoading}
                  error={isError(meta)}
                  isModel={true}
                  required={true}
                  onChange={(value: any) => {
                    form.change(`${name}.villages`, undefined);
                    form.change(`${name}.branches`, undefined);
                    input.onChange(value);
                  }}
                />
              )
            }
          />
        </div>
      )}
      {isOrganizerSelected && (
        <div className={colClass}>
          <Field
            name={`${name}.villages`}
            type='text'
            validate={required}
            render={({ input, meta }) => (
              <MultiSelect
                {...(input as any)}
                label={villagePName}
                errorLabel={villagePName.toLowerCase()}
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
                options={villages || []}
                loadingOptions={villagesLoading}
                error={isError(meta)}
                onChange={(value: any) => {
                  form.change(`${name}.branches`, undefined);
                  input.onChange(value);
                }}
              />
            )}
          />
        </div>
      )}
    </>
  );
};

export default DistrictChiefdomVillageFields;
