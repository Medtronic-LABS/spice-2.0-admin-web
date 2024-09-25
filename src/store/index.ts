// import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { rootSaga } from './rootSaga';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Mount it on the Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV === 'development' // Enable Redux DevTools in development mode only
});

// Run the saga
sagaMiddleware.run(rootSaga);

export default store;
