import { all, fork } from 'redux-saga/effects';
import { rootSaga } from '../rootSaga';
import userSaga from '../user/sagas';
import regionSaga from '../region/sagas';
import superAdminSaga from '../superAdmin/sagas';

describe('rootSaga', () => {
  it('should run all the sagas', () => {
    const generator = rootSaga();

    expect(generator.next().value).toEqual(all([fork(userSaga)]));
    expect(generator.next().value).toEqual(all([fork(regionSaga)]));
    expect(generator.next().value).toEqual(all([fork(superAdminSaga)]));
    expect(generator.next().done).toBe(true);
  });
});
