import { FormApi } from 'final-form';
import { useEffect } from 'react';
import { Field, useFormState } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SelectInput from '../../formFields/SelectInput';
import MultiSelect from '../../multiSelect/MultiSelect';
import APPCONSTANTS from '../../../constants/appConstants';
import useAppTypeConfigs from '../../../hooks/appTypeBasedConfigs';
import { fetchChiefdomListRequest } from '../../../store/chiefdom/actions';
import { districtLoadingSelector, getDistrictListSelector } from '../../../store/district/selectors';
import { chiefdomListSelector, chiefdomLoadingSelector } from '../../../store/chiefdom/selectors';
import { fetchDistrictListRequest } from '../../../store/district/actions';
import { fetchVillagesListRequest } from '../../../store/healthFacility/actions';
import { villagesListSelector, villagesLoadingSelector } from '../../../store/healthFacility/selectors';
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
}

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

  // Subscribe to live form values so dependent fetches react to field changes.
  const { values } = useFormState({ subscription: { values: true } });
  const currentUser = (values as any)?.users?.[index];
  const selectedDistrictId = currentUser?.districts?.id;
  const selectedDistrictTenantId = currentUser?.districts?.tenantId;
  const selectedChiefdomId = currentUser?.chiefdoms?.id;

  // District fetch
  useEffect(() => {
    if (countryId) {
      dispatch(fetchDistrictListRequest({ countryId, tenantId, isActive: true }));
    }
  }, [countryId, dispatch, tenantId]);

  // Chiefdom fetch
  useEffect(() => {
    if (selectedDistrictTenantId) {
      dispatch(fetchChiefdomListRequest({ tenantId: selectedDistrictTenantId }));
    }
  }, [dispatch, selectedDistrictTenantId]);

  // Villages fetch
  useEffect(() => {
    if (selectedChiefdomId && selectedDistrictId && countryId) {
      dispatch(
        fetchVillagesListRequest({
          countryId,
          districtId: Number(selectedDistrictId),
          chiefdomId: Number(selectedChiefdomId),
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
  }, [countryId, dispatch, selectedChiefdomId, selectedDistrictId]);

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
          render={({ input, meta }) => (
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
          )}
        />
      </div>
      <div className={colClass}>
        <Field
          name={`${name}.chiefdoms`}
          type='text'
          render={({ input, meta }) => (
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
          )}
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
