import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as commonService from '../../services/commomAPI';
import { IFetchSideMenuRequest } from './types';
import { fetchSideMenuFailure } from './actions';
import { FETCH_SIDEMENU_REQUEST } from './actionTypes';

/*
  Worker Saga: Fired on FETCH_SIDEMENU_REQUEST action
*/
export function* fetchSideMenu(action: IFetchSideMenuRequest): SagaIterator {
  const { countryId, roleName, successCb, failureCb } = action.payload;
  try {
    const response = yield call(commonService.getSideMenu, {
      countryId,
      roleName
    });
    const payload = {
      list: response.data.entity.menus,
      roleName
    };
    successCb?.(payload);
  } catch (e: any) {
    if (e instanceof Error) {
      failureCb?.(e);
      yield put(fetchSideMenuFailure(e));
    }
  }
}

/*
  Starts worker saga on latest dispatched specific action.
  Allows concurrent increments.
*/
function* regionSaga() {
  yield all([takeLatest(FETCH_SIDEMENU_REQUEST, fetchSideMenu)]);
}

export default regionSaga;
