import { combineReducers } from 'redux';
import rootReducer from '../rootReducer';
import userReducer from '../user/reducer';
import regionReducer from '../region/reducer';
import healthFacilityReducer from '../healthFacility/reducer';
import medicationReducer from '../medication/reducer';
import labtestReducer from '../labTest/reducer';
import workflowReducer from '../workflow/reducer';
import districtReducer from '../district/reducer';
import chiefdomReducer from '../chiefdom/reducer';
import programReducer from '../program/reducer';
import commonReducer from '../common/reducer';

describe('rootReducer', () => {
  it('should combine all reducers correctly', () => {
    const appReducer = combineReducers({
      user: userReducer,
      region: regionReducer,
      healthFacility: healthFacilityReducer,
      medication: medicationReducer,
      labtest: labtestReducer,
      workflow: workflowReducer,
      district: districtReducer,
      chiefdom: chiefdomReducer,
      program: programReducer,
      common: commonReducer
    });

    const initialState = {
      user: {},
      region: {},
      healthFacility: {},
      medication: {},
      labtest: {},
      workflow: {},
      district: {},
      chiefdom: {},
      program: {},
      common: {}
    };

    const action = { type: 'SOME_ACTION' };

    const newState = rootReducer(initialState, action);
    const expectedState = appReducer(initialState as any, action);

    expect(newState).toEqual(expectedState);
  });

  it('should reset the store correctly', () => {
    const appReducer = combineReducers({
      user: userReducer,
      region: regionReducer,
      healthFacility: healthFacilityReducer,
      medication: medicationReducer,
      labtest: labtestReducer,
      workflow: workflowReducer,
      district: districtReducer,
      chiefdom: chiefdomReducer,
      program: programReducer,
      common: commonReducer
    });

    const initialState = {
      user: {},
      region: {},
      healthFacility: {},
      medication: {},
      labtest: {},
      workflow: {},
      district: {},
      chiefdom: {},
      program: {},
      common: {}
    };

    const resetAction = { type: 'RESET_STORE' };

    const newState = rootReducer(initialState, resetAction);
    const expectedState = appReducer(undefined, resetAction);

    expect(newState).toEqual(expectedState);
  });
});
