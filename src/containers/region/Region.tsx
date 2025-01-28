import arrayMutators from 'final-form-arrays';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DownloadIcon from '../../assets/images/download.svg';
import UploadIcon from '../../assets/images/upload_blue.svg';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import DragDropFiles from '../../components/dragDropFiles/DragDropFiles';
import dragDropStyles from '../../components/dragDropFiles/DragDropFiles.module.scss';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import APPCONSTANTS from '../../constants/appConstants';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import {
  downloadFileRequest,
  fetchCountryDetailReq,
  regionDetailsRequest,
  uploadFileRequest
} from '../../store/region/actions';
import {
  getIsUploadingSelector,
  getLoadingSelector,
  getRegionDetailsSelector,
  getRegionIdSelector
} from '../../store/region/selectors';
import { IMatchParams } from '../../store/region/types';
import { getAppTypeSelector, roleSelector } from '../../store/user/selectors';
import { fileDownload, formatUserToastMsg } from '../../utils/commonUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import styles from './Region.module.scss';
const Region = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const { regionId, tenantId } = useParams<IMatchParams>();
  const regionDetails = useSelector(getRegionDetailsSelector);
  const role = useSelector(roleSelector);
  const loading = useSelector(getLoadingSelector);
  const uploading = useSelector(getIsUploadingSelector);
  const regionDetailsId = useSelector(getRegionIdSelector);
  const [uploadClicked, setUploadClicked] = useState(false);
  const appTypes = useSelector(getAppTypeSelector);

  const {
    isCommunity,
    region: { s: regionSName },
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName },
    healthFacility: { s: healthFacilitySName }
  } = useAppTypeConfigs();

  // Check if the current user role is Region Admin to set read-only access
  const isReadOnly = role === APPCONSTANTS.ROLES.REGION_ADMIN;

  /**
   * Handles the file download process when the download button is clicked.
   * Dispatches an action to download the file.
   */
  const onDownloadClick = () => {
    dispatch(
      downloadFileRequest({
        countryId: Number(regionId),
        appTypes,
        successCb: (data) => {
          const filename = regionDetails.name;
          // Initiating file download with appropriate file type (Excel sheet)
          fileDownload(data, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.REGION_DOWNLOAD_SUCCESS, regionSName)
          );
        },
        failureCb: (error) => {
          toastCenter.error(APPCONSTANTS.OOPS, formatUserToastMsg(APPCONSTANTS.REGION_DOWNLOAD_FAILURE, regionSName));
        }
      })
    );
  };

  /**
   * Handles file upload submission by dispatching the upload action.
   * On success, fetches the updated region details and displays a success toast.
   * On failure, displays an error toast.
   *
   * @param {FILE} file - The file to be uploaded.
   */
  const onSubmit = (file: File) =>
    dispatch(
      uploadFileRequest({
        file,
        appTypes: appTypes[0],
        successCb: (_) => {
          fetchRegionDetails(); // Fetch updated region details after successful upload
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.REGION_UPLOAD_SUCCESS, regionSName)
          );
          setUploadClicked(false); // Reset upload button state
        },
        failureCb: (e) => {
          toastCenter.error(APPCONSTANTS.OOPS, formatUserToastMsg(APPCONSTANTS.REGION_UPLOAD_FAILURE, regionSName));
        }
      })
    );

  /**
   * Fetches the details of the current region using the regionId.
   */
  const fetchRegionDetails = useCallback(() => {
    if (regionId) {
      dispatch(
        regionDetailsRequest({
          countryId: Number(regionId),
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: listParams.rowsPerPage,
          search: listParams.searchTerm,
          failureCb: (e) => {
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.REGION_DETAIL_FETCH_ERROR, regionSName)
              )
            );
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, listParams.page, listParams.rowsPerPage, listParams.searchTerm, regionId]);

  /**
   * Fetches the region details whenever the regionId changes or the pagination/search params change.
   */
  useEffect(() => {
    if (regionId) {
      fetchRegionDetails();
    }
  }, [dispatch, fetchRegionDetails, listParams, regionId]);

  /**
   * Fetches country details associated with the current region.
   * Dispatches the fetch request based on regionId and tenantId.
   */
  const getCountryDetails = useCallback(() => {
    dispatch(
      fetchCountryDetailReq({
        id: regionId,
        tenantId
      })
    );
  }, [dispatch, regionId, tenantId]);

  useEffect(() => {
    if (regionId && tenantId && !regionDetailsId) {
      getCountryDetails();
    }
  }, [getCountryDetails, regionDetailsId, regionId, tenantId]);

  const fields = [
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
  ];

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
              buttonLabel={isReadOnly ? undefined : 'Download'}
              buttonCustomClass={styles.regionDetailIcons}
              customLabel={isReadOnly ? undefined : 'Upload'}
              customButtonIcon={UploadIcon}
              onCustomClick={() => setUploadClicked(true)}
              header={regionSName}
              searchPlaceholder='Search Name'
              isSearch={true}
              onSearch={handleSearch}
              onButtonClick={onDownloadClick}
            >
              <CustomTable
                rowData={regionDetails.list ?? []}
                columnsDef={
                  isCommunity
                    ? [
                        ...fields,
                        {
                          id: 4,
                          name: 'villagetype',
                          label: 'VILLAGE TYPE'
                        }
                      ]
                    : fields
                }
                isEdit={false}
                isDelete={false}
                page={listParams.page}
                rowsPerPage={listParams.rowsPerPage}
                count={regionDetails.total}
                handlePageChange={handlePage}
                confirmationTitle={formatUserToastMsg(
                  APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_CONFIRMATION,
                  healthFacilitySName
                )}
                deleteTitle={formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_USER_DELETE_TITLE, healthFacilitySName)}
              />
            </DetailCard>
          </div>
        )}
      </div>
      <ModalForm
        show={uploadClicked}
        title={`Upload ${regionSName} Data`}
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
