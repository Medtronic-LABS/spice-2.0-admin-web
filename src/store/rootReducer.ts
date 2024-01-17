import { combineReducers, ReducersMapObject } from 'redux';

const appReducer = combineReducers({} as ReducersMapObject<unknown, any>);

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }
  return appReducer(state || {}, action);
};
export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
