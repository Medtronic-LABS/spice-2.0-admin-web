import { useRef, useState } from 'react';
import { IComponentConfig } from '../types/ComponentConfig';
import { IComponentConfig as IRegionComponentConfig } from '../types/CustomizationComponentConfig';
import { FormApi } from 'final-form';
import { getConfigByViewType } from '../utils/FieldUtils';
import {
  isEditableFields,
  unitMeasurementFields,
  getConfigByViewType as getRegionConfigViewType
} from '../utils/CustomizationFieldUtils';
import { ISelectFormOptions } from '../../../components/formFields/SelectInput';
import APPCONSTANTS from '../../../constants/appConstants';
import { camel2Title } from '../../../utils/validation';
import { useParams } from 'react-router-dom';

interface IMatchParams {
  form: string;
}

/**
 * Customization hook for form fields.
 * @param {boolean} isRegionFormCustomization - Whether the form is a region form customization
 */
const useFormCustomization = (isRegionFormCustomization?: boolean) => {
  const [formData, setFormData] = useState<any>({});
  const { form: formType } = useParams<IMatchParams>();
  const [isFamilyOrderModelOpen, setFamilyOrderModelOpen] = useState<boolean>(false);
  const [editGroupedFieldsOrder, setEditGroupedFieldsOrder] = useState<any>({
    isOpen: false,
    familyName: ''
  });

  const formRef = useRef<FormApi<any>>();

  const addedFieldRef = useRef<string[]>([]);
  const addedFields = addedFieldRef.current;

  const targetIdRef = useRef<ISelectFormOptions[]>([]);
  const targetIds = targetIdRef.current;
  const targetIdForAccountRef = useRef<ISelectFormOptions[]>([]);
  const targetIdsForAccount = targetIdForAccountRef.current;

  const hashFieldIdsWithTitleRef = useRef<any>({});
  const hashFieldIdsWithTitle = hashFieldIdsWithTitleRef.current;
  const [hashFieldIdsWithFieldName, sethashFieldIdsWithFieldName] = useState<any>({});

  /**
   * Resets the collapsed calculation for the provided keys.
   * @param {string[]} keys - The keys to reset the collapsed calculation for
   */
  const resetCollapsedCalculation = (keys: string[]) => {
    const res: { [k: string]: boolean } = {};
    keys.forEach((key: string, index: number) => {
      res[key] = index === 0 && !isRegionFormCustomization ? true : false;
    });
    return res as { [key: string]: boolean };
  };

  const [collapsedGroup, setCollapsedGroup] = useState<{ [key: string]: boolean }>(
    resetCollapsedCalculation(Object.keys(formData || {}))
  );

  // add targetIds based on condition
  const getTargetIds = (view: any) => {
    if (
      (!view.isNeededDefault ||
        (view.isNeededDefault && view.visibility && view.visibility === 'gone') ||
        (view.isNeededDefault && view.isEnabled === false)) &&
      !!view.family
    ) {
      targetIds.push({
        key: view.id,
        label: camel2Title(view.id)
      });
    }
  };

  /**
   * Retrieves the target IDs for the account based on the provided view.
   * @param {any} view - The view to retrieve the target IDs for
   */
  const getTargetIdsForAccount = (view: any) => {
    if (
      (!view.isNeededDefault ||
        (view.isNeededDefault && view.visibility && view.visibility === 'gone') ||
        (view.isNeededDefault && view.isEnabled === false)) &&
      !!view.family
    ) {
      targetIdsForAccount.push({
        key: view.id,
        label: camel2Title(view.title)
      });
    }
  };

  // format initial data by family
  const groupViewsByFamily = (obj: any) => {
    const res: { [groupName: string]: any } = {};
    const newhashFieldIdsWithFieldName = { ...hashFieldIdsWithFieldName };
    Object.values(obj).forEach((view: any) => {
      if (view.family) {
        // temp ID to track Display name changes
        hashFieldIdsWithTitle[view.id.trim()] = view.title.trim();
        // temp ID to track Field name changes
        newhashFieldIdsWithFieldName[view.id.trim()] = view.fieldName?.trim();
        res[view.family] = { ...res[view.family], ...{ [view.id]: view } };
      } else if (view.viewType === 'CardView' && !view.family) {
        res[view.id] = { [view.id]: view };
      } else if (view.viewType !== 'CardView' && !view.family) {
        res[APPCONSTANTS.NO_FAMILY] = { [view.id]: view };
      }
      addedFields.push(view.id);
      getTargetIds(view);
      getTargetIdsForAccount(view);

      if (!isRegionFormCustomization) {
        return;
      }
      if (isRegionFormCustomization) {
        if (formType === 'enrollment' && isEditableFields.includes(view.id) && !('isEditable' in view)) {
          view.isEditable = true;
        }
        if (unitMeasurementFields.includes(view.id) && !('unitMeasurement' in view)) {
          view.unitMeasurement = undefined;
        }
      }
    });
    sethashFieldIdsWithFieldName(newhashFieldIdsWithFieldName);
    return res;
  };

  /**
   * Retrieves the sorted data based on the provided data.
   * @param {any} data - The data to sort
   */
  const getSortedData = (data: any) =>
    Object.entries(data)
      .sort(([val1, obj1]: [any, any], [val2, obj2]: [any, any]) =>
        obj1[val1]?.familyOrder >= 0 && obj2[val2]?.familyOrder >= 0
          ? obj1[val1].familyOrder - obj2[val2].familyOrder
          : 1
      )
      .map(([val1]: [any, any]) => val1);

  /**
   * Retrieves the presentable JSON based on the provided values and sorted family.
   * @param {any} values - The values to present
   * @param {string[]} sortedFamily - The sorted family to present
   */
  const presentableJson = (values: any, sortedFamily: string[] = []) => {
    let data: any = [];
    (sortedFamily.length ? sortedFamily : Object.keys(values)).forEach((familyName) => {
      const familyData: any = [];
      Object.keys(values[familyName]).forEach((fieldGroupName) => {
        const obj = values[familyName][fieldGroupName];
        let componentConfig: IComponentConfig | IRegionComponentConfig;
        if (isRegionFormCustomization) {
          componentConfig = getRegionConfigViewType(obj?.viewType);
        } else {
          componentConfig = getConfigByViewType(obj?.viewType);
        }
        const json = componentConfig.getJSON?.(obj);
        if (json) {
          familyData.push(json);
        }
      });
      data = data.concat(familyData.sort((a: any, b: any) => a.orderId - b.orderId));
    });
    return data;
  };

  return {
    formRef,
    formData,
    setFormData,

    // accordion props
    groupViewsByFamily,
    addedFields,
    getTargetIds,
    targetIds,
    targetIdsForAccount,
    collapsedGroup,
    setCollapsedGroup,
    resetCollapsedCalculation,
    getSortedData,
    presentableJson,
    hashFieldIdsWithTitle,
    hashFieldIdsWithFieldName,
    sethashFieldIdsWithFieldName,

    // reorder props
    isFamilyOrderModelOpen,
    setFamilyOrderModelOpen,
    editGroupedFieldsOrder,
    setEditGroupedFieldsOrder
  };
};

export default useFormCustomization;
