import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Field } from 'react-final-form';
import Checkbox from '../../components/formFields/Checkbox';
import { convertToCaptilize } from '../../utils/validation';
import { useSelector } from 'react-redux';
import { workflowListSelector } from '../../store/healthFacility/selectors';
import { IClinicalWorkflow as IWorkflow } from '../../store/workflow/types';
import { FormApi } from 'final-form';
import APPCONSTANTS from '../../constants/appConstants';

// Props interface
interface IWorkflowsProps {
  form: FormApi<any, Partial<any>>;
  formName: string;
  submittedData?: any;
  isHFEdit?: boolean;
}

/**
 * Renders the workflow fields for healthFacility form
 * @returns {React.ReactElement}
 */
const renderWorkflowByModuleType = (
  clinicalWorkflows: IWorkflow[],
  moduleType: string,
  selectedState?: any,
  form?: any,
  mentalHealthSelection?: () => any,
  pregnancyCheckTimeout?: any
) => {
  const {
    WORKFLOW_MODULE: { clinical },
    WORKFLOW_NAME: { phq4, pregnancy, pregnancyAnc, substanceAbuse, suicideScreener }
  } = APPCONSTANTS;
  const clinicalWorkflowsWOphq4 = clinicalWorkflows.filter(
    (v) => ![substanceAbuse, suicideScreener, phq4].includes(v?.workflowName || '')
  );
  const clinicalWorkflowsWphq4 = clinicalWorkflows
    .filter((v) => [substanceAbuse, suicideScreener, phq4].includes(v?.workflowName || ''))
    .sort((a: any, b: any) => a?.id - b?.id);

  const onClickWorkflow = (selectedValue: any) => {
    pregnancyCheckTimeout = setTimeout(() => {
      const isPregnancy = selectedValue?.workflowName === pregnancy;
      const isPregnancyAnc = selectedValue?.workflowName === pregnancyAnc;
      const selectedClinicalWFs: number[] = form?.getState().values.healthFacility.clinicalWorkflows;
      if ((isPregnancy || isPregnancyAnc) && selectedClinicalWFs.includes(selectedValue.id)) {
        const idToRemove = clinicalWorkflowsWOphq4.find(
          (v) => v?.workflowName === (isPregnancy ? pregnancyAnc : pregnancy)
        );
        if (idToRemove) {
          const selectedWOPANC = selectedClinicalWFs.filter((v) => Number(idToRemove?.id) !== v);
          form.batch(() => {
            form.change(`healthFacility.clinicalWorkflows`, selectedWOPANC);
          });
        }
      }
    }, 0);

    if ([substanceAbuse, suicideScreener, phq4].includes(selectedValue?.workflowName || '') && mentalHealthSelection) {
      mentalHealthSelection();
    }
  };
  const workflowsToRender = [clinicalWorkflowsWOphq4, clinicalWorkflowsWphq4];
  const renderedWorkFlowLength = workflowsToRender
    ?.flat()
    ?.filter((renderWorkflow: any) => renderWorkflow?.moduleType === moduleType)?.length;

  return renderedWorkFlowLength > 0 ? (
    <div className='col-12 mb-1'>
      <div className='mb-0dot5 input-field-label'>{`${convertToCaptilize(moduleType)} Workflows involved`}</div>
      {workflowsToRender.map((clinicalWorkflow, i) => {
        const checkPhq4Condition = (workflow: any) =>
          [substanceAbuse, suicideScreener, phq4].includes(workflow?.workflowName || '') &&
          workflow.workflowName !== phq4 &&
          !selectedState?.phq4Selected;
        return (
          <Fragment key={i}>
            <div className={`row ${i === 1 ? 'pt-1' : ''}`}>
              {clinicalWorkflow.map((workflow) => {
                if (workflow?.moduleType === moduleType) {
                  return (
                    <div key={workflow.name} className='col-sm-6 col-12'>
                      <Field
                        id={Number(workflow.id)}
                        name={`healthFacility.${moduleType}Workflows`}
                        key={workflow.name}
                        type='checkbox'
                        value={workflow.id}
                        render={({ input }) => {
                          return (
                            <Checkbox
                              {...input}
                              label={convertToCaptilize(workflow.name)}
                              disabled={workflow.default || checkPhq4Condition(workflow)}
                              readOnly={moduleType === clinical && checkPhq4Condition(workflow)}
                              onClick={() => onClickWorkflow(workflow)}
                              checked={input.checked}
                            />
                          );
                        }}
                      />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </Fragment>
        );
      })}
    </div>
  ) : (
    <div />
  );
};

const Workflows: React.FC<IWorkflowsProps> = ({ form, formName, isHFEdit = false }) => {
  const [phq4Selected, setPhq4Selected] = useState(false);
  // Selector hooks
  const workflows: IWorkflow[] = useSelector(workflowListSelector);
  const {
    WORKFLOW_MODULE: { clinical, customized },
    WORKFLOW_NAME: { phq4, substanceAbuse, suicideScreener }
  } = APPCONSTANTS;

  const getHFWorkflowIds = useCallback((hfWorkflows: any[], workflow: IWorkflow, moduleType: string) => {
    if (workflow.moduleType === moduleType) {
      if (hfWorkflows.length) {
        return workflow.id;
      } else if (workflow?.default) {
        return workflow.id;
      }
    }
    return null;
  }, []);

  const mentalHealthTimeout = useRef<any>(null);
  const pregnancyCheckTimeout = useRef<any>(null);

  const mentalHealthSelection = () => {
    mentalHealthTimeout.current = setTimeout(() => {
      const clinicalWorkflowsWphq4 = workflows.filter((v) =>
        [substanceAbuse, suicideScreener, phq4].includes(v?.workflowName || '')
      );
      const phq4Workflow = clinicalWorkflowsWphq4.find((value) => value.workflowName === phq4);
      const selectedClinicalWFs = form?.getState().values.healthFacility.clinicalWorkflows;
      if (selectedClinicalWFs?.includes((phq4Workflow || {}).id)) {
        setPhq4Selected(true);
      } else {
        const substanceAbuseId = clinicalWorkflowsWphq4
          .filter((value) => [substanceAbuse, suicideScreener].includes(value.workflowName || ''))
          .map((value) => value.id);
        const myArray = selectedClinicalWFs?.filter((el: any) => !substanceAbuseId.includes(el));
        form.batch(() => {
          form.change(`healthFacility.clinicalWorkflows`, myArray);
        });
        setPhq4Selected(false);
      }
    }, 0);
  };

  useEffect(() => {
    if (workflows.length) {
      form.initialize((data: any) => {
        const hfClinicalWorkflows = data?.healthFacility?.clinicalWorkflows || [];
        const hfCustomizedWorkflows = data?.healthFacility?.customizedWorkflows || [];
        const clinicalWorkflow = hfClinicalWorkflows.length ? hfClinicalWorkflows : workflows;
        const newClinicalWorkflow = (newWorkflow: IWorkflow[], moduleType: string) =>
          newWorkflow
            .map((workflow: IWorkflow) => getHFWorkflowIds(hfClinicalWorkflows, workflow, moduleType))
            .filter(Boolean);
        const newData = {
          ...data,
          healthFacility: {
            ...data?.healthFacility,
            clinicalWorkflows: newClinicalWorkflow(clinicalWorkflow, clinical),
            customizedWorkflows: newClinicalWorkflow(hfCustomizedWorkflows, customized)
          }
        };
        mentalHealthSelection();
        return newData;
      });
    }
    const pregnancyCheckTimeoutVar = pregnancyCheckTimeout.current;
    return () => {
      window.clearInterval(mentalHealthTimeout.current);
      window.clearInterval(pregnancyCheckTimeoutVar);
      if (!isHFEdit) {
        form.change(`${formName}.clinicalWorkflows`, undefined);
        form.change(`${formName}.customizedWorkflows`, undefined);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflows]);

  return (
    <>
      {renderWorkflowByModuleType(
        workflows,
        clinical,
        { phq4Selected, setPhq4Selected },
        form,
        mentalHealthSelection,
        pregnancyCheckTimeout.current
      )}
      {renderWorkflowByModuleType(workflows, customized)}
    </>
  );
};

export default Workflows;
