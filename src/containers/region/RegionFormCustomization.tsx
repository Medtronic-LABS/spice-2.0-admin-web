import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import AccordianView from '../../components/formBuilder/components/accordian/AccordianView';
import {
  clearFormJSON,
  clearFormMeta,
  customizeFormRequest,
  fetchFormMetaRequest,
  fetchCustomizationFormRequest
} from '../../store/workflow/actions';
import { formJSONSelector, getFormMetaSelector, loadingSelector } from '../../store/workflow/selectors';
import { FormType } from '../../store/workflow/types';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS, { APP_TYPE } from '../../constants/appConstants';
import Loader from '../../components/loader/Loader';
import { PROTECTED_ROUTES } from '../../constants/route';
import IconButton from '../../components/button/IconButton';
import ReorderView from '../../components/formBuilder/components/reorder/ReorderView';
import useFormCustomization from '../../components/formBuilder/hooks/useFormCustomization';
import SelectInput from '../../components/formFields/SelectInput';
import { fetchCultureListRequest } from '../../store/user/actions';
import { cultureListLoadingSelector, cultureListSelector } from '../../store/user/selectors';
import styles from '../../components/formBuilder/styles/FormBuilder.module.scss';
import { Form } from 'react-final-form';
import { filterByAppTypes } from '../../utils/commonUtils';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

/**
 * Interface for route parameters
 */
interface IMatchParams {
  regionId: string;
  tenantId: string;
  form: string;
}

/**
 * RegionFormCustomization component for customizing region-specific forms
 * @returns {React.ReactElement} The rendered component
 */
const RegionFormCustomization = (): React.ReactElement => {
  const dispatch = useDispatch();

  const history = useHistory();
  const { tenantId, regionId, form } = useParams<IMatchParams>();
  const formGetMeta = useSelector(getFormMetaSelector) || [];
  const { id: formId } = useSelector(formJSONSelector) || {};
  const loading = useSelector(loadingSelector);
  const cultureList = useSelector(cultureListSelector);
  const isCultureListLoading = useSelector(cultureListLoadingSelector);
  const defaultCulture = useMemo(
    () =>
      (cultureList || []).find((culture: { appTypes: string[] }) => culture.appTypes.includes(APP_TYPE.NON_COMMUNITY)),
    [cultureList]
  ); // returns first culture from array which has non community app type
  const [currentCulture, setCulture] = useState(defaultCulture);
  const accordianRef = useRef<any>([]);
  const newlyAddedIdsRef = useRef<any>([]);

  const { appTypes } = useAppTypeConfigs();

  const {
    formRef,
    formData,
    setFormData,

    // accordion props
    groupViewsByFamily,
    addedFields,
    targetIds,
    collapsedGroup,
    setCollapsedGroup,
    resetCollapsedCalculation,
    getSortedData,
    presentableJson,
    sethashFieldIdsWithFieldName,

    // reorder props
    isFamilyOrderModelOpen,
    setFamilyOrderModelOpen,
    editGroupedFieldsOrder,
    setEditGroupedFieldsOrder
  } = useFormCustomization(true);

  /**
   * Fetches the customization form
   * @param {number} cultureId - The culture ID
   */
  const fetchCustomizationForm = useCallback(
    (cultureId: number) =>
      dispatch(
        fetchCustomizationFormRequest({
          tenantId,
          countryId: regionId,
          formType: (form.charAt(0).toUpperCase() + form.slice(1)) as FormType,
          category: APPCONSTANTS.CUSTOMIZATION_FORM_CATEGORY,
          cultureId,
          successCb: ({ formInput, cultureId: existingCulture }) => {
            if (!currentCulture?.id && cultureList?.length) {
              setCulture((cultureList || []).find((culture: { id: any }) => culture.id === existingCulture));
            }
            const formJSON = JSON.parse(formInput)?.formLayout;
            const formDataJSON = groupViewsByFamily(formJSON);
            setCollapsedGroup(resetCollapsedCalculation(Object.keys(formDataJSON)));
            setFormData(formDataJSON || {});
          }
        })
      ),
    [
      cultureList,
      currentCulture?.id,
      dispatch,
      form,
      groupViewsByFamily,
      regionId,
      resetCollapsedCalculation,
      setCollapsedGroup,
      setFormData,
      tenantId
    ]
  );
  useEffect(() => {
    if (!currentCulture?.id) {
      setCulture(defaultCulture);
    }
  }, [currentCulture?.id, defaultCulture]);

  useEffect(() => {
    dispatch(fetchCultureListRequest());
    fetchCustomizationForm(currentCulture?.id);
    dispatch(
      fetchFormMetaRequest({
        formType: form as FormType,
        failureCb: (e) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.FETCH_FORM_META_ERROR));
        }
      })
    );
    return () => {
      dispatch(clearFormJSON());
      setFormData(undefined);
      dispatch(clearFormMeta(form as FormType));
    };
    // eslint-disable-next-line
  }, [dispatch, form, regionId, tenantId]);

  /**
   * Handles cancellation and navigation back
   */
  const onCancel = () => {
    history.push(PROTECTED_ROUTES.customizationByRegion.replace(':tenantId', tenantId).replace(':regionId', regionId));
  };

  /**
   * Handles form submission
   * @param {any} data - The form data
   */
  const onSubmit = (data: any) => {
    const formatData = [...presentableJson(data, getSortedData(data))];
    const newData = JSON.stringify({
      time: Date.now(),
      formLayout: formatData
    }).toString();
    dispatch(
      customizeFormRequest({
        formType: form as FormType,
        formId,
        category: APPCONSTANTS.CUSTOMIZATION_FORM_CATEGORY,
        tenantId,
        countryId: regionId ? regionId : '',
        cultureId: currentCulture?.id,
        payload: newData,
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            APPCONSTANTS.FORM_CUSTOMIZATION_SUCCESS.replace('Dynamic', form.charAt(0).toUpperCase() + form.slice(1))
          );
          onCancel();
        },
        failureCb: (e) => {
          toastCenter.error(
            ...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.FORM_CUSTOMIZATION_ERROR.replace('dynamic', form))
          );
        }
      })
    );
  };

  /**
   * Handles culture change
   * @param {Object} param0 - The selected culture object
   * @param {string} param0.name - The name of the selected culture
   * @param {number} param0.id - The ID of the selected culture
   */
  const onChange = ({ name, id }: { name: string; id: number }) => {
    if (currentCulture?.id !== id) {
      setCulture({ name, id });
      fetchCustomizationForm(id);
    }
  };

  return (
    <>
      {Object.keys(formData || {}).length && !loading ? (
        <>
          <div className='d-flex justify-content-end my-1'>
            <div className={`pe-1 ${styles.cultureDropdown}`}>
              <Form
                /* tslint:disable-next-line:no-empty */
                onSubmit={() => {}}
                render={() => (
                  <SelectInput
                    id={'input'}
                    showOnlyDropdown={true}
                    label={''}
                    required={false}
                    disabled={false}
                    input={{ onChange }}
                    labelKey={'name'}
                    valueKey={'id'}
                    value={currentCulture as any}
                    defaultValue={defaultCulture as any}
                    options={filterByAppTypes(cultureList, appTypes)}
                    loadingOptions={isCultureListLoading}
                  />
                )}
              />
            </div>
            <IconButton label='Edit family order' isEdit={true} handleClick={() => setFamilyOrderModelOpen(true)} />
          </div>
          <AccordianView
            formRef={formRef}
            formMeta={formData}
            setFormMeta={setFormData}
            addedFields={addedFields}
            allowedFields={[...formGetMeta]}
            targetIds={targetIds}
            culture={currentCulture}
            onSubmit={onSubmit}
            onCancel={onCancel}
            setEditGroupedFieldsOrder={setEditGroupedFieldsOrder}
            presentableJson={presentableJson}
            collapsedGroup={collapsedGroup}
            setCollapsedGroup={setCollapsedGroup}
            isShow={false}
            sethashFieldIdsWithFieldName={sethashFieldIdsWithFieldName}
            addNewFieldDisabled={true}
            isFieldNameChangable={false}
            isCustomizationForm={true}
            newlyAddedIdsRef={newlyAddedIdsRef.current}
            accordianRef={accordianRef}
          />
          <ReorderView
            formRef={formRef}
            formMeta={formData}
            setFormMeta={setFormData}
            isFamilyOrderModelOpen={isFamilyOrderModelOpen}
            setFamilyOrderModelOpen={setFamilyOrderModelOpen}
            editGroupedFieldsOrder={editGroupedFieldsOrder}
            setEditGroupedFieldsOrder={setEditGroupedFieldsOrder}
          />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default RegionFormCustomization;
