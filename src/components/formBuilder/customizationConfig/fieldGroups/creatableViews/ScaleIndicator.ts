import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface IScaleIndicatorFields extends IBaseFields {
  errorMessage?: string;
  startValue?: number;
  endValue?: number;
  interval?: number;
  isAboveUpperLimit?: boolean;
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the scale indicator fields based on the provided configuration.
 * @returns {IScaleIndicatorFields} The empty data for the scale indicator fields
 */
const getEmptyData = (): IScaleIndicatorFields => ({
  id: new Date().getTime().toString() + 'ScaleIndicator',
  viewType: 'ScaleIndicator',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  isAboveUpperLimit: false,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  isNotDefault: true,
  errorMessage: undefined,
  startValue: undefined,
  endValue: undefined,
  interval: undefined
});

const customizableFieldMeta: IBaseFieldMeta = {
  visibility: {},
  isEnabled: {},
  isEnrollment: {},
  isMandatory: {},
  isAboveUpperLimit: {},
  startValue: {},
  endValue: {},
  interval: {},
  errorMessage: {},
  title: {},
  fieldName: {},
  isEditable: {}
};

/**
 * Retrieves the JSON data for the scale indicator fields based on the provided configuration.
 * @param {any} json - The JSON data for the scale indicator fields
 * @returns {IFieldViewType} The JSON data for the scale indicator fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  if (json.inputType === 0) {
    delete json.inputType;
  }
  if (json.startValue) {
    json.startValue = Number(json.startValue);
  }
  if (json.endValue) {
    json.endValue = Number(json.endValue);
  }
  if (json.interval) {
    json.interval = Number(json.interval);
  }
  return json;
};

const SCALE_INDICATOR_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default SCALE_INDICATOR_CONFIG;
