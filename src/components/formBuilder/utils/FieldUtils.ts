import { InputTypes } from '../config/BaseFieldConfig';
import CARD_VIEW_CONFIG from '../config/fieldGroups/CardView';
import EDIT_TEXT_CONFIG from '../config/fieldGroups/creatableViews/EditText';
import RADIO_GROUP_CONFIG from '../config/fieldGroups/creatableViews/RadioGroup';
import DROPDOWN_CONFIG from '../config/fieldGroups/creatableViews/Dropdown';
import CHECKBOX_CONFIG from '../config/fieldGroups/creatableViews/CheckBox';
import TEXT_LABEL_CONFIG from '../config/fieldGroups/TextLabel';
import { IComponentConfig } from '../types/ComponentConfig';
import SINGLE_SELECTION_VIEW_CONFIG from '../config/fieldGroups/creatableViews/SingleSelectionView';
import DATE_PICKER_CONFIG from '../config/fieldGroups/creatableViews/DatePickerView';
import DIALOG_CHECKBOX_CONFIG from '../config/fieldGroups/creatableViews/DialogCheckbox';
import MENTAL_HEALTH_CONFIG from '../config/fieldGroups/MentalHealthView';

export const creatableViews = [
  { label: 'Text', value: 'EditText' },
  { label: 'Dropdown', value: 'Spinner' },
  { label: 'Date', value: 'DatePicker' }
];

export const getConfigByViewType = (viewType: string): IComponentConfig => {
  switch (viewType) {
    case 'RadioGroup':
      return RADIO_GROUP_CONFIG;
    case 'EditText':
      return EDIT_TEXT_CONFIG;
    case 'Spinner':
      return DROPDOWN_CONFIG;
    case 'CheckBox':
      return CHECKBOX_CONFIG;
    case 'TextLabel':
      return TEXT_LABEL_CONFIG;
    case 'DatePicker':
      return DATE_PICKER_CONFIG;
    case 'CardView':
      return CARD_VIEW_CONFIG;
    default:
      return EDIT_TEXT_CONFIG;
  }
};

export const resultSwitch = (fieldValue: number | null, obj: any, isResult: boolean = true) => {
  const inputTypeRelatedFields: any = {
    minValue: false,
    maxValue: false,
    maxLength: false,
    minLength: false,
    contentLength: false,
    startsWith: false
  };
  const resultFields = {
    code: true,
    url: true,
    resource: true,
    unitList: true,
    condition: true
  };
  let finalFields: any = {};
  if (fieldValue) {
    switch (fieldValue) {
      case InputTypes.NUMBER:
      case InputTypes.DECIMAL:
        inputTypeRelatedFields.minValue = true;
        inputTypeRelatedFields.maxValue = true;
        break;
      case InputTypes.PHONE_NUMBER:
        inputTypeRelatedFields.contentLength = true;
        inputTypeRelatedFields.startsWith = true;
        break;
      case InputTypes.DEFAULT:
      default:
        inputTypeRelatedFields.minLength = true;
        inputTypeRelatedFields.maxLength = true;
    }
  }
  if (isResult) {
    finalFields = { ...finalFields, ...resultFields };
    Object.keys(fieldValue ? inputTypeRelatedFields : {}).forEach((key: any) => {
      finalFields[key] = false;
    });
  } else {
    Object.keys(resultFields).forEach((key: any) => {
      finalFields[key] = false;
    });
    finalFields = { ...finalFields, ...(fieldValue ? inputTypeRelatedFields : {}) };
  }

  Object.keys(finalFields).forEach((key: any) => {
    if (finalFields[key]) {
      obj[key] = obj[key] || null;
    } else {
      if (key in obj) {
        delete obj[key];
      }
    }
  });
};

// Condition unit and gender filter
interface ICondition {
  unitType: string;
  gender: string;
  minRange: number;
  maxRange: number;
  displayRange: string;
}

export interface IUnit {
  name: string;
  id: string;
}

interface IGender {
  name: string;
  id: string;
}

const genderList: IGender[] = [
  { name: 'Male', id: 'Male' },
  { name: 'Female', id: 'Female' }
];

interface IRemovedUnits {
  units: IUnit[];
  indices: number[];
  genders: { [unitType: string]: IGender[] };
}

export const filterUnitsandGender = (conditions: ICondition[], unitList: IUnit[]) => {
  // Create a dictionary to keep track of the genders associated with each unitType
  const unitGenderMap: { [unitType: string]: Set<string> } = {};

  // Populate the dictionary with the genders from the conditions array
  (conditions || []).forEach((condition) => {
    const { unitType, gender } = condition;
    if (!unitGenderMap[unitType]) {
      unitGenderMap[unitType] = new Set<string>();
    }
    unitGenderMap[unitType].add(gender);
  });

  // Function to check if a unitType has both genders
  const hasBothGenders = (unitType: string) => unitGenderMap[unitType] && unitGenderMap[unitType].size === 2;

  // Filter the unitList based on the genders associated with each unitType
  const filteredUnitList: IUnit[] = [];
  const removedUnits: IRemovedUnits = { units: [], indices: [], genders: {} };

  (unitList || []).forEach((unit, index) => {
    const unitType = unit.id;
    if (hasBothGenders(unitType)) {
      removedUnits.units.push(unit);
      removedUnits.indices.push(index);
      removedUnits.genders[unitType] = genderList.filter((gender) => unitGenderMap[unitType].has(gender.id));
    } else {
      filteredUnitList.push(unit);
    }
  });

  return { filteredUnitList, removedUnits };
};
