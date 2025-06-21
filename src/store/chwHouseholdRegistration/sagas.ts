import { SagaIterator } from 'redux-saga';
import { all, put, takeLatest } from 'redux-saga/effects';
import {
  ACTION_TYPES,
  IFetchHouseholdRegistrationRequest,
  IHouseholdRegistrationData
} from './types';
import {
  fetchHouseholdRegistrationSuccess,
  fetchHouseholdRegistrationFailure
} from './actions';

export function* fetchHouseholdRegistrationSaga({
  chwId,
  healthFacilityId,
  successCb,
  failureCb
}: IFetchHouseholdRegistrationRequest): SagaIterator {
  try {
    const mockData: IHouseholdRegistrationData[] = [
      { month: 'May', registered: 400, target: 640, achievement: 62.5 },
      { month: 'Jun', registered: 1000, target: 1240, achievement: 80.6 },
      { month: 'Jul', registered: 1600, target: 1870, achievement: 85.6 },
      { month: 'Aug', registered: 2400, target: 2850, achievement: 84.2 },
      { month: 'Sep', registered: 3200, target: 3850, achievement: 83.1 },
      { month: 'Oct', registered: 3600, target: 4470, achievement: 80.5 },
      { month: 'Nov', registered: 4000, target: 5040, achievement: 79.4 },
      { month: 'Dec', registered: 4400, target: 5620, achievement: 78.3 },
      { month: 'Jan', registered: 4800, target: 6200, achievement: 77.4 },
      { month: 'Feb', registered: 5200, target: 6600, achievement: 78.8 },
      { month: 'Mar', registered: 5600, target: 7000, achievement: 80.0 },
      { month: 'Apr', registered: 5600, target: 7100, achievement: 78.9 }
    ];

    successCb?.(mockData);
    yield put(fetchHouseholdRegistrationSuccess(mockData));
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Failed to fetch household registration data';
    failureCb?.(e as Error);
    yield put(fetchHouseholdRegistrationFailure(error));
  }
}

export function* chwHouseholdRegistrationSaga(): SagaIterator {
  yield all([
    takeLatest(ACTION_TYPES.FETCH_HOUSEHOLD_REGISTRATION_REQUEST, fetchHouseholdRegistrationSaga)
  ]);
}
