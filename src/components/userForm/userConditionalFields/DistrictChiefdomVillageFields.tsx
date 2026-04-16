import { FormApi } from 'final-form';
import { useEffect, useMemo } from 'react';
import { Field, useFormState } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SelectInput from '../../formFields/SelectInput';
import MultiSelect from '../../multiSelect/MultiSelect';
import APPCONSTANTS from '../../../constants/appConstants';
import useAppTypeConfigs from '../../../hooks/appTypeBasedConfigs';
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

interface IDistrictChiefdomVillageFieldsProps {
  form: FormApi<any>;
  name: string;
  isError: (meta: any) => string | undefined;
  isHFCreate?: boolean;
  index: number;
  isFoSelected: boolean;
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
  index,
  isFoSelected
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

  // Subscribe to live form values so dependent fetches react to field changes.
  const { values } = useFormState({ subscription: { values: true } });
  const currentUser = (values as any)?.users?.[index];
  const selectedDistrictIds = useMemo(
    () => extractIds(currentUser?.districts),
    [currentUser?.districts]
  );
  const selectedChiefdomIds = useMemo(
    () => extractIds(currentUser?.chiefdoms),
    [currentUser?.chiefdoms]
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
    if (selectedChiefdomIds.length && countryId) {
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
    selectedChiefdomIds
  ]);

  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    village: { p: villagePName }
  } = useAppTypeConfigs();
  const colClass = `${isHFCreate ? 'col-12 col-sm-6 col-lg-4' : 'col-sm-6 col-12'} `;

  return (
    <>
      <div className={colClass}>
        <Field
          name={`${name}.districts`}
          type='text'
          render={({ input, meta }) =>
            isFoSelected ? (
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
                  input.onChange(value);
                }}
              />
            )
          }
        />
      </div>
      <div className={colClass}>
        <Field
          name={`${name}.chiefdoms`}
          type='text'
          render={({ input, meta }) =>
            isFoSelected ? (
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
                  input.onChange(value);
                }}
              />
            )
          }
        />
      </div>
      <div className={colClass}>
        <Field
          name={`${name}.villages`}
          type='text'
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
            />
          )}
        />
      </div>
    </>
  );
};

export default DistrictChiefdomVillageFields;
