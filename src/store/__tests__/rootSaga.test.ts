import { all, fork } from 'redux-saga/effects';
import { rootSaga } from '../rootSaga';
import userSaga from '../user/sagas';
import regionSaga from '../region/sagas';
import healthFacilitySaga from '../healthFacility/sagas';
import medicationSaga from '../medication/sagas';
import labtestSaga from '../labTest/sagas';
import workflowSaga from '../workflow/sagas';
import districtSaga from '../district/sagas';
import chiefdomSaga from '../chiefdom/sagas';
import programSaga from '../program/sagas';
import commonSaga from '../common/sagas';

describe('rootSaga', () => {
  it('should run all the sagas', () => {
    const generator = rootSaga();

    expect(generator.next().value).toEqual(all([fork(userSaga)]));
    expect(generator.next().value).toEqual(all([fork(regionSaga)]));
    expect(generator.next().value).toEqual(all([fork(healthFacilitySaga)]));
    expect(generator.next().value).toEqual(all([fork(medicationSaga)]));
    expect(generator.next().value).toEqual(all([fork(labtestSaga)]));
    expect(generator.next().value).toEqual(all([fork(workflowSaga)]));
    expect(generator.next().value).toEqual(all([fork(districtSaga)]));
    expect(generator.next().value).toEqual(all([fork(chiefdomSaga)]));
    expect(generator.next().value).toEqual(all([fork(programSaga)]));
    expect(generator.next().value).toEqual(all([fork(commonSaga)]));
    expect(generator.next().done).toBe(true);
  });
});
