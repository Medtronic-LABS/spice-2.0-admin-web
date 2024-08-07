import React, { useCallback, useState, useEffect, useRef } from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import {
  clearCountyDetails,
  clearCountyList,
  decactivateCountyReq,
  fetchCountyListRequest,
  resetClinicalWorkflow,
  setCountyDetails,
  updateCountyDetail
} from '../../store/county/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import {
  countyLoadingSelector,
  getCountyListSelector,
  countyCountSelector,
  getClinicalWorkflowSelector
} from '../../store/county/selectors';
import Loader from '../../components/loader/Loader';
import { PROTECTED_ROUTES } from '../../constants/route';
import { ICounty, ICountyDeactivateFormValues, ICountyDetail, IDeactivateReqPayload } from '../../store/county/types';
import Modal from '../../components/modal/ModalForm';
import CountyForm from '../createCounty/CountyForm';
import sessionStorageServices from '../../global/sessionStorageServices';
import Deactivation from '../../components/deactivate/Deactivation';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { ReactComponent as IconLegal } from '../../assets/images/icon-legal.svg';
import { clearConsentForm } from '../../store/workflow/actions';
import CountyConsentForm from './CountyConsentForm';
import { loadingSelector } from '../../store/workflow/selectors';
import { formatUserToastMsg } from '../../utils/commonUtils';

interface IMatchParams {
  regionId: string;
  tenantId: string;
}

interface IDispatchProps {
  decactivateCountyReq: (payload: IDeactivateReqPayload) => void;
}

interface IMatchProps extends RouteComponentProps<IMatchParams> {}

/**
 * Shows the county list
 * @returns {React.ReactElement}
 */
const CountyList = (props: IMatchProps & IDispatchProps): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const dispatch = useDispatch();
  const loading = useSelector(countyLoadingSelector);
  const workflowLoading = useSelector(loadingSelector);
  const countyList = useSelector(getCountyListSelector);
  const countyCount = useSelector(countyCountSelector);
  const clinicalWorkflows = useSelector(getClinicalWorkflowSelector);
  const [isOpenCountyModal, setOpenCountyModal] = useState(false);
  const [isOpenDeactivateModal, setOpenDeactivateModal] = useState(false);
  const countyToBeEdited = useRef<ICountyDetail>({} as ICountyDetail);
  const consentFormConfig = useRef({} as any);
  const [openConsentForm, setOpenConsentForm] = useState(false);
  const { regionId, tenantId } = useParams<IMatchParams>();
  const { county: countyModuleName } = NAME_CONSTANTS;

  const fetchDetails = useCallback(() => {
    dispatch(
      fetchCountyListRequest({
        tenantId,
        skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
        limit: listParams.rowsPerPage,
        search: listParams.searchTerm,
        isActive: true,
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.COUNTY_FETCH_ERROR, countyModuleName)
            )
          )
      })
    );
  }, [dispatch, tenantId, listParams]);

  useEffect(() => {
    fetchDetails();
  }, [dispatch, fetchDetails, tenantId, listParams]);

  /**
   * To remove County List and Consent form cache in store
   */
  useEffect(() => {
    if (clinicalWorkflows.length) {
      dispatch(resetClinicalWorkflow());
    }
    return () => {
      dispatch(clearCountyList());
      dispatch(clearConsentForm());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    props.history.push(
      PROTECTED_ROUTES.createCountyByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId)
    );
  };

  const handleRowClick = (data: Partial<ICounty>) => {
    dispatch(clearCountyDetails());
    dispatch(setCountyDetails(data));
    props.history.push(
      PROTECTED_ROUTES.countySummary
        .replace(':countyId', data.id as string)
        .replace(':tenantId', data.tenantId as string)
    );
  };

  /**
   * Handle for modal cancel
   */
  const handleCancelClick = () => {
    setOpenCountyModal(false);
    setOpenDeactivateModal(false);
  };

  const openCountyEditModal = (value: ICountyDetail) => {
    countyToBeEdited.current = value;
    setOpenCountyModal(true);
  };

  /**
   * Handler for county edit form submit.
   * @param values
   */
  const handleCountyFormSubmit = (values?: ICountyDetail) => {
    const data = JSON.parse(JSON.stringify(values));
    dispatch(
      updateCountyDetail({
        data: {
          id: data.county.id,
          name: data.county.name.trim(),
          tenantId: data.county.tenantId
        },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.COUNTY_UPDATE_SUCCESS, countyModuleName)
          );
          handlePage(APPCONSTANTS.INITIAL_PAGE);
          handleCancelClick();
        },
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.COUNTY_UPDATE_FAIL, countyModuleName)
            )
          )
      })
    );
  };

  const showDeactivateModal = () => {
    setOpenDeactivateModal(true);
  };

  const handleDeactivate = (values: ICountyDeactivateFormValues) => {
    const status = values.status.value;
    const { reason } = values;
    dispatch(
      decactivateCountyReq({
        data: { tenantId: Number(countyToBeEdited.current.tenantId), status, reason },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.COUNTY_DEACTIVATE_SUCCESS, countyModuleName)
          );
          props.history.push(
            PROTECTED_ROUTES.countyByRegion
              .replace(':regionId', sessionStorageServices.getItem(APPCONSTANTS.FORM_ID))
              .replace(':tenantId', sessionStorageServices.getItem(APPCONSTANTS.ID))
          );
        },
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              formatUserToastMsg(APPCONSTANTS.COUNTY_DEACTIVATE_FAIL, countyModuleName)
            )
          )
      })
    );
  };

  const editModalRender = (form: any) => {
    return isOpenDeactivateModal ? (
      <Deactivation formName={countyModuleName.toLowerCase()} />
    ) : (
      <CountyForm form={form} />
    );
  };

  const handleConsentFormOpen = (data: { name: string; index: number }) => {
    consentFormConfig.current = { ...data, regionId: regionId || '' };
    setOpenConsentForm(true);
  };

  const handleConsentFormClose = () => {
    setOpenConsentForm(false);
    consentFormConfig.current = {};
  };

  return (
    <>
      {(loading || workflowLoading) && <Loader />}
      <div className={`row g-0dot625`}>
        <div className='col-12'>
          <DetailCard
            buttonLabel={`Add ${countyModuleName}`}
            header={countyModuleName}
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={openAddModal}
          >
            <CustomTable
              rowData={countyList}
              columnsDef={[
                {
                  id: 1,
                  name: 'name',
                  label: 'Name',
                  width: '600px'
                }
              ]}
              isEdit={true}
              isDelete={false}
              page={countyCount > APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE ? listParams.page : 0}
              rowsPerPage={listParams.rowsPerPage}
              count={countyCount}
              onRowEdit={openCountyEditModal}
              handlePageChange={handlePage}
              onCustomConfirmed={handleConsentFormOpen}
              CustomIcon={IconLegal}
              customTitle='Consent Form'
              isCustom={true}
              isRowEdit={true}
              handleRowClick={handleRowClick}
            />
          </DetailCard>
        </div>
        <CountyConsentForm
          isOpen={openConsentForm}
          consentFormConfig={consentFormConfig.current}
          handleConsentFormClose={handleConsentFormClose}
        />
        <Modal
          show={isOpenCountyModal}
          title={isOpenDeactivateModal ? `Deactivate ${countyModuleName}` : `Edit ${countyModuleName}`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={!isOpenDeactivateModal ? handleCountyFormSubmit : handleDeactivate}
          initialValues={!isOpenDeactivateModal ? { county: countyToBeEdited.current } : {}}
          deactivateLabel={!isOpenDeactivateModal ? `Deactivate ${countyModuleName}` : ''}
          handleDeactivate={showDeactivateModal}
          isDeactivateModal={isOpenDeactivateModal}
          render={editModalRender}
        />
      </div>
    </>
  );
};

export default CountyList;
