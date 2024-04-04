import { all, fork } from 'redux-saga/effects';
import userSaga from './user/sagas';
import regionSaga from './region/sagas';
import healthFacilitySaga from './healthFacility/sagas';
import medicationSaga from './medication/sagas';

export function* rootSaga() {
  yield all([fork(userSaga)]);
  yield all([fork(regionSaga)]);
  yield all([fork(healthFacilitySaga)]);
  yield all([fork(medicationSaga)]);
}
