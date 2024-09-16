import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/CustomizationComponentConfig';

export interface IDatePickerFields extends IBaseFields {
  isNotDefault?: boolean;
  startDate?: string;
  endDate?: string;
}

const getEmptyData = (): IDatePickerFields => ({
  id: new Date().getTime().toString() + 'DatePicker',
  viewType: 'DatePicker',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  startDate: '',
  endDate: '',
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  title: {},
  fieldName: {},
  isMandatory: {},
  isEnabled: {},
  visibility: {},
  startDate: {},
  endDate: {}
};

const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  json.startDate = json.startDate?.label ? json.startDate.label : json.startDate;
  return json;
};

const DATE_PICKER_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default DATE_PICKER_CONFIG;
