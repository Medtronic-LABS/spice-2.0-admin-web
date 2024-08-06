import React, { useMemo } from 'react';
import { Field } from 'react-final-form';
import Checkbox from '../../components/formFields/Checkbox';
import { convertToCaptilize, required } from '../../utils/validation';
import { useSelector } from 'react-redux';
import { workflowListSelector, workflowLoadingSelector } from '../../store/healthFacility/selectors';
import Loader from '../../components/loader/Loader';
import { IWorkflow } from '../../store/healthFacility/types';
import { FormApi } from 'final-form';
import APPCONSTANTS from '../../constants/appConstants';

// Props interface
interface IWorkflowsProps {
  form: FormApi<any, Partial<any>>;
  formName: string;
  submittedData?: any;
}

// Memoized WorkflowCheckbox component
const WorkflowCheckbox: React.FC<{ workflow: IWorkflow; formName: string }> = React.memo(({ workflow, formName }) => {
  return (
    <div key={workflow.id} className='col-sm-6 col-12'>
      <Field
        id={Number(workflow.id)}
        name={`${formName}.workflows`}
        type='checkbox'
        value={workflow.id}
        render={({ input }) => <Checkbox {...input} label={convertToCaptilize(workflow.name)} />}
      />
    </div>
  );
});

const Workflows: React.FC<IWorkflowsProps> = ({ form, formName }) => {
  // Selector hooks
  const workflows: IWorkflow[] = useSelector(workflowListSelector);
  const isWorkflowLoading = useSelector(workflowLoadingSelector);

  // Error handling for form submission
  const viewScreenError = required(form?.getState()?.values?.healthFacility?.workflows);

  // Memoization for workflow lists
  const [clinicalWorkflows, customizedWorkflows] = useMemo(() => {
    const clinical = (workflows || []).filter(
      (workflow: IWorkflow) => workflow.moduleType === APPCONSTANTS.WORKFLOW_MODULE.clinical
    );
    const customized = (workflows || []).filter(
      (workflow: IWorkflow) => workflow.moduleType === APPCONSTANTS.WORKFLOW_MODULE.customized
    );
    return [clinical, customized];
  }, [workflows]);

  return (
    <>
      {isWorkflowLoading ? <Loader /> : null}
      <div className='row'>
        <p>{APPCONSTANTS.CLINICAL_WORKFLOW}</p>
        {clinicalWorkflows.map((workflow) => (
          <WorkflowCheckbox key={workflow.name} workflow={workflow} formName={formName} />
        ))}
      </div>

      <div className='row py-2'>
        <p>{customizedWorkflows.length ? APPCONSTANTS.CUSTOMIZED_WORKFLOW : ''}</p>
        {customizedWorkflows.map((workflow) => (
          <WorkflowCheckbox key={workflow.name} workflow={workflow} formName={formName} />
        ))}
      </div>
      {viewScreenError && <p className='text-danger mt-1'>{APPCONSTANTS.WORKFLOW_SELECT_ERROR_MESSAGE}</p>}
    </>
  );
};

export default Workflows;
