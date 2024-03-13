import { Field } from 'react-final-form';
import Checkbox from '../../components/formFields/Checkbox';
import { convertToCaptilize } from '../../utils/validation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflowListRequest } from '../../store/healthFacility/actions';
import { useParams } from 'react-router';
import { workflowListSelector, workflowLoadingSelector } from '../../store/healthFacility/selectors';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS from '../../constants/appConstants';
import Loader from '../../components/loader/Loader';
import { IWorkflow } from '../../store/healthFacility/types';

const Workflows = () => {
  const dispatch = useDispatch();
  const workflows = useSelector(workflowListSelector);
  const isWorkflowLoading = useSelector(workflowLoadingSelector);
  const { regionId } = useParams<{ regionId: string }>();

  useEffect(() => {
    if (!workflows.length) {
      dispatch(
        fetchWorkflowListRequest({
          countryId: Number(regionId),
          failureCb: (error) =>
            toastCenter.error(
              ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.CLINICAL_WORKFLOW_FETCH_SUCCESS)
            )
        })
      );
    }
  }, [dispatch, regionId, workflows.length]);

  const onClickWorkflow = (workflow: any) => {
    // To be added later
  };

  return (
    <>
      {isWorkflowLoading && <Loader />}
      <div className='row'>
        {(workflows || []).map((workflowVal: IWorkflow) => {
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
    </>
  );
};

export default Workflows;
