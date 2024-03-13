import { all, fork } from 'redux-saga/effects';
import userSaga from './user/sagas';
import regionSaga from './region/sagas';
import healthFacilitySaga from './healthFacility/sagas';

export function* rootSaga() {
  yield all([fork(userSaga)]);
  yield all([fork(regionSaga)]);
  yield all([fork(healthFacilitySaga)]);
}
