import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { camelCase } from 'lodash';

import { formJSONSelector, getFormMetaSelector, loadingSelector } from '../../store/workflow/selectors';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import Loader from '../../components/loader/Loader';
import AccordianView from '../../components/formBuilder/components/accordian/AccordianView';
import { clearFormJSON, customizeFormRequest, fetchCustomizationFormRequest } from '../../store/workflow/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ReorderView from '../../components/formBuilder/components/reorder/ReorderView';
import { getConfigByViewType } from '../../components/formBuilder/utils/FieldUtils';
import useFormCustomization from '../../components/formBuilder/hooks/useFormCustomization';

interface IMatchParams {
  regionId: string;
  tenantId: string;
  form: string;
  clinicalWorkflowId: string;
  workflowId: string;
}

/**
 * Renders the workflow form customization component.
 */
const WorkflowFormCustomization = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { tenantId, regionId, form, clinicalWorkflowId, workflowId: wfId } = useParams<IMatchParams>();
  const formType = decodeURIComponent(form);
  const workflowId = decodeURIComponent(wfId);
  const formGetMeta = useSelector(getFormMetaSelector) || [];
  const { id: formId } = useSelector(formJSONSelector) || {};
  const loading = useSelector(loadingSelector);

  const {
    formRef,
    formData,
    setFormData,

    // accordion props
    groupViewsByFamily,
    addedFields,
    targetIdsForAccount,
    collapsedGroup,
    setCollapsedGroup,
    resetCollapsedCalculation,
    presentableJson,
    hashFieldIdsWithTitle,
    hashFieldIdsWithFieldName,
    sethashFieldIdsWithFieldName,

    // reorder props
    isFamilyOrderModelOpen,
    setFamilyOrderModelOpen,
    editGroupedFieldsOrder,
    setEditGroupedFieldsOrder
  } = useFormCustomization();

  /**
   * Fetches the customization form data and handles the response.
   */
  useEffect(() => {
    dispatch(
      fetchCustomizationFormRequest({
        tenantId,
        countryId: regionId,
        formType: 'Module',
        category: APPCONSTANTS.CUSTOMIZATION_FORM_CATEGORY,
        clinicalWorkflowId,
        successCb: ({ formInput }) => {
          const formJSON = JSON.parse(formInput)?.formLayout;
          if (formJSON) {
            handleAddDefaultFamily(formType, formJSON[0].id);
            setFormData(groupViewsByFamily(formJSON));
          } else {
            handleAddDefaultFamily(formType);
          }
        },
        failureCb: () => {
          handleAddDefaultFamily(formType);
        }
      })
    );
    return () => {
      dispatch(clearFormJSON());
      setFormData(undefined);
    };
    // eslint-disable-next-line
  }, [dispatch, formType, regionId, tenantId]);

  /**
   * Handles the cancel action.
   */
  const onCancel = () => {
    history.push(PROTECTED_ROUTES.workflowByRegion.replace(':tenantId', tenantId).replace(':regionId', regionId));
  };

  /**
   * Handles the submit action.
   * @param {any} data - The data to submit
   */
  const onSubmit = (data: any) => {
    const formatData = presentableJson(data);
    const newData = JSON.stringify({
      time: Date.now(),
      formLayout: formatData
    }).toString();
    dispatch(
      customizeFormRequest({
        formType: 'Module',
        formId,
        category: APPCONSTANTS.CUSTOMIZATION_FORM_CATEGORY,
        tenantId,
        countryId: regionId ? regionId : '',
        payload: newData,
        workflowId,
        clinicalWorkflowId,
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            APPCONSTANTS.FORM_CUSTOMIZATION_SUCCESS.replace(
              'Dynamic',
              formType.charAt(0).toUpperCase() + formType.slice(1)
            )
          );
          onCancel();
        },
        failureCb: (e) => {
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              APPCONSTANTS.FORM_CUSTOMIZATION_ERROR.replace('dynamic', formType)
            )
          );
        }
      })
    );
  };

  /**
   * Handles the addition of a default family.
   * @param {string} familyName - The name of the family to add
   * @param {any} formJSON - The form JSON to add the family to
   */
  const handleAddDefaultFamily = (familyName: string, formJSON?: any) => {
    const formValues: any = {};
    const id = formJSON || camelCase(familyName) + Date.now();
    const nxtView: any = getConfigByViewType('CardView').getEmptyData();
    nxtView.viewType = 'CardView';
    nxtView.id = id;
    nxtView.title = familyName;
    nxtView.familyOrder = 0;
    nxtView.isCustomWorkflow = true;
    formValues[id] = {};
    formValues[id][id] = nxtView;
    setCollapsedGroup(resetCollapsedCalculation(Object.keys(formValues)));
    setFormData(formValues);
  };
  const accordianRef = useRef<any>([]);
  const newlyAddedIdsRef = useRef<any>([]);
  return (
    <div data-testid='workflow-form-customization'>
      {formData && !loading ? (
        <>
          <AccordianView
            formRef={formRef}
            formMeta={formData}
            setFormMeta={setFormData}
            addedFields={addedFields}
            allowedFields={formGetMeta}
            targetIds={targetIdsForAccount}
            onSubmit={onSubmit}
            onCancel={onCancel}
            setEditGroupedFieldsOrder={setEditGroupedFieldsOrder}
            presentableJson={presentableJson}
            collapsedGroup={collapsedGroup}
            setCollapsedGroup={setCollapsedGroup}
            hashFieldIdsWithTitle={hashFieldIdsWithTitle}
            hashFieldIdsWithFieldName={hashFieldIdsWithFieldName}
            sethashFieldIdsWithFieldName={sethashFieldIdsWithFieldName}
            isShow={true}
            addNewFieldDisabled={false}
            isFieldNameChangable={true}
            isCustomizationForm={true}
            isWorkFlowCustomization={true}
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
      ) : null}
      {loading && <Loader />}
    </div>
  );
};

export default WorkflowFormCustomization;
