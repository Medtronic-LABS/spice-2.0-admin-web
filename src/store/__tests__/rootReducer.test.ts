import { combineReducers } from 'redux';
import rootReducer from '../rootReducer';
import userReducer from '../user/reducer';

describe('rootReducer', () => {
  it('should combine all reducers correctly', () => {
    const appReducer = combineReducers({
      user: userReducer
    });

    const initialState = {
      user: {}
    };

    const action = { type: 'SOME_ACTION' };

    const newState = rootReducer(initialState, action);
    const expectedState = appReducer(initialState as any, action);

    expect(newState).toEqual(expectedState);
  });

  it('should reset the store correctly', () => {
    const appReducer = combineReducers({
      user: userReducer
    });

    const initialState = {
      user: {}
    };

    const resetAction = { type: 'RESET_STORE' };

    const newState = rootReducer(initialState, resetAction);
    const expectedState = appReducer(undefined, resetAction);

    expect(newState).toEqual(expectedState);
  });
});
