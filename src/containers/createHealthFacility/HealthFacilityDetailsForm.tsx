import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import TextInput from '../../components/formFields/TextInput';
import {
  composeValidators,
  required,
  minLength,
  normalizePhone,
  normalizeFloatingNumber,
  validateMobile,
  validateName,
  validateLatitude,
  validateLongitude
} from '../../utils/validation';
import SelectInput from '../../components/formFields/SelectInput';
import MultiSelect from '../../components/multiSelect/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import {
  cultureListSelector,
  cultureLoadingSelector,
  hfTypesLoadingSelector,
  hfTypesSelector,
  peerSupervisorListSelector,
  peerSupervisorLoadingSelector,
  unlinkedVillagesListSelector,
  unlinkedVillagesLoadingSelector,
  villagesListSelector,
  villagesLoadingSelector
} from '../../store/healthFacility/selectors';
import { useEffect } from 'react';
import {
  clearHFFormData,
  clearSupervisorList,
  clearVillageList,
  fetchCultureListRequest,
  fetchHFTypesRequest,
  fetchPeerSupervisorListRequest,
  fetchUnlinkedVillagesRequest,
  fetchVillagesListRequest
} from '../../store/healthFacility/actions';
import { useParams } from 'react-router';
import { countryIdSelector } from '../../store/user/selectors';
import { IObjectData, IVillages } from '../../store/healthFacility/types';
import SiteDetailsIcon from '../../assets/images/info-grey.svg';
import FormContainer from '../../components/formContainer/FormContainer';
import Workflows from '../healthFacility/Workflows';
import { fetchDistrictDetailReq, fetchDistrictListRequest } from '../../store/district/actions';
import { districtLoadingSelector, districtSelector, getDistrictListSelector } from '../../store/district/selectors';
import { fetchChiefdomDetail, fetchChiefdomListRequest } from '../../store/chiefdom/actions';
import {
  chiefdomListSelector,
  chiefdomLoadingSelector,
  getChiefdomDetailSelector
} from '../../store/chiefdom/selectors';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import toastCenter from '../../utils/toastCenter';
import sessionStorageServices from '../../global/sessionStorageServices';

interface IAddUserFormProps {
  formName: string;
  form: FormApi<any>;
  modalRef?: any;
  isEdit?: boolean;
  data?: any;
  submittedData?: any;
}

interface IMatchParams {
  regionId?: string;
  chiefdomId?: string;
  districtId?: string;
  tenantId: string;
}

/**
 * Form for Site Details
 * @param param0
 * @returns {React.ReactElement}
 */
const HealthFacilityDetailsForm = ({
  form,
  formName,
  isEdit = false,
  data = {},
  submittedData
}: IAddUserFormProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { regionId, districtId, chiefdomId, tenantId } = useParams<IMatchParams>();
  const hfTypesList = useSelector(hfTypesSelector);
  const hfTypesLoading = useSelector(hfTypesLoadingSelector);
  const peerSupervisorList = useSelector(peerSupervisorListSelector);
  const peerSupervisorLoading = useSelector(peerSupervisorLoadingSelector);
  const unlinkedVillagesList = useSelector(unlinkedVillagesListSelector);
  const unlinkedVillagesLoading = useSelector(unlinkedVillagesLoadingSelector);
  const districtList = useSelector(getDistrictListSelector);
  const chiefdomList = useSelector(chiefdomListSelector);
  const districtLoading = useSelector(districtLoadingSelector);
  const chiefdomLoading = useSelector(chiefdomLoadingSelector);
  const villagesList = useSelector(villagesListSelector);
  const villagesLoading = useSelector(villagesLoadingSelector);
  const languages = useSelector(cultureListSelector);
  const languageLoading = useSelector(cultureLoadingSelector);
  const columnStyle = `${isEdit ? 'col-sm-6 col-md-4' : 'col-sm-6'} col-12`;
  const country = useSelector(countryIdSelector);
  const countryId = Number(regionId || country?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID));
  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    healthFacility: { s: healthFacilitySName }
  } = NAME_CONSTANTS;

  const chiefdom = useSelector(getChiefdomDetailSelector);
  useEffect(() => {
    if (!isEdit && chiefdomId && Number(chiefdom?.id) !== Number(chiefdomId)) {
      dispatch(
        fetchChiefdomDetail({
          tenantId,
          id: chiefdomId
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!isEdit && chiefdomId) {
    const { values: formValues = {} } = form?.getState?.() || {};
    const chiefdomFormValue = (formValues as any)?.formName?.chiefdom;
    if (!chiefdomFormValue && Number(chiefdom?.id) === Number(chiefdomId)) {
      form?.change(`${formName}.district` as any, chiefdom.district);
      form?.change(`${formName}.chiefdom` as any, chiefdom);
    }
  }

  // Logic for district autoselecting when the route is createHealthFacilityByDistrict
  // route is createhealthFacilityByDistrict, if isEdit = false and the route contains districtId param
  const district = useSelector(districtSelector);
  useEffect(() => {
    if (!isEdit && districtId && district?.id !== districtId) {
      dispatch(
        fetchDistrictDetailReq({
          tenantId,
          id: districtId
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!isEdit && districtId) {
    const { values: formValues = {} } = form?.getState?.() || {};
    const districtFormValue = (formValues as any)?.formName?.district;
    if (!districtFormValue && Number(district?.id) === Number(districtId)) {
      form?.change(`${formName}.district` as any, district);
    }
  }

  // Culture list fetch
  useEffect(() => {
    if (!languages.length) {
      dispatch(fetchCultureListRequest());
    }
  }, [dispatch, languages.length]);

  // Health Facility Types fetch
  useEffect(() => {
    if (!hfTypesList.length) {
      dispatch(fetchHFTypesRequest({}));
    }
  }, [dispatch, hfTypesList.length]);

  // District fetch
  useEffect(() => {
    dispatch(fetchDistrictListRequest({ tenantId: countryId, isActive: true }));
  }, [dispatch, countryId]);

  // Peer Supervisor fetch
  useEffect(() => {
    const selectedTenantId = form.getState().values?.healthFacility?.district?.tenantId;
    if (selectedTenantId) {
      dispatch(fetchPeerSupervisorListRequest({ tenantIds: [selectedTenantId] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, form.getState().values?.healthFacility?.district?.tenantId]);

  // Chiefdom fetch
  useEffect(() => {
    const selectedDistrictId = form.getState().values?.healthFacility?.district?.tenantId;
    if (selectedDistrictId) {
      dispatch(fetchChiefdomListRequest({ tenantId: selectedDistrictId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, form.getState().values?.healthFacility?.district?.id]);

  // Villages fetch
  useEffect(() => {
    const selectedDistrictId = form.getState().values.healthFacility.district?.id;
    const selectedChiefdomId = form.getState().values.healthFacility.chiefdom?.id;
    if (selectedChiefdomId && selectedDistrictId) {
      dispatch(
        fetchVillagesListRequest({
          countryId,
          districtId: Number(selectedDistrictId),
          chiefdomId: Number(selectedChiefdomId)
        })
      );
      dispatch(
        fetchUnlinkedVillagesRequest({
          countryId,
          districtId: Number(selectedDistrictId),
          chiefdomId: Number(selectedChiefdomId),
          healthFacilityId: data?.id ? data.id : undefined,
          successCb: (list: IVillages[]) => {
            if (!list.length) {
              toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.NO_VILLAGE_FOUND);
            }
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    countryId,
    dispatch,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    form.getState().values?.healthFacility?.district?.id,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    form.getState().values?.healthFacility?.chiefdom?.id,
    regionId
  ]);

  useEffect(() => {
    const {
      district: formDistrict,
      chiefdom: formChiefdom,
      city,
      linkedVillages
    } = form.getState().values?.healthFacility || {
      district: {},
      chiefdom: {},
      city: {},
      linkedVillages: []
    };
    if (!isEdit && !formDistrict?.id && (formChiefdom?.id || city?.id || (linkedVillages || []).length)) {
      form.batch(() => {
        form.change(`${formName}.chiefdom`, undefined);
        form.change(`${formName}.city`, undefined);
        form.change(`${formName}.linkedVillages`, undefined);
      });
    }
  }, [form, formName, isEdit]);

  useEffect(() => {
    return () => {
      dispatch(clearHFFormData());
    };
  }, []);

  return (
    <>
      {submittedData?.isNextClicked ? (
        <FormContainer label='Clinical Workflows Involved' required={true} icon={SiteDetailsIcon}>
          <Workflows formName='healthFacility' form={form} />
        </FormContainer>
      ) : (
        <div className='row gx-1dot25 align-items-end'>
          <div className={columnStyle}>
            <Field
              name={`${formName}.name`}
              type='text'
              validate={composeValidators(required, minLength(2))}
              render={({ input, meta }) => (
                <TextInput
                  {...input}
                  label={`${healthFacilitySName} Name`}
                  errorLabel={`${healthFacilitySName.toLowerCase()} name`}
                  disabled={isEdit}
                  capitalize={true}
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.type`}
              type='text'
              validate={required}
              render={({ input, meta }) => (
                <SelectInput
                  {...(input as any)}
                  label={`${healthFacilitySName} Type`}
                  errorLabel='type'
                  labelKey='name'
                  valueKey='id'
                  defaultValue={hfTypesList.find((type: IObjectData) => type.name === (data.type?.name || data.type))}
                  options={hfTypesList}
                  loadingOptions={hfTypesLoading}
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.phuFocalPersonName`}
              type='text'
              validate={composeValidators(required, validateName)}
              render={({ input, meta }) => (
                <TextInput
                  {...input}
                  label='PHU Focal Person Name'
                  errorLabel='PHU focal person name'
                  capitalize={true}
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.phuFocalPersonNumber`}
              type='text'
              validate={composeValidators(required, validateMobile)}
              parse={normalizePhone}
              render={({ input, meta }) => (
                <TextInput
                  {...input}
                  label='PHU Focal Person Number'
                  errorLabel='PHU focal person number'
                  capitalize={true}
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={`${isEdit ? 'col-12 col-md-8' : 'col-12'}`}>
            <Field
              name={`${formName}.address`}
              type='text'
              validate={required}
              render={({ input, meta }) => (
                <TextInput
                  {...input}
                  label='Address'
                  errorLabel='address'
                  capitalize={true}
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.district`}
              type='text'
              validate={required}
              render={({ input, meta }) => {
                return (
                  <SelectInput
                    {...(input as any)}
                    {...(meta as any)}
                    disabled={Boolean(isEdit || chiefdomId || districtId)}
                    label={districtSName}
                    errorLabel={districtSName.toLowerCase()}
                    labelKey='name'
                    valueKey='id'
                    options={districtList || []}
                    loadingOptions={districtLoading}
                    error={(meta.touched && meta.error) || undefined}
                    onChange={(value: any) => {
                      form.change(`${formName}.chiefdom`, undefined);
                      form.change(`${formName}.peerSupervisors`, undefined);
                      form.change(`${formName}.linkedVillages`, undefined);
                      form.change(`${formName}.city`, undefined);
                      dispatch(clearVillageList());
                      dispatch(clearSupervisorList());
                      input.onChange(value);
                    }}
                  />
                );
              }}
            />
          </div>
          <div className={columnStyle}>
            <Field
              required={true}
              name={`${formName}.chiefdom`}
              validate={required}
              render={({ input, meta }) => (
                <SelectInput
                  {...(input as any)}
                  {...(meta as any)}
                  disabled={Boolean(isEdit || chiefdomId)}
                  label={chiefdomSName}
                  errorLabel={chiefdomSName.toLowerCase()}
                  labelKey='name'
                  valueKey='id'
                  options={chiefdomList}
                  loadingOptions={chiefdomLoading}
                  error={(meta.touched && meta.error) || undefined}
                  onChange={(value: any) => {
                    form.change(`${formName}.peerSupervisors`, undefined);
                    form.change(`${formName}.city`, undefined);
                    form.change(`${formName}.linkedVillages`, undefined);
                    input.onChange(value);
                  }}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              required={true}
              name={`${formName}.city`}
              type='text'
              validate={required}
              render={({ input, meta }) => (
                <SelectInput
                  {...(input as any)}
                  {...(meta as any)}
                  label='City/Village'
                  errorLabel='city/village'
                  labelKey='name'
                  valueKey='id'
                  options={villagesList}
                  loadingOptions={villagesLoading}
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.latitude`}
              type='text'
              validate={composeValidators(required, validateLatitude)}
              parse={normalizeFloatingNumber}
              render={({ input, meta }) => (
                <TextInput
                  {...input}
                  label='Latitude'
                  errorLabel='latitude'
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.longitude`}
              type='text'
              validate={composeValidators(required, validateLongitude)}
              parse={normalizeFloatingNumber}
              render={({ input, meta }) => (
                <TextInput
                  {...input}
                  label='Longitude'
                  errorLabel='longitude'
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.postalCode`}
              type='text'
              validate={composeValidators(required, minLength(4))}
              parse={normalizePhone}
              render={({ input, meta }) => (
                <TextInput
                  {...input}
                  label='Facility ID'
                  errorLabel='facility id'
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.language`}
              type='text'
              validate={required}
              render={({ input, meta }) => (
                <SelectInput
                  {...(input as any)}
                  label='Language'
                  errorLabel='language'
                  labelKey='name'
                  valueKey='id'
                  options={languages}
                  loadingOptions={languageLoading}
                  error={(meta.touched && meta.error) || undefined}
                  isModel={isEdit ? true : false}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.peerSupervisors`}
              type='text'
              render={({ input, meta }) => (
                <MultiSelect
                  {...(input as any)}
                  label='Linked Community Health Assistant'
                  labelKey='name'
                  valueKey='id'
                  isShowLabel={true}
                  isSelectAll={true}
                  menuPlacement={'auto'}
                  placeholder=''
                  isModel={true}
                  isMulti={true}
                  options={peerSupervisorList.list}
                  loading={peerSupervisorLoading}
                  controlStyles={{
                    borderColor: meta.touched && meta.error ? 'red !important' : '#8c8c8c',
                    '&:focus-visible': {
                      borderColor: meta.touched && meta.error ? 'red !important' : '#8c8c8c'
                    }
                  }}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              name={`${formName}.linkedVillages`}
              type='text'
              validate={required}
              render={({ input, meta }) => {
                return (
                  <MultiSelect
                    {...(input as any)}
                    label='Linked Villages'
                    errorLabel='linked villages'
                    labelKey='name'
                    valueKey='id'
                    required={true}
                    isShowLabel={true}
                    isSelectAll={true}
                    placeholder=''
                    isDefaultSelected={true}
                    menuPlacement={'auto'}
                    isModel={true}
                    isMulti={true}
                    options={unlinkedVillagesList}
                    loading={unlinkedVillagesLoading}
                    error={(meta.touched && meta.error) || undefined}
                    controlStyles={{
                      borderColor: meta.touched && meta.error ? 'red !important' : '#8c8c8c',
                      '&:focus-visible': {
                        borderColor: meta.touched && meta.error ? 'red !important' : '#8c8c8c'
                      }
                    }}
                  />
                );
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HealthFacilityDetailsForm;
