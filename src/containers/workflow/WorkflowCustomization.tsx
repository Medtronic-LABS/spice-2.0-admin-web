import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import ModalForm from '../../components/modal/ModalForm';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  createWorkflowModule,
  fetchClinicalWorkflow,
  updateWorkflowModule,
  deleteWorkflowModule,
  resetClinicalWorkflow
} from '../../store/workflow/actions';
import {
  workflowLoadingSelector,
  getClinicalWorkflowsCountSelector,
  getClinicalWorkflowSelector
} from '../../store/workflow/selectors';
import { IClinicalWorkflow } from '../../store/workflow/types';
import { convertToCaptilize } from '../../utils/validation';
import WorkflowForm from './WorkflowForm';
import { ReactComponent as CustomizeIcon } from '../../assets/images/account-customize.svg';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import Loader from '../../components/loader/Loader';

interface IMatchParams {
  regionId?: string;
  tenantId: string;
  form: string;
}

interface IModalState {
  isOpen: boolean;
  isEdit: boolean;
  data?: IClinicalWorkflow;
}

const WorkflowCustomization = (): React.ReactElement => {
  const { WORKFLOW_MODULE } = APPCONSTANTS;
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const dispatch = useDispatch();
  const history = useHistory();
  const [workflowModal, setWorkflowModal] = useState<IModalState>({
    isOpen: false,
    isEdit: false,
    data: {} as IClinicalWorkflow
  });
  const clinicalWorkflows: any = useSelector(getClinicalWorkflowSelector);
  const clinicalWorkflowsCount = useSelector(getClinicalWorkflowsCountSelector);
  const loading: boolean = useSelector(workflowLoadingSelector);

  const { regionId, tenantId } = useParams<IMatchParams>();

  const getClinicalWorkflow = useCallback(() => {
    if (regionId) {
      dispatch(
        fetchClinicalWorkflow({
          countryId: regionId || '',
          tenantId,
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: listParams.rowsPerPage,
          searchTerm: listParams.searchTerm
        })
      );
    }
  }, [dispatch, regionId, listParams, tenantId]);

  useEffect(() => {
    if (clinicalWorkflows.length) {
      dispatch(resetClinicalWorkflow());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, resetClinicalWorkflow]);

  useEffect(() => {
    getClinicalWorkflow();
  }, [getClinicalWorkflow]);

  const handleRowEdit = ({ index, id, workflowName }: { index: number; id: string; workflowName: string }) => {
    history.push(
      PROTECTED_ROUTES.workflowCustomization
        .replace(':tenantId', tenantId)
        .replace(':regionId', regionId as string)
        .replace(':form', encodeURIComponent(clinicalWorkflows[index].name))
        .replace(':clinicalWorkflowId', id)
        .replace(':workflowId', encodeURIComponent(workflowName))
    );
  };

  const addWorkFlow = () => {
    setWorkflowModal({ isOpen: true, isEdit: false });
  };
  const closeWorkflowModal = () => {
    setWorkflowModal({ isOpen: false, isEdit: false, data: {} as IClinicalWorkflow });
  };
  const handleAddWorkflowSubmit = (account: IClinicalWorkflow) => {
    dispatch(
      createWorkflowModule({
        data: { ...account, name: account.name.replace(/\s+/g, ' ').trim(), countryId: regionId || '', tenantId },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ACCOUNT_WORKFLOW_MODULE_CREATE_SUCCESS);
          closeWorkflowModal();
          handlePage(1);
        },
        failureCb: (e) => {
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              e.message === APPCONSTANTS.ACCOUNT_WORKFLOW_ALREADY_EXISTS
                ? e.message
                : APPCONSTANTS.ACCOUNT_WORKFLOW_MODULE_CREATE_FAIL
            )
          );
        }
      })
    );
  };

  const handleWorkflowEditOpen = (data: IClinicalWorkflow) => {
    setWorkflowModal({ isOpen: true, isEdit: true, data });
  };

  const handleEditWorkflowSubmit = (account: IClinicalWorkflow) => {
    const data = { id: account.id, viewScreens: account.viewScreens, tenantId };
    dispatch(
      updateWorkflowModule({
        data,
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ACCOUNT_WORKFLOW_MODULE_UPDATE_SUCCESS);
          getClinicalWorkflow();
          closeWorkflowModal();
        },
        failureCb: (e: any) => {
          toastCenter.error(
            ...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.ACCOUNT_WORKFLOW_MODULE_UPDATE_FAIL)
          );
        }
      })
    );
  };

  const handleWorkflowDelete = ({ data: { id, tenant_id } }: any) => {
    dispatch(
      deleteWorkflowModule({
        data: { id, tenantId },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.ACCOUNT_WORKFLOW_DELETE_SUCCESS);
          handlePage(
            listParams.page > 1 &&
              Math.ceil(clinicalWorkflowsCount / listParams.rowsPerPage) === listParams.page &&
              (clinicalWorkflowsCount - 1) % listParams.rowsPerPage === 0
              ? listParams.page - 1
              : listParams.page
          );
        },
        failureCb: (e: any) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.ACCOUNT_WORKFLOW_DELETE_ERROR))
      })
    );
  };

  const formatName = (account: any) => `${account.name.charAt(0).toUpperCase() + account.name.slice(1)}`;

  return (
    <div className='col-12'>
      <DetailCard
        header='Workflow Customization'
        buttonLabel='Add Workflow'
        onButtonClick={addWorkFlow}
        isSearch={true}
        onSearch={handleSearch}
      >
        <CustomTable
          rowData={clinicalWorkflows}
          columnsDef={[
            {
              id: 1,
              name: 'name',
              label: 'Name',
              width: '200px',
              cellFormatter: formatName
            },
            {
              id: 2,
              name: 'moduleType',
              label: 'Type',
              width: '200px',
              cellFormatter: (clinicalWorkflow: IClinicalWorkflow) =>
                convertToCaptilize(clinicalWorkflow?.moduleType || '')
            }
          ]}
          actionFormatter={{
            hideEditIcon: (rowData: IClinicalWorkflow) => rowData.moduleType === WORKFLOW_MODULE.clinical,
            hideDeleteIcon: (rowData: IClinicalWorkflow) => rowData.moduleType === WORKFLOW_MODULE.clinical,
            hideCustomIcon: (rowData: IClinicalWorkflow) => rowData.moduleType === WORKFLOW_MODULE.clinical
          }}
          isEdit={true}
          onRowEdit={handleWorkflowEditOpen}
          onCustomConfirmed={handleRowEdit}
          CustomIcon={CustomizeIcon}
          customTitle='Customize Workflow'
          isCustom={true}
          customIconStyle={{ width: 16 }}
          isDelete={true}
          onDeleteClick={handleWorkflowDelete}
          confirmationTitle={APPCONSTANTS.ACCOUNT_WORKFLOW_DELETE_CONFIRMATION}
          deleteTitle={APPCONSTANTS.ACCOUNT_WORKFLOW_DELETE_TITLE}
          page={listParams.page}
          rowsPerPage={listParams.rowsPerPage}
          count={clinicalWorkflowsCount}
          handlePageChange={handlePage}
        />
      </DetailCard>
      <ModalForm
        show={workflowModal.isOpen}
        title={`${workflowModal.isEdit ? 'Edit' : 'Add'} Workflow`}
        cancelText='Cancel'
        submitText='Submit'
        handleCancel={closeWorkflowModal}
        handleFormSubmit={workflowModal.isEdit ? handleEditWorkflowSubmit : handleAddWorkflowSubmit}
        initialValues={workflowModal.isEdit ? workflowModal.data : {}}
        render={(form) => <WorkflowForm isEdit={workflowModal.isEdit} form={form} />}
        size='modal-lg'
      />
      {loading && (
        <div className={`d-flex align-items-center justify-content-center mt-2dot5`}>
          <Loader isFullScreen={true} className='translate-x-minus50' />
        </div>
      )}
    </div>
  );
};

export default WorkflowCustomization;
