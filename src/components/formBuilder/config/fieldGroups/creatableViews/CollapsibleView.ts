import APPCONSTANTS from '../../../../../constants/appConstants';
import { IBaseFieldMeta } from '../../../types/BaseFieldMeta';
import { IBaseFields } from '../../../types/BaseFields';
import { IComponentConfig, IFieldViewType } from '../../../types/ComponentConfig';

export interface ICollapsibleViewFields extends IBaseFields {
  hint?: string;
  visibility: string;
  defaultValue?: string;
  isNew?: boolean;
  optionsList?: Array<{ name: string; id: string }>;
  errorMessage?: string;
  isNotDefault?: boolean;
  targetViews: Array<{ name: string; id: string }>;
}

const getEmptyData = (): ICollapsibleViewFields => ({
  id: new Date().getTime().toString() + 'CollapsibleView',
  viewType: 'CollapsibleView',
  title: '',
  fieldName: '',
  family: '',
  isSummary: false,
  isMandatory: false,
  isEnabled: true,
  isEnrollment: true,
  visibility: APPCONSTANTS.VALIDITY_OPTIONS.visible.key,
  condition: [],
  hint: '',
  optionsList: [],
  targetViews: [],
  errorMessage: '',
  defaultValue: '',
  isNotDefault: true
});

const customizableFieldMeta: IBaseFieldMeta = {
  visibility: {},
  isEnabled: {},
  isEnrollment: {},
  isMandatory: {},
  defaultValue: {},
  title: {},
  fieldName: {},
  optionsList: {},
  targetViews: {},
  condition: {},
  errorMessage: {},
  isEditable: {},
  unitMeasurement: {}
};

const getJSON = (json: any): IFieldViewType => {
  json.fieldName = json.fieldName?.label ? json.fieldName.label : json.fieldName;
  json.condition = json.condition?.filter((val: any) => !!val);
  return json;
};

const COLLAPSIBLE_VIEW_CONFIG: IComponentConfig = {
  getEmptyData,
  customizableFieldMeta,
  getJSON
};

export default COLLAPSIBLE_VIEW_CONFIG;
