import { FormApi, Tools } from 'final-form';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FormContainer from '../../components/formContainer/FormContainer';
import SiteDetailsIcon from '../../assets/images/info-grey.svg';
import SiteAddUserIcon from '../../assets/images/avatar-o.svg';
import Loader from '../../components/loader/Loader';
import UserForm from '../../components_com/userForm/UserForm';
import HealthFacilityDetailsForm from './HealthFacilityDetailsForm';
import APPCONSTANTS from '../../constants/appConstantsCom';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  clearAllDependentData,
  createHFRequest,
  fetchWorkflowListRequest
} from '../../store/healthFacility_com/actions';
import { formatHealthFacility, formatHFUserData } from './HealthFacilitySummary';
import { IHFUserGet, IHealthFacility } from '../../store/healthFacility_com/types';
import { PROTECTED_ROUTES } from '../../constants/route';
import {
  healthFacilityLoadingSelector,
  workflowListSelector,
  workflowLoadingSelector
} from '../../store/healthFacility_com/selectors';
import { IWorkflow } from '../../store/healthFacility/types';
import Workflows from './Workflows';

interface IMatchParams {
  regionId?: string;
  tenantId: string;
}

interface IRouteProps extends RouteComponentProps<IMatchParams> {}

export const filterAndExtractAppTypes = (allWorkflows: IWorkflow[], selectedIds: number[]): string[] => {
  // Filter workflows by selected IDs
  const filteredWorkflows = allWorkflows.filter((workflow) => selectedIds.includes(Number(workflow.id)));
  // Extract appTypes from the filtered workflows and flatten the array
  const appTypes = filteredWorkflows.flatMap((workflow) => workflow.appTypes);
  // Remove duplicates from the appTypes array
  const uniqueAppTypes = [...new Set(appTypes)];
  return uniqueAppTypes;
};

/**
 * Renders the form for create site
 */
const CreateHealthFacilityCom = (props: IRouteProps): React.ReactElement => {
  const dispatch = useDispatch();
  const formInstance = useRef({} as FormApi<any>);
  const history = useHistory();
  const workflows = useSelector(workflowListSelector);
  const isWorkflowLoading = useSelector(workflowLoadingSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const [submittedData, setSubmittedData] = useState({
    data: {
      healthFacility: {
        workflows: [] as number[]
      },
      users: [] as IHFUserGet[],
      appTypes: [] as string[]
    },
    isSubmitClicked: false,
    pageNumber: 1
  });

  const [autoFetch, setAutoFetchState] = useState([] as any[]);

  const { regionId, tenantId } = props.match.params;

  const PAGENUMBER = { DETAILS: 1, WORKFLOW: 2, USER: 3, SUBMIT: 4 };

  useEffect(() => {
    dispatch(clearAllDependentData());
  }, [dispatch]);

  /**
   * Handler for form cancel
   */
  const onCancel = () => {
    if (submittedData.pageNumber === PAGENUMBER.DETAILS) {
      onGotoList();
    } else {
      setSubmittedData({
        ...submittedData,
        pageNumber: submittedData.pageNumber >= 1 ? submittedData.pageNumber - 1 : PAGENUMBER.DETAILS
      });
    }
  };

  const onGotoList = useCallback(() => {
    const url = PROTECTED_ROUTES.healthFacilityBySuperAdmin;
    history.push(url.replace(':tenantId', tenantId).replace(/(:regionId)/, regionId as string));
  }, [history, regionId, tenantId]);

  /**
   * Resets all the fields whose name contains given substring,
   * @param param0
   * @param state
   * @param utils
   */
  const resetFields = ([subStrOfKey]: [string], state: any, utils: Tools<any>) => {
    try {
      Object.keys(state.fields).forEach((key: string) => {
        if (key.includes(subStrOfKey)) {
          utils.resetFieldState(key);
        }
      });
    } catch (e) {
      console.error('Error removing form', e);
    }
  };

  const onCreateSuccess = useCallback(() => {
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_CREATION_SUCCESS);
    setSubmittedData({
      ...submittedData,
      isSubmitClicked: false,
      pageNumber: submittedData.pageNumber <= 3 ? submittedData.pageNumber + 1 : PAGENUMBER.DETAILS
    });
    formInstance.current.change('healthFacility', {});
    onGotoList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PAGENUMBER.DETAILS, onGotoList, submittedData]);

  const onCreateFailure = useCallback(
    (e: Error) => {
      setSubmittedData({
        ...submittedData,
        isSubmitClicked: false,
        pageNumber: submittedData.pageNumber >= 1 ? submittedData.pageNumber - 1 : PAGENUMBER.DETAILS
      });
      toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.HEALTH_FACILITY_CREATION_ERROR));
    },
    [PAGENUMBER.DETAILS, submittedData]
  );

  /**
   * Handler for form submission action which changes the page number
   * @param {Object} values - The form values submitted
   * @param {Object} values.healthFacility - The health facility data
   * @param {Array} values.healthFacility.workflows - Selected workflows for the health facility
   * @param {Array} values.users - User data associated with the health facility
   * @returns {void}
   *
   * This function is called when the form is submitted. It processes the form data,
   * extracts relevant information, and updates the component's state to move to the next page.
   * It also filters and extracts app types based on the selected workflows.
   */
  const onSubmitClicked = ({ healthFacility, users }: { healthFacility: IHealthFacility; users: any }) => {
    const selectedWorkflows = healthFacility?.workflows || [];
    const selectedAppTypes = filterAndExtractAppTypes(workflows, selectedWorkflows) || [];
    setSubmittedData({
      data: {
        healthFacility: { ...healthFacility, workflows: selectedWorkflows },
        users,
        appTypes: selectedAppTypes
      },
      isSubmitClicked: true,
      pageNumber: submittedData.pageNumber + 1
    });
  };

  useEffect(() => {
    if (!submittedData.isSubmitClicked) {
      return;
    }

    const handleWorkflowPage = () => {
      dispatch(
        fetchWorkflowListRequest({
          countryId: Number(regionId),
          successCb: (flows) => {
            setSubmittedData((prev) => ({
              ...prev,
              data: {
                ...prev.data,
                healthFacility: {
                  ...prev.data.healthFacility,
                  workflows: flows.filter((r) => r.default).map((v: any) => v.id),
                  defaultTrueWorkflows: flows.filter((flow) => flow.default)?.map((f) => f.id)
                }
              },
              isSubmitClicked: false
            }));
          },
          failureCb: (error) => {
            setSubmittedData((prev) => ({
              ...prev,
              isSubmitClicked: false,
              pageNumber: Math.max(prev.pageNumber - 1, PAGENUMBER.DETAILS)
            }));
            toastCenter.error(
              ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.CLINICAL_WORKFLOW_FETCH_FAILURE)
            );
          }
        })
      );
    };

    const handleSubmitPage = () => {
      if (!regionId) {
        return;
      }

      const postData = {
        ...formatHealthFacility({ ...submittedData.data.healthFacility }, regionId),
        users: formatHFUserData(submittedData.data.users, regionId)
      };

      if (postData.clinicalWorkflowIds.length) {
        dispatch(createHFRequest({ data: postData, successCb: onCreateSuccess, failureCb: onCreateFailure }));
      }
    };

    switch (submittedData.pageNumber) {
      case PAGENUMBER.WORKFLOW:
        handleWorkflowPage();
        break;
      case PAGENUMBER.SUBMIT:
        handleSubmitPage();
        break;
      case PAGENUMBER.USER:
      case PAGENUMBER.DETAILS:
      default:
        setSubmittedData((prev) => ({ ...prev, isSubmitClicked: false }));
        break;
    }
  }, [
    PAGENUMBER.DETAILS,
    PAGENUMBER.SUBMIT,
    PAGENUMBER.USER,
    PAGENUMBER.WORKFLOW,
    dispatch,
    onCreateFailure,
    onCreateSuccess,
    regionId,
    submittedData,
    workflows
  ]);

  /**
   * Renders the appropriate form component based on the current page number
   * @param pageNumber - The current page number
   * @param form - The form API instance
   * @returns JSX.Element - The rendered form component
   */
  const renderByPage = useCallback(
    (pageNumber: number, form: FormApi<any, Partial<any>>) => {
      switch (pageNumber) {
        case PAGENUMBER.DETAILS:
          return (
            <div className='col-lg-6 col-12'>
              <FormContainer label='Health Facility Details' icon={SiteDetailsIcon}>
                <HealthFacilityDetailsForm
                  formName='healthFacility'
                  form={formInstance.current}
                  data={submittedData.data?.healthFacility}
                />
              </FormContainer>
            </div>
          );
        case PAGENUMBER.WORKFLOW:
          return (
            <FormContainer label='Clinical Workflows Involved' required={true} icon={SiteDetailsIcon}>
              <Workflows formName='healthFacility' form={form} />
            </FormContainer>
          );

        case PAGENUMBER.SUBMIT:
        case PAGENUMBER.USER:
        default:
          return (
            <div className='col-lg-6 col-12'>
              <FormContainer label='Add User' icon={SiteAddUserIcon}>
                <UserForm
                  countryId={Number(regionId)}
                  form={form}
                  enableAutoPopulate={true}
                  isHF={true}
                  isHFCreate={true}
                  appTypes={submittedData?.data.appTypes || []}
                  entityName='healthFacility'
                  data={submittedData?.data?.users || []}
                  autoFetchedState={{ autoFetch, setAutoFetchState }}
                />
              </FormContainer>
            </div>
          );
      }
    },
    [
      PAGENUMBER.DETAILS,
      PAGENUMBER.SUBMIT,
      PAGENUMBER.USER,
      PAGENUMBER.WORKFLOW,
      autoFetch,
      formInstance,
      regionId,
      submittedData,
      setAutoFetchState
    ]
  );

  return (
    <>
      <Form
        onSubmit={onSubmitClicked}
        initialValues={{ ...submittedData.data }}
        mutators={{
          ...arrayMutators,
          resetFields
        }}
        render={({ handleSubmit, form }: FormRenderProps<any>) => {
          formInstance.current = form;
          return (
            <form onSubmit={handleSubmit} data-testid='create-site-form'>
              <div className='row g-1dot25'>{renderByPage(submittedData.pageNumber, form)}</div>
              <div className='col-12 mt-1dot25 d-flex'>
                <button type='button' className='btn secondary-btn me-0dot625 px-1dot125 ms-auto' onClick={onCancel}>
                  {submittedData.pageNumber === PAGENUMBER.DETAILS ? 'Cancel' : 'Back'}
                </button>
                <button type='submit' className='btn primary-btn px-1dot75'>
                  {[PAGENUMBER.USER, PAGENUMBER.SUBMIT].includes(submittedData.pageNumber) ? 'Submit' : 'Next'}
                </button>
              </div>
              {(loading || isWorkflowLoading) && <Loader isFullScreen={true} className='translate-x-minus50' />}
            </form>
          );
        }}
      />
    </>
  );
};

export default CreateHealthFacilityCom;
