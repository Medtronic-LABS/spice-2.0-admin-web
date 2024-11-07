import { all, fork } from 'redux-saga/effects';
import userSaga from './user/sagas';
import regionSaga from './region/sagas';
import healthFacilitySaga from './healthFacility/sagas';
import medicationSaga from './medication/sagas';
import workflowSaga from './workflow/sagas';
import labtestSaga from './labTest/sagas';
import districtSaga from './district/sagas';
import chiefdomSaga from './chiefdom/sagas';
import programSaga from './program/sagas';
import commonSaga from './common/sagas';
import healthFacilitySagaCom from './healthFacility_com/sagas';
import medicationSagaCom from './medication_com/sagas';
import labtestSagaCom from './labTest_com/sagas';
import workflowSagaCom from './workflow_com/sagas';

export function* rootSaga() {
  yield all([fork(userSaga)]);
  yield all([fork(regionSaga)]);
  yield all([fork(healthFacilitySaga)]);
  yield all([fork(healthFacilitySagaCom)]);
  yield all([fork(medicationSaga)]);
  yield all([fork(medicationSagaCom)]);
  yield all([fork(labtestSaga)]);
  yield all([fork(labtestSagaCom)]);
  yield all([fork(workflowSaga)]);
  yield all([fork(workflowSagaCom)]);
  yield all([fork(districtSaga)]);
  yield all([fork(chiefdomSaga)]);
  yield all([fork(programSaga)]);
  yield all([fork(commonSaga)]);
}
