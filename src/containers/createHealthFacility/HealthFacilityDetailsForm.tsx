import { FormApi } from 'final-form';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import SiteDetailsIcon from '../../assets/images/info-grey.svg';
import FormContainer from '../../components/formContainer/FormContainer';
import SelectInput from '../../components/formFields/SelectInput';
import TextInput from '../../components/formFields/TextInput';
import MultiSelect from '../../components/multiSelect/MultiSelect';
import APPCONSTANTS from '../../constants/appConstants';
import sessionStorageServices from '../../global/sessionStorageServices';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { fetchChiefdomDetail, fetchChiefdomListRequest } from '../../store/chiefdom/actions';
import {
  chiefdomListSelector,
  chiefdomLoadingSelector,
  getChiefdomDetailSelector
} from '../../store/chiefdom/selectors';
import { fetchDistrictDetailReq, fetchDistrictListRequest } from '../../store/district/actions';
import { districtLoadingSelector, districtSelector, getDistrictListSelector } from '../../store/district/selectors';
import {
  clearHFFormData,
  clearSupervisorList,
  clearVillageList,
  fetchCityListRequest,
  fetchCultureListRequest,
  fetchHFTypesRequest,
  fetchPeerSupervisorListRequest,
  fetchUnlinkedVillagesRequest,
  fetchVillagesListRequest
} from '../../store/healthFacility/actions';
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
import { ICity, IObjectData, IVillages } from '../../store/healthFacility/types';
import { countryIdSelector } from '../../store/user/selectors';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  composeValidators,
  minLength,
  normalizeFloatingNumber,
  normalizePhone,
  required,
  validateLatitude,
  validateLongitude,
  validateMobile,
  validateName
} from '../../utils/validation';
import Workflows from '../healthFacility/Workflows';
import { filterByAppTypes } from '../../utils/commonUtils';

interface IAddUserFormProps {
  formName: string;
  form: FormApi<any>;
  modalRef?: any;
  isEdit?: boolean;
  data?: any;
  isNextClicked?: boolean;
  isHFCreate?: boolean;
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
  isNextClicked,
  isHFCreate
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
  const columnStyle = `${isEdit ? 'col-sm-6 col-md-4' : 'col-md-6 col-lg-3'} col-12`;
  const country = useSelector(countryIdSelector);
  const countryId = Number(regionId || country?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID));
  const {
    appTypes,
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    hfDetails: {
      supervisor: { s: supervisorSName }
    },
    healthFacility: { s: healthFacilitySName },
    isCommunity
  } = useAppTypeConfigs();
  const [cityList, setCityList] = useState<ICity[]>([]);
  const timerId: React.MutableRefObject<number | undefined> = useRef<number>();
  const [cityLoading, setCityLoading] = useState(false);

  const chiefdom = useSelector(getChiefdomDetailSelector);
  const [workflowEditedData, setWorkFlowEditedData] = useState<{
    customizedWorkflows: number[];
    clinicalWorkflows: number[];
  }>({
    clinicalWorkflows: form?.getState()?.values?.healthFacility?.clinicalWorkflows || [],
    customizedWorkflows: form?.getState()?.values?.healthFacility?.customizedWorkflows || []
  });
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

  const district = useSelector(districtSelector);

  if (!isEdit && chiefdomId) {
    const { values: formValues = {} } = form?.getState?.() || {};
    const chiefdomFormValue = (formValues as any)?.formName?.chiefdom;
    if (!chiefdomFormValue && Number(chiefdom?.id) === Number(chiefdomId)) {
      let districtValue = {};
      if (chiefdom.district.id) {
        districtValue = chiefdom.district;
      } else if (district.id) {
        districtValue = district;
      }
      form?.change(`${formName}.district` as any, districtValue);
      form?.change(`${formName}.chiefdom` as any, chiefdom);
    }
  }

  // Logic for district autoselecting when the route is createHealthFacilityByDistrict
  // route is createhealthFacilityByDistrict, if isEdit = false and the route contains districtId param
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
    if (!isEdit) {
      dispatch(fetchDistrictListRequest({ countryId, tenantId, isActive: true }));
    }
  }, [countryId, dispatch, isEdit, tenantId]);

  // Peer Supervisor fetch
  useEffect(() => {
    const selectedTenantId = form.getState().values?.healthFacility?.chiefdom?.tenantId;
    if (selectedTenantId) {
      dispatch(fetchPeerSupervisorListRequest({ tenantIds: [selectedTenantId], appTypes }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, form.getState().values?.healthFacility?.chiefdom?.tenantId]);

  // Chiefdom fetch
  useEffect(() => {
    const selectedDistrictId = form.getState().values?.healthFacility?.district?.tenantId;
    if (selectedDistrictId && !isEdit) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formName, isEdit]);

  useEffect(() => {
    return () => {
      dispatch(clearHFFormData());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCityList = useCallback(
    (searchTerm: string) => {
      dispatch(
        fetchCityListRequest({
          searchTerm,
          appTypes,
          successCb: (result) => {
            setCityList(result);
            setCityLoading(false);
          },
          failureCb: (error) => {
            setCityList([]);
            setCityLoading(false);
            toastCenter.error(...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.FETCH_CITY_LIST_FAILURE));
          }
        })
      );
    },
    [appTypes, dispatch]
  );

  const fetchCityListDebounce = useCallback(
    (searchTerm: string) => {
      if (searchTerm.length >= 3) {
        setCityLoading(true);
        clearTimeout(timerId.current);
        timerId.current = setTimeout(() => fetchCityList(searchTerm), 500) as any;
      } else {
        setCityLoading(false);
        setCityList([]);
      }
    },
    [fetchCityList]
  );

  return (
    <>
      {isNextClicked ? (
        <FormContainer label='Workflows Involved' required={true} icon={SiteDetailsIcon}>
          <Workflows
            formName='healthFacility'
            form={form}
            isHFEdit={isEdit}
            workflowEditedData={workflowEditedData}
            setWorkFlowEditedData={setWorkFlowEditedData}
          />
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
              render={({ input, meta }) => {
                const filteredHFTypes = filterByAppTypes(hfTypesList, appTypes);
                return (
                  <SelectInput
                    {...(input as any)}
                    label={`${healthFacilitySName} Type`}
                    errorLabel='type'
                    labelKey='name'
                    valueKey='id'
                    defaultValue={filteredHFTypes?.find(
                      (type: IObjectData) => type.name === (data.type?.name || data.type)
                    )}
                    options={filteredHFTypes}
                    loadingOptions={hfTypesLoading}
                    error={(meta.touched && meta.error) || undefined}
                  />
                );
              }}
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
                  label={isCommunity ? 'PHU Focal Person Name' : 'Facility Incharge'}
                  errorLabel={isCommunity ? 'PHU focal person name' : 'facility incharge'}
                  capitalize={true}
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={`${columnStyle} ${isEdit && !isCommunity ? 'col-md-5' : ''}`}>
            <Field
              name={`${formName}.phuFocalPersonNumber`}
              type='text'
              validate={composeValidators(required, validateMobile)}
              parse={normalizePhone}
              render={({ input, meta }) => (
                <TextInput
                  {...input}
                  label={isCommunity ? 'PHU Focal Person Number' : 'Facility Incharge No'}
                  errorLabel={isCommunity ? 'PHU focal person number' : 'facility incharge no'}
                  capitalize={true}
                  error={(meta.touched && meta.error) || undefined}
                />
              )}
            />
          </div>
          <div className={`col-12 ${isEdit ? (isCommunity ? 'col-md-8' : 'col-md-7') : 'col-lg-6'}`}>
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
                    // clear hf for reports while changing chiefdom
                    form.change('users[0].reportUserOrganization', undefined);
                    input.onChange(value);
                  }}
                />
              )}
            />
          </div>
          <div className={columnStyle}>
            <Field
              required={isCommunity ? true : false}
              name={`${formName}.city`}
              type='text'
              validate={isCommunity ? required : undefined}
              render={({ input, meta }) => (
                <SelectInput
                  {...(input as any)}
                  {...(meta as any)}
                  label={isCommunity ? 'City/Village' : 'City'}
                  errorLabel={isCommunity ? 'city/village' : 'city'}
                  labelKey='name'
                  valueKey={isCommunity ? 'id' : 'value'}
                  options={isCommunity ? villagesList : cityList}
                  loadingOptions={isCommunity ? villagesLoading : cityLoading}
                  error={(isCommunity && meta.touched && meta.error) || undefined}
                  required={isCommunity ? true : false}
                  onInput={(value) => {
                    if (!isCommunity) {
                      fetchCityListDebounce(value);
                    }
                  }}
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
              validate={composeValidators(required, minLength(3))}
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
                  options={filterByAppTypes(languages, appTypes)}
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
                  label={supervisorSName}
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
              validate={isCommunity ? required : undefined}
              render={({ input, meta }) => {
                return (
                  <MultiSelect
                    {...(input as any)}
                    label='Linked Villages'
                    errorLabel='linked villages'
                    labelKey='name'
                    valueKey='id'
                    required={isCommunity ? true : false}
                    isShowLabel={true}
                    isSelectAll={true}
                    placeholder=''
                    isDefaultSelected={true}
                    menuPlacement={'auto'}
                    isModel={true}
                    isMulti={true}
                    options={unlinkedVillagesList}
                    loading={unlinkedVillagesLoading}
                    error={(isCommunity && meta.touched && meta.error) || undefined}
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
