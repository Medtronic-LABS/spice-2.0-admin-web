import { FormApi } from 'final-form';
import { Field } from 'react-final-form';
import TextInput from '../../components/formFields/TextInput';
import {
  composeValidators,
  required,
  minLength,
  normalizePhone,
  normalizeFloatingNumber
} from '../../utils/validation';
import SelectInput, { AsyncSelectInput, ISelectOption } from '../../components/formFields/SelectInput';
import MultiSelect from '../../components/multiSelect/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import {
  chiefdomListSelector,
  chiefdomLoadingSelector,
  districtListSelector,
  districtLoadingSelector,
  peerSupervisorListSelector,
  peerSupervisorLoadingSelector,
  villagesListSelector,
  villagesLoadingSelector
} from '../../store/healthFacility/selectors';
import { useEffect, useRef } from 'react';
import {
  fetchChiefdomListRequest,
  fetchDistrictListRequest,
  fetchPeerSupervisorListRequest,
  fetchVillagesListRequest
} from '../../store/healthFacility/actions';
import { useParams } from 'react-router';
import { userDataSelector } from '../../store/user/selectors';
import { listCities } from '../../services/healthFacilityAPI';

interface IAddUserFormProps {
  form: FormApi<any>;
  isEdit?: boolean;
  data?: any;
}

interface IMatchParams {
  regionId?: string;
  OUId?: string;
  accountId?: string;
}

/**
 * Form for Site Details
 * @param param0
 * @returns {React.ReactElement}
 */
const HealthFacilityDetailsForm = ({
  form,
  isEdit = false,
  data = {}
}: IAddUserFormProps & IMatchParams): React.ReactElement => {
  const dispatch = useDispatch();
  const { regionId } = useParams<{ regionId: string }>();
  const regionData = useSelector(userDataSelector).country;
  const districtList = useSelector(districtListSelector);
  const districtListLoading = useSelector(districtLoadingSelector);
  const chiefdomList = useSelector(chiefdomListSelector);
  const chiefdomLoading = useSelector(chiefdomLoadingSelector);
  const peerSupervisorList = useSelector(peerSupervisorListSelector);
  const peerSupervisorLoading = useSelector(peerSupervisorLoadingSelector);
  const villagesList = useSelector(villagesListSelector);
  const villagesLoading = useSelector(villagesLoadingSelector);
  const columnStyle = `${isEdit ? 'col-sm-6 col-md-4' : 'col-sm-6'} col-12`;
  const countryId = Number(regionId || regionData.id);
  const cityOptions = useRef<ISelectOption[]>([]);

  // District fetch
  useEffect(() => {
    if (!districtList.length) {
      dispatch(fetchDistrictListRequest({ countryId }));
    }
  }, [dispatch, districtList.length, countryId]);

  // Peer Supervisor fetch
  useEffect(() => {
    const tenantId = form.getState().values.healthFacility?.district?.tenantId;
    if (tenantId && !peerSupervisorList.length) {
      dispatch(fetchPeerSupervisorListRequest({ tenantIds: [tenantId] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, countryId, form.getState().values.healthFacility?.district?.tenantId, peerSupervisorList.length]);

  // Chiefdom fetch
  useEffect(() => {
    const districtId = form.getState().values.healthFacility?.district?.id;
    if (districtId && !chiefdomList.length) {
      dispatch(fetchChiefdomListRequest({ countryId, districtId: Number(districtId) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chiefdomList.length, dispatch, countryId, form.getState().values.healthFacility?.district?.id]);

  // Villages fetch
  useEffect(() => {
    const districtId = form.getState().values.healthFacility.district?.id;
    const chiefdomId = form.getState().values.healthFacility.chiefdom?.id;
    if (chiefdomId && districtId && !villagesList.length) {
      dispatch(
        fetchVillagesListRequest({
          countryId,
          districtId: Number(districtId),
          chiefdomId: Number(chiefdomId)
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    countryId,
    dispatch,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    form.getState().values.healthFacility.district?.id,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    form.getState().values.healthFacility.chiefdom?.id,
    regionId,
    villagesList.length
  ]);

  /**
   * It gets the city from API and list the options
   * @param searchStr it denotes the search text
   */
  const loadCities = async (searchStr: string) => {
    if (searchStr) {
      try {
        const city: any = await new Promise(async (resolve) => {
          try {
            const response = await listCities(Number(regionId), searchStr);
            resolve(response);
          } catch (e) {
            console.error('Unable to fetch cities', e);
            return [];
          }
        }).catch((e) => {
          console.error('Unable to fetch cities', e);
          return [];
        });
        cityOptions.current = city.data;
        return city.data;
      } catch (e) {
        console.error('Unable to fetch cities', e);
        return [];
      }
    }
  };

  const hfType = [
    { name: 'MCU', id: 'MCU' },
    { name: 'CHP', id: 'CHP' },
    { name: 'CHCP', id: 'CHCP' },
    { name: 'CHC', id: 'CHC' }
  ] as any[];
  const hfTypeLoading = false;
  const languages = [{ id: '1', name: 'English' }] as any[];
  const languageLoading = false;

  return (
    <div className='row gx-1dot25 align-items-end'>
      <div className={columnStyle}>
        <Field
          name='healthFacility.name'
          type='text'
          validate={composeValidators(required, minLength(2))}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='Health Facility Name'
              errorLabel='health facility name'
              disabled={isEdit}
              capitalize={true}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      <div className={columnStyle}>
        <Field
          name='healthFacility.type'
          type='text'
          validate={required}
          render={({ input, meta }) => (
            <SelectInput
              {...(input as any)}
              label='Health Facility Type'
              errorLabel='type'
              labelKey='name'
              valueKey='id'
              defaultValue={hfType.find((type) => type.name === (data.type?.name || data.type))}
              options={hfType}
              loadingOptions={hfTypeLoading}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      <div className={columnStyle}>
        <Field
          name='healthFacility.phuFocalPersonName'
          type='text'
          validate={required}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='PHU Focal Person Name'
              errorLabel='PHU person name'
              capitalize={true}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      <div className={columnStyle}>
        <Field
          name='healthFacility.phuFocalPersonNumber'
          type='text'
          validate={required}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='PHU Focal Person Number'
              errorLabel='PHU person number'
              capitalize={true}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      <div className={`${isEdit ? 'col-12 col-md-8' : 'col-12'}`}>
        <Field
          name='healthFacility.address'
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
          name='healthFacility.district'
          type='text'
          validate={required}
          render={({ input, meta }) => {
            return (
              <SelectInput
                {...(input as any)}
                {...(meta as any)}
                label='District'
                errorLabel='district'
                labelKey='name'
                valueKey='id'
                options={districtList || []}
                loadingOptions={districtListLoading}
                error={(meta.touched && meta.error) || undefined}
              />
            );
          }}
        />
      </div>
      <div className={columnStyle}>
        <Field
          required={true}
          name='healthFacility.chiefdom'
          validate={required}
          render={({ input, meta }) => (
            <SelectInput
              {...(input as any)}
              {...(meta as any)}
              label='Chiefdom'
              errorLabel='chiefdom'
              labelKey='name'
              valueKey='id'
              options={chiefdomList}
              loadingOptions={chiefdomLoading}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      <div className={columnStyle}>
        <Field
          required={true}
          name='healthFacility.city'
          validate={required}
          render={(props) => (
            <AsyncSelectInput
              {...props}
              label='City/Village'
              errorLabel='city/village'
              labelKey='name'
              valueKey='id'
              options={cityOptions.current}
              loadInputOptions={loadCities}
              error={(props.meta.touched && props.meta.error) || undefined}
            />
          )}
        />
      </div>
      <div className={columnStyle}>
        <Field
          name='healthFacility.latitude'
          type='text'
          validate={composeValidators(required)}
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
          name='healthFacility.longitude'
          type='text'
          validate={composeValidators(required)}
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
          name='healthFacility.postalCode'
          type='text'
          validate={composeValidators(required, minLength(4))}
          parse={normalizePhone}
          render={({ input, meta }) => (
            <TextInput
              {...input}
              label='Pincode'
              errorLabel='pin code'
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      <div className={columnStyle}>
        <Field
          name='healthFacility.peerSupervisors'
          type='text'
          render={({ input, meta }) => (
            <MultiSelect
              {...(input as any)}
              label='Linked Peer Supervisor'
              errorLabel='linked peer supervisor'
              labelKey='name'
              valueKey='id'
              isShowLabel={true}
              isSelectAll={true}
              menuPlacement={'bottom'}
              placeholder=''
              isModel={true}
              isMulti={true}
              options={peerSupervisorList}
              loading={peerSupervisorLoading}
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
      <div className={columnStyle}>
        <Field
          name='healthFacility.language'
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
          name='healthFacility.linkedVillages'
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
              menuPlacement={'bottom'}
              isModel={true}
              isMulti={true}
              options={villagesList}
              loading={villagesLoading}
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
  );
};

export default HealthFacilityDetailsForm;
