import React, { useCallback, useState, useEffect, useRef } from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import {
  clearDistrictDetails,
  clearDistrictList,
  decactivateDistrictReq,
  fetchDistrictListRequest,
  resetClinicalWorkflow,
  setDistrictDetails,
  updateDistrictDetail
} from '../../store/district/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS from '../../constants/appConstants';
import {
  districtLoadingSelector,
  getDistrictListSelector,
  districtCountSelector,
  getClinicalWorkflowSelector
} from '../../store/district/selectors';
import Loader from '../../components/loader/Loader';
import { PROTECTED_ROUTES } from '../../constants/route';
import {
  IDistrict,
  IDistrictDeactivateFormValues,
  IDistrictDetail,
  IDeactivateReqPayload
} from '../../store/district/types';
import Modal from '../../components/modal/ModalForm';
import DistrictForm from '../createDistrict/DistrictForm';
import sessionStorageServices from '../../global/sessionStorageServices';
import Deactivation from '../../components/deactivate/Deactivation';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import { ReactComponent as IconLegal } from '../../assets/images/icon-legal.svg';
import { clearConsentForm } from '../../store/workflow/actions';
import DistrictConsentForm from './DistrictConsentForm';
import { loadingSelector } from '../../store/workflow/selectors';
import { formatUserToastMsg } from '../../utils/commonUtils';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

interface IMatchParams {
  regionId: string;
  tenantId: string;
}

interface IDispatchProps {
  decactivateDistrictReq: (payload: IDeactivateReqPayload) => void;
}

interface IMatchProps extends RouteComponentProps<IMatchParams> {}

/**
 * Shows the district list
 * @returns {React.ReactElement}
 */
const DistrictList = (props: IMatchProps & IDispatchProps): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const dispatch = useDispatch();
  const loading = useSelector(districtLoadingSelector);
  const workflowLoading = useSelector(loadingSelector);
  const districtList = useSelector(getDistrictListSelector);
  const districtCount = useSelector(districtCountSelector);
  const clinicalWorkflows = useSelector(getClinicalWorkflowSelector);
  const [isOpenDistrictModal, setOpenDistrictModal] = useState(false);
  const [isOpenDeactivateModal, setOpenDeactivateModal] = useState(false);
  const districtToBeEdited = useRef<IDistrictDetail>({} as IDistrictDetail);
  const consentFormConfig = useRef({} as any);
  const [openConsentForm, setOpenConsentForm] = useState(false);
  const { regionId, tenantId } = useParams<IMatchParams>();
  const {
    district: { s: districtSName }
  } = useAppTypeConfigs();

  /**
   * fetch district list API
   */
  const fetchDetails = useCallback(() => {
    dispatch(
      fetchDistrictListRequest({
        countryId: Number(regionId),
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
              formatUserToastMsg(APPCONSTANTS.DISTRICT_FETCH_ERROR, districtSName)
            )
          )
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tenantId, listParams]);

  /**
   * useEffect hook to invoke fetchDetails function when dependencies change
   */
  useEffect(() => {
    fetchDetails();
  }, [dispatch, fetchDetails, tenantId, listParams]);

  /**
   * When component mount reset workflow cache in store
   * To remove District List and Consent form cache in store
   */
  useEffect(() => {
    if (clinicalWorkflows.length) {
      dispatch(resetClinicalWorkflow());
    }
    return () => {
      dispatch(clearDistrictList());
      dispatch(clearConsentForm());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Navigate to create district page
   * @callback
   */
  const navigateToCreateDistrict = () => {
    props.history.push(
      PROTECTED_ROUTES.createDistrictByRegion.replace(':regionId', regionId).replace(':tenantId', tenantId)
    );
  };

  /**
   * Row click handler
   * @param {Partial<IDistrict>} data - District data
   */
  const handleRowClick = (data: Partial<IDistrict>) => {
    dispatch(clearDistrictDetails());
    dispatch(setDistrictDetails(data));
    props.history.push(
      PROTECTED_ROUTES.districtSummary
        .replace(':districtId', data.id as string)
        .replace(':tenantId', data.tenantId as string)
    );
  };

  /**
   * Handle for modal cancel
   * @callback
   */
  const handleCancelClick = () => {
    setOpenDistrictModal(false);
    setOpenDeactivateModal(false);
  };

  /**
   * Hadle district edit click
   * @param {IDistrictDetail} value - District details
   * @callback
   */
  const openDistrictEditModal = (value: IDistrictDetail) => {
    districtToBeEdited.current = value;
    setOpenDistrictModal(true);
  };

  /**
   * Handler for district edit form submit.
   * @param {IDistrictDetail} values - District details
   */
  const handleDistrictFormSubmit = (values?: IDistrictDetail) => {
    const data = JSON.parse(JSON.stringify(values));
    dispatch(
      updateDistrictDetail({
        data: {
          id: data.district.id,
          name: data.district.name.trim(),
          tenantId: data.district.tenantId
        },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.DISTRICT_UPDATE_SUCCESS, districtSName)
          );
          handlePage(APPCONSTANTS.INITIAL_PAGE);
          handleCancelClick();
        },
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.OOPS,
              formatUserToastMsg(APPCONSTANTS.DISTRICT_UPDATE_FAIL, districtSName)
            )
          )
      })
    );
  };

  /**
   * Handler for deactivate district click event
   * @callback
   */
  const showDeactivateModal = () => {
    setOpenDeactivateModal(true);
  };

  /**
   * Handler for deactivate district
   * @param {IDistrictDeactivateFormValues} values - Deactivate district form values
   */
  const handleDeactivate = (values: IDistrictDeactivateFormValues) => {
    const status = values.status.value;
    const { reason } = values;
    dispatch(
      decactivateDistrictReq({
        data: { tenantId: Number(districtToBeEdited.current.tenantId), status, reason },
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            formatUserToastMsg(APPCONSTANTS.DISTRICT_DEACTIVATE_SUCCESS, districtSName)
          );
          props.history.push(
            PROTECTED_ROUTES.districtByRegion
              .replace(':regionId', sessionStorageServices.getItem(APPCONSTANTS.FORM_ID))
              .replace(':tenantId', sessionStorageServices.getItem(APPCONSTANTS.ID))
          );
        },
        failureCb: (e) =>
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              formatUserToastMsg(APPCONSTANTS.DISTRICT_DEACTIVATE_FAIL, districtSName)
            )
          )
      })
    );
  };

  /**
   * Handler for edit button click
   * @param {any} form - Form object for edit district form
   */
  const editModalRender = (form: any) => {
    return isOpenDeactivateModal ? <Deactivation formName={districtSName.toLowerCase()} /> : <DistrictForm />;
  };

  /**
   * Handler for open consent form
   * @param {object} data - The data object containing the name and index for the consent form
   * @param {string} data.name - The name associated with the consent form
   * @param {number} data.index - The index of the item that requires the consent form
   */
  const handleConsentFormOpen = (data: { name: string; index: number }) => {
    consentFormConfig.current = { ...data, regionId: regionId || '' };
    setOpenConsentForm(true);
  };

  /**
   * Handler for close consent form
   * @callback
   */
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
            buttonLabel={`Add ${districtSName}`}
            header={districtSName}
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={navigateToCreateDistrict}
          >
            <CustomTable
              rowData={districtList}
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
              page={districtCount > APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE ? listParams.page : 0}
              rowsPerPage={listParams.rowsPerPage}
              count={districtCount}
              onRowEdit={openDistrictEditModal}
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
        <DistrictConsentForm
          isOpen={openConsentForm}
          consentFormConfig={consentFormConfig.current}
          handleConsentFormClose={handleConsentFormClose}
        />
        <Modal
          show={isOpenDistrictModal}
          title={isOpenDeactivateModal ? `Deactivate ${districtSName}` : `Edit ${districtSName}`}
          cancelText='Cancel'
          submitText='Submit'
          handleCancel={handleCancelClick}
          handleFormSubmit={!isOpenDeactivateModal ? handleDistrictFormSubmit : handleDeactivate}
          initialValues={!isOpenDeactivateModal ? { district: districtToBeEdited.current } : {}}
          deactivateLabel={!isOpenDeactivateModal ? `Deactivate ${districtSName}` : ''}
          handleDeactivate={showDeactivateModal}
          isDeactivateModal={isOpenDeactivateModal}
          render={editModalRender}
        />
      </div>
    </>
  );
};

export default DistrictList;
