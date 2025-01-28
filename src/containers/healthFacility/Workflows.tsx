import { FormApi } from 'final-form';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Field } from 'react-final-form';
import { useSelector } from 'react-redux';
import Checkbox from '../../components/formFields/Checkbox';
import APPCONSTANTS from '../../constants/appConstants';
import { workflowListSelector } from '../../store/healthFacility/selectors';
import { IClinicalWorkflow as IWorkflow } from '../../store/workflow/types';
import { convertToCaptilize } from '../../utils/validation';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

// Props interface
interface IWorkflowsProps {
  form: FormApi<any, Partial<any>>;
  formName: string;
  submittedData?: any;
  isHFEdit?: boolean;
  workflowEditedData?: {
    customizedWorkflows: number[];
    clinicalWorkflows: number[];
  };
  setWorkFlowEditedData?: ({
    customizedWorkflows,
    clinicalWorkflows
  }: {
    customizedWorkflows: number[];
    clinicalWorkflows: number[];
  }) => void;
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
  pregnancyCheckTimeoutRef?: any
) => {
  const {
    WORKFLOW_MODULE: { clinical },
    WORKFLOW_NAME: { phq4, pregnancy, pregnancyAnc, substanceAbuse, suicideScreener }
  } = APPCONSTANTS;
  /**
   * Filters the clinical workflows without PHQ-4
   */
  const clinicalWorkflowsWOphq4 = clinicalWorkflows.filter(
    (v) => ![substanceAbuse, suicideScreener, phq4].includes(v?.workflowName || '')
  );
  /**
   * Filters the clinical workflows with PHQ-4
   */
  const clinicalWorkflowsWphq4 = clinicalWorkflows
    .filter((v) => [substanceAbuse, suicideScreener, phq4].includes(v?.workflowName || ''))
    .sort((a: any, b: any) => a?.id - b?.id);

  /**
   * Handles the workflow click event
   * @param {any} selectedValue - The selected workflow value
   */
  const onClickWorkflow = (selectedValue: any) => {
    const pregancyTimeOut = setTimeout(() => {
      const isPregnancy = selectedValue?.workflowName === pregnancy;
      const isPregnancyAnc = selectedValue?.workflowName === pregnancyAnc;
      const selectedClinicalWFs: number[] = form?.getState().values.healthFacility.clinicalWorkflows;
      if ((isPregnancy || isPregnancyAnc) && (selectedClinicalWFs || []).includes(selectedValue.id)) {
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
    if (pregnancyCheckTimeoutRef) {
      pregnancyCheckTimeoutRef.current = pregancyTimeOut;
    }

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
                              checked={input.checked || workflow.default}
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

const Workflows: React.FC<IWorkflowsProps> = ({
  form,
  formName,
  isHFEdit = false,
  workflowEditedData = {
    customizedWorkflows: [],
    clinicalWorkflows: []
  },
  setWorkFlowEditedData
}) => {
  const [phq4Selected, setPhq4Selected] = useState(false);
  // Selector hooks
  const workflows: IWorkflow[] = useSelector(workflowListSelector);
  const {
    WORKFLOW_MODULE: { clinical, customized },
    WORKFLOW_NAME: { phq4, substanceAbuse, suicideScreener }
  } = APPCONSTANTS;
  const { isCommunity } = useAppTypeConfigs();

  /**
   * Gets the HF workflow IDs
   * @param {any[]} hfWorkflows - The HF workflow data
   * @param {IWorkflow} workflow - The workflow data
   * @param {string} moduleType - The module type
   * @returns {number | null} The workflow ID or null
   */
  const getHFWorkflowIds = useCallback((hfWorkflows: any[], workflow: IWorkflow, moduleType: string) => {
    if (workflow.moduleType === moduleType) {
      if (hfWorkflows.length) {
        return workflow.id;
      } else {
        if (workflow?.default) {
          return workflow.id;
        }
      }
    }
    return null;
  }, []);

  const mentalHealthTimeout = useRef<any>(null);
  const pregnancyCheckTimeout = useRef<any>(null);

  /**
   * Handles the mental health selection
   */

  const mentalHealthSelection = () => {
    mentalHealthTimeout.current = setTimeout(() => {
      const clinicalWorkflowsWphq4 = workflows.filter((v) =>
        [substanceAbuse, suicideScreener, phq4].includes(v?.workflowName || '')
      );
      const phq4Workflow = clinicalWorkflowsWphq4.find((value) => value.workflowName === phq4);
      const selectedClinicalWFs = form?.getState().values.healthFacility.clinicalWorkflows;
      if ((selectedClinicalWFs || [])?.includes((phq4Workflow || {}).id)) {
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

  /**
   * Initializes the form values
   */
  useEffect(() => {
    if (workflows.length) {
      form.initialize((data: any) => {
        const hfClinicalWorkflows = data?.healthFacility?.rawClinicalWorkflows || [];
        const hfCustomizedWorkflows = data?.healthFacility?.rawCustomizedWorkflows || [];
        const clinicalWorkflow = hfClinicalWorkflows.length ? hfClinicalWorkflows : workflows;
        const newClinicalWorkflow = (newWorkflow: IWorkflow[], moduleType: string) => {
          return newWorkflow
            .map((workflow: IWorkflow) => getHFWorkflowIds(hfClinicalWorkflows, workflow, moduleType))
            .filter(Boolean);
        };
        const defaultWorkflows =
          workflows?.filter((workflow) => workflow.moduleType === clinical && workflow.default)?.map((wf) => wf.id) ||
          [];
        // Preserve existing workflows if they exist
        const existingClinicalWorkflows = form.getState()?.values.healthFacility?.clinicalWorkflows || [];
        const existingCustomizedWorkflows = form.getState()?.values.healthFacility?.customizedWorkflows || [];
        const newData = {
          ...data,
          healthFacility: {
            ...data?.healthFacility,
            clinicalWorkflows:
              isHFEdit && workflowEditedData && workflowEditedData?.clinicalWorkflows
                ? [...workflowEditedData.clinicalWorkflows, ...defaultWorkflows]
                : [...existingClinicalWorkflows, ...newClinicalWorkflow(clinicalWorkflow, clinical)],
            customizedWorkflows:
              isHFEdit && workflowEditedData && workflowEditedData?.customizedWorkflows
                ? workflowEditedData.customizedWorkflows
                : [...existingCustomizedWorkflows, ...newClinicalWorkflow(hfCustomizedWorkflows, customized)]
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
      if (isHFEdit && setWorkFlowEditedData) {
        setWorkFlowEditedData({
          clinicalWorkflows: form.getState().values.healthFacility?.clinicalWorkflows,
          customizedWorkflows: form.getState().values.healthFacility?.customizedWorkflows
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflows]);

  const formClinicalWFsLength = (form?.getState()?.values.healthFacility?.clinicalWorkflows || [])?.length;
  const formCustomizedWFsLength = (form?.getState()?.values.healthFacility?.customizedWorkflows || [])?.length;

  return (
    <>
      {renderWorkflowByModuleType(
        workflows,
        clinical,
        { phq4Selected, setPhq4Selected },
        form,
        mentalHealthSelection,
        pregnancyCheckTimeout
      )}
      {renderWorkflowByModuleType(workflows, customized)}
      {(isCommunity ? formClinicalWFsLength === 0 : formClinicalWFsLength === 0 && formCustomizedWFsLength === 0) && (
        <div className='col-sm-6 col-12'>
          <div className='mb-0dot5 input-field-label text-danger'>Select atleast one workflows</div>
        </div>
      )}
    </>
  );
};

export default Workflows;
