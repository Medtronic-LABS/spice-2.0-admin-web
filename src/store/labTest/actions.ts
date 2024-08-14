import * as ACTION_TYPES from './actionTypes';
import {
  IFetchLabtestsSuccessPayload,
  IFetchLabtestsRequest,
  IFetchLabtestsSuccess,
  IFetchLabtestsFailure,
  IFetchLabtest,
  IDeleteLabtestRequest,
  IDeleteLabtestSuccess,
  IDeleteLabtestFailure,
  IFetchUnitListRequest,
  IFetchUnitListSuccess,
  IFetchUnitListFailure,
  IUnit,
  ILabTestCustomizationRequest,
  ILabTestCustomizationSuccess,
  ILabTestCustomizationFailure,
  IFetchLabTestCustomizationRequest,
  IFetchLabTestCustomizationSuccess,
  IFetchLabTestCustomizationFailure,
  IValidateLabtestRequest,
  IValidateLabtestSuccess,
  IValidateLabtestFailure
} from './types';

export const fetchLabtestsRequest = ({
  data,
  successCb,
  failureCb
}: {
  data: IFetchLabtest;
  successCb?: (payload: IFetchLabtestsSuccessPayload) => void;
  failureCb?: (error: Error) => void;
}): IFetchLabtestsRequest => ({
  type: ACTION_TYPES.FETCH_LABTEST_REQUEST,
  data,
  successCb,
  failureCb
});

export const fetchLabtestsSuccess = (payload: IFetchLabtestsSuccessPayload): IFetchLabtestsSuccess => ({
  type: ACTION_TYPES.FETCH_LABTEST_SUCCESS,
  payload
});

export const fetchLabtestsFailure = (error: Error): IFetchLabtestsFailure => ({
  type: ACTION_TYPES.FETCH_LABTEST_FAILURE,
  error
});

// lab test customization actions
export const fetchLabTestCustomizationRequest = ({
  name,
  countryId,
  successCb,
  failureCb
}: Omit<IFetchLabTestCustomizationRequest, 'type'>): IFetchLabTestCustomizationRequest => ({
  type: ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_REQUEST,
  name,
  countryId,
  successCb,
  failureCb
});

export const fetchLabTestCustomizationSuccess = ({
  payload
}: Omit<IFetchLabTestCustomizationSuccess, 'type'>): IFetchLabTestCustomizationSuccess => ({
  type: ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_SUCCESS,
  payload
});

export const fetchLabTestCustomizationFailure = (error: any): IFetchLabTestCustomizationFailure => ({
  type: ACTION_TYPES.FETCH_LABTEST_CUSTOMIZATION_FAILURE,
  error
});

// lab test customization actions add/edit
export const labtestCustomization = ({
  data,
  successCb,
  failureCb
}: Omit<ILabTestCustomizationRequest, 'type'>): ILabTestCustomizationRequest => ({
  type: ACTION_TYPES.LABTEST_CUSTOMIZATION_REQUEST,
  data,
  successCb,
  failureCb
});

export const labtestCustomizationSuccess = (): ILabTestCustomizationSuccess => ({
  type: ACTION_TYPES.LABTEST_CUSTOMIZATION_SUCCESS
});

export const labtestCustomizationFailure = (error: any): ILabTestCustomizationFailure => ({
  type: ACTION_TYPES.LABTEST_CUSTOMIZATION_FAILURE,
  error
});

export const deleteLabtestRequest = ({
  id,
  successCb,
  failureCb
}: Omit<IDeleteLabtestRequest, 'type'>): IDeleteLabtestRequest => ({
  type: ACTION_TYPES.DELETE_LABTEST_REQUEST,
  id,
  successCb,
  failureCb
});

export const deleteLabtestSuccess = (): IDeleteLabtestSuccess => ({
  type: ACTION_TYPES.DELETE_LABTEST_SUCCESS
});

export const deleteLabtestFail = (error: Error): IDeleteLabtestFailure => ({
  type: ACTION_TYPES.DELETE_LABTEST_FAILURE,
  error
});

export const fetchUnitListRequest = (): IFetchUnitListRequest => ({
  type: ACTION_TYPES.FETCH_UNIT_LIST_REQUEST
});

export const fetchUnitListSuccess = (payload: IUnit[]): IFetchUnitListSuccess => ({
  type: ACTION_TYPES.FETCH_UNIT_LIST_SUCCESS,
  payload
});

export const fetchUnitListFail = (error: Error): IFetchUnitListFailure => ({
  type: ACTION_TYPES.FETCH_UNIT_LIST_FAILURE,
  error
});

export const validateLabtestRequest = ({
  name,
  countryId,
  successCb,
  failureCb
}: Omit<IValidateLabtestRequest, 'type'>): IValidateLabtestRequest => ({
  type: ACTION_TYPES.VALIDATE_LABTEST_REQUEST,
  name,
  countryId,
  successCb,
  failureCb
});

export const validateLabtestSuccess = (): IValidateLabtestSuccess => ({
  type: ACTION_TYPES.VALIDATE_LABTEST_SUCCESS
});

export const validateLabtestFailure = (error: Error): IValidateLabtestFailure => ({
  type: ACTION_TYPES.VALIDATE_LABTEST_FAILURE,
  error
});
