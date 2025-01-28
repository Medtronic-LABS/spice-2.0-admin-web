import { FormApi, Tools } from 'final-form';
import arrayMutators from 'final-form-arrays';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import SiteAddUserIcon from '../../assets/images/avatar-o.svg';
import SiteDetailsIcon from '../../assets/images/info-grey.svg';
import FormContainer from '../../components/formContainer/FormContainer';
import Loader from '../../components/loader/Loader';
import UserForm, { IDisabledRoles } from '../../components/userForm/UserForm';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import sessionStorageServices from '../../global/sessionStorageServices';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { clearAllDependentData, createHFRequest, fetchWorkflowListRequest } from '../../store/healthFacility/actions';
import {
  healthFacilityLoadingSelector,
  workflowListSelector,
  workflowLoadingSelector
} from '../../store/healthFacility/selectors';
import { IClinicalWorkflows, IHFUserGet, IHealthFacility, IWorkflow } from '../../store/healthFacility/types';
import { countryIdSelector, roleSelector, userRolesSelector } from '../../store/user/selectors';
import { formatHealthFacility, getUserPayload } from '../../utils/formatObjectUtils';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import Workflows from '../healthFacility/Workflows';
import HealthFacilityDetailsForm from './HealthFacilityDetailsForm';
import { formatUserToastMsg } from '../../utils/commonUtils';

interface IMatchParams {
  regionId?: string;
  districtId?: string;
  chiefdomId?: string;
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
const CreateHealthFacility = (props: IRouteProps): React.ReactElement => {
  const dispatch = useDispatch();
  const formInstance = useRef({} as FormApi<any>);
  const history = useHistory();
  const workflows = useSelector(workflowListSelector);
  const isWorkflowLoading = useSelector(workflowLoadingSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const [submittedData, setSubmittedData] = useState({
    data: {
      healthFacility: {} as any,
      users: [] as IHFUserGet[],
      appTypes: [] as string[]
    },
    isSubmitClicked: false,
    pageNumber: 1
  });

  const [autoFetch, setAutoFetchState] = useState([] as any[]);
  const [selectedchiefdomTenantId, setSelectedchiefdomTenantId] = useState();

  const { regionId, districtId, chiefdomId, tenantId } = useParams<IMatchParams>();
  const country = useSelector(countryIdSelector);
  const countryId = Number(regionId || country?.id || sessionStorageServices.getItem(APPCONSTANTS.COUNTRY_ID));
  const role = useSelector(roleSelector);
  const rolesGrouped = useSelector(userRolesSelector);
  const {
    isCommunity,
    appTypes,
    healthFacility: { s: healthFacilitySName }
  } = useAppTypeConfigs();

  useEffect(() => {
    formInstance.current?.subscribe(
      (formState) => {
        const nextchiefdomTenantId = formState?.values?.healthFacility?.chiefdom?.tenantId || '';
        if (nextchiefdomTenantId !== selectedchiefdomTenantId) {
          setSelectedchiefdomTenantId(nextchiefdomTenantId);
        }
      },
      { values: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const url = ((regionId && PROTECTED_ROUTES.healthFacilityByRegion) ||
      (districtId && PROTECTED_ROUTES.healthFacilityByDistrict) ||
      (chiefdomId && role === APPCONSTANTS.ROLES.CHIEFDOM_ADMIN && PROTECTED_ROUTES.healthFacilityDashboard) ||
      (chiefdomId && PROTECTED_ROUTES.healthFacilityByChiefdom)) as string;
    history.push(
      url
        .replace(':tenantId', tenantId)
        .replace(/(:regionId)|(:districtId)|(:chiefdomId)/, (regionId || chiefdomId || districtId) as string)
    );
  }, [chiefdomId, districtId, history, regionId, role, tenantId]);

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
    toastCenter.success(
      APPCONSTANTS.SUCCESS,
      formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_CREATION_SUCCESS, healthFacilitySName)
    );
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
      toastCenter.error(
        ...getErrorToastArgs(
          e,
          APPCONSTANTS.ERROR,
          formatUserToastMsg(APPCONSTANTS.HEALTH_FACILITY_CREATION_ERROR, healthFacilitySName)
        )
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        healthFacility: {
          ...healthFacility,
          workflows: selectedWorkflows,
          defaultTrueWorkflows: healthFacility.defaultTrueWorkflows || []
        },
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

    const { healthFacility, users } = submittedData.data;

    const handleWorkflowPage = () => {
      dispatch(
        fetchWorkflowListRequest({
          countryId,
          successCb: (flows) => {
            setSubmittedData((prev) => ({
              ...prev,
              data: {
                ...prev.data,
                healthFacility: {
                  ...healthFacility,
                  clinicalWorkflows:
                    formInstance.current.getState().values.healthFacility?.clinicalWorkflows ||
                    (isCommunity
                      ? flows.map((v: any) => v?.id)
                      : flows.filter((flow) => flow.default)?.map((f) => f?.id)),
                  defaultTrueWorkflows: flows.filter((flow) => flow.default)?.map((f) => f?.id)
                },
                users
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
      if (!countryId) {
        return;
      }
      // adding default clinicalworkflows explicitly to payload, since it's not getting added by default
      let clinicalWFs: IClinicalWorkflows[] = [];
      if (healthFacility.clinicalWorkflows?.length) {
        if (healthFacility.defaultTrueWorkflows?.length) {
          clinicalWFs = [...healthFacility.clinicalWorkflows, ...healthFacility.defaultTrueWorkflows];
        } else {
          clinicalWFs = healthFacility.clinicalWorkflows;
        }
      } else if (healthFacility.defaultTrueWorkflows?.length) {
        clinicalWFs = healthFacility.defaultTrueWorkflows;
      }
      const postUserData = getUserPayload({
        appTypes,
        userFormData: users,
        countryId,
        isHFCreate: true,
        spiceRolesGroup: rolesGrouped?.SPICE
      });
      const postData = {
        ...formatHealthFacility({ ...{ ...healthFacility, clinicalWorkflows: clinicalWFs } }, countryId, appTypes),
        users: postUserData
      };
      if (postData?.clinicalWorkflowIds?.length || postData?.customizedWorkflowIds?.length) {
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
    appTypes,
    countryId,
    dispatch,
    isCommunity,
    onCreateFailure,
    onCreateSuccess,
    regionId,
    rolesGrouped?.SPICE,
    submittedData,
    workflows
  ]);

  const [disabledRoleState, setDisabledRoles] = useState<IDisabledRoles[]>([]);
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
            <div className='col-12'>
              <FormContainer label={`${healthFacilitySName} Details`} icon={SiteDetailsIcon}>
                <HealthFacilityDetailsForm
                  formName='healthFacility'
                  form={formInstance.current}
                  data={submittedData.data?.healthFacility}
                  isHFCreate={true}
                />
              </FormContainer>
            </div>
          );
        case PAGENUMBER.WORKFLOW:
          return (
            <FormContainer label='Workflows Involved' required={true} icon={SiteDetailsIcon}>
              <Workflows formName='healthFacility' form={form} />
            </FormContainer>
          );

        case PAGENUMBER.SUBMIT:
        case PAGENUMBER.USER:
        default:
          return (
            <div className='col-12'>
              <FormContainer label='Add User' icon={SiteAddUserIcon}>
                <UserForm
                  countryId={countryId}
                  form={form}
                  enableAutoPopulate={true}
                  entityName='healthFacility'
                  data={submittedData.data?.users}
                  autoFetchedState={{ autoFetch, setAutoFetchState }}
                  parentOrgId={selectedchiefdomTenantId || tenantId}
                  ignoreTenantId={''}
                  isSiteUser={true}
                  disabledRolesState={{ disabledRoles: disabledRoleState, setDisabledRoles }}
                  appTypes={submittedData.data?.appTypes || []}
                  fetchHFListForReports={false}
                  userFormParams={{ isHF: true, isHFCreate: true }}
                />
              </FormContainer>
            </div>
          );
      }
    },
    [
      PAGENUMBER.DETAILS,
      PAGENUMBER.WORKFLOW,
      PAGENUMBER.SUBMIT,
      PAGENUMBER.USER,
      healthFacilitySName,
      submittedData.data?.healthFacility,
      submittedData.data?.users,
      submittedData.data?.appTypes,
      countryId,
      autoFetch,
      selectedchiefdomTenantId,
      tenantId,
      disabledRoleState
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
          const formClinicalWFsLength = (form?.getState()?.values?.healthFacility?.clinicalWorkflows || []).length;
          const formCustomizedWFsLength = (form?.getState()?.values?.healthFacility?.customizedWorkflows || []).length;
          return (
            <form onSubmit={handleSubmit} data-testid='create-site-form'>
              <div className='row g-1dot25'>{renderByPage(submittedData.pageNumber, form)}</div>
              <div className='col-12 mt-1dot25 d-flex'>
                <button type='button' className='btn secondary-btn me-0dot625 px-1dot125 ms-auto' onClick={onCancel}>
                  {submittedData.pageNumber === PAGENUMBER.DETAILS ? 'Cancel' : 'Back'}
                </button>
                <button
                  type='submit'
                  className='btn primary-btn px-1dot75'
                  disabled={
                    submittedData.pageNumber === PAGENUMBER.WORKFLOW &&
                    (isCommunity
                      ? formClinicalWFsLength === 0
                      : formClinicalWFsLength === 0 && formCustomizedWFsLength === 0)
                  }
                >
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

export default CreateHealthFacility;
