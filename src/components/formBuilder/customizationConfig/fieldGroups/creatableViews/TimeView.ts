import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface ITimeViewFields extends IBaseFields {
  isNew?: boolean;
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the time view fields based on the provided configuration.
 * @returns {ITimeViewFields} The empty data for the time view fields
 */
const getEmptyData = (): ITimeViewFields => ({
  id: new Date().getTime().toString() + 'TimeView',
  viewType: 'TimeView',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  title: {},
  fieldName: {},
  isMandatory: {},
  visibility: {},
  isEnabled: {},
  isEnrollment: {},
  isEditable: {},
  unitMeasurement: {}
};

/**
 * Retrieves the JSON data for the time view fields based on the provided configuration.
 * @param {any} json - The JSON data for the time view fields
 * @returns {IFieldViewType} The JSON data for the time view fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  return json;
};

const TIME_VIEW_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default TIME_VIEW_CONFIG;
