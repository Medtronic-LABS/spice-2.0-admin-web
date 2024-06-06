import { Field } from 'react-final-form';
import Checkbox from '../../components/formFields/Checkbox';
import { convertToCaptilize, required } from '../../utils/validation';
import { useSelector } from 'react-redux';
import { workflowListSelector, workflowLoadingSelector } from '../../store/healthFacility/selectors';
import Loader from '../../components/loader/Loader';
import { IWorkflow } from '../../store/healthFacility/types';
import { FormApi } from 'final-form';
interface IWorkflowsProps {
  form: FormApi<any, Partial<any>>;
  formName: string;
  submittedData?: any;
}

const Workflows = (props: IWorkflowsProps) => {
  const workflows = useSelector(workflowListSelector);
  const isWorkflowLoading = useSelector(workflowLoadingSelector);
  const viewScreenError = required(props.form?.getState()?.values?.healthFacility?.workflows);
  return (
    <>
      {isWorkflowLoading && <Loader />}
      <div className='row'>
        {(workflows || []).map((workflowVal: IWorkflow) => (
          <div key={workflowVal.name} className='col-sm-6 col-12'>
            <Field
              id={Number(workflowVal.id)}
              name={`${props.formName}.workflows`}
              type='checkbox'
              value={workflowVal.id}
              render={({ input }) => <Checkbox {...input} label={convertToCaptilize(workflowVal.name)} />}
            />
          </div>
        ))}
      </div>
      {viewScreenError && <p className={'text-danger mt-1'}>Please select a clinical workflow</p>}
    </>
  );
};

export default Workflows;
