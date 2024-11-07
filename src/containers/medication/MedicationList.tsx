import React, { useCallback, useEffect, useState } from 'react';
import DetailCard from '../../components/detailCard/DetailCard';
import APPCONSTANTS, { APP_TYPE } from '../../constants/appConstants';
import { useHistory, useParams } from 'react-router';
import { PROTECTED_ROUTES } from '../../constants/route';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import MedicationForm, { IMedicationDataFormValues } from './MedicationForm';
import arrayMutators from 'final-form-arrays';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import CustomTable from '../../components/customTable/CustomTable';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMedicationListCountSelector,
  getMedicationListSelector,
  getMedicationLoadingSelector
} from '../../store/medication/selectors';
import { deleteMedication, fetchMedicationListReq, updateMedication } from '../../store/medication/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { getAppTypeSelector } from '../../store/user/selectors';

/**
 * MedicationList component
 * Shows the medication list, provides search feature, and edit functionality
 * @returns {React.ReactElement} The rendered MedicationList component
 */
const MedicationList = (): React.ReactElement => {
  // Custom hook for table pagination
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const appTypes = useSelector(getAppTypeSelector);
  // State for controlling the medication edit modal
  const [isOpenMedicationModal, setOpenMedicationModal] = useState(false);
  const [medicationInitialValues, setMedicationInitialValues] = useState({});
  const dispatch = useDispatch();

  // Selectors for medication data from Redux store
  const medicationList = useSelector(getMedicationListSelector);
  const loading = useSelector(getMedicationLoadingSelector);
  const listCount = useSelector(getMedicationListCountSelector);

  // Get route parameters
  const { regionId, tenantId }: { regionId: string; tenantId: string } = useParams();
  const history = useHistory();

  /**
   * Fetches the medication list
   */
  const fetchList = useCallback(() => {
    dispatch(
      fetchMedicationListReq({
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        search: listParams.searchTerm,
        countryId: Number(regionId),
        failureCb: (e) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.MEDICATION_FETCH_ERROR))
      })
    );
  }, [dispatch, regionId, listParams]);

  // Fetch medication list when component mounts or when dependencies change
  useEffect(() => {
    fetchList();
  }, [dispatch, fetchList, regionId, listParams]);

  /**
   * Handles the "Add Medication" button click
   */
  const handleAddMedication = () => {
    const url = PROTECTED_ROUTES.createMedication;
    const createMedicationURL = url.replace(':regionId', regionId).replace(':tenantId', tenantId);
    history.push(createMedicationURL);
  };

  /**
   * Handles medication deletion
   * @param {Object} values - The values object containing data and index of the medication to delete
   */
  const handleMedicationDelete = (values: { data: any; index: number }) => {
    dispatch(
      deleteMedication({
        data: { id: values?.data?.id, tenantId },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.MEDICATION_DELETE_SUCCESS);
          // Update page if necessary after deletion
          handlePage(
            listParams.page > 1 &&
              Math.ceil(listCount / listParams.rowsPerPage) === listParams.page &&
              (listCount - 1) % listParams.rowsPerPage === 0
              ? listParams.page - 1
              : listParams.page
          );
        },
        failureCb: (e) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.MEDICATION_DELETE_FAIL))
      })
    );
  };

  /**
   * Opens the edit modal for a medication
   * @param {any} value - The medication data to edit
   */
  const openEditModal = (value: any) => {
    setOpenMedicationModal(true);
    // Prepare the edit value object
    const editValue = {
      ...value,
      name: value?.name,
      brand: value.brandId ? { id: value.brandId, name: value.brandName } : undefined,
      classification: value.classificationId
        ? { id: value.classificationId, name: value.classificationName }
        : undefined,
      dosage_form: value.dosageFormId ? { id: value.dosageFormId, name: value.dosageFormName } : undefined
    };
    setMedicationInitialValues(editValue);
  };

  /**
   * Handles the cancellation of medication edit
   */
  const handleEditCancelClick = () => {
    setOpenMedicationModal(false);
    setMedicationInitialValues({});
  };

  /**
   * Handles the submission of edited medication data
   * @param {Object} param0 - Object containing the edited medication data
   */
  const handleMedicationEditSubmit = ({ medication }: { medication: IMedicationDataFormValues[] }) => {
    const data = JSON.parse(JSON.stringify(medication[0]));
    const codeDetails = {
      code: data?.codeDetails?.code,
      url: data?.codeDetails?.url
    };
    // Prepare the post data for updating medication
    const postData = {
      countryId: Number(data?.countryId),
      classificationId: data?.classification.id,
      classificationName: data?.classification.name,
      brandId: data?.brand.id,
      brandName: data?.brand.name,
      dosageFormId: data?.dosage_form.id,
      dosageFormName: data?.dosage_form.name,
      ...(appTypes.length === 1 && appTypes[0] === APP_TYPE.COMMUNITY
        ? {}
        : { category: { id: data?.category?.id, name: data?.category?.name } }),
      name: data?.name,
      id: data?.id,
      codeDetails
    };
    dispatch(
      updateMedication({
        data: postData,
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.MEDICATION_UPDATE_SUCCESS);
          handlePage(APPCONSTANTS.INITIAL_PAGE);
          handleEditCancelClick();
        },
        failureCb: (e: Error) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.MEDICATION_UPDATE_FAIL))
      })
    );
  };

  /**
   * Renders the edit modal content
   * @param {any} form - The form object
   * @returns {React.ReactElement} The rendered MedicationForm component
   */
  const editModalRender = (form: any): React.ReactElement => {
    return <MedicationForm form={form} initialEditValue={medicationInitialValues} disableOptions={true} />;
  };

  return (
    <>
      {loading && <Loader />}
      <div className='col-lg-12'>
        <div className='mt-0'>
          <DetailCard
            buttonLabel='Add Medication'
            header='Medication List'
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={handleAddMedication}
          >
            <CustomTable
              rowData={medicationList}
              columnsDef={[
                { id: 1, name: 'name', label: 'Name', width: '125px' },
                {
                  id: 2,
                  name: 'classificationName',
                  label: 'Classification',
                  width: '150px'
                },
                {
                  id: 3,
                  name: 'brandName',
                  label: 'Brand Name',
                  width: '150px'
                },
                {
                  id: 4,
                  name: 'dosageFormName',
                  label: 'Dosage Form',
                  width: '150px'
                }
              ]}
              isEdit={true}
              isDelete={true}
              onRowEdit={openEditModal}
              page={listParams.page}
              rowsPerPage={listParams.rowsPerPage}
              count={listCount}
              onDeleteClick={handleMedicationDelete}
              handlePageChange={handlePage}
              confirmationTitle={APPCONSTANTS.MEDICATION_DELETE_CONFIRMATION}
              deleteTitle={APPCONSTANTS.MEDICATION_DELETE_TITLE}
            />
          </DetailCard>
        </div>
      </div>
      <ModalForm
        show={isOpenMedicationModal}
        title={`Edit Medication Details`}
        cancelText='Cancel'
        submitText='Submit'
        handleCancel={handleEditCancelClick}
        handleFormSubmit={handleMedicationEditSubmit}
        initialValues={medicationInitialValues}
        mutators={arrayMutators}
        render={editModalRender}
      />
    </>
  );
};

export default MedicationList;
