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

  const openAddLabTest = () => {
    setLabTestModalState({ isOpen: true, isEdit: false, isNextClicked: false });
  };

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

  const handleEdit = (data: any) => {
    setLabTestModalState({ isOpen: true, isEdit: true, data, isNextClicked: false });
  };

  const onNextClicked = (data: any, customizeClicked?: boolean) => {
    dispatch(
      validateLabtestRequest({
        name: data.testName,
        countryId: Number(props.match.params.regionId || 0),
        successCb: () => {
          if (!customizeClicked) {
            setLabTestModalState({ ...labTestModalState, isNextClicked: true });
          }
          props.history.push(
            PROTECTED_ROUTES.customizeLabTest
              .replace(':tenantId', tenantId)
              .replace(':regionId', regionId as string)
              .replace(':labTestName', encodeURIComponent(data.testName))
              .replace(':identifier', data.uniqueName || camelCase(data.testName) + Date.now())
              .replace(':testId', data?.id || null),
            { codeDetails: data.codeDetails }
          );
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
  };

  const handleEditLabTestSubmit = (dataParams: any) => {
    const data = {
      ...dataParams,
      formInput: undefined,
      testName: dataParams.testName,
      codeDetails: { code: dataParams.codeDetails?.code, url: dataParams.codeDetails?.url }
    };
    dispatch(
      labtestCustomization({
        data,
        successCb: () => {
          toastCenter.success(
            APPCONSTANTS.SUCCESS,
            APPCONSTANTS.FORM_CUSTOMIZATION_SUCCESS.replace(
              'Dynamic',
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
              APPCONSTANTS.FORM_CUSTOMIZATION_ERROR.replace('dynamic', dataParams.testName)
            )
          );
        }
      })
    );
  };

  const closeLabTestModal = () => {
    setLabTestModalState({ isOpen: false, isEdit: false, data: {}, isNextClicked: false });
  };

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
            header='Lab Test List'
            isSearch={true}
            onSearch={handleSearch}
            onButtonClick={openAddLabTest}
          >
            <CustomTable
              rowData={labTestList}
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
