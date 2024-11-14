import { InputTypes } from '../labTestConfig/BaseFieldConfig';
import CARD_VIEW_CONFIG from '../labTestConfig/fieldGroups/CardView';
import EDIT_TEXT_CONFIG from '../labTestConfig/fieldGroups/creatableViews/EditText';
import RADIO_GROUP_CONFIG from '../labTestConfig/fieldGroups/creatableViews/RadioGroup';
import DROPDOWN_CONFIG from '../labTestConfig/fieldGroups/creatableViews/Dropdown';
import CHECKBOX_CONFIG from '../labTestConfig/fieldGroups/creatableViews/CheckBox';
import TEXT_LABEL_CONFIG from '../labTestConfig/fieldGroups/TextLabel';
import { IComponentConfig } from '../types/ComponentConfig';
import DATE_PICKER_CONFIG from '../labTestConfig/fieldGroups/creatableViews/DatePickerView';

export const creatableViews = [
  { label: 'Text', value: 'EditText' },
  { label: 'Dropdown', value: 'Spinner' }
];

/**
 * Retrieves the configuration for the provided view type.
 * @param {string} viewType - The view type to retrieve the configuration for
 * @returns {IComponentConfig} The configuration for the provided view type
 */
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

/**
 * Switches the result fields based on the provided field value.
 * @param {number | null} fieldValue - The field value to switch the result fields for
 * @param {any} obj - The object to switch the result fields for
 * @param {boolean} isResult - Whether the fields are for a result or not
 */
export const resultSwitch = (fieldValue: number | null, obj: any, isResult: boolean = true) => {
  const inputTypeRelatedFields: any = {
    minValue: false,
    maxValue: false,
    maxLength: false,
    minLength: false,
    contentLength: false,
    startsWith: false,
    unitList: false,
    ranges: false
  };
  const resultFields = {
    code: true,
    url: true,
    resource: true,
    condition: true
  };
  let finalFields: any = {};
  if (fieldValue) {
    switch (fieldValue) {
      case InputTypes.NUMBER:
      case InputTypes.DECIMAL:
        inputTypeRelatedFields.minValue = true;
        inputTypeRelatedFields.maxValue = true;
        inputTypeRelatedFields.unitList = true;
        inputTypeRelatedFields.ranges = true;
        break;
      case InputTypes.PHONE_NUMBER:
        inputTypeRelatedFields.contentLength = true;
        inputTypeRelatedFields.startsWith = true;
        inputTypeRelatedFields.unitList = true;
        inputTypeRelatedFields.ranges = true;
        break;
      case InputTypes.DEFAULT:
      default:
        inputTypeRelatedFields.minLength = true;
        inputTypeRelatedFields.maxLength = true;
        inputTypeRelatedFields.unitList = false;
        inputTypeRelatedFields.ranges = false;
    }
  }
  if (isResult) {
    finalFields = {
      ...finalFields,
      ...inputTypeRelatedFields,
      ...resultFields
    };
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

// Ranges unit and gender filter
interface IRanges {
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

/**
 * Filters the unit list based on the provided ranges and returns the filtered unit list and the removed units.
 * @param {IRanges[]} ranges - The ranges to filter the unit list for
 * @param {IUnit[]} unitList - The unit list to filter
 */
export const filterUnitsandGender = (ranges: IRanges[], unitList: IUnit[]) => {
  // Create a dictionary to keep track of the genders associated with each unitType
  const unitGenderMap: { [unitType: string]: Set<string> } = {};

  // Populate the dictionary with the genders from the ranges array
  (ranges || []).forEach((range) => {
    const { unitType, gender } = range;
    if (!unitGenderMap[unitType]) {
      unitGenderMap[unitType] = new Set<string>();
    }
    unitGenderMap[unitType].add(gender);
  });

  // Filter the unitList based on the genders associated with each unitType
  const filteredUnitList: IUnit[] = [];
  const removedUnits: IRemovedUnits = { units: [], indices: [], genders: {} };

  (unitList || []).forEach((unit, index) => {
    const unitType = unit.id;
    if (unitGenderMap[unitType]) {
      if (unitGenderMap[unitType].size === genderList.length) {
        removedUnits.units.push(unit);
      }
      removedUnits.indices.push(index);
      removedUnits.genders[unitType] = genderList.filter((gender) => unitGenderMap[unitType].has(gender.id));
    } else {
      filteredUnitList.push(unit);
    }
  });

  return { filteredUnitList, removedUnits };
};
