import React, { useCallback, useEffect, useState } from 'react';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import DownloadIcon from '../../assets/images/download.svg';
import UploadIcon from '../../assets/images/upload_blue.svg';
import { useDispatch, useSelector } from 'react-redux';
import dragDropStyles from '../../components/dragDropFiles/DragDropFiles.module.scss';
import styles from './Region.module.scss';
import DragDropFiles from '../../components/dragDropFiles/DragDropFiles';
import {
  downloadFileRequest,
  uploadFileRequest,
  regionDetailsRequest,
  fetchCountryDetailReq
} from '../../store/region/actions';
import {
  getIsUploadingSelector,
  getLoadingSelector,
  getRegionDetailsSelector,
  getRegionIdSelector
} from '../../store/region/selectors';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import ModalForm from '../../components/modal/ModalForm';
import arrayMutators from 'final-form-arrays';
import { fileDownload } from '../../utils/commonUtils';
import { useParams } from 'react-router-dom';
import { IMatchParams } from '../../store/region/types';

const Region = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const { regionId, tenantId } = useParams<IMatchParams>();
  const regionDetails = useSelector(getRegionDetailsSelector);
  const loading = useSelector(getLoadingSelector);
  const uploading = useSelector(getIsUploadingSelector);
  const regionDetailsId = useSelector(getRegionIdSelector);
  const [uploadClicked, setUploadClicked] = useState(false);
  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = NAME_CONSTANTS;

  const onDownloadClick = () => {
    dispatch(
      downloadFileRequest({
        countryId: Number(regionId),
        successCb: (data) => {
          const filename = regionDetails.name;
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

  const fetchRegionDetails = useCallback(() => {
    if (regionData?.id) {
      dispatch(
        regionDetailsRequest({
          countryId: Number(regionId),
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: listParams.rowsPerPage,
          search: listParams.searchTerm,
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.REGION_DETAIL_FETCH_ERROR));
          }
        })
      );
    }
  }, [dispatch, listParams.page, listParams.rowsPerPage, listParams.searchTerm, regionData.id]);

  useEffect(() => {
    fetchRegionDetails();
  }, [fetchRegionDetails]);

  return (
    <>
      {(loading || uploading) && <Loader />}
      <div className={` row g-0dot625 position-relative h-100`}>
        {!loading && Array.isArray(regionDetails.list) && !regionDetails.list.length ? (
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
              header='Region'
              searchPlaceholder='Search Name'
              isSearch={true}
              onSearch={handleSearch}
              onButtonClick={onDownloadClick}
            >
              <CustomTable
                rowData={regionDetails.list ? regionDetails.list : []}
                columnsDef={[
                  {
                    id: 1,
                    name: 'districtname',
                    label: districtSName
                  },
                  {
                    id: 2,
                    name: 'chiefdomname',
                    label: chiefdomSName
                  },
                  {
                    id: 3,
                    name: 'villagename',
                    label: 'VILLAGE'
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
