import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface IHeightFields extends IBaseFields {
  errorMessage?: string;
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the height fields based on the provided configuration.
 * @returns {IHeightFields} The empty data for the height fields
 */
const getEmptyData = (): IHeightFields => ({
  id: new Date().getTime().toString() + 'Height',
  viewType: 'Height',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  condition: [],
  errorMessage: '',
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  visibility: {},
  isEnabled: {},
  isMandatory: {},
  errorMessage: {},
  title: {},
  condition: {},
  fieldName: {},
  isEditable: {},
  isEnrollment: {},
  unitMeasurement: {}
};

/**
 * Retrieves the JSON data for the height fields based on the provided configuration.
 * @param {any} json - The JSON data for the height fields
 * @returns {IFieldViewType} The JSON data for the height fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  json.condition = json.condition?.filter((val: any) => !!val);
  return json;
};

const HEIGHT_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default HEIGHT_CONFIG;
