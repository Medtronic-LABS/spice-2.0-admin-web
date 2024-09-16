import { ICardViewFields } from '../labTestConfig/fieldGroups/CardView';
import { ICheckBoxFields } from '../labTestConfig/fieldGroups/creatableViews/CheckBox';
import { IEditTextFields } from '../labTestConfig/fieldGroups/creatableViews/EditText';
import { IRadioGroupFields } from '../labTestConfig/fieldGroups/creatableViews/RadioGroup';
import { IDropdownFields } from '../labTestConfig/fieldGroups/creatableViews/Dropdown';
import { ITextLabelFields } from '../labTestConfig/fieldGroups/TextLabel';

import { IBaseFieldMeta } from './BaseFieldMeta';
import { IDatePickerFields } from '../labTestConfig/fieldGroups/creatableViews/DatePickerView';

export type IFieldViewType =
  | IEditTextFields
  | IRadioGroupFields
  | IDropdownFields
  | ICheckBoxFields
  | ICardViewFields
  | ITextLabelFields
  | IDatePickerFields;

export interface IComponentConfig {
  getEmptyData: () => IFieldViewType;
  customizableFieldMeta: IBaseFieldMeta;
  getJSON?: (json: any) => IFieldViewType;
}
