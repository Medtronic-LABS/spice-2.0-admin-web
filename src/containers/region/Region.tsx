import React, { useCallback, useEffect, useState } from 'react';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS from '../../constants/appConstants';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import DownloadIcon from '../../assets/images/download.svg';
import UploadIcon from '../../assets/images/upload_blue.svg';
import { useDispatch, useSelector } from 'react-redux';
import { userDataSelector } from '../../store/user/selectors';
import dragDropStyles from '../../components/dragDropFiles/DragDropFiles.module.scss';
import styles from './Region.module.scss';
import DragDropFiles from '../../components/dragDropFiles/DragDropFiles';
import { downloadFileRequest, regionDetailsRequest, uploadFileRequest } from '../../store/region/actions';
import { getLoadingSelector, getRegionDetailsSelector } from '../../store/region/selectors';
import toastCenter from '../../utils/toastCenter';
import ModalForm from '../../components/modal/ModalForm';
import arrayMutators from 'final-form-arrays';
import { fileDownload } from '../../utils/commonUtils';

const Region = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();

  const regionData = useSelector(userDataSelector).country;
  const regionDetails = useSelector(getRegionDetailsSelector);
  const loading = useSelector(getLoadingSelector);
  const [uploadClicked, setUploadClicked] = useState(false);

  const onDownloadClick = () => {
    dispatch(
      downloadFileRequest({
        countryId: Number(regionData.id),
        successCb: (data) => {
          const filename = regionData.name;
          fileDownload(data, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.REGION_DOWNLOAD_SUCCESS);
        },
        failureCb: (error) => {
          toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.REGION_DOWNLOAD_FAILURE);
        }
      })
    );
  };

  const onSubmit = (file: any) =>
    dispatch(
      uploadFileRequest({
        file,
        successCb: (_) => {
          fetchRegionDetails();
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.REGION_UPLOAD_SUCCESS);
          setUploadClicked(false);
        },
        failureCb: (e) => {
          toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.REGION_UPLOAD_FAILURE);
        }
      })
    );

  const fetchRegionDetails = useCallback(
    () =>
      dispatch(
        regionDetailsRequest({
          countryId: Number(regionData.id),
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: listParams.rowsPerPage,
          search: listParams.searchTerm,
          failureCb: (e) => toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.REGION_DETAIL_FETCH_ERROR)
        })
      ),
    [dispatch, listParams, regionData.id]
  );

  useEffect(() => {
    if (regionData.id) {
      fetchRegionDetails();
    }
  }, [dispatch, fetchRegionDetails, listParams, regionData.id]);

  return (
    <>
      {loading && <Loader />}
      <div className={` row g-0dot625 position-relative h-100`}>
        {!loading && !regionDetails.list.length ? (
          <div
            className={`${dragDropStyles.dragDropContainer} d-flex justify-content-center align-items-center`}
            onDragOver={(e) => e.preventDefault()}
            draggable={false}
            onDrop={(event: React.DragEvent<HTMLDivElement>) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          >
            <DragDropFiles onUploadSubmit={onSubmit} />
          </div>
        ) : (
          <div className='col-12'>
            <DetailCard
              buttonIcon={DownloadIcon}
              buttonLabel='Download'
              buttonCustomClass={styles.regionDetailIcons}
              customLabel='Upload'
              customButtonIcon={UploadIcon}
              onCustomClick={() => setUploadClicked(true)}
              header={regionData.name}
              isSearch={true}
              onSearch={handleSearch}
              onButtonClick={onDownloadClick}
            >
              <CustomTable
                rowData={regionDetails.list}
                columnsDef={[
                  {
                    id: 1,
                    name: 'districtname',
                    label: 'DISTRICT'
                  },
                  {
                    id: 2,
                    name: 'chiefdomname',
                    label: 'CHEIFDOM'
                  },
                  {
                    id: 3,
                    name: 'villagename',
                    label: 'VILLAGE'
                  },
                  {
                    id: 4,
                    name: 'villagetype',
                    label: 'VILLAGE TYPE'
                  }
                ]}
                isEdit={false}
                isDelete={false}
                page={listParams.page}
                rowsPerPage={listParams.rowsPerPage}
                count={regionDetails.total}
                handlePageChange={handlePage}
                confirmationTitle={APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_CONFIRMATION}
                deleteTitle={APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_TITLE}
              />
            </DetailCard>
          </div>
        )}
      </div>
      <ModalForm
        show={uploadClicked}
        title={`Upload Region Data`}
        cancelText='Cancel'
        submitText='Submit'
        hideFooterButton={true}
        handleCancel={() => setUploadClicked(false)}
        handleFormSubmit={onSubmit}
        mutators={arrayMutators}
        render={() => <DragDropFiles onUploadSubmit={onSubmit} />}
      />
    </>
  );
};

export default Region;
