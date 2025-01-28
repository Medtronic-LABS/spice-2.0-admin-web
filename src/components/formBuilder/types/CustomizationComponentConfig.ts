import { ICardViewFields } from '../customizationConfig/fieldGroups/CardView';
import { IAgeFields } from '../customizationConfig/fieldGroups/creatableViews/Age';
import { IBPInputFields } from '../customizationConfig/fieldGroups/creatableViews/BPInput';
import { ICheckBoxFields } from '../customizationConfig/fieldGroups/creatableViews/CheckBox';
import { IEditTextFields } from '../customizationConfig/fieldGroups/creatableViews/EditText';
import { IHeightFields } from '../customizationConfig/fieldGroups/creatableViews/Height';
import { IInstructionFields } from '../customizationConfig/fieldGroups/creatableViews/Instruction';
import { IRadioGroupFields } from '../customizationConfig/fieldGroups/creatableViews/RadioGroup';
import { ISpinnerFields } from '../customizationConfig/fieldGroups/creatableViews/Spinner';
import { IInformationLabelFields } from '../customizationConfig/fieldGroups/creatableViews/InformationLabel';
import { ITimeViewFields } from '../customizationConfig/fieldGroups/creatableViews/TimeView';
import { IMentalHealthViewFields } from '../customizationConfig/fieldGroups/MentalHealthView';
import { ITextLabelFields } from '../customizationConfig/fieldGroups/TextLabel';

import { IBaseFieldMeta } from './BaseFieldMeta';
import { IDialogCheckboxFields } from '../customizationConfig/fieldGroups/creatableViews/DialogCheckbox';
import { IDatePickerFields } from '../customizationConfig/fieldGroups/creatableViews/DatePickerView';

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
