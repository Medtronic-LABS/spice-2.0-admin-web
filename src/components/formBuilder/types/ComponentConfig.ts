import { ICardViewFields } from '../config/fieldGroups/CardView';
import { IAgeFields } from '../config/fieldGroups/creatableViews/Age';
import { IBPInputFields } from '../config/fieldGroups/creatableViews/BPInput';
import { ICheckBoxFields } from '../config/fieldGroups/creatableViews/CheckBox';
import { IEditTextFields } from '../config/fieldGroups/creatableViews/EditText';
import { IHeightFields } from '../config/fieldGroups/creatableViews/Height';
import { IInstructionFields } from '../config/fieldGroups/creatableViews/Instruction';
import { IRadioGroupFields } from '../config/fieldGroups/creatableViews/RadioGroup';
import { ISpinnerFields } from '../config/fieldGroups/creatableViews/Spinner';
import { IInformationLabelFields } from '../config/fieldGroups/creatableViews/InformationLabel';
import { ITimeViewFields } from '../config/fieldGroups/creatableViews/TimeView';
import { IMentalHealthViewFields } from '../config/fieldGroups/MentalHealthView';
import { ITextLabelFields } from '../config/fieldGroups/TextLabel';

import { IBaseFieldMeta } from './BaseFieldMeta';
import { IDialogCheckboxFields } from '../config/fieldGroups/creatableViews/DialogCheckbox';
import { IDatePickerFields } from '../config/fieldGroups/creatableViews/DatePickerView';

export type IFieldViewType =
  | IEditTextFields
  | IRadioGroupFields
  | IBPInputFields
  | ISpinnerFields
  | ICheckBoxFields
  | IAgeFields
  | IHeightFields
  | ITimeViewFields
  | IInstructionFields
  | ICardViewFields
  | IMentalHealthViewFields
  | ITextLabelFields
  | IInformationLabelFields
  | IDialogCheckboxFields
  | IDatePickerFields;

export interface IComponentConfig {
  getEmptyData: () => IFieldViewType;
  customizableFieldMeta: IBaseFieldMeta;
  getJSON?: (json: any) => IFieldViewType;
}
