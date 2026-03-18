import React, { useEffect, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, FormSpy, useForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useSelector } from 'react-redux';
import { ReactComponent as BinIcon } from '../../assets/images/bin.svg';
import { ReactComponent as PlusIcon } from '../../assets/images/plus_blue.svg';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { getSubVillagesSelector, getSubVillagesLoadingSelector } from '../../store/region/selectors';
import { ssPrefixListSelector, ssPrefixLoadingSelector, shasthyaShebikaByKormiIdSelector } from '../../store/healthFacility/selectors';
import PhoneNumberField from '../formFields/PhoneNumber';
import SelectInput from '../formFields/SelectInput';
import TextInput from '../formFields/TextInput';
import MultiSelect from '../multiSelect/MultiSelect';
import { required } from '../../utils/validation';
import { ISSPrefix } from '../../store/healthFacility/types';
import { shastiyaKormiRole } from '../../constants/roleConstants';
import { ISubVillage } from '../../store/region/types';

/** Default row shape for Assign SS Users (used when adding a new row) */
export const DEFAULT_SS_USER_ROW = { ssId: null, name: '', phoneNumber: '', subVillages: null };

/** SPICE role name that enables the Assign SS Users section */
const hasShastiyaKormiRole = (role: any): boolean => {
  if (!role) return false;
  if (Array.isArray(role)) return role.some((r: { name?: string }) => r?.name === shastiyaKormiRole);
  return role?.name === shastiyaKormiRole;
};

/** Map API SS user item to form row shape */
const mapApiSSUserToFormRow = (
  item: { name?: string; phoneNumber?: string; ssId?: string; subVillages?: any[] },
  ssPrefixList: ISSPrefix[]
) => {
  const ssIdOption =
    item.ssId && ssPrefixList?.length
      ? ssPrefixList.find((opt) => opt.name === item.ssId) ?? null
      : null;
  return {
    ssId: ssIdOption,
    name: item.name ?? '',
    phoneNumber: item.phoneNumber ?? '',
    subVillages: item.subVillages ?? null
  };
};

/**
 * Filters sub-village options for a specific row, excluding sub-villages already selected in other rows
 * @param rowIndex - The index of the current row
 * @param ssUsers - Array of SS user form values
 * @param subVillagesList - Complete list of available sub-villages
 * @returns Filtered array of sub-village options available for the current row
 */
const getFilteredSubVillageOptionsForIndex = (
  rowIndex: number,
  ssUsers: Array<{ ssId?: any; subVillages?: any[] }>,
  subVillagesList: any[]
): any[] => {
  // Get IDs of sub-villages currently selected in this row
  const currentRowIds = new Set(
    (ssUsers[rowIndex]?.subVillages ?? [])
      .map((v: any) => Number(v?.id))
      .filter((id: number) => !Number.isNaN(id))
  );

  // Get IDs of sub-villages used in other rows
  const usedInOtherRows = new Set(
    ssUsers
      .filter((_, i) => i !== rowIndex)
      .flatMap(row => row?.subVillages ?? [])
      .map((v: any) => Number(v?.id))
      .filter((id: number) => !Number.isNaN(id))
  );

  // Return sub-villages that are either selected in current row or (not used elsewhere and not assigned to another SS)
  return (subVillagesList ?? []).filter(
    (opt: any) => {
      const inCurrentRow = currentRowIds.has(Number(opt.id));
      const notUsedElsewhere = !usedInOtherRows.has(Number(opt.id));
      const notAssignedToSS = opt.assignedShasthyaShebikaId == null;
      return inCurrentRow || (notUsedElsewhere && notAssignedToSS);
    }
  );
};

/** Clears subVillages field values that are no longer in the current options when subVillagesList/options change */
const SubVillagesFieldWithCleanup = ({
  form,
  name,
  index,
  options,
  subVillagesLoading,
  children
}: {
  form: FormApi<any>;
  name: string;
  index: number;
  options: ISubVillage[];
  subVillagesLoading: boolean;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (subVillagesLoading || !options?.length) return;
    const currentValue = form.getState().values?.ssUsers?.[index]?.subVillages;
    const selected = Array.isArray(currentValue) ? currentValue : [];
    if (selected.length === 0) return;
    const optionIds = new Set(options.map((opt: any) => Number(opt?.id)).filter((id: number) => !Number.isNaN(id)));
    const validSelected = selected.filter((v: any) => optionIds.has(Number(v?.id)));
    if (validSelected.length !== selected.length) {
      form.change(`${name}.subVillages`, validSelected.length > 0 ? validSelected : null);
    }
  }, [form, index, name, subVillagesLoading, options]);

  return <>{children}</>;
};

interface IFormSpyValues {
  users?: Array<{ role?: any }>;
  ssUsers?: Array<{ ssId?: any; subVillages?: any[] }>;
}

interface ISSUserRowProps {
  name: string;
  index: number;
  fields: { length?: number; remove: (idx: number) => void; push: (row: typeof DEFAULT_SS_USER_ROW) => void };
  form: FormApi<any>;
  filteredSSIdOptions: ISSPrefix[];
  ssPrefixLoading: boolean;
  subVillageSName: string;
  subVillagesList: ISubVillage[];
  subVillagesLoading: boolean;
  ssUsers: Array<{ ssId?: any; subVillages?: any[] }>;
}

const SSUserRow = ({
  name,
  index,
  fields,
  form,
  filteredSSIdOptions,
  ssPrefixLoading,
  subVillageSName,
  subVillagesList,
  subVillagesLoading,
  ssUsers
}: ISSUserRowProps): React.ReactElement => {
  const isLastSSRow = (fields?.length || 0) === index + 1;
  const showRemove = (fields?.length ?? 0) > 1;
  const showAdd = isLastSSRow;

  return (
    <React.Fragment>
      {index > 0 && <div className='divider mx-neg-1dot25 mb-1dot5' />}
      <div className='row gx-1dot25 align-items-start'>
        <div className='col-12 col-sm-6 col-lg-4'>
          <Field
            name={`${name}.ssId`}
            validate={required}
            render={({ input, meta }) => (
              <SelectInput
                {...(input as any)}
                label='SS ID'
                errorLabel='SS ID'
                labelKey='name'
                valueKey='id'
                options={filteredSSIdOptions}
                isModel={true}
                error={meta.touched && meta.error}
                required={true}
                isLoading={ssPrefixLoading}
                disabled={ssPrefixLoading}
                placeholder={ssPrefixLoading ? 'Loading SS IDs...' : 'Select SS ID'}
              />
            )}
          />
        </div>
        <div className='col-12 col-sm-6 col-lg-4'>
          <Field
            name={`${name}.name`}
            validate={required}
            render={({ input, meta }) => (
              <TextInput
                {...input}
                label='Name'
                errorLabel='name'
                error={(meta.touched && meta.error) || undefined}
                required={true}
              />
            )}
          />
        </div>
        <div className='col-12 col-sm-6 col-lg-4'>
          <PhoneNumberField
            id={0}
            name={name}
            fieldName='phoneNumber'
            form={form}
            formName='ssUsers'
            index={index}
          />
        </div>
      </div>
      <div className='row gx-1dot25 align-items-start mt-0dot5'>
        <div className='col-12 col-sm-10'>
          <SubVillagesFieldWithCleanup
            form={form}
            name={name}
            index={index}
            options={subVillagesList}
            subVillagesLoading={subVillagesLoading}
          >
            <Field
              name={`${name}.subVillages`}
              render={({ input, meta }) => (
                <MultiSelect
                  {...(input as any)}
                  label={subVillageSName}
                  errorLabel={subVillageSName}
                  labelKey='name'
                  valueKey='id'
                  options={getFilteredSubVillageOptionsForIndex(index, ssUsers, subVillagesList)}
                  isShowLabel={true}
                  isModel={true}
                  isMulti={true}
                  required={false}
                  isSelectAll={true}
                  error={meta.touched && meta.error}
                  isLoading={subVillagesLoading}
                  isDisabled={subVillagesLoading}
                  placeholder={subVillagesLoading ? `Loading ${subVillageSName}...` : `Select ${subVillageSName}`}
                />
              )}
            />
          </SubVillagesFieldWithCleanup>
        </div>
        <div className='col-12 col-sm-auto d-flex align-items-end align-self-center gap-1 pb-0dot25'>
          {showRemove && (
            <button
              type='button'
              className='danger-text lh-1dot25 pointer border-0 bg-transparent p-0'
              onClick={() => fields.remove(index)}
              title='Remove row'
              aria-label='Remove row'
            >
              <BinIcon className='me-0dot5' aria-hidden style={{ width: 20, height: 20 }} />
            </button>
          )}
          {showAdd && (
            <button
              type='button'
              className='theme-text lh-1dot25 pointer d-flex align-items-center border-0 bg-transparent p-0'
              onClick={() => fields.push({ ...DEFAULT_SS_USER_ROW })}
              title='Add row'
              aria-label='Add row'
            >
              <PlusIcon className='me-0dot5' aria-hidden style={{ width: 20, height: 20 }} />
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

const AssignSSUsersSection = (): React.ReactElement => {
  const form = useForm();
  const ssUsersFormName = 'ssUsers';
  const ssUsersInitialValue = useMemo(() => [{ ...DEFAULT_SS_USER_ROW }], []);
  const ssUsersInitializedForUserId = useRef<string | null>(null);
  const subVillagesList = useSelector(getSubVillagesSelector);
  const subVillagesLoading = useSelector(getSubVillagesLoadingSelector);
  const ssPrefixList = useSelector(ssPrefixListSelector);
  const ssPrefixLoading = useSelector(ssPrefixLoadingSelector);
  const shasthyaShebikaByKormiId = useSelector(shasthyaShebikaByKormiIdSelector);
  const { subVillage: { s: subVillageSName } } = useAppTypeConfigs();
  const ssIdOptions = useMemo<ISSPrefix[]>(() => {
    const options = ssPrefixList ?? [];
    return options.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [ssPrefixList]);

  const userId = form.getState()?.values?.users?.[0]?.id;
  const ssListForUser = userId == null ? null : shasthyaShebikaByKormiId?.[String(userId)];

  useEffect(() => {
    const clearInitializedUser = () => {
      ssUsersInitializedForUserId.current = null;
    };

    if (userId == null) {
      clearInitializedUser();
      return clearInitializedUser;
    }
    if (!Array.isArray(ssListForUser) || ssListForUser.length === 0) {
      return clearInitializedUser;
    }
    if (ssUsersInitializedForUserId.current === String(userId)) {
      return clearInitializedUser;
    }
    const options = ssPrefixList ?? [];
    const mapped = ssListForUser.map((item: any) => mapApiSSUserToFormRow(item, options));
    form.change(ssUsersFormName, mapped);
    ssUsersInitializedForUserId.current = String(userId);

    return clearInitializedUser;
  }, [userId, ssListForUser, form, ssPrefixList]);

  return (
  <FormSpy subscription={{ values: true }}>
    {(formSpyProps: { values?: IFormSpyValues }) => {
      const { values } = formSpyProps;
      const firstUserRole = values?.users?.[0]?.role;
      if (!hasShastiyaKormiRole(firstUserRole)) return null;
      const ssUsers = values?.ssUsers ?? [];
      const usedIds = new Set(
        ssUsers.map(user => user.ssId?.id)
      );
      const filteredSSIdOptions = ssIdOptions.filter(
        option => !usedIds.has(option.id)
      );

      return (
        <div className='mb-2 mt-2'>
          <div className='fw-bold theme-text mb-1dot25'>Assign Shasthya Shebika Users</div>
          <FieldArray name={ssUsersFormName} initialValue={ssUsersInitialValue}>
            {({ fields }) => (
              <>
                {fields.map((fieldName: string, rowIndex: number) => (
                  <SSUserRow
                    key={fieldName}
                    name={fieldName}
                    index={rowIndex}
                    fields={fields}
                    form={form}
                    filteredSSIdOptions={filteredSSIdOptions}
                    ssPrefixLoading={ssPrefixLoading}
                    subVillageSName={subVillageSName}
                    subVillagesList={subVillagesList}
                    subVillagesLoading={subVillagesLoading}
                    ssUsers={ssUsers}
                  />
                ))}
              </>
            )}
          </FieldArray>
        </div>
      );
    }}
  </FormSpy>
  );
};

export default AssignSSUsersSection;
