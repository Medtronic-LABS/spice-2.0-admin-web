import { FormApi } from 'final-form';
import { useEffect, useMemo } from 'react';
import { Field, useField } from 'react-final-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SelectInput from '../../formFields/SelectInput';
import MultiSelect from '../../multiSelect/MultiSelect';
import APPCONSTANTS from '../../../constants/appConstants';
import useAppTypeConfigs from '../../../hooks/appTypeBasedConfigs';
import useDebouncedValue from '../../../hooks/useDebouncedValue';
import { fetchBranchesByUnionRequest } from '../../../store/branch/actions';
import { clearTaggedChiefdomList, fetchTaggedChiefdomsRequest } from '../../../store/chiefdom/actions';
import {
  getTaggedChiefdomListSelector,
  taggedChiefdomLoadingSelector
} from '../../../store/chiefdom/selectors';
import { fetchTaggedDistrictsRequest } from '../../../store/district/actions';
import {
  getTaggedDistrictListSelector,
  taggedDistrictLoadingSelector
} from '../../../store/district/selectors';
import { fetchVillagesListRequest } from '../../../store/healthFacility/actions';
import {
  villagesListSelector,
  villagesLoadingSelector
} from '../../../store/healthFacility/selectors';
import { IVillages } from '../../../store/healthFacility/types';
import { countryIdSelector } from '../../../store/user/selectors';
import { formatUserToastMsg } from '../../../utils/commonUtils';
import toastCenter, { getErrorToastArgs } from '../../../utils/toastCenter';
import sessionStorageServices from '../../../global/sessionStorageServices';
import { getRoleFlags } from '../userFormUtils';
import { required } from '../../../utils/validation';
import { useAppDispatch } from '../../../store/hooks';

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
  const dispatch = useAppDispatch();
  const { regionId } = useParams<{ tenantId: string; regionId: string }>();
  const country = useSelector(countryIdSelector);
  const countryId = Number(regionId || country?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID));
  const taggedDistrictList = useSelector(getTaggedDistrictListSelector);
  const taggedDistrictLoading = useSelector(taggedDistrictLoadingSelector);
  const taggedChiefdomList = useSelector(getTaggedChiefdomListSelector);
  const taggedChiefdomLoading = useSelector(taggedChiefdomLoadingSelector);
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

  const debouncedDistrictIds = useDebouncedValue(selectedDistrictIds, 500);
  const debouncedChiefdomIds = useDebouncedValue(selectedChiefdomIds, 500);
  const debouncedVillageIds = useDebouncedValue(selectedVillageIds, 500);

  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    village: { p: villagePName }
  } = useAppTypeConfigs();

  // Tagged district fetch
  useEffect(() => {
    if (!taggedDistrictList.length) {
      dispatch(
        fetchTaggedDistrictsRequest({
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_FETCH_ERROR, districtSName)
              )
            )
        })
      );
    }
  }, [dispatch, districtSName, taggedDistrictList.length]);

  // Tagged chiefdom fetch
  useEffect(() => {
    dispatch(clearTaggedChiefdomList());
    if (debouncedDistrictIds.length) {
      dispatch(
        fetchTaggedChiefdomsRequest({
          districtIds: debouncedDistrictIds,
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.CHIEFDOM_FETCH_ERROR, chiefdomSName)
              )
            )
        })
      );
    }
  }, [dispatch, chiefdomSName, debouncedDistrictIds]);

  // Villages fetch
  useEffect(() => {
    if (debouncedChiefdomIds.length && countryId && isOrganizerSelected) {
      dispatch(
        fetchVillagesListRequest({
          countryId,
          chiefdomIds: debouncedChiefdomIds,
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
    debouncedChiefdomIds
  ]);

  // Branches fetch by region filters
  useEffect(() => {
    const noRoleSelected = !isManagerSelected && !isOrganizerSelected;
    const managerInvalid = isManagerSelected && debouncedDistrictIds.length === 0;
    const poFoInvalid = isOrganizerSelected && debouncedVillageIds.length === 0;

    if (noRoleSelected || managerInvalid || poFoInvalid) {
      return;
    }
    const requestPayload: {
      districtIds?: number[];
      chiefdomIds?: number[];
      unionIds?: number[];
    } = {};

    if (isManagerSelected && debouncedDistrictIds.length) {
      requestPayload.districtIds = debouncedDistrictIds;
    }
    if (isAreaManagerSelected && debouncedChiefdomIds.length) {
      requestPayload.chiefdomIds = debouncedChiefdomIds;
    }
    if (isOrganizerSelected && debouncedVillageIds.length) {
      requestPayload.unionIds = debouncedVillageIds;
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
    debouncedChiefdomIds,
    debouncedDistrictIds,
    debouncedVillageIds
  ]);

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
                options={taggedDistrictList || []}
                loadingOptions={taggedDistrictLoading}
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
                options={taggedDistrictList || []}
                loadingOptions={taggedDistrictLoading}
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
                  options={taggedChiefdomList || []}
                  loadingOptions={taggedChiefdomLoading}
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
                  options={taggedChiefdomList || []}
                  loadingOptions={taggedChiefdomLoading}
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
