import React from 'react';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS from '../../constants/appConstants';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import DownloadIcon from '../../assets/images/download.svg';
import UploadIcon from '../../assets/images/upload_blue.svg';
import { useSelector } from 'react-redux';
import { userDataSelector } from '../../store/user/selectors';
import styles from '../../components/dragDropFiles/DragDropFiles.module.scss';
import DragDropFiles from '../../components/dragDropFiles/DragDropFiles';

const Region = (): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const regionName = useSelector(userDataSelector).country.name;
  const openAddModal = () => {
    //
  };
  const handleEditSiteUserClick = () => {
    //
  };
  const handleSiteUserDelete = () => {
    //
  };
  const onUploadClick = () => {
    //
  };
  const regionList: any[] = [];

  return (
    <>
      {false && <Loader />}
      <div className={` row g-0dot625 position-relative h-100`}>
        {regionList.length ? (
          <div className='col-12'>
            <DetailCard
              buttonIcon={DownloadIcon}
              buttonLabel='Download'
              buttonCustomStyle={{
                iconStyle: { backgroundColor: 'white', color: '#2514BE', border: '1.5px solid #2514BE' },
                textStyle: { fontWeight: '500' }
              }}
              customLabel='Upload'
              customButtonIcon={UploadIcon}
              onCustomClick={onUploadClick}
              header={regionName}
              isSearch={true}
              onSearch={handleSearch}
              onButtonClick={openAddModal}
            >
              <CustomTable
                rowData={regionList}
                columnsDef={[
                  {
                    id: 1,
                    name: 'district',
                    label: 'DISTRICT'
                  },
                  {
                    id: 2,
                    name: 'chiefdom',
                    label: 'CHEIFDOM'
                  },
                  {
                    id: 1,
                    name: 'village',
                    label: 'VILLAGE'
                  },
                  {
                    id: 1,
                    name: 'villageType',
                    label: 'VILLAGE TYPE'
                  }
                ]}
                isEdit={true}
                isDelete={true}
                page={listParams.page}
                rowsPerPage={listParams.rowsPerPage}
                count={regionList.length}
                onRowEdit={handleEditSiteUserClick}
                onDeleteClick={handleSiteUserDelete}
                handlePageChange={handlePage}
                confirmationTitle={APPCONSTANTS.SITE_USER_DELETE_CONFIRMATION}
                deleteTitle={APPCONSTANTS.SITE_USER_DELETE_TITLE}
              />
            </DetailCard>
          </div>
        ) : (
          <div
            className={`${styles.dragDropContainer} d-flex justify-content-center align-items-center`}
            onDragOver={(e) => e.preventDefault()}
            draggable={false}
            onDrop={(event: React.DragEvent<HTMLDivElement>) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <DragDropFiles />
          </div>
        )}
      </div>
    </>
  );
};

export default Region;
