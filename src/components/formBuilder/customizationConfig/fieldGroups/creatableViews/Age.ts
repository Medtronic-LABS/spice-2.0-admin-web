import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface IAgeFields extends IBaseFields {
  hint?: string;
  disableFutureDate?: boolean;
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the age fields based on the provided configuration.
 * @returns {IAgeFields} The empty data for the age fields
 */
const getEmptyData = (): IAgeFields => ({
  id: new Date().getTime().toString() + 'Age',
  viewType: 'Age',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  disableFutureDate: true,
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  title: {},
  fieldName: {},
  isMandatory: {},
  disableFutureDate: {},
  isEnabled: {},
  isEnrollment: {},
  visibility: {},
  isEditable: {},
  unitMeasurement: {}
};

/**
 * Retrieves the JSON data for the age fields based on the provided configuration.
 * @param {any} json - The JSON data for the age fields
 * @returns {IFieldViewType} The JSON data for the age fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  return json;
};

const AGE_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default AGE_CONFIG;
