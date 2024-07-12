import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import regionReducer from './region/reducer';
import regionDashboardReducer from './regionDashboard/reducer'
import healthFacilityReducer from './healthFacility/reducer';
import medicationReducer from './medication/reducer';
import workflowReducer from './workflow/reducer';
import labtestReducer from './labTest/reducer';
import countyReducer from './county/reducer';
import subCountyReducer from './subCounty/reducer';
import healthFacilityDashboardReducer from './healthFacilityDashboard/reducer';
// import superAdminReducer from './superAdmin/reducer';
// import programReducer from './program/reducer';
// import workflowReducer from './workflow/reducer';

const appReducer = combineReducers({
  user: userReducer,
  region: regionReducer,
  healthFacility: healthFacilityReducer,
  medication: medicationReducer,
  labtest: labtestReducer,
  workflow: workflowReducer,
  regionDashboardReducer: regionDashboardReducer,
  county: countyReducer,
  subCounty: subCountyReducer,
  healthFacilityDashboardReducer: healthFacilityDashboardReducer,
  // program: programReducer,
  // superAdmin: superAdminReducer,
  // labtest: labtestReducer,
  // workflow: workflowReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }
  return appReducer(state, action);
};
export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
