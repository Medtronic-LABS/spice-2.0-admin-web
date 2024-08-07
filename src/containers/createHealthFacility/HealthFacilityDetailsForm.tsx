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
  clearSupervisorList,
  clearVillageList,
  fetchCultureListRequest,
  fetchHFTypesRequest,
  fetchPeerSupervisorListRequest,
  fetchUnlinkedVillagesRequest,
  fetchVillagesListRequest
} from '../../store/healthFacility/actions';
import { useParams } from 'react-router';
import { userDataSelector } from '../../store/user/selectors';
import SiteDetailsIcon from '../../assets/images/info-grey.svg';
import FormContainer from '../../components/formContainer/FormContainer';
import Workflows from './Workflows';
import { fetchCountyListRequest } from '../../store/county/actions';
import { countyLoadingSelector, getCountyListSelector } from '../../store/county/selectors';
import { fetchSubCountyListRequest } from '../../store/subCounty/actions';
import { subCountyListSelector, subCountyLoadingSelector } from '../../store/subCounty/selectors';

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
  subCountyId?: string;
  countyId?: string;
}

/**
 * Form for Site Details
 * @param param0
 * @returns {React.ReactElement}
 */
const HealthFacilityDetailsForm = ({
  form,
  formName,
  modalRef,
  isEdit = false,
  data = {},
  submittedData
}: IAddUserFormProps & IMatchParams): React.ReactElement => {
  const dispatch = useDispatch();
  const { regionId } = useParams<{ regionId: string }>();
  const regionData = useSelector(userDataSelector).country;
  const hfTypesList = useSelector(hfTypesSelector);
  const hfTypesLoading = useSelector(hfTypesLoadingSelector);
  const peerSupervisorList = useSelector(peerSupervisorListSelector);
  const peerSupervisorLoading = useSelector(peerSupervisorLoadingSelector);
  const countyList = useSelector(getCountyListSelector);
  const subCountyList = useSelector(subCountyListSelector);
  const countyLoading = useSelector(countyLoadingSelector);
  const subCountyLoading = useSelector(subCountyLoadingSelector);
  const villagesList = useSelector(villagesListSelector);
  const villagesLoading = useSelector(villagesLoadingSelector);
  const languages = useSelector(cultureListSelector);
  const languageLoading = useSelector(cultureLoadingSelector);
  const columnStyle = `${isEdit ? 'col-sm-6 col-md-4' : 'col-sm-6'} col-12`;
  const countryId = Number(regionId || regionData?.id);

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

  // County fetch
  useEffect(() => {
    if (!countyList.length) {
      dispatch(fetchCountyListRequest({ tenantId: String(countryId), isActive: true }));
    }
  }, [dispatch, countyList.length, countryId]);

  // Peer Supervisor fetch
  useEffect(() => {
    const tenantId = form.getState().values.healthFacility?.county?.tenantId;
    if (tenantId) {
      dispatch(fetchPeerSupervisorListRequest({ tenantIds: [tenantId] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, form.getState().values.healthFacility?.county?.tenantId]);

  // SubCounty fetch
  useEffect(() => {
    const countyId = form.getState().values.healthFacility?.county?.tenantId;
    if (countyId) {
      dispatch(fetchSubCountyListRequest({ tenantId: countyId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, form.getState().values.healthFacility?.county?.id]);

  // Villages fetch
  useEffect(() => {
    const countyId = form.getState().values.healthFacility.county?.id;
    const subCountyId = form.getState().values.healthFacility.subCounty?.id;
    if (subCountyId && countyId) {
      dispatch(
        fetchVillagesListRequest({
          countryId,
          districtId: Number(countyId),
          chiefdomId: Number(subCountyId)
        })
      );
      dispatch(
        fetchUnlinkedVillagesRequest({
          countryId,
          districtId: Number(districtId),
          chiefdomId: Number(chiefdomId),
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
    form.getState().values.healthFacility?.county?.id,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    form.getState().values.healthFacility?.subCounty?.id,
    regionId
  ]);

  useEffect(() => {
    const { district, chiefdom, city, linkedVillages } = form.getState().values?.healthFacility || {
      district: {},
      chiefdom: {},
      city: {},
      linkedVillages: []
    };
    if (!isEdit && !district?.id && (chiefdom?.id || city?.id || (linkedVillages || []).length)) {
      form.batch(() => {
        form.change(`${formName}.chiefdom`, undefined);
        form.change(`${formName}.city`, undefined);
        form.change(`${formName}.linkedVillages`, undefined);
      });
    }
  }, [form, formName, isEdit]);

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
                  defaultValue={hfTypesList.find(
                    (type: { id: string; name: string }) => type.name === (data.type?.name || data.type)
                  )}
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
              name={`${formName}.county`}
              type='text'
              validate={required}
              render={({ input, meta }) => {
                return (
                  <SelectInput
                    {...(input as any)}
                    {...(meta as any)}
                    label='County'
                    errorLabel='county'
                    labelKey='name'
                    valueKey='id'
                    options={countyList || []}
                    loadingOptions={countyLoading}
                    error={(meta.touched && meta.error) || undefined}
                    onChange={(value: any) => {
                      form.change(`${formName}.subCounty`, undefined);
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
              name={`${formName}.subCounty`}
              validate={required}
              render={({ input, meta }) => (
                <SelectInput
                  {...(input as any)}
                  {...(meta as any)}
                  label='Sub County'
                  errorLabel='Sub County'
                  labelKey='name'
                  valueKey='id'
                  options={subCountyList}
                  loadingOptions={subCountyLoading}
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
                  label='Linked Peer Supervisor'
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
              render={({ input, meta }) => (
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
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HealthFacilityDetailsForm;
