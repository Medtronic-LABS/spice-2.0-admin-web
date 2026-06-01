// import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { rootSaga } from './rootSaga';
import { appEnv } from '../config/env';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Mount it on the Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }).concat(sagaMiddleware),
  devTools: appEnv.nodeEnv === 'development' // Enable Redux DevTools in development mode only
});

// Run the saga
sagaMiddleware.run(rootSaga);

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];

export default store;
