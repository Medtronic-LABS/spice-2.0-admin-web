import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { PROTECTED_ROUTES } from '../../constants/route';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import APPCONSTANTS from '../../constants/appConstants';
import { ReactComponent as CustomizeIcon } from '../../assets/images/account-customize.svg';
import {
  fetchLabtestsRequest,
  deleteLabtestRequest,
  labtestCustomization,
  validateLabtestRequest
} from '../../store/labTest/actions';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { labtestLoadingSelector, labtestsSelector, labtestCountSelector } from '../../store/labTest/selectors';
import { ILabTest } from '../../store/labTest/types';
import { formatDate } from '../../utils/validation';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import ModalForm from '../../components/modal/ModalForm';
import LabtestModalForm from './LabtestModalForm';
import { camelCase } from 'lodash';
import { decodeURIText } from '../../utils/commonUtils';

interface IMatchParams {
  regionId: string;
  tenantId: string;
}

interface IModalState {
  isOpen: boolean;
  isEdit: boolean;
  isNextClicked: boolean;
  data?: any;
}

export interface ILabTestsEditFormValues {
  labTest: ILabTest;
}

interface ICodeDetails {
  code: string;
  url: string;
}

export interface IRouteDataForCustomizLabTest {
  id?: any; // if create new customize lab test id will be null
  uniqueName: string;
  testName: string;
  formInput: string; // JSON string, will need to be parsed if used as an object
  countryId: number;
  tenantId: string;
  codeDetails: ICodeDetails;
}

interface IMatchProps extends RouteComponentProps<IMatchParams> {}

/**
 * Shows the lab test list
 * @returns {React.ReactElement}
 */
const LabTestList = (props: IMatchProps): React.ReactElement => {
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const dispatch = useDispatch();
  const loading = useSelector(labtestLoadingSelector);
  const labTestList = useSelector(labtestsSelector);
  const labTestCount = useSelector(labtestCountSelector);
  const [labTestModalState, setLabTestModalState] = useState<IModalState>({
    isOpen: false,
    isEdit: false,
    isNextClicked: false,
    data: {}
  });

  const { regionId, tenantId } = useParams<IMatchParams>();

  /**
   * Fetches lab test details
   */
  const fetchDetails = useCallback(() => {
    dispatch(
      fetchLabtestsRequest({
        data: {
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: listParams.rowsPerPage,
          searchTerm: listParams.searchTerm,
          countryId: props.match.params.regionId
        },
        failureCb: (e) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.LABTEST_LIST_FETCH_ERROR))
      })
    );
  }, [dispatch, props.match.params.regionId, listParams]);

  useEffect(() => {
    fetchDetails();
  }, [dispatch, fetchDetails, props.match.params.tenantId]);

  /**
   * Opens the add lab test modal
   */
  const openAddLabTest = () => {
    setLabTestModalState({ isOpen: true, isEdit: false, isNextClicked: false });
  };

  /**
   * Handles lab test deletion
   * @param {{ data: ILabTest }} param0 - Object containing lab test data
   */
  const handleLabTestDelete = ({ data }: { data: ILabTest }) => {
    dispatch(
      deleteLabtestRequest({
        id: Number(data.id),
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.LABTEST_DELETE_SUCCESS);
          handlePage(APPCONSTANTS.INITIAL_PAGE);
        },
        failureCb: (e) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.LABTEST_DELETE_ERROR))
      })
    );
  };

  /**
   * Opens the edit lab test modal
   * @param {any} data - The lab test data to edit
   */
  const handleEdit = (data: any) => {
    setLabTestModalState({ isOpen: true, isEdit: true, data, isNextClicked: false });
  };

  /**
   * Routes to the lab test customization page
   * @param {any} data - The lab test data
   */
  const routeToLabtestCustomizationPage = (data: IRouteDataForCustomizLabTest) => {
    props.history.push(
      PROTECTED_ROUTES.customizeLabTest
        .replace(':tenantId', tenantId)
        .replace(':regionId', regionId as string)
        .replace(':labTestName', encodeURIComponent(data.testName.trim()))
        .replace(':identifier', data.uniqueName || camelCase(data.testName.trim()) + Date.now())
        .replace(':testId', data?.id || null),
      { codeDetails: data.codeDetails }
    );
  };

  /**
   * Handles the next button click in the lab test modal
   * @param {any} data - The lab test data
   * @param {boolean} customizeClicked - Whether the customize button was clicked
   */
  const onNextClicked = (data: any, customizeClicked?: boolean) => {
    if (!customizeClicked) {
      setLabTestModalState({ ...labTestModalState, isNextClicked: true });
      dispatch(
        validateLabtestRequest({
          name: data.testName.trim(),
          countryId: Number(props.match.params.regionId || 0),
          successCb: () => {
            routeToLabtestCustomizationPage(data);
          },
          failureCb: (error: any) => {
            toastCenter.error(
              ...getErrorToastArgs(
                error,
                APPCONSTANTS.ERROR,
                APPCONSTANTS.FORM_CUSTOMIZATION_ERROR.replace('dynamic', data.testName).replace('update', 'create')
              )
            );
          }
        })
      );
    } else {
      routeToLabtestCustomizationPage(data);
    }
  };

  /**
   * Handles the submission of lab test edits
   * @param {any} dataParams - The edited lab test data
   */
  const handleEditLabTestSubmit = (dataParams: any) => {
    let formInput = JSON.parse(dataParams.formInput || '');
    const formLayout = (formInput?.formLayout || []).map((item: any) => {
      if (item.viewType === 'CardView') {
        item.title = dataParams.testName;
      }
      return item;
    });
    formInput = { ...formInput, formLayout };
    const data = {
      ...dataParams,
      formInput: JSON.stringify(formInput),
      testName: dataParams.testName.trim(),
      codeDetails: { code: dataParams.codeDetails?.code, url: dataParams.codeDetails?.url }
    };
    dispatch(
      labtestCustomization({
        data,
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            APPCONSTANTS.FORM_CUSTOMIZATION_SUCCESS.replace(
              'Dynamic customization',
              dataParams.testName.charAt(0).toUpperCase() + dataParams.testName.slice(1)
            )
          );
          fetchDetails();
          closeLabTestModal();
        },
        failureCb: (e) => {
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              APPCONSTANTS.FORM_CUSTOMIZATION_ERROR.replace('dynamic customization', dataParams.testName)
            )
          );
        }
      })
    );
  };

  /**
   * Closes the lab test modal
   */
  const closeLabTestModal = () => {
    setLabTestModalState({ isOpen: false, isEdit: false, data: {}, isNextClicked: false });
  };

  /**
   * Formats the updated date for display
   * @param {ILabTest} data - The lab test data
   * @returns {string} The formatted date string
   */
  const formatUpdatedAt = (data: ILabTest) => {
    if (data?.updatedAt) {
      return formatDate(data.updatedAt, { month: 'short', format: 'YYYY-MM-DD' });
    } else {
      return '';
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            buttonLabel='Add Lab Test'
            header='Lab/Imaging Database'
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={openAddLabTest}
          >
            <CustomTable
              rowData={labTestList.map((labTestRowData: ILabTest) => ({
                ...labTestRowData,
                testName: labTestRowData.testName ? decodeURIText(labTestRowData.testName) : ''
              }))}
              columnsDef={[
                {
                  id: 1,
                  name: 'testName',
                  label: 'NAME',
                  width: '140px'
                },
                {
                  id: 2,
                  name: 'displayOrder',
                  label: 'DISPLAY ORDER',
                  width: '125px'
                },
                {
                  id: 3,
                  name: 'updated_at',
                  label: 'UPDATED ON',
                  width: '125px',
                  cellFormatter: formatUpdatedAt
                }
              ]}
              isEdit={true}
              isDelete={true}
              onCustomConfirmed={(data) => onNextClicked(data, true)}
              CustomIcon={CustomizeIcon}
              customTitle='Customize Lab Test'
              isCustom={true}
              customIconStyle={{ width: 16 }}
              page={listParams.page}
              rowsPerPage={listParams.rowsPerPage}
              count={labTestCount}
              onRowEdit={handleEdit}
              onDeleteClick={handleLabTestDelete}
              confirmationTitle={APPCONSTANTS.LABTEST_DELETE_CONFIRMATION}
              deleteTitle={APPCONSTANTS.LABTEST_DELETE_TITLE}
              handlePageChange={handlePage}
            />
          </DetailCard>
        </div>
      </div>
      <ModalForm
        show={labTestModalState.isOpen}
        title={`${labTestModalState.isEdit ? 'Edit' : 'Add'} Lab Test`}
        cancelText='Cancel'
        submitText={labTestModalState.isEdit ? 'Submit' : 'Next'}
        handleCancel={closeLabTestModal}
        handleFormSubmit={labTestModalState.isEdit ? handleEditLabTestSubmit : onNextClicked}
        initialValues={labTestModalState.isEdit ? labTestModalState.data : {}}
        render={(form) => <LabtestModalForm isEdit={labTestModalState.isEdit} form={form} />}
        size='modal-lg'
      />
    </>
  );
};

export default LabTestList;
