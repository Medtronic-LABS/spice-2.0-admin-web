import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface IInstructionFields extends IBaseFields {
  inputType?: number;
  instructions: string[];
  isNotDefault?: boolean;
}

/**
 * Retrieves the empty data for the instruction fields based on the provided configuration.
 * @returns {IInstructionFields} The empty data for the instruction fields
 */
const getEmptyData = (): IInstructionFields => ({
  id: new Date().getTime().toString() + 'Instruction',
  viewType: 'Instruction',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  instructions: [],
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  instructions: {},
  fieldName: {},
  title: {},
  visibility: {},
  isEditable: {},
  isEnrollment: {},
  unitMeasurement: {}
};

/**
 * Retrieves the JSON data for the instruction fields based on the provided configuration.
 * @param {any} json - The JSON data for the instruction fields
 * @returns {IFieldViewType} The JSON data for the instruction fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  if (json.inputType === 0) {
    delete json.inputType;
  }
  return json;
};

const INSTRUCTION_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default INSTRUCTION_CONFIG;
