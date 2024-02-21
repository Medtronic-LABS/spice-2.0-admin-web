import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';

import DetailCard from '../../components/detailCard/DetailCard';
import CustomTable from '../../components/customTable/CustomTable';
import Loader from '../../components/loader/Loader';
import { PROTECTED_ROUTES } from '../../constants/route';
import ModalForm from '../../components/modal/ModalForm';
import { useTablePaginationHook } from '../../hooks/tablePagination';

interface IModalState {
  data?: any;
  isOpen: boolean;
}

const HealthFacilityList = (): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [editHealthFacilityModal, setEditSiteDetailsModal] = useState<IModalState>({
    isOpen: false
  });

  const history = useHistory();
  const loading = false;
  const openEditDialogue = () => {
    //
  };

  const closeHealthFacilityEditModal = () => {
    setEditSiteDetailsModal({
      isOpen: false
    });
  };

  const editHealthFacilityDetailsModalRender = (form: any) => {
    return <></>;
  };

  const handleHealthFacilityDetailsSubmit = ({ site }: any) => {
    //
  };

  const openCreateHealthFacility = () => {
    const url = PROTECTED_ROUTES.healthFacilitySummary;
    const healthFacilityId = '1';
    history.push(url.replace(':healthFacilityId', healthFacilityId as string));
  };

  const handleRowClick = (data: any) => {
    history.push(PROTECTED_ROUTES.healthFacilitySummary.replace(':healthFacilityId', data.id));
  };

  const healthFacilityList: any[] = [
    { id: '1', name: 'Kalangba', type: 'CHC', chiefdom: 'Bombali Sebora' },
    { id: '2', name: 'Sierra Leone', type: 'CHC', chiefdom: 'Kamaranka' },
    { id: '3', name: 'Kalangba', type: 'CHC', chiefdom: 'Bombali Sebora' },
    { id: '4', name: 'Sierra Leone', type: 'CHC', chiefdom: 'Kamaranka' },
    { id: '5', name: 'Kalangba', type: 'CHC', chiefdom: 'Bombali Sebora' },
    { id: '6', name: 'Sierra Leone', type: 'CHC', chiefdom: 'Kamaranka' },
    { id: '7', name: 'Kalangba', type: 'CHC', chiefdom: 'Bombali Sebora' },
    { id: '8', name: 'Sierra Leone', type: 'CHC', chiefdom: 'Kamaranka' },
    { id: '9', name: 'Kalangba', type: 'CHC', chiefdom: 'Bombali Sebora' },
    { id: '10', name: 'Sierra Leone', type: 'CHC', chiefdom: 'Kamaranka' },
    { id: '11', name: 'Kalangba', type: 'CHC', chiefdom: 'Bombali Sebora' },
    { id: '12', name: 'Sierra Leone', type: 'CHC', chiefdom: 'Kamaranka' },
    { id: '13', name: 'Kalangba', type: 'CHC', chiefdom: 'Bombali Sebora' },
    { id: '14', name: 'Sierra Leone', type: 'CHC', chiefdom: 'Kamaranka' },
    { id: '15', name: 'Kalangba', type: 'CHC', chiefdom: 'Bombali Sebora' },
    { id: '16', name: 'Sierra Leone', type: 'CHC', chiefdom: 'Kamaranka' }
  ];

  return (
    <>
      {loading && <Loader />}
      <div className='col-12'>
        <DetailCard
          buttonLabel='Add Health Facility'
          header='Health Facility'
          isSearch={true}
          onSearch={handleSearch}
          onButtonClick={openCreateHealthFacility}
        >
          <CustomTable
            rowData={healthFacilityList}
            columnsDef={[
              {
                id: 1,
                name: 'name',
                label: 'Name'
              },
              {
                id: 2,
                name: 'type',
                label: 'Type'
              },
              {
                id: 3,
                name: 'chiefdom',
                label: 'Chiefdom'
              }
            ]}
            isDelete={false}
            isEdit={true}
            page={listParams.page}
            rowsPerPage={listParams.rowsPerPage}
            count={20}
            onRowEdit={openEditDialogue}
            handlePageChange={handlePage}
            handleRowClick={handleRowClick}
          />
        </DetailCard>
      </div>
      <ModalForm
        show={editHealthFacilityModal.isOpen}
        title={`Edit Health Facility`}
        cancelText='Cancel'
        submitText='Submit'
        handleCancel={closeHealthFacilityEditModal}
        handleFormSubmit={handleHealthFacilityDetailsSubmit}
        initialValues={{ healthFacility: editHealthFacilityModal.data }}
        mutators={arrayMutators}
        render={editHealthFacilityDetailsModalRender}
        size='modal-lg'
      />
    </>
  );
};

export default HealthFacilityList;
