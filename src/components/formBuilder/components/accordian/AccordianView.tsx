import arrayMutators from 'final-form-arrays';
import { cloneDeep } from 'lodash';
import { Fragment, useMemo, useRef } from 'react';
import { Form } from 'react-final-form';
import BinIcon from '../../../../assets/images/bin.svg';
import editIcon from '../../../../assets/images/edit.svg';
import plusIcon from '../../../../assets/images/plus.svg';
import Accordian from '../../../../components/accordian/Accordian';
import APPCONSTANTS from '../../../../constants/appConstants';
import styles from '../../styles/FormBuilder.module.scss';
import { IFieldViewType as IViewType } from '../../types/ComponentConfig';
import { creatableViews, getConfigByViewType } from '../../utils/FieldUtils';
import {
  creatableViews as workflowCreatableViews,
  getConfigByViewType as getWorkFlowConfigViewType
} from '../../utils/CustomizationFieldUtils';
import { isEditableFields, unitMeasurementFields } from '../../utils/CustomizationFieldUtils';
import RenderFieldGroups from '../RenderFieldGroups';
import { containsOnlyLettersAndNumbers } from '../../../../utils/validation';

interface IAccordinaViewProps {
  formRef: any;
  formMeta: any;
  accordianRef: any;
  newlyAddedIdsRef: any;
  setFormMeta: any;
  targetIds: any;
  onSubmit: any;
  onCancel: any;
  setEditGroupedFieldsOrder: any;
  presentableJson: any;
  collapsedGroup: any;
  setCollapsedGroup: any;
  addedFields: any;
  allowedFields: any;
  hashFieldIdsWithTitle?: any;
  hashFieldIdsWithFieldName?: any;
  sethashFieldIdsWithFieldName?: any;
  culture?: any;
  isShow?: boolean;
  addNewFieldDisabled?: boolean;
  isFieldNameChangable?: boolean;
  isCustomizationForm?: boolean;
  isWorkFlowCustomization?: boolean;
}

export interface IFormValues {
  jsonForm: IViewType[];
}

/**
 * Adds a new field to the form.
 * @param {object} props - The props for the addNewFieldFn function
 */
export const addNewFieldFn = ({
  family,
  view,
  formRef,
  newlyAddedIds,
  isFieldNameChangable,
  hashFieldIdsWithTitle,
  hashFieldIdsWithFieldName,
  accordianRef,
  setFormMeta,
  isDeletable = undefined,
  isWorkFlowCustomization = false
}: {
  family: string;
  view: string;
  formRef: any;
  newlyAddedIds: any;
  isFieldNameChangable: boolean;
  hashFieldIdsWithTitle: any;
  hashFieldIdsWithFieldName: any;
  accordianRef: React.MutableRefObject<any>;
  setFormMeta: any;
  isDeletable?: boolean;
  isWorkFlowCustomization?: boolean;
}) => {
  const finalFormState = { ...formRef.current.getState() };
  const formValues = cloneDeep(finalFormState.values);
  // enable add field options dropdown
  const element = document.getElementById('dropdownMenu');
  element?.classList.remove('show');
  const dropdownelement = document.getElementById('newfieldoptions');
  dropdownelement?.classList.remove('show');
  // add new field to form meta
  let nxtView: any;
  if (isWorkFlowCustomization) {
    nxtView = getWorkFlowConfigViewType(view).getEmptyData();
  } else {
    nxtView = getConfigByViewType(view).getEmptyData();
  }
  nxtView.family = family;
  nxtView.orderId = Object.values(formValues[family]).filter((item: any) => item.viewType !== 'CardView').length + 1;
  if (isDeletable !== undefined) {
    nxtView.isDeletable = isDeletable;
  }
  // add newly added ids and fieldname
  newlyAddedIds.push(nxtView.id);
  formValues[family][nxtView.id] = nxtView;
  if (isFieldNameChangable) {
    hashFieldIdsWithTitle[nxtView.id] = '';
    hashFieldIdsWithFieldName[nxtView.id] = '';
  }
  setFormMeta(formValues);
  setTimeout(() => {
    accordianRef?.current[family].scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 0);
};

/**
 * Renders the header for the accordian view.
 * @param {object} props - The props for the AccordianHeader component
 */
const AccordianHeader = ({
  collapsedGroup,
  familyName,
  currentFamilyGroup,
  setEditGroupedFieldsOrder,
  handleAddNewField,
  addNewFieldDisabled,
  isWorkFlowCustomization,
  isShow
}: any) => {
  /**
   * Gets the createable views based on the provided configuration.
   */
  const getCreateableViews = () => {
    if (isWorkFlowCustomization) {
      return [...workflowCreatableViews];
    }
    return [...creatableViews];
  };
  return (
    <div className='row g-0 w-100' data-testid='accordian-header'>
      <div className='col-lg-8 col-7'>{currentFamilyGroup[familyName].title}</div>
      {collapsedGroup[familyName as keyof typeof collapsedGroup] && (
        <div className='col-lg-4 col-5 d-flex justify-content-end'>
          <div className=' dropdown me-1 d-flex' onClick={(e) => e.stopPropagation()}>
            <button
              className='btn btn-secondary dropdown-toggle primary-btn ms-1'
              type='button'
              id='edit-field-order'
              data-bs-toggle='dropdown'
              aria-expanded='false'
              aria-label='edit-field-order'
              disabled={Object.keys(currentFamilyGroup).length < 3}
              onClick={() => setEditGroupedFieldsOrder({ isOpen: true, familyName })}
            >
              <img className={`me-0dot5 ${styles.editBtnImg}`} width='14' height='14' src={editIcon} alt='edit-icon' />
              Edit Order
            </button>
            {isShow && (
              <button
                className='btn btn-secondary dropdown-toggle primary-btn ms-1'
                type='button'
                id='newfieldoptions'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                aria-label='add-new-field'
                disabled={addNewFieldDisabled}
              >
                <img className='me-0dot5' width='14' height='14' src={plusIcon} alt='plus-icon' />
                Add New Field
              </button>
            )}
            <ul className='dropdown-menu' aria-labelledby='newfieldoptions' id='dropdownMenu'>
              {getCreateableViews()
                .sort((a, b) => (a.label > b.label ? 1 : -1))
                .map((view, index) => {
                  return (
                    <li key={index}>
                      <button
                        className='dropdown-item'
                        type='button'
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddNewField(familyName, view.value);
                        }}
                        aria-label={view.label}
                      >
                        {view.label}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Renders the body of the accordian view.
 * @param {object} props - The props for the AccordianBody component
 */
const AccordianBody = ({
  currentFamilyGroup,
  newlyAddedIds,
  familyName,
  fieldGroupRef,
  form,
  unAddedFields,
  targetIds,
  handleDeleteField,
  handleUpdateFieldName,
  hashFieldIdsWithTitle,
  hashFieldIdsWithFieldName,
  addNewFieldDisabled,
  isFieldNameChangable,
  isCustomizationForm,
  isWorkFlowCustomization
}: any) => {
  /**
   * Gets the delete icon condition based on the provided configuration.
   */
  const getDeleteIconCondition = (fieldGroupName: any, isNew: any) => {
    if (!isCustomizationForm || isWorkFlowCustomization) {
      if (isWorkFlowCustomization && (isNew || currentFamilyGroup[fieldGroupName]?.isNotDefault)) {
        return true;
      } else if (!isWorkFlowCustomization) {
        return currentFamilyGroup[fieldGroupName]?.isDeletable !== undefined
          ? currentFamilyGroup[fieldGroupName]?.deletable
          : isNew || !currentFamilyGroup[fieldGroupName]?.isDefault;
      }
    }
    return false;
  };
  return (
    <div className='row' data-testid='accordian-body'>
      {Object.keys(currentFamilyGroup)
        .sort(
          (fieldA: string, fieldB: string) =>
            (currentFamilyGroup[fieldA]?.orderId || 0) - (currentFamilyGroup[fieldB]?.orderId || 0)
        )
        .map((fieldGroupName: any, index: number) => {
          const isNew = newlyAddedIds?.includes?.(currentFamilyGroup[fieldGroupName].id);
          return currentFamilyGroup[fieldGroupName].viewType !== 'CardView' &&
            currentFamilyGroup[fieldGroupName].viewType !== APPCONSTANTS.NO_FAMILY ? (
            <Fragment key={currentFamilyGroup[fieldGroupName].id}>
              <div
                key={`${familyName}_${currentFamilyGroup[fieldGroupName].id}` || index}
                className={`col-12 py-1 position-relative bg-light rounded ps-2 pe-2`}
                ref={(ref) => {
                  fieldGroupRef.current[`${familyName}_${currentFamilyGroup[fieldGroupName]?.id}`] = ref;
                }}
              >
                <div className='row align-items-stretch'>
                  <RenderFieldGroups
                    obj={currentFamilyGroup[fieldGroupName]}
                    name={`${familyName}.${fieldGroupName}`}
                    form={form}
                    unAddedFields={unAddedFields}
                    targetIds={targetIds}
                    newlyAddedIds={newlyAddedIds}
                    isNew={isNew}
                    handleUpdateFieldName={handleUpdateFieldName}
                    isFieldNameChangable={isFieldNameChangable}
                    addNewFieldDisabled={addNewFieldDisabled}
                    hashFieldIdsWithTitle={hashFieldIdsWithTitle}
                    hashFieldIdsWithFieldName={hashFieldIdsWithFieldName}
                    isCustomizationForm={isCustomizationForm}
                    isWorkFlowCustomization={isWorkFlowCustomization}
                  />
                </div>
                {getDeleteIconCondition(fieldGroupName, isNew) && (
                  <div className={`col-12 d-flex justify-content-end mt-1 danger-text lh-1dot25`}>
                    <div
                      onClick={() => handleDeleteField(familyName, fieldGroupName)}
                      className='pointer d-flex align-items-center'
                      data-testid='delete-field-icon'
                    >
                      <img className='me-0dot5' title='Delete' src={BinIcon} alt='delete' />
                      <span className={`${styles.customizationFont}`}>Delete</span>
                    </div>
                  </div>
                )}
              </div>
              {Object.keys(currentFamilyGroup).length - 1 > index && <div className='col-12 divider m-0dot125' />}
            </Fragment>
          ) : null;
        })}
    </div>
  );
};

/**
 * Renders the footer of the accordian view.
 * @param {object} props - The props for the AccordianFooter component
 */
const AccordianFooter = ({ initialState, submitting, values, culture, onCancel, _presentableJson }: any) => {
  return (
    <>
      <div className='col-12 mt-1dot25 d-flex'>
        <button type='button' className='btn secondary-btn me-0dot625 px-1dot125 ms-auto' onClick={onCancel}>
          Cancel
        </button>
        {Boolean(Object.keys(values).length) && (
          <button
            type='submit'
            disabled={initialState && initialState.length === 0 && submitting}
            className='btn primary-btn px-1dot75'
          >
            Submit
          </button>
        )}
      </div>
      {/* ------- JSON viewer ----------- */}
      {/* <div className='mt-1 bg-black p-2'>
        <code>
          <pre style={{ fontSize: '1rem' }}>{JSON.stringify(_presentableJson(cloneDeep(values)), null, 2)}</pre>
        </code>
      </div> */}
      {/* ------------------------------- */}
    </>
  );
};

/**
 * Renders the accordian view.
 * @param {object} props - The props for the AccordianView component
 */
const AccordianView = ({
  formRef,
  formMeta,
  setFormMeta,
  onCancel,
  targetIds,
  onSubmit: onSubmitFinal,
  accordianRef,
  newlyAddedIdsRef,
  setEditGroupedFieldsOrder,
  presentableJson,
  collapsedGroup,
  setCollapsedGroup,
  addedFields,
  allowedFields,
  hashFieldIdsWithTitle,
  hashFieldIdsWithFieldName,
  sethashFieldIdsWithFieldName,
  culture,
  isShow,
  addNewFieldDisabled,
  isFieldNameChangable,
  isCustomizationForm = false,
  isWorkFlowCustomization = false
}: IAccordinaViewProps) => {
  const fieldGroupRef = useRef<any>([]);
  const newlyAddedIds = newlyAddedIdsRef;

  /**
   * Gets the unadded fields based on the provided configuration.
   */
  const unAddedFields = useMemo(
    () =>
      allowedFields
        .sort((a: any, b: any) => (a.label > b.label ? 1 : -1))
        .filter((item: any) => !addedFields.includes(item.key)),
    [allowedFields, addedFields]
  );

  /**
   * Gets the final form error based on the provided configuration.
   */
  const getFinalFormError = (errors: any, values: any) => {
    let errorField: any = null;
    let newErrors = { ...errors };
    // manual error validation for code and url fields
    const familyGroup = Object.keys(values)[0];
    const valueObject: any = Object.values(values)[0] as any;
    for (const [key, value] of Object.entries(valueObject)) {
      if ((value as any)?.code && !(value as any).url) {
        newErrors = { ...errors, [familyGroup]: { [key]: { url: 'Please enter the url' } } };
      }
      if (
        (!(value as any).code && (value as any).url) ||
        ((value as any)?.code && containsOnlyLettersAndNumbers((value as any)?.code))
      ) {
        newErrors = { ...errors, [familyGroup]: { [key]: { code: 'Please enter the code' } } };
      }
    }
    // form errorField
    Object.keys(newErrors).forEach((familyName: string) => {
      if (!errorField) {
        let fieldGroupName: any;
        for (fieldGroupName in newErrors[familyName]) {
          if (newErrors[familyName][fieldGroupName]) {
            errorField = formMeta[familyName][fieldGroupName];
            break;
          }
        }
      }
    });
    return errorField;
  };

  /**
   * Toggles the accordian view based on the provided configuration.
   */
  const onToggle = (key: keyof typeof collapsedGroup) => {
    const finalFormState = formRef.current.getState();
    const prev = { ...collapsedGroup };
    let foundError: any = null;
    if (finalFormState?.valid) {
      Object.keys(prev).forEach((currKey: string) => {
        prev[currKey as keyof typeof prev] = currKey === key ? !prev[currKey] : false;
      });
    } else {
      foundError = getFinalFormError(finalFormState?.errors, finalFormState?.values);
    }
    setCollapsedGroup(prev);
    setTimeout(() => {
      const allowedRef = !!foundError?.id
        ? fieldGroupRef.current[`${foundError.family}_${foundError.id}`]
        : accordianRef?.current[key];
      allowedRef.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  /**
   * Handles the deletion of a field based on the provided configuration.
   */
  const handleDeleteField = (familyName: string, fieldGroupName: string) => {
    const finalFormState = { ...formRef.current.getState() };
    const formValues = cloneDeep(finalFormState.values);
    // update newly added ids
    const index = newlyAddedIds.indexOf(fieldGroupName);
    if (index > -1) {
      newlyAddedIds.splice(index, 1);
    }

    // update newly added ids and fieldname value
    if (isFieldNameChangable) {
      if (fieldGroupName in hashFieldIdsWithFieldName) {
        const newhashFieldIdsWithFieldName = { ...hashFieldIdsWithFieldName };
        delete newhashFieldIdsWithFieldName[fieldGroupName];
        sethashFieldIdsWithFieldName(newhashFieldIdsWithFieldName);
      }
      if (fieldGroupName in hashFieldIdsWithTitle) {
        delete hashFieldIdsWithTitle[fieldGroupName];
      }
    }

    // validation for the targetId removal in conditions in all family
    const allFamily = Object.keys(formValues).filter((v) => v !== 'NO_FAMILY');
    allFamily.forEach((family) => {
      Object.values(formValues[family]).forEach((v: any) => {
        if (v?.condition?.length) {
          v.condition.forEach((c: any, conditionIndex: number) => {
            if (c.targetId === fieldGroupName) {
              const toDeleteCondition = formValues[family][v.id]?.condition;
              if (toDeleteCondition) {
                toDeleteCondition[conditionIndex].targetId = '';
              }
            }
          });
        }
        if (v?.targetViews?.length) {
          const fieldToRemove = v.targetViews.findIndex(
            (selectedField: any) => selectedField.value === formValues[familyName][fieldGroupName].id
          );
          formValues[family][v.id].targetViews.splice(fieldToRemove, 1);
        }
      });
    });
    const targetIdRemoveIndex = targetIds.findIndex((t: any) => t.key === fieldGroupName);
    targetIds.splice(targetIdRemoveIndex, 1);
    delete formValues[familyName][fieldGroupName];
    setFormMeta(formValues);
  };

  /**
   * Handles the addition of a new field based on the provided configuration.
   */
  const handleAddNewField = (family: string, view: string) => {
    addNewFieldFn({
      family,
      view,
      formRef,
      newlyAddedIds,
      isFieldNameChangable: true,
      hashFieldIdsWithTitle,
      hashFieldIdsWithFieldName,
      accordianRef,
      setFormMeta,
      isWorkFlowCustomization
    });
  };

  /**
   * Handles the update of the field name based on the provided configuration.
   */
  const handleUpdateFieldName = (
    familyName: string,
    currentFieldID: string,
    newFieldName: string,
    newFieldLabel: string,
    currentTitle: string,
    onlyCallBack = false,
    callBack?: (formValues: any) => void
  ) => {
    const finalFormState = { ...formRef.current.getState() };
    const formValues = cloneDeep(finalFormState.values);
    if (!onlyCallBack) {
      formValues[familyName][newFieldName] = formValues[familyName][currentFieldID];
      formValues[familyName][newFieldName].id = newFieldName;
      formValues[familyName][newFieldName].fieldName = newFieldLabel;

      if (isCustomizationForm) {
        // toggle fields based on fieldname
        if (isEditableFields.includes(newFieldName)) {
          formValues[familyName][newFieldName].isEditable = true;
        } else if ('isEditable' in formValues[familyName][newFieldName]) {
          delete formValues[familyName][newFieldName].isEditable;
        }
        if (unitMeasurementFields.includes(newFieldName)) {
          formValues[familyName][newFieldName].unitMeasurement = undefined;
        } else if ('unitMeasurement' in formValues[familyName][newFieldName]) {
          delete formValues[familyName][newFieldName].unitMeasurement;
        }
      }

      delete formValues[familyName][currentFieldID];

      // update newly added ids
      const index = newlyAddedIds.indexOf(currentFieldID);
      if (index > -1) {
        newlyAddedIds.splice(index, 1);
      }
      newlyAddedIds.push(newFieldName);
      // update newly added ids with fieldname
      if (isFieldNameChangable) {
        if (currentFieldID in hashFieldIdsWithFieldName) {
          hashFieldIdsWithFieldName[newFieldName] = newFieldLabel;
          hashFieldIdsWithTitle[newFieldName] = currentTitle;
          delete hashFieldIdsWithFieldName[currentFieldID];
          delete hashFieldIdsWithTitle[currentFieldID];
        }
      }
    }
    // update newly added ids with title
    if (isFieldNameChangable) {
      if (currentFieldID in hashFieldIdsWithTitle) {
        hashFieldIdsWithTitle[currentFieldID] = newFieldLabel;
      }
    }
    setFormMeta(formValues);
    if (callBack) {
      return callBack(formValues);
    }
  };

  /**
   * Handles the form submission based on the provided configuration.
   */
  const handleFormSubmit = (event: any) => {
    const finalFormState = formRef.current.getState();
    event.preventDefault();
    let foundError: any = null;
    foundError = getFinalFormError(finalFormState.errors, finalFormState.values);
    if (!!foundError?.id) {
      const prev = { ...collapsedGroup };
      Object.keys(prev).forEach((currKey: string) => {
        prev[currKey as keyof typeof prev] = currKey === foundError.family ? true : false;
      });
      setCollapsedGroup(prev);
      setTimeout(() => {
        fieldGroupRef.current[
          `${foundError.family}_${foundError.id}${foundError.subField ? '_' + foundError.subField : ''}`
        ].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } else if (finalFormState.valid) {
      onSubmitFinal(finalFormState.values);
    }
  };

  // final form mutator to change value outside Form
  const setValue = ([fieldName, value]: any, state: any, { changeValue }: any) => {
    changeValue(state, fieldName, () => value);
  };

  /**
   * Sets the error for the field based on the provided configuration.
   */
  const setError = ([fieldName, error]: any, state: any) => {
    if (error !== undefined) {
      const { fields } = state;
      const field = fields[fieldName];
      field.data.customError = error;
      field.touched = true;
      state.formState.errors[fieldName] = error;
    } else {
      delete state.formState.errors[fieldName];
    }
  };

  return (
    <div className={`${styles.formBuilderViewTwo} container-fluid px-0 w-100`} data-testid='accordian-view'>
      <Form
        mutators={{
          ...arrayMutators,
          setValue,
          setError
        }}
        initialValues={formMeta}
        // tslint:disable-next-line:no-empty
        onSubmit={() => {}}
        render={({ form, submitting, values, errors }) => {
          formRef.current = form;
          return (
            <form onSubmit={(event) => handleFormSubmit(event)}>
              <div className='row gy-1'>
                {Object.keys(values)
                  .sort(
                    (fieldA: string, fieldB: string) =>
                      (values[fieldA][fieldA]?.familyOrder || 0) - (values[fieldB][fieldB]?.familyOrder || 0)
                  )
                  .map((familyName) => {
                    const currentFamilyGroup: any[] = values[familyName] || [];
                    if (familyName === APPCONSTANTS.NO_FAMILY) {
                      return null;
                    }
                    return (
                      <div
                        className={`${styles.viewContent}col-12`}
                        key={familyName}
                        ref={(ref) => (accordianRef.current = { ...accordianRef.current, [familyName]: ref })}
                      >
                        <Accordian
                          collapsed={collapsedGroup[familyName as keyof typeof collapsedGroup]}
                          onToggle={() => onToggle(familyName as keyof typeof collapsedGroup)}
                          header={
                            <AccordianHeader
                              currentFamilyGroup={currentFamilyGroup}
                              familyName={familyName}
                              collapsedGroup={collapsedGroup}
                              setEditGroupedFieldsOrder={setEditGroupedFieldsOrder}
                              handleAddNewField={handleAddNewField}
                              addNewFieldDisabled={addNewFieldDisabled}
                              isFieldNameChangable={isFieldNameChangable}
                              isShow={isShow}
                              isWorkFlowCustomization={isWorkFlowCustomization}
                            />
                          }
                          body={
                            <AccordianBody
                              currentFamilyGroup={currentFamilyGroup}
                              familyName={familyName}
                              fieldGroupRef={fieldGroupRef}
                              newlyAddedIds={newlyAddedIds}
                              form={form}
                              unAddedFields={unAddedFields}
                              targetIds={targetIds}
                              handleUpdateFieldName={handleUpdateFieldName}
                              handleDeleteField={handleDeleteField}
                              addNewFieldDisabled={addNewFieldDisabled}
                              isFieldNameChangable={isFieldNameChangable}
                              hashFieldIdsWithTitle={hashFieldIdsWithTitle}
                              hashFieldIdsWithFieldName={hashFieldIdsWithFieldName}
                              isCustomizationForm={isCustomizationForm}
                              isWorkFlowCustomization={isWorkFlowCustomization}
                            />
                          }
                        />
                      </div>
                    );
                  })}
              </div>
              <AccordianFooter
                initialState={formMeta}
                submitting={submitting}
                values={values}
                culture={culture}
                onCancel={onCancel}
                _presentableJson={presentableJson}
              />
            </form>
          );
        }}
      />
    </div>
  );
};

export default AccordianView;
