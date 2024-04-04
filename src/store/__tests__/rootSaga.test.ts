import { all, fork } from 'redux-saga/effects';
import { rootSaga } from '../rootSaga';
import userSaga from '../user/sagas';
import regionSaga from '../region/sagas';
import healthFacilitySaga from '../healthFacility/sagas';
import medicationSaga from '../medication/sagas';

describe('rootSaga', () => {
  it('should run all the sagas', () => {
    const generator = rootSaga();

    expect(generator.next().value).toEqual(all([fork(userSaga)]));
    expect(generator.next().value).toEqual(all([fork(regionSaga)]));
    expect(generator.next().value).toEqual(all([fork(healthFacilitySaga)]));
    expect(generator.next().value).toEqual(all([fork(medicationSaga)]));
    expect(generator.next().done).toBe(true);
  });
});
