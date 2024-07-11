import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { camelCase } from 'lodash';

import { formMetaSelector } from '../../store/workflow/selectors';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import Loader from '../../components/loader/Loader';
import AccordianView from '../../components/formBuilder/components/accordian/AccordianView';
import { clearFormJSON } from '../../store/workflow/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ReorderView from '../../components/formBuilder/components/reorder/ReorderView';
import { getConfigByViewType } from '../../components/formBuilder/utils/FieldUtils';
import useFormCustomization from '../../components/formBuilder/hooks/useFormCustomization';
import { fetchLabTestCustomizationRequest, labtestCustomization } from '../../store/labTest/actions';
import { labTestJSONLoadingSelector } from '../../store/labTest/selectors';

interface IMatchParams {
  regionId: string;
  tenantId: string;
  labTestName: string;
  identifier: string;
  testId: string;
}

const LabTestCustomizationLayout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { tenantId, regionId, labTestName, identifier: uniqueName, testId: formId } = useParams<IMatchParams>();
  const testName = decodeURIComponent(labTestName);
  const uniqueId = decodeURIComponent(uniqueName);
  const formGetMeta = useSelector(formMetaSelector) || [];
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

    // reorder props
    isFamilyOrderModelOpen,
    setFamilyOrderModelOpen,
    editGroupedFieldsOrder,
    setEditGroupedFieldsOrder
  } = useFormCustomization();

  useEffect(() => {
    dispatch(
      fetchLabTestCustomizationRequest({
        name: uniqueId,
        successCb: ({ formInput }: { formInput: any }) => {
          const formJSON = JSON.parse(formInput)?.formLayout;
          if (formJSON) {
            handleAddDefaultFamily(testName, formJSON[0].id);
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

  const onCancel = () => {
    history.push(PROTECTED_ROUTES.labtestList.replace(':tenantId', tenantId).replace(':regionId', regionId));
  };

  const onSubmit = (dataParams: any) => {
    const formatData = presentableJson(dataParams);
    const data = {
      id: JSON.parse(formId) ? formId : undefined,
      formInput: JSON.stringify({
        time: Date.now(),
        formLayout: formatData
      }).toString(),
      uniqueName,
      testName: labTestName,
      displayOrder: 1,
      countryId: Number(regionId),
      tenantId: null
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
            ).replace('updated', formId ? 'updated' : 'created')
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
                formId ? 'update' : 'create'
              )
            )
          );
        }
      })
    );
  };

  const handleAddDefaultFamily = (familyName: string, formID?: any) => {
    const formValues: any = {};
    const id = formID || camelCase(familyName) + Date.now();
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
            setEditGroupedFieldsOrder={setEditGroupedFieldsOrder}
            presentableJson={presentableJson}
            collapsedGroup={collapsedGroup}
            setCollapsedGroup={setCollapsedGroup}
            hashFieldIdsWithTitle={hashFieldIdsWithTitle}
            hashFieldIdsWithFieldName={hashFieldIdsWithFieldName}
            addNewFieldDisabled={false}
            isFieldNameChangable={true}
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
