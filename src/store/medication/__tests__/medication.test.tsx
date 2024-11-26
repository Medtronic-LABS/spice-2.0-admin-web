import { runSaga } from 'redux-saga';
import {
  createMedication,
  deleteMedication,
  fetchCategoryForms,
  fetchMedicationClassifications,
  fetchMedicationDosageForms,
  fetchMedicationList,
  updateMedication,
  validateMedication
} from '../sagas';
import * as medicationService from '../../../services/medicationAPI';
import * as medicationActions from '../actions';
import MEDICATION_MOCK_DATA from '../../../tests/mockData/medicationDataConstants';
import * as ACTION_TYPES from '../actionTypes';
import { AxiosPromise } from 'axios';

const medicationListRequestPayload = MEDICATION_MOCK_DATA.MEDICATION_LIST_FETCH_PAYLOAD;
const medicationListDataPayload = MEDICATION_MOCK_DATA.MEDICATION_LIST_DATA;
const medicationTiIdRequestPayload = MEDICATION_MOCK_DATA.MEDICATION_TI_ID;
const medicationIList = MEDICATION_MOCK_DATA.MEDICATION_DROPDOWN_ILIST;
const classficationIList = MEDICATION_MOCK_DATA.CLASSIFICATION_DROPDOWN_ILIST;

describe('Medication Sagas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch Medication List in Region: FETCH_MEDICATIONS_LIST_REQUEST', () => {
    it('Fetch all medication list and return medication list and dispatches success', async () => {
      const fetchMedicationListSpy = jest.spyOn(medicationService, 'getMedicationList').mockImplementation(
        () =>
          Promise.resolve({
            data: { entityList: medicationListDataPayload, totalCount: 10 }
          }) as AxiosPromise
      );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationList,
        { ...medicationListRequestPayload, type: ACTION_TYPES.FETCH_MEDICATIONS_LIST_REQUEST }
      ).toPromise();
      expect(fetchMedicationListSpy).toHaveBeenCalledWith(0, 10, 2, undefined);
      expect(dispatched).toEqual([
        medicationActions.fetchMedicationListSuccess({ list: medicationListDataPayload as any, total: 10 })
      ]);
    });

    it('Fetch all medication list and return undefined and dispatches success', async () => {
      const fetchMedicationListSpy = jest.spyOn(medicationService, 'getMedicationList').mockImplementation(
        () =>
          Promise.resolve({
            data: { entityList: undefined, totalCount: 10 }
          }) as AxiosPromise
      );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationList,
        { ...medicationListRequestPayload, type: ACTION_TYPES.FETCH_MEDICATIONS_LIST_REQUEST }
      ).toPromise();
      expect(fetchMedicationListSpy).toHaveBeenCalledWith(0, 10, 2, undefined);
      expect(dispatched).toEqual([medicationActions.fetchMedicationListSuccess({ list: [] as any, total: 10 })]);
    });

    it('Fails to fetch all medication and return instances of error and dispatches failure', async () => {
      const failureCb = jest.fn();
      const error = new Error('Failed to fetch medication');
      const fetchMedicationListSpy = jest
        .spyOn(medicationService, 'getMedicationList')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationList,
        { ...medicationListRequestPayload, failureCb, type: ACTION_TYPES.FETCH_MEDICATIONS_LIST_REQUEST }
      ).toPromise();
      expect(fetchMedicationListSpy).toHaveBeenCalledWith(0, 10, 2, undefined);
      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([medicationActions.fetchMedicationlistFail(error)]);
    });

    it('Fails to fetch all medication and return error and dispatches failure', async () => {
      const failureCb = jest.fn();
      const error = 'Failed to fetch medication';
      const fetchMedicationListSpy = jest
        .spyOn(medicationService, 'getMedicationList')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationList,
        { ...medicationListRequestPayload, failureCb, type: ACTION_TYPES.FETCH_MEDICATIONS_LIST_REQUEST }
      ).toPromise();
      expect(fetchMedicationListSpy).toHaveBeenCalledWith(0, 10, 2, undefined);
      expect(failureCb).not.toHaveBeenCalledWith(error);
      expect(dispatched).not.toEqual([medicationActions.fetchMedicationlistFail(error as any)]);
    });
  });

  describe('Create Medication in Region', () => {
    it('Create medication and dispatches success', async () => {
      const createMedicationSpy = jest.spyOn(medicationService, 'createMedication').mockImplementation(
        () =>
          Promise.resolve({
            data: { entity: medicationListDataPayload, totalCount: 10 }
          }) as AxiosPromise
      );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createMedication,
        { data: medicationListDataPayload, type: ACTION_TYPES.CREATE_MEDICATION_REQUEST }
      ).toPromise();
      expect(createMedicationSpy).toHaveBeenCalledWith(medicationListDataPayload);
      expect(dispatched).toEqual([medicationActions.createMedicationSuccess()]);
    });

    it('Create medication and dispatches failure with instance of error', async () => {
      const failureCb = jest.fn();
      const error = new Error('Failed to create medication');
      const createMedicationSpy = jest
        .spyOn(medicationService, 'createMedication')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createMedication,
        { data: medicationListDataPayload, failureCb, type: ACTION_TYPES.CREATE_MEDICATION_REQUEST }
      ).toPromise();
      expect(createMedicationSpy).toHaveBeenCalledWith(medicationListDataPayload);
      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([medicationActions.createMedicationFailure(error)]);
    });

    it('Create medication and dispatches failure with error', async () => {
      const failureCb = jest.fn();
      const error = 'Failed to create medication';
      const createMedicationSpy = jest
        .spyOn(medicationService, 'createMedication')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        createMedication,
        { data: medicationListDataPayload, failureCb, type: ACTION_TYPES.CREATE_MEDICATION_REQUEST }
      ).toPromise();
      expect(createMedicationSpy).toHaveBeenCalledWith(medicationListDataPayload);
      expect(failureCb).not.toHaveBeenCalledWith(error);
      expect(dispatched).not.toEqual([medicationActions.createMedicationFailure(error as any)]);
    });
  });

  describe('Update Medication in Region: UPDATE_MEDICATION_REQUEST', () => {
    it('Update medication and dispatches success', async () => {
      const validateMedicationSpy = jest
        .spyOn(medicationService, 'validateMedication')
        .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
      const updateMedicationSpy = jest
        .spyOn(medicationService, 'updateMedication')
        .mockImplementation(() => Promise.resolve({}) as AxiosPromise);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateMedication,
        { data: medicationListDataPayload[0], type: ACTION_TYPES.UPDATE_MEDICATION_REQUEST }
      ).toPromise();
      expect(validateMedicationSpy).toHaveBeenCalledWith(medicationListDataPayload[0]);
      expect(updateMedicationSpy).toHaveBeenCalledWith(medicationListDataPayload[0]);
      expect(dispatched).toEqual([medicationActions.updateMedicationSuccess()]);
    });

    it('Update medication and dispatches failure with instance of error', async () => {
      const failureCb = jest.fn();
      const error = new Error('Failed to update medication');
      const validateMedicationSpy = jest
        .spyOn(medicationService, 'validateMedication')
        .mockImplementation(() => Promise.reject(error));
      const updateMedicationSpy = jest
        .spyOn(medicationService, 'updateMedication')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateMedication,
        { data: medicationListDataPayload[0], failureCb, type: ACTION_TYPES.UPDATE_MEDICATION_REQUEST }
      ).toPromise();
      expect(validateMedicationSpy).toHaveBeenCalledWith(JSON.parse(JSON.stringify(medicationListDataPayload[0])));
      expect(updateMedicationSpy).not.toHaveBeenCalledWith(medicationListDataPayload[0]);
      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([medicationActions.updateMedicationFail(error)]);
    });

    it('Update medication and dispatches failure with error', async () => {
      const failureCb = jest.fn();
      const error = 'Failed to update medication';
      const validateMedicationSpy = jest
        .spyOn(medicationService, 'validateMedication')
        .mockImplementation(() => Promise.reject(error));
      const updateMedicationSpy = jest
        .spyOn(medicationService, 'updateMedication')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        updateMedication,
        { data: medicationListDataPayload[0], failureCb, type: ACTION_TYPES.UPDATE_MEDICATION_REQUEST }
      ).toPromise();
      expect(validateMedicationSpy).toHaveBeenCalledWith(JSON.parse(JSON.stringify(medicationListDataPayload[0])));
      expect(updateMedicationSpy).not.toHaveBeenCalledWith(medicationListDataPayload[0]);
      expect(failureCb).not.toHaveBeenCalledWith(error);
      expect(dispatched).not.toEqual([medicationActions.updateMedicationFail(error as any)]);
    });
  });

  describe('Delete a Medication in Region', () => {
    it('Delete a medication and dispatches success', async () => {
      const deleteMedicationSpy = jest
        .spyOn(medicationService, 'deleteMedication')
        .mockImplementation(() => Promise.resolve() as any);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        deleteMedication,
        { data: medicationTiIdRequestPayload, type: ACTION_TYPES.DELETE_MEDICATION_REQUEST }
      ).toPromise();
      expect(deleteMedicationSpy).toHaveBeenCalledWith(medicationTiIdRequestPayload);
      expect(dispatched).toEqual([medicationActions.deleteMedicationSuccess()]);
    });

    it('Fails to delete a medication and dispatches failure with instance of error', async () => {
      const failureCb = jest.fn();
      const error = new Error('Failed to delete medication');
      const deleteMedicationSpy = jest
        .spyOn(medicationService, 'deleteMedication')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        deleteMedication,
        { data: medicationTiIdRequestPayload, failureCb, type: ACTION_TYPES.DELETE_MEDICATION_REQUEST }
      ).toPromise();
      expect(deleteMedicationSpy).toHaveBeenCalledWith(medicationTiIdRequestPayload);
      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([medicationActions.deleteMedicationFail(error)]);
    });

    it('Fails to delete a medication and dispatches failure with error', async () => {
      const failureCb = jest.fn();
      const error = 'Failed to delete medication';
      const deleteMedicationSpy = jest
        .spyOn(medicationService, 'deleteMedication')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        deleteMedication,
        { data: medicationTiIdRequestPayload, failureCb, type: ACTION_TYPES.DELETE_MEDICATION_REQUEST }
      ).toPromise();
      expect(deleteMedicationSpy).toHaveBeenCalledWith(medicationTiIdRequestPayload);
      expect(failureCb).not.toHaveBeenCalledWith(error);
      expect(dispatched).not.toEqual([medicationActions.deleteMedicationFail(error as any)]);
    });
  });

  describe('Validate Medication in Region', () => {
    it('Validate medication and dispatches success', async () => {
      const successCb = jest.fn();
      const validateMedicationSpy = jest.spyOn(medicationService, 'validateMedication').mockImplementation(
        () =>
          Promise.resolve({
            status: 'Validation Successfull'
          }) as unknown as AxiosPromise<any>
      );
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        validateMedication,
        { data: medicationListDataPayload[0], successCb, type: ACTION_TYPES.VALIDATE_MEDICATION }
      ).toPromise();
      expect(validateMedicationSpy).toHaveBeenCalledWith(medicationListDataPayload[0]);
      expect(successCb).toHaveBeenCalled();
      expect(dispatched).toEqual([]);
    });

    it('Validate medication and dispatches success with empty API response', async () => {
      const successCb = jest.fn();
      const validateMedicationSpy = jest
        .spyOn(medicationService, 'validateMedication')
        .mockImplementation(() => Promise.resolve({}) as AxiosPromise<any>);
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        validateMedication,
        { data: medicationListDataPayload[0], successCb, type: ACTION_TYPES.VALIDATE_MEDICATION }
      ).toPromise();
      expect(validateMedicationSpy).toHaveBeenCalledWith(medicationListDataPayload[0]);
      expect(successCb).not.toHaveBeenCalled();
      expect(dispatched).toEqual([]);
    });

    it('Validate medication and dispatches failure', async () => {
      const failureCb = jest.fn();
      const error = new Error('Validate medication failed');
      const validateMedicationSpy = jest
        .spyOn(medicationService, 'validateMedication')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        validateMedication,
        { data: medicationListDataPayload[0], failureCb, type: ACTION_TYPES.VALIDATE_MEDICATION }
      ).toPromise();
      expect(validateMedicationSpy).toHaveBeenCalledWith(medicationListDataPayload[0]);
      expect(failureCb).toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([]);
    });

    it('Validate medication and dispatches failure', async () => {
      const failureCb = jest.fn();
      const error = 'Validate medication failed';
      const validateMedicationSpy = jest
        .spyOn(medicationService, 'validateMedication')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        validateMedication,
        { data: medicationListDataPayload[0], failureCb, type: ACTION_TYPES.VALIDATE_MEDICATION }
      ).toPromise();
      expect(validateMedicationSpy).toHaveBeenCalledWith(medicationListDataPayload[0]);
      expect(failureCb).not.toHaveBeenCalledWith(error);
      expect(dispatched).toEqual([]);
    });
  });

  describe('Fetch the medication classification list: FETCH_MEDICATION_CLASSIFICATIONS_REQUEST', () => {
    it('Fetch the medication classification list and dispatches success', async () => {
      const fetchMedicationClassificationSpy = jest
        .spyOn(medicationService, 'getMedicationClassifications')
        .mockImplementation(() => {
          return Promise.resolve({ data: { entityList: classficationIList } }) as AxiosPromise<any>;
        });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationClassifications,
        { countryId: 2, type: ACTION_TYPES.FETCH_MEDICATION_CLASSIFICATIONS_REQUEST }
      ).toPromise();
      expect(fetchMedicationClassificationSpy).toHaveBeenCalledWith(2);
      expect(dispatched).toEqual([
        medicationActions.fetchClassificationsSuccess({ classifications: classficationIList as any })
      ]);
    });

    it('Fetch the medication classification list and dispatches success', async () => {
      const fetchMedicationClassificationSpy = jest
        .spyOn(medicationService, 'getMedicationClassifications')
        .mockImplementation(() => {
          return Promise.resolve({ data: { entityList: undefined } }) as AxiosPromise<any>;
        });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationClassifications,
        { countryId: 2, type: ACTION_TYPES.FETCH_MEDICATION_CLASSIFICATIONS_REQUEST }
      ).toPromise();
      expect(fetchMedicationClassificationSpy).toHaveBeenCalledWith(2);
      expect(dispatched).toEqual([medicationActions.fetchClassificationsSuccess({ classifications: [] })]);
    });

    it('Fails to fetch the medication classification and dispatches failure', async () => {
      const error = new Error('Failed to fetch the medication classification');
      const fetchMedicationClassificationSpy = jest
        .spyOn(medicationService, 'getMedicationClassifications')
        .mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationClassifications,
        { countryId: 2, type: ACTION_TYPES.FETCH_MEDICATION_CLASSIFICATIONS_REQUEST }
      ).toPromise();
      expect(fetchMedicationClassificationSpy).toHaveBeenCalledWith(2);
      expect(dispatched).toEqual([medicationActions.fetchClassificationsFailure()]);
    });
  });

  describe('Fetch the medication dosage list: FETCH_MEDICATION_DOSAGE_FORM ', () => {
    it('Fetch the medication dosage list and dispatches success', async () => {
      jest.spyOn(medicationService, 'getMedicationDosageForm').mockImplementation(() => {
        return Promise.resolve({ data: { entityList: medicationIList } }) as AxiosPromise<any>;
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationDosageForms
      ).toPromise();
      expect(dispatched).toEqual([medicationActions.fetchDosageFormsSuccess({ dosageForms: medicationIList })]);
    });

    it('Fetch the medication dosage list and return undefined and dispatches success', async () => {
      jest.spyOn(medicationService, 'getMedicationDosageForm').mockImplementation(() => {
        return Promise.resolve({ data: { entityList: undefined } }) as AxiosPromise<any>;
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationDosageForms
      ).toPromise();
      expect(dispatched).toEqual([medicationActions.fetchDosageFormsSuccess({ dosageForms: [] })]);
    });

    it('Fails to fetch the medication dosage and dispatches failure', async () => {
      const error = new Error('Failed to fetch the medication dosage');
      jest.spyOn(medicationService, 'getMedicationDosageForm').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchMedicationDosageForms
      ).toPromise();
      expect(dispatched).toEqual([medicationActions.fetchDosageFormsFailure()]);
    });
  });

  describe('Fetch the medication category list: FETCH_CATEGORY_FORM', () => {
    it('Fetch the medication category list and dispatches success with data', async () => {
      jest.spyOn(medicationService, 'getMedicationCategory').mockImplementation(() => {
        return Promise.resolve({ data: medicationIList }) as AxiosPromise<any>;
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchCategoryForms
      ).toPromise();
      expect(dispatched).toEqual([medicationActions.fetchCategoryFormsSuccess({ categoryList: medicationIList })]);
    });
    it('Fetch the medication category list and dispatches success without data', async () => {
      jest.spyOn(medicationService, 'getMedicationCategory').mockImplementation(() => {
        return Promise.resolve({ data: undefined }) as AxiosPromise<any>;
      });
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchCategoryForms
      ).toPromise();
      expect(dispatched).toEqual([medicationActions.fetchCategoryFormsSuccess({ categoryList: [] })]);
    });
    it('Fetch the medication category list and dispatches failure', async () => {
      const error = new Error('Failed to fetch the medication category');
      jest.spyOn(medicationService, 'getMedicationCategory').mockImplementation(() => Promise.reject(error));
      const dispatched: any = [];
      await runSaga(
        {
          dispatch: (action) => dispatched.push(action)
        },
        fetchCategoryForms
      ).toPromise();
      expect(dispatched).toEqual([medicationActions.fetchCategoryFormsFailure()]);
    });
  });
});
