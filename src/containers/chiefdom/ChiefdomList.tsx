import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import APPCONSTANTS from '../../constants/appConstants';
import {
  chiefdomListCountSelector,
  chiefdomListSelector,
  chiefdomLoadingSelector
} from '../../store/chiefdom/selectors';
import DetailCard from '../../components/detailCard/DetailCard';
import CustomTable from '../../components/customTable/CustomTable';
import Loader from '../../components/loader/Loader';
import {
  clearChiefdomDetail,
  clearChiefdomList,
  fetchChiefdomByIdReq,
  fetchChiefdomListRequest,
  setChiefdomDetails,
  updateChiefdomReq
} from '../../store/chiefdom/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { IChiefdomDetail, IChiefdomList } from '../../store/chiefdom/types';
import { PROTECTED_ROUTES } from '../../constants/route';
import ChiefdomForm from '../../components/chiefdomForm/ChiefdomForm';
import ModalForm from '../../components/modal/ModalForm';
import { IDistrictOption } from '../../store/district/types';
import sessionStorageServices from '../../global/sessionStorageServices';
import { countryIdSelector } from '../../store/user/selectors';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { formatUserToastMsg } from '../../utils/commonUtils';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

interface IChiefdomFormValue {
  name: string;
  email: string;
  manager_name: string;
  manager_phone_number: string;
  district?: IDistrictOption;
}

/**
 * Lists all the chiefdom
 * Provides search feature
 * @returns {React.ReactElement}
 */
const ChiefdomList = (): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const dispatch = useDispatch();
  const history = useHistory();
  const countryId = useSelector(countryIdSelector);
  const chiefdomsList = useSelector(chiefdomListSelector);
  const loading = useSelector(chiefdomLoadingSelector);
  const listCount = useSelector(chiefdomListCountSelector);
  // Considering this component can be rendered under ouByRegion and chiefdomByDistrict routes
  // taking all the possible params(ie: districtId & regionId) to determine current route
  const {
    regionId = '',
    districtId = '',
    tenantId = ''
  } = useParams<{ regionId?: string; districtId?: string; tenantId?: string }>();

  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = useAppTypeConfigs();

  /**
   * To load Chiefdom List data.
   */
  const fetchList = useCallback(() => {
    dispatch(
      fetchChiefdomListRequest({
        tenantId,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        search: listParams.searchTerm,
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.CHIEFDOM_LIST_FETCH_ERROR, chiefdomSName)
            )
          )
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tenantId, listParams]);

  /**
   * useEffect hook to invoke fetchList function when dependencies change
   */
  useEffect(() => {
    fetchList();
  }, [dispatch, fetchList, listParams]);

  /**
   * To remove chiefdom List and chiefdom Detail cache in store
   */
  useEffect(() => {
    return () => {
      dispatch(clearChiefdomList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Opens the page for adding a new chiefdom, adjusting the route based on the presence of a region ID.
   * @callback
   */
  const openAddChiefdom = useCallback(() => {
    const pathname = regionId ? PROTECTED_ROUTES.createChiefdomByRegion : PROTECTED_ROUTES.createChiefdomByDistrict;
    history.push(
      pathname.replace(':regionId', regionId).replace(':districtId', districtId).replace(':tenantId', tenantId)
    );
  }, [history, regionId, districtId, tenantId]);

  const [showChiefdomEditModal, setShowChiefdomEditModal] = useState(false);
  const chiefdomToBeEdited = useRef<IChiefdomFormValue | {}>({});

  /**
   * Opens the modal for editing an chiefdom by fetching its details.
   *
   * @callback
   * @param {IChiefdomDetail} chiefdom - The details of the chiefdom to be edited.
   * @param {string} chiefdom.id - The ID of the chiefdom.
   * @param {string} chiefdom.tenantIdFromEdit - The tenant ID of the chiefdom.
   */
  const openChiefdomEditModal = useCallback(
    ({ id, tenantId: tenantIdFromEdit }: IChiefdomDetail) => {
      dispatch(
        fetchChiefdomByIdReq({
          payload: { id, tenantId: tenantIdFromEdit },
          successCb: (payload: IChiefdomDetail) => {
            payload = {
              ...payload,
              district: {
                id: payload.countryId,
                name: payload.districtName
              }
            };
            chiefdomToBeEdited.current = payload;
            setShowChiefdomEditModal(true);
          },
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.CHIEFDOM_UPDATE_FAIL, chiefdomSName)
              )
            )
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  /**
   * Handles the update of an chiefdom with the provided details.
   *
   * @param {IChiefdomDetail} chiefdom - The details of the chiefdom to be updated.
   * @param {string} chiefdom.name - The name of the chiefdom.
   * @param {object} chiefdom.district - The district information of the chiefdom.
   * @param {string} chiefdom.id - The ID of the chiefdom.
   * @param {string} chiefdom.tenantIdFromEdit - The tenant ID of the chiefdom.
   */
  const handleChiefdomEdit = ({ name, district, id, tenantId: tenantIdFromEdit }: IChiefdomDetail) => {
    dispatch(
      updateChiefdomReq({
        payload: {
          name: name.trim(),
          countryId: Number(countryId?.id || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID)),
          districtId: Number(district?.id),
          id,
          tenantId: tenantIdFromEdit
        },
        successCb: () => {
          setShowChiefdomEditModal(false);
          handlePage(APPCONSTANTS.INITIAL_PAGE);
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.CHIEFDOM_UPDATE_SUCCESS, chiefdomSName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.CHIEFDOM_UPDATE_FAIL, chiefdomSName)
            )
          )
      })
    );
  };

  /**
   * Handles the row click event by setting the chiefdom details and navigating to the summary page.
   *
   * @param {IChiefdomList} chiefdom - The details of the chiefdom from the clicked row.
   * @param {string} chiefdom.id - The ID of the chiefdom.
   * @param {string} chiefdom.tenantIdFromClick - The tenant ID of the chiefdom.
   * @param {string} chiefdom.name - The name of the chiefdom.
   */
  const handleRowClick = ({ id, tenantId: tenantIdFromClick, name }: IChiefdomList) => {
    dispatch(clearChiefdomDetail());
    dispatch(setChiefdomDetails({ id, tenantId, name }));
    history.push(PROTECTED_ROUTES.chiefdomSummary.replace(':chiefdomId', id).replace(':tenantId', tenantIdFromClick));
  };
  return (
    <>
      {loading && <Loader />}
      <div className={`row g-0dot625`}>
        <div className='col-12'>
          <DetailCard
            buttonLabel={`Add ${chiefdomSName}`}
            header={chiefdomSName}
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={openAddChiefdom}
          >
            <CustomTable
              rowData={chiefdomsList}
              columnsDef={[
                { id: 1, name: 'name', label: 'NAME', width: '200px' },
                {
                  id: 2,
                  name: 'districtName',
                  label: districtSName,
                  width: '200px',
                  cellFormatter: (ouList: IChiefdomList) => ouList.districtName
                }
              ]}
              isEdit={true}
              isDelete={false}
              page={listParams.page}
              rowsPerPage={listParams.rowsPerPage}
              count={listCount}
              handlePageChange={handlePage}
              isRowEdit={true}
              onRowEdit={openChiefdomEditModal}
              handleRowClick={handleRowClick as any}
              confirmationTitle={formatUserToastMsg(APPCONSTANTS.CHIEFDOM_DELETE_CONFIRMATION, chiefdomSName)}
              deleteTitle={formatUserToastMsg(APPCONSTANTS.CHIEFDOM_DELETE_TITLE, chiefdomSName)}
            />
          </DetailCard>
        </div>
      </div>
      <ModalForm
        title={`Edit ${chiefdomSName}`}
        cancelText='Cancel'
        submitText='Submit'
        show={showChiefdomEditModal}
        handleCancel={() => setShowChiefdomEditModal(false)}
        handleFormSubmit={handleChiefdomEdit}
        initialValues={chiefdomToBeEdited.current}
      >
        <ChiefdomForm isEdit={true} />
      </ModalForm>
    </>
  );
};

export default ChiefdomList;
