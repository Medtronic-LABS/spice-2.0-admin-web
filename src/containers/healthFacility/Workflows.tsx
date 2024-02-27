import { Field } from 'react-final-form';
import Checkbox from '../../components/formFields/Checkbox';
import { convertToCaptilize } from '../../utils/validation';

const Workflows = () => {
  const onClickWorkflow = (workflow: any) => {
    //
  };
  return (
    <div className='row'>
      {[
        { name: 'Above 5 (General)', id: '1' },
        { name: 'ICCM', id: '2' },
        { name: 'Under 5 (Age upto 2 months)', id: '3' }
      ].map((workflowVal) => {
        return (
          <div key={workflowVal.name} className='col-sm-6 col-12'>
            <Field
              id={Number(workflowVal.id)}
              name={`account.workflow`}
              key={workflowVal.name}
              type='checkbox'
              value={workflowVal.id}
              render={({ input }) => (
                <Checkbox
                  {...input}
                  checked={true}
                  disabled={true}
                  label={convertToCaptilize(workflowVal.name)}
                  onClick={() => onClickWorkflow(workflowVal)}
                />
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Workflows;
