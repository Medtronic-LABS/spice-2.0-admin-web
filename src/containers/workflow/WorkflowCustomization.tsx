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
import { IWorkflow } from '../../store/healthFacility/types';
import { getAppTypeSelector } from '../../store/user/selectors';

/**
 * Interface for route parameters
 */
interface IMatchParams {
  regionId?: string;
  tenantId: string;
  form: string;
}

/**
 * Interface for modal state
 */
interface IModalState {
  isOpen: boolean;
  isEdit: boolean;
  data?: IClinicalWorkflow;
}

/**
 * WorkflowCustomization component for managing clinical workflows
 * @returns {React.ReactElement} The rendered component
 */
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
  const clinicalWorkflows: IWorkflow[] = useSelector(getClinicalWorkflowSelector);
  const clinicalWorkflowsCount = useSelector(getClinicalWorkflowsCountSelector);
  const loading: boolean = useSelector(workflowLoadingSelector);
  const appTypes = useSelector(getAppTypeSelector);

  const { regionId, tenantId } = useParams<IMatchParams>();

  /**
   * Fetches clinical workflows
   */
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
  }, [dispatch, regionId, listParams.page, listParams.rowsPerPage, tenantId, listParams.searchTerm]);

  useEffect(() => {
    if (clinicalWorkflows.length) {
      dispatch(resetClinicalWorkflow());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, resetClinicalWorkflow]);

  useEffect(() => {
    getClinicalWorkflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listParams]);

  /**
   * Handles row edit action
   * @param {Object} params - Edit parameters
   * @param {number} params.index - Index of the edited row
   * @param {string} params.id - ID of the edited workflow
   * @param {string} params.workflowName - Name of the edited workflow
   */
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

  /**
   * Opens the add workflow modal
   */
  const addWorkFlow = () => {
    setWorkflowModal({ isOpen: true, isEdit: false });
  };

  /**
   * Closes the workflow modal
   */
  const closeWorkflowModal = () => {
    setWorkflowModal({ isOpen: false, isEdit: false, data: {} as IClinicalWorkflow });
  };

  /**
   * Handles the submission of a new workflow
   * @param {IClinicalWorkflow} workflow - The new workflow data
   */
  const handleAddWorkflowSubmit = (workflow: IClinicalWorkflow) => {
    dispatch(
      createWorkflowModule({
        data: {
          ...workflow,
          name: workflow.name.replace(/\s+/g, ' ').trim(),
          countryId: regionId || '',
          tenantId,
          appTypes
        },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.WORKFLOW_CREATE_SUCCESS);
          closeWorkflowModal();
          handlePage(1);
        },
        failureCb: (e) => {
          toastCenter.error(
            ...getErrorToastArgs(
              e,
              APPCONSTANTS.ERROR,
              e.message === APPCONSTANTS.WORKFLOW_ALREADY_EXISTS ? e.message : APPCONSTANTS.WORKFLOW_CREATE_FAIL
            )
          );
        }
      })
    );
  };

  /**
   * Opens the edit workflow modal
   * @param {IClinicalWorkflow} data - The workflow data to edit
   */
  const handleWorkflowEditOpen = (data: IClinicalWorkflow) => {
    setWorkflowModal({ isOpen: true, isEdit: true, data });
  };

  /**
   * Handles the submission of workflow edits
   * @param {IClinicalWorkflow} workflow - The edited workflow data
   */
  const handleEditWorkflowSubmit = (workflow: IClinicalWorkflow) => {
    const data = { id: workflow.id, viewScreens: workflow.viewScreens, tenantId, appTypes };
    dispatch(
      updateWorkflowModule({
        data,
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.WORKFLOW_UPDATE_SUCCESS);
          getClinicalWorkflow();
          closeWorkflowModal();
        },
        failureCb: (e: any) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.WORKFLOW_UPDATE_FAIL));
        }
      })
    );
  };

  /**
   * Handles workflow deletion
   * @param {Object} params - Delete parameters
   * @param {Object} params.data - The workflow data to delete
   * @param {string} params.data.id - ID of the workflow to delete
   * @param {string} params.data.tenant_id - Tenant ID of the workflow
   */
  const handleWorkflowDelete = ({ data: { id, tenant_id } }: any) => {
    dispatch(
      deleteWorkflowModule({
        data: { id, tenantId },
        successCb: () => {
          toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.WORKFLOW_DELETE_SUCCESS);
          handlePage(
            listParams.page > 1 &&
              Math.ceil(clinicalWorkflowsCount / listParams.rowsPerPage) === listParams.page &&
              (clinicalWorkflowsCount - 1) % listParams.rowsPerPage === 0
              ? listParams.page - 1
              : listParams.page
          );
        },
        failureCb: (e: any) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.WORKFLOW_DELETE_ERROR))
      })
    );
  };

  /**
   * Formats the workflow name for display
   * @param {Object} workflow - The workflow object
   * @returns {string} The formatted workflow name
   */
  const formatName = (workflow: any): string => `${workflow.name.charAt(0).toUpperCase() + workflow.name.slice(1)}`;

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
          confirmationTitle={APPCONSTANTS.WORKFLOW_DELETE_CONFIRMATION}
          deleteTitle={APPCONSTANTS.WORKFLOW_DELETE_TITLE}
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
