import { runSaga } from 'redux-saga';
import { AxiosResponse } from 'axios';
import * as commonService from '../../../services/commomAPI';
import { fetchSideMenu } from '../sagas';
import * as ACTION_TYPES from '../actionTypes';
import * as commonActions from '../actions';
import MOCK_DATA_CONSTANTS from '../../../tests/mockData/commonDataConstants';

const fetchSideMenuRequestPayload = MOCK_DATA_CONSTANTS.MOCK_SIDEMENU_REQUEST;
const fetchSideMenuResponse = MOCK_DATA_CONSTANTS.MOCK_SIDEMENU;

describe('Fetch Sidemenu', () => {
  it('Fetch sidemenu and dispatches success: FETCH_SIDEMENU_SUCCESS', async () => {
    const fetchSideMenuSpy = jest.spyOn(commonService, 'getSideMenu').mockImplementation(() =>
      Promise.resolve({
        data: {
          entity: fetchSideMenuResponse
        }
      } as AxiosResponse)
    );
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSideMenu,
      {
        type: ACTION_TYPES.FETCH_SIDEMENU_REQUEST,
        payload: fetchSideMenuRequestPayload
      }
    ).toPromise();
    expect(fetchSideMenuSpy).toHaveBeenCalledWith(fetchSideMenuRequestPayload);
  });

  it('Fetch sidemenu and dispatches failure: FETCH_SIDEMENU_FAILURE', async () => {
    const error = new Error('Failed to fetch sidemenu');
    const fetchSideMenuSpy = jest.spyOn(commonService, 'getSideMenu').mockImplementation(() => Promise.reject(error));
    const dispatched: any = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action)
      },
      fetchSideMenu,
      {
        type: ACTION_TYPES.FETCH_SIDEMENU_REQUEST,
        payload: fetchSideMenuRequestPayload
      }
    ).toPromise();
    expect(fetchSideMenuSpy).toHaveBeenCalledWith(fetchSideMenuRequestPayload);
    expect(dispatched).toEqual([commonActions.fetchSideMenuFailure(error)]);
  });
});
