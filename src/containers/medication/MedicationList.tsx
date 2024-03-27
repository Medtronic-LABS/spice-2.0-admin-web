import React, { useState } from 'react';
import DetailCard from '../../components/detailCard/DetailCard';
import APPCONSTANTS from '../../constants/appConstants';
import { useHistory, useParams } from 'react-router';
import { PROTECTED_ROUTES } from '../../constants/route';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import MedicationForm, { IMedicationDataFormValues } from './MedicationForm';
import arrayMutators from 'final-form-arrays';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import CustomTable from '../../components/customTable/CustomTable';

/**
 * Shows the medication list
 * Provides search feature in medication
 * Provides edit feature for medication list
 * @returns {React.ReactElement}
 */
const MedicationList = (): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [isOpenMedicationModal, setOpenMedicationModal] = useState(false);
  const [medicationInitialValues, setMedicationInitialValues] = useState({});

  const medicationList = [{}] as any[];
  const loading = false;
  const listCount = 10;

  const { regionId, tenantId }: { regionId: string; tenantId: string } = useParams();
  const history = useHistory();

  /**
   * Handler for add medication button click.
   */
  const handleAddMedication = () => {
    const url = PROTECTED_ROUTES.createMedication;
    const createMedicationURL = url.replace(':regionId', regionId).replace(':tenantId', tenantId);
    history.push(createMedicationURL);
  };

  const handleMedicationDelete = (values: { data: any; index: number }) => {
    // Medication Delete
  };

  const openEditModal = (value: any) => {
    setOpenMedicationModal(true);
    const editValue = {
      ...value,
      name: value?.medicationName,
      brand: value.brandId ? { brand: { id: value.brandId, name: value.brandName } } : undefined,
      classification: value.classificationId
        ? { classification: { id: value.classificationId, name: value.classificationName } }
        : undefined,
      dosage_form: value.dosageFormId ? { id: value.dosageFormId, name: value.dosageFormName } : undefined
    };
    setMedicationInitialValues(editValue);
  };

  /**
   * Handler for edit medication form cancel.
   */
  const handleEditCancelClick = () => {
    setOpenMedicationModal(false);
    setMedicationInitialValues({});
  };

  /**
   * Handler for edit medication form submit.
   * @param medication
   */
  const handleMedicationEditSubmit = ({ medication }: { medication: IMedicationDataFormValues[] }) => {
    // Update medication API
  };

  const editModalRender = (form: any) => {
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
                { id: 1, name: 'medicationName', label: 'Name', width: '125px' },
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
