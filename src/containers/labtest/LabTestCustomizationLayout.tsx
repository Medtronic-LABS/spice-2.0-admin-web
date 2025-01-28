import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { camelCase } from 'lodash';

import { getFormMetaSelector } from '../../store/workflow/selectors';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import Loader from '../../components/loader/Loader';
import AccordianView from '../../components/formBuilder/components/accordian/AccordianView';
import { clearFormJSON } from '../../store/workflow/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ReorderView from '../../components/formBuilder/components/reorder/ReorderView';
import { getConfigByViewType } from '../../components/formBuilder/utils/FieldUtils';
import useFormCustomization from '../../components/formBuilder/hooks/useFormCustomization';
import {
  fetchLabTestCustomizationRequest,
  fetchUnitListRequest,
  labtestCustomization
} from '../../store/labTest/actions';
import { labTestJSONLoadingSelector } from '../../store/labTest/selectors';

/**
 * Interface for route parameters
 */
interface IMatchParams {
  regionId: string;
  tenantId: string;
  labTestName: string;
  identifier: string;
  testId: string;
}

/**
 * LabTestCustomizationLayout component for customizing lab test forms
 * @returns {React.ReactElement} The rendered component
 */
const LabTestCustomizationLayout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { tenantId, regionId, labTestName, identifier: uniqueName, testId: formId } = useParams<IMatchParams>();
  const testName = decodeURIComponent(labTestName);
  const uniqueId = decodeURIComponent(uniqueName);
  const formGetMeta = useSelector(getFormMetaSelector) || [];
  const loading = useSelector(labTestJSONLoadingSelector);

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

  // Fetch unit list on component mount
  useEffect(() => {
    dispatch(fetchUnitListRequest());
  }, [dispatch]);

  // Fetch lab test customization data on component mount
  useEffect(() => {
    dispatch(
      fetchLabTestCustomizationRequest({
        countryId: Number(regionId),
        name: uniqueId,
        successCb: ({ formInput }: { formInput: any }) => {
          const formJSON = JSON.parse(formInput)?.formLayout;
          if (formJSON) {
            setCollapsedGroup(resetCollapsedCalculation([formJSON[0].id]));
            setFormData(groupViewsByFamily(formJSON));
          } else {
            handleAddDefaultFamily(testName);
          }
        },
        failureCb: () => {
          handleAddDefaultFamily(testName);
        }
      })
    );
    return () => {
      dispatch(clearFormJSON());
      setFormData(undefined);
    };
    // eslint-disable-next-line
  }, [dispatch, testName, regionId, tenantId]);

  /**
   * Handles cancellation and navigation back
   */
  const onCancel = () => {
    history.push(PROTECTED_ROUTES.labTestByRegion.replace(':tenantId', tenantId).replace(':regionId', regionId));
  };

  /**
   * Handles form submission
   * @param {any} dataParams - The form data
   */
  const onSubmit = (dataParams: any) => {
    const newData: any = Object.values(dataParams)[0];
    if ((Object.values(newData) || []).filter((v: any) => v.isMandatory).length < 2) {
      toastCenter.error(APPCONSTANTS.ERROR, APPCONSTANTS.REQUIRED_MANDATORY_FAILED);
      return;
    }
    const { state = {} } = history.location;
    const formatData = presentableJson(dataParams);
    const data = {
      id: JSON.parse(formId) ? formId : undefined,
      formInput: JSON.stringify({
        time: Date.now(),
        formLayout: formatData
      }).toString(),
      uniqueName,
      testName: labTestName.trim(),
      displayOrder: 1,
      countryId: Number(regionId),
      tenantId: null,
      ...state
    };
    dispatch(
      labtestCustomization({
        data,
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            APPCONSTANTS.FORM_CUSTOMIZATION_SUCCESS.replace(
              'Dynamic',
              testName.charAt(0).toUpperCase() + testName.slice(1)
            ).replace('updated', data.id ? 'updated' : 'created')
          );
          onCancel();
        },
        failureCb: (e) => {
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              APPCONSTANTS.FORM_CUSTOMIZATION_ERROR.replace('dynamic', testName).replace(
                'update',
                data.id ? 'update' : 'create'
              )
            )
          );
        }
      })
    );
  };

  const accordianRef = useRef<any>([]);
  const newlyAddedIdsRef = useRef<any>([]);

  /**
   * Adds a default family to the form
   * @param {string} familyName - The name of the family to add
   * @param {string} [formID] - Optional form ID
   */
  const handleAddDefaultFamily = (familyName: string, formID?: any) => {
    const formValues: any = {};
    const id = formID || camelCase(familyName) + Date.now();
    const nxtView: any = getConfigByViewType('CardView').getEmptyData();
    nxtView.viewType = 'CardView';
    nxtView.id = id;
    nxtView.title = familyName;
    nxtView.familyOrder = 0;
    formValues[id] = {};
    formValues[id][id] = nxtView;

    // mandatory "Tested On" field
    const dateView: any = getConfigByViewType('DatePicker').getEmptyData();
    dateView.viewType = 'DatePicker';
    dateView.id = 'TestedOn';
    dateView.fieldName = 'TestedOn';
    dateView.title = 'Tested On';
    dateView.family = id;
    dateView.isDeletable = false;
    dateView.isMandatory = true;
    dateView.disableFutureDate = true;
    dateView.orderId = 1;
    formValues[id][dateView.id] = dateView;
    setCollapsedGroup(resetCollapsedCalculation(Object.keys(formValues)));
    setFormData(formValues);
  };

  // Ensure 'TestedOn' field is in hashFieldIdsWithFieldName
  useEffect(() => {
    if ('TestedOn' in hashFieldIdsWithFieldName) {
      return;
    } else {
      const newhashFieldIdsWithFieldName = {
        ...hashFieldIdsWithFieldName,
        TestedOn: 'TestedOn'
      };
      sethashFieldIdsWithFieldName(newhashFieldIdsWithFieldName);
    }
  }, [hashFieldIdsWithFieldName, sethashFieldIdsWithFieldName]);

  return (
    <>
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
            accordianRef={accordianRef}
            newlyAddedIdsRef={newlyAddedIdsRef.current}
            setEditGroupedFieldsOrder={setEditGroupedFieldsOrder}
            presentableJson={presentableJson}
            collapsedGroup={collapsedGroup}
            setCollapsedGroup={setCollapsedGroup}
            hashFieldIdsWithTitle={hashFieldIdsWithTitle}
            hashFieldIdsWithFieldName={hashFieldIdsWithFieldName}
            sethashFieldIdsWithFieldName={sethashFieldIdsWithFieldName}
            addNewFieldDisabled={false}
            isFieldNameChangable={true}
            isCustomizationForm={false}
            isShow={true}
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
    </>
  );
};

export default LabTestCustomizationLayout;
