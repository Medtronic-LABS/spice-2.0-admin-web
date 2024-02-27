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
import SelectInput from '../../components/formFields/SelectInput';
import MultiSelect from '../../components/multiSelect/MultiSelect';

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
  const columnStyle = `${isEdit ? 'col-sm-6 col-md-4' : 'col-sm-6'} col-12`;

  const hfType = [
    { label: 'CHP', value: 'chp' },
    { label: 'CHP1', value: 'chp1' }
  ] as any[];
  const hfTypeLoading = false;
  const districtList = [
    { value: 'port_loko', label: 'Port Loko' },
    { value: 'port_loko1', label: 'Port Loko 1' }
  ] as any[];
  const districtListLoading = false;
  const chiefdomOptions = [
    { label: 'Kamaranka', value: 'kamaranka' },
    { label: 'Kamaranka 1', value: 'kamaranka1' }
  ] as any[];
  const chiefdomLoading = false;
  const cityOptions = [{ label: 'Makatha', value: 'makatha' }] as any[];
  const cityLoading = false;
  const linkedPeerSupervisorList = [{ id: '1', name: 'Supervisor 1' }] as any[];
  const linkedPeerSupervisorLoading = false;
  const languages = [{ id: '1', name: 'English' }] as any[];
  const languageLoading = false;
  const linkedVillages = [
    { label: 'Village 1', value: 'village1' },
    { label: 'Village 2', value: 'village2' },
    { label: 'Village 3', value: 'village3' },
    { label: 'Village 4', value: '4' },
    { label: 'Village 5', value: '5' },
    { label: 'Village 6', value: '6' },
    { label: 'Village 7', value: '7' },
    { label: 'Village 8', value: '8' },
    { label: 'Village 9', value: '9' },
    { label: 'Village 10', value: '10' },
    { label: 'Village 11', value: '11' }
  ] as any[];
  const linkedVillagesLoading = false;
  return (
    <div className='row gx-1dot25'>
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
              defaultValue={hfType.find((type) => type.label === (data.type?.label || data.type))}
              options={hfType}
              loadingOptions={hfTypeLoading}
              error={(meta.touched && meta.error) || undefined}
            />
          )}
        />
      </div>
      <div className={columnStyle}>
        <Field
          name='healthFacility.phuName'
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
          name='healthFacility.phuNo'
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
      <div className={`${isEdit ? 'col-8' : 'col-12'}`}>
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
                defaultValue={districtList.find((value) => value.label === (data.district?.label || data.district))}
                options={districtList}
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
              defaultValue={chiefdomOptions.find((value) => value.label === (data.chiefdom?.label || data.chiefdom))}
              options={chiefdomOptions}
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
          render={({ input, meta }) => (
            <SelectInput
              {...(input as any)}
              {...(meta as any)}
              label='City/Village'
              errorLabel='city/village'
              defaultValue={cityOptions.find((value) => value.label === (data.city?.label || data.city))}
              options={cityOptions}
              loadingOptions={cityLoading}
              error={(meta.touched && meta.error) || undefined}
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
          name='healthFacility.linkedPeerSupervisor'
          type='text'
          validate={required}
          render={({ input, meta }) => (
            <SelectInput
              {...(input as any)}
              label='Linked Peer Supervisor'
              errorLabel='linked peer supervisor'
              valueKey='id'
              labelKey='name'
              defaultValue={linkedPeerSupervisorList.find(
                (value) => value.name === (data.linkedPeerSupervisor?.name || data.linkedPeerSupervisor)
              )}
              options={linkedPeerSupervisorList}
              loadingOptions={linkedPeerSupervisorLoading}
              error={(meta.touched && meta.error) || undefined}
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
              defaultValue={languages.find((value) => value.name === (data.language?.name || data.language))}
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
              isShowLabel={true}
              isSelectAll={true}
              menuPlacement={'bottom'}
              isModel={true}
              isMulti={true}
              options={linkedVillages}
              loading={linkedVillagesLoading}
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
