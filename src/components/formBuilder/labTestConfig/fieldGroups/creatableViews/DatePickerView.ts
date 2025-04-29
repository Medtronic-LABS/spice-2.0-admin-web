import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/ComponentConfig';

export interface IDatePickerFields extends IBaseFields {
  isDefault?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  disableFutureDate?: boolean;
  resource?: string;
  inputType: number;
  minDays?: number | null;
  maxDays?: number | null;
}

/**
 * Retrieves the empty data for the date picker fields based on the provided configuration.
 * @returns {IDatePickerFields} The empty data for the date picker fields
 */
const getEmptyData = (): IDatePickerFields => ({
  id: new Date().getTime().toString() + 'DatePicker',
  viewType: 'DatePicker',
  title: '',
  fieldName: '',
  family: '',
  inputType: 4,
  isMandatory: false,
  isEnabled: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  isDefault: false,
  resource: '',
  disableFutureDate: false,
  startDate: null,
  endDate: null
});

const customizableFieldMeta: IBaseFieldMeta = {
  title: {},
  fieldName: {},
  isMandatory: {},
  disableFutureDate: {},
  resource: {},
  inputType: { disabled: true },
  minDays: {},
  maxDays: {},
  startDate: {},
  endDate: {}
};

/**
 * Retrieves the JSON data for the date picker fields based on the provided configuration.
 * @param {any} json - The JSON data for the date picker fields
 * @returns {IFieldViewType} The JSON data for the date picker fields
 */
const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  return json;
};

const DATE_PICKER_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default DATE_PICKER_CONFIG;
