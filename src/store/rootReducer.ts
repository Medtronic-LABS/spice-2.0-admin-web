import { combineReducers } from 'redux';
import userReducer from './user/reducer';

const appReducer = combineReducers({ user: userReducer });

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }
  return appReducer(state, action);
};
export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
