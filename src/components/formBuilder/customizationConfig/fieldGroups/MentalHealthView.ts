import APPCONSTANTS from '../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../types/BaseFieldMeta';
import { IBaseFields } from '../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../types/CustomizationComponentConfig';

export interface IMentalHealthViewFields extends IBaseFields {
  localDataCache?: string;
  isNew?: boolean;
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the mental health view fields based on the provided configuration.
 * @returns {IMentalHealthViewFields} The empty data for the mental health view fields
 */
const getEmptyData = (): IMentalHealthViewFields => ({
  id: new Date().getTime().toString() + 'MentalHealthView',
  viewType: 'MentalHealthView',
  title: 'Title',
  fieldName: 'Field name',
  family: 'phq4',
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  isMandatory: undefined,
  isEnabled: undefined,
  isEnrollment: true,
  localDataCache: 'PHQ4',
  isNotDefault: false
});

const customizableFieldMeta: IBaseFieldMeta = {
  isMandatory: {},
  title: {},
  fieldName: {},
  visibility: {},
  isEnabled: {},
  isEnrollment: {},
  isEditable: {},
  unitMeasurement: {}
};

/**
 * Retrieves the JSON data for the mental health view fields based on the provided configuration.
 * @param {any} json - The JSON data for the mental health view fields
 * @returns {IFieldViewType} The JSON data for the mental health view fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  return json;
};

const MENTAL_HEALTH_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default MENTAL_HEALTH_CONFIG;
