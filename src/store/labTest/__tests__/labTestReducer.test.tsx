import labtestReducer from '../reducer';
import * as actionTypes from '../actionTypes';
import { ILabTest } from '../types';

describe('labtestReducer', () => {
  const initialState = {
    labTests: [
      {
        id: '',
        testName: '',
        uniqueName: '',
        tenantId: null,
        countryId: '',
        formInput: '',
        updatedAt: '',
        displayOrder: 1
      }
    ],
    total: 0,
    loading: false,
    error: null,
    units: [],
    unitsLoading: false,
    customizationLoading: false,
    labTestCustomizationData: {} as ILabTest,
    labtestJson: undefined
  };

  it('should handle FETCH_LABTEST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_LABTEST_SUCCESS,
      payload: {
        labtests: [
          {
            id: '1',
            name: 'Lab Test 1',
            active: true,
            tenantId: '123',
            countryId: '456'
          },
          {
            id: '2',
            name: 'Lab Test 2',
            active: true,
            tenantId: '123',
            countryId: '456'
          }
        ],
        total: 2
      }
    };
    const expectedState = {
      ...initialState,
      labTests: action.payload.labtests,
      total: action.payload.total,
      loading: false
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LABTEST_FAILURE', () => {
    const error = 'Error fetching lab tests';
    const action: any = {
      type: actionTypes.FETCH_LABTEST_FAILURE,
      error
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_UNIT_LIST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_UNIT_LIST_SUCCESS,
      payload: ['unit1', 'unit2']
    };
    const expectedState = {
      ...initialState,
      units: action.payload,
      unitsLoading: false
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LABTEST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_LABTEST_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_LABTEST_REQUEST', () => {
    const action: any = {
      type: actionTypes.DELETE_LABTEST_REQUEST
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_LABTEST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.DELETE_LABTEST_SUCCESS
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: null
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LABTEST_SUCCESS', () => {
    const labtests = [{ id: '1', name: 'Lab Test 1' }];
    const total = 1;
    const action: any = {
      type: actionTypes.FETCH_LABTEST_SUCCESS,
      payload: { labtests, total }
    };
    const expectedState = {
      ...initialState,
      labTests: labtests,
      total,
      loading: false,
      error: null
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LABTEST_FAILURE', () => {
    const error = null;
    const action: any = {
      type: actionTypes.FETCH_LABTEST_FAILURE,
      error
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle DELETE_LABTEST_FAILURE', () => {
    const error = null;
    const action: any = {
      type: actionTypes.DELETE_LABTEST_FAILURE,
      error
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_UNIT_LIST_REQUEST', () => {
    const action: any = {
      type: actionTypes.FETCH_UNIT_LIST_REQUEST
    };
    const expectedState = {
      ...initialState,
      unitsLoading: true
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_UNIT_LIST_SUCCESS', () => {
    const units = ['unit1', 'unit2'];
    const action: any = {
      type: actionTypes.FETCH_UNIT_LIST_SUCCESS,
      payload: units
    };
    const expectedState = {
      ...initialState,
      units,
      unitsLoading: false
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle FETCH_UNIT_LIST_FAILURE', () => {
    const error = 'Failed to fetch unit list.';
    const action: any = {
      type: actionTypes.FETCH_UNIT_LIST_FAILURE,
      error
    };
    const expectedState = {
      ...initialState,
      unitsLoading: false,
      error
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LABTEST_CUSTOMIZATION_SUCCESS', () => {
    const action: any = {
      type: actionTypes.FETCH_LABTEST_CUSTOMIZATION_SUCCESS,
      payload: {
        labtests: [
          {
            id: '1',
            name: 'Lab Test 1',
            active: true,
            tenantId: '123',
            countryId: '456'
          },
          {
            id: '2',
            name: 'Lab Test 2',
            active: true,
            tenantId: '123',
            countryId: '456'
          }
        ],
        total: 2
      }
    };
    const expectedState = {
      ...initialState,
      loading: false,
      customizationLoading: false,
      labTestCustomizationData: action.payload,
      labtestJson: action.payload.formInput
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LABTEST_CUSTOMIZATION_FAILURE', () => {
    const error = 'Error fetching lab tests';
    const action: any = {
      type: actionTypes.FETCH_LABTEST_CUSTOMIZATION_FAILURE,
      error
    };
    const expectedState = {
      ...initialState,
      loading: false,
      customizationLoading: false,
      error: action.error
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle FETCH_LABTEST_CUSTOMIZATION_REQUEST', () => {
    const error = 'Error fetching lab tests';
    const action: any = {
      type: actionTypes.FETCH_LABTEST_CUSTOMIZATION_REQUEST,
      error
    };
    const expectedState = {
      ...initialState,
      loading: true,
      customizationLoading: true
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle LABTEST_CUSTOMIZATION_REQUEST', () => {
    const action: any = {
      type: actionTypes.LABTEST_CUSTOMIZATION_REQUEST,
      customizationLoading: true
    };
    const expectedState = {
      ...initialState,
      customizationLoading: true
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle LABTEST_CUSTOMIZATION_SUCCESS', () => {
    const action: any = {
      type: actionTypes.LABTEST_CUSTOMIZATION_SUCCESS,
      customizationLoading: true
    };
    const expectedState = {
      ...initialState,
      customizationLoading: false
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle LABTEST_CUSTOMIZATION_FAILURE', () => {
    const action: any = {
      type: actionTypes.LABTEST_CUSTOMIZATION_FAILURE,
      customizationLoading: true
    };
    const expectedState = {
      ...initialState,
      customizationLoading: false
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle VALIDATE_LABTEST_REQUEST', () => {
    const action: any = {
      type: actionTypes.VALIDATE_LABTEST_REQUEST,
      customizationLoading: true
    };
    const expectedState = {
      ...initialState,
      loading: true
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle VALIDATE_LABTEST_SUCCESS', () => {
    const action: any = {
      type: actionTypes.VALIDATE_LABTEST_SUCCESS,
      customizationLoading: true
    };
    const expectedState = {
      ...initialState,
      loading: false
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });
  it('should handle VALIDATE_LABTEST_FAILURE', () => {
    const action: any = {
      type: actionTypes.VALIDATE_LABTEST_FAILURE,
      customizationLoading: true
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: action.error
    };
    expect(labtestReducer(initialState, action)).toEqual(expectedState);
  });
});
