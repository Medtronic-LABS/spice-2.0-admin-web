import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import {
  subCountyListCountSelector,
  subCountyListSelector,
  subCountyLoadingSelector
} from '../../store/subCounty/selectors';
import DetailCard from '../../components/detailCard/DetailCard';
import CustomTable from '../../components/customTable/CustomTable';
import Loader from '../../components/loader/Loader';
import {
  clearSubCountyDetail,
  clearSubCountyList,
  fetchSubCountyByIdReq,
  fetchSubCountyListRequest,
  setSubCountyDetails,
  updateSubCountyReq
} from '../../store/subCounty/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { ISubCountyDetail, ISubCountyList } from '../../store/subCounty/types';
import { PROTECTED_ROUTES } from '../../constants/route';
import SubCountyForm from '../../components/subCountyForm/SubCountyForm';
import ModalForm from '../../components/modal/ModalForm';
import { ICountyOption } from '../../store/county/types';
import sessionStorageServices from '../../global/sessionStorageServices';
import { countryIdSelector } from '../../store/user/selectors';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { formatUserToastMsg } from '../../utils/commonUtils';

interface ISubCountyFormValue {
  name: string;
  email: string;
  manager_name: string;
  manager_phone_number: string;
  county?: ICountyOption;
}

/**
 * Lists all the sub county
 * Provides search feature
 * @returns {React.ReactElement}
 */
const SubCountyList = (): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const dispatch = useDispatch();
  const history = useHistory();
  const countryId = useSelector(countryIdSelector);
  const subCountysList = useSelector(subCountyListSelector);
  const loading = useSelector(subCountyLoadingSelector);
  const listCount = useSelector(subCountyListCountSelector);
  // Considering this component can be rendered under ouByRegion and ouByAccount routes
  // taking all the possible params(ie: countyId & regionId) to determine current route
  const {
    regionId = '',
    countyId = '',
    tenantId = ''
  } = useParams<{ regionId?: string; countyId?: string; tenantId?: string }>();

  const { county: countyModuleName, subCounty: subCountyModuleName } = NAME_CONSTANTS;

  /**
   * to load Sub County List data.
   * @param Sub County List
   */
  const fetchList = useCallback(() => {
    dispatch(
      fetchSubCountyListRequest({
        tenantId,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        search: listParams.searchTerm,
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_LIST_FETCH_ERROR, subCountyModuleName)
            )
          )
      })
    );
  }, [dispatch, tenantId, listParams]);

  useEffect(() => {
    fetchList();
  }, [dispatch, fetchList, listParams]);

  /**
   * To remove sub county List and sub county Detail cache in store
   */
  useEffect(() => {
    return () => {
      dispatch(clearSubCountyList());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Opens the page for adding a new sub county, adjusting the route based on the presence of a region ID.
   * @callback
   */
  const openAddSubCounty = useCallback(() => {
    const pathname = regionId ? PROTECTED_ROUTES.createSubCountyByRegion : PROTECTED_ROUTES.createSubCountyByCounty;
    history.push(pathname.replace(':regionId', regionId).replace(':countyId', countyId).replace(':tenantId', tenantId));
  }, [history, regionId, countyId, tenantId]);

  const [showSubCountyEditModal, setShowSubCountyEditModal] = useState(false);
  const subCountyToBeEdited = useRef<ISubCountyFormValue | {}>({});

  /**
   * Opens the modal for editing an sub County by fetching its details.
   *
   * @callback
   * @param {ISubCountyDetail} subCounty - The details of the sub County to be edited.
   * @param {string} subCounty.id - The ID of the sub County.
   * @param {string} subCounty.tenantIdFromEdit - The tenant ID of the sub County.
   */
  const openSubCountyEditModal = useCallback(
    ({ id, tenantId: tenantIdFromEdit }: ISubCountyDetail) => {
      dispatch(
        fetchSubCountyByIdReq({
          payload: { id, tenantId: tenantIdFromEdit },
          successCb: (payload: ISubCountyDetail) => {
            payload = {
              ...payload,
              county: {
                id: payload.countryId,
                name: payload.countyName
              }
            };
            subCountyToBeEdited.current = payload;
            setShowSubCountyEditModal(true);
          },
          failureCb: (e) =>
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_UPDATE_FAIL, subCountyModuleName)
              )
            )
        })
      );
    },
    [dispatch]
  );

  /**
   * Handles the update of an sub County with the provided details.
   *
   * @param {ISubCountyDetail} subCounty - The details of the sub County to be updated.
   * @param {string} subCounty.name - The name of the sub County.
   * @param {object} subCounty.account - The account information of the sub County.
   * @param {string} subCounty.id - The ID of the sub County.
   * @param {string} subCounty.tenantIdFromEdit - The tenant ID of the sub County.
   */
  const handleSubCountyEdit = ({ name, county, id, tenantId: tenantIdFromEdit }: ISubCountyDetail) => {
    dispatch(
      updateSubCountyReq({
        payload: {
          name: name.trim(),
          countryId: Number(countryId?.id || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID)),
          countyId: Number(county?.id),
          id,
          tenantId: tenantIdFromEdit
        },
        successCb: () => {
          setShowSubCountyEditModal(false);
          handlePage(APPCONSTANTS.INITIAL_PAGE);
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_UPDATE_SUCCESS, subCountyModuleName)
          );
        },
        failureCb: (e: Error) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_UPDATE_FAIL, subCountyModuleName)
            )
          )
      })
    );
  };

  /**
   * Handles the row click event by setting the sub County details and navigating to the summary page.
   *
   * @param {ISubCountyList} subCounty - The details of the sub County from the clicked row.
   * @param {string} subCounty.id - The ID of the sub County.
   * @param {string} subCounty.tenantIdFromClick - The tenant ID of the sub County.
   * @param {string} subCounty.name - The name of the sub County.
   */
  const handleRowClick = ({ id, tenantId: tenantIdFromClick, name }: ISubCountyList) => {
    dispatch(clearSubCountyDetail());
    dispatch(setSubCountyDetails({ id, tenantId, name }));
    history.push(PROTECTED_ROUTES.subCountySummary.replace(':subCountyId', id).replace(':tenantId', tenantIdFromClick));
  };
  return (
    <>
      {loading && <Loader />}
      <div className={`row g-0dot625`}>
        <div className='col-12'>
          <DetailCard
            buttonLabel={`Add ${subCountyModuleName}`}
            header={subCountyModuleName}
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={openAddSubCounty}
          >
            <CustomTable
              rowData={subCountysList}
              columnsDef={[
                { id: 1, name: 'name', label: 'NAME', width: '200px' },
                {
                  id: 2,
                  name: 'countyName',
                  label: countyModuleName,
                  width: '200px',
                  cellFormatter: (ouList: ISubCountyList) => ouList.countyName
                }
              ]}
              isEdit={true}
              isDelete={false}
              page={listParams.page}
              rowsPerPage={listParams.rowsPerPage}
              count={listCount}
              handlePageChange={handlePage}
              isRowEdit={true}
              onRowEdit={openSubCountyEditModal}
              handleRowClick={handleRowClick as any}
              confirmationTitle={formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_DELETE_CONFIRMATION, subCountyModuleName)}
              deleteTitle={formatUserToastMsg(APPCONSTANTS.SUB_COUNTY_DELETE_TITLE, subCountyModuleName)}
            />
          </DetailCard>
        </div>
      </div>
      <ModalForm
        title={`Edit ${subCountyModuleName}`}
        cancelText='Cancel'
        submitText='Submit'
        show={showSubCountyEditModal}
        handleCancel={() => setShowSubCountyEditModal(false)}
        handleFormSubmit={handleSubCountyEdit}
        initialValues={subCountyToBeEdited.current}
      >
        <SubCountyForm isEdit={true} />
      </ModalForm>
    </>
  );
};

export default SubCountyList;
