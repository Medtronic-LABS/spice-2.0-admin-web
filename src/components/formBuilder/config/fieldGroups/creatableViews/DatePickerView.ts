import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/ComponentConfig';

export interface IDatePickerFields extends IBaseFields {
  isDefault?: boolean;
  startDate?: string;
  endDate?: string;
  disableFutureDate?: boolean;
  minDays?: number | null;
  maxDays?: number | null;
}

const getEmptyData = (): IDatePickerFields => ({
  id: new Date().getTime().toString() + 'DatePicker',
  viewType: 'DatePicker',
  title: '',
  fieldName: '',
  family: '',
  isMandatory: false,
  isEnabled: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  isDefault: false,
  disableFutureDate: false,
  minDays: null,
  maxDays: null
});

const customizableFieldMeta: IBaseFieldMeta = {
  title: {},
  fieldName: {},
  isMandatory: {},
  isEnabled: {},
  visibility: {},
  disableFutureDate: {},
  minDays: {},
  maxDays: {}
};

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
