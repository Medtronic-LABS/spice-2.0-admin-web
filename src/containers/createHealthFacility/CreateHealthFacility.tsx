import { FormApi, Tools } from 'final-form';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FormContainer from '../../components/formContainer/FormContainer';
import SiteDetailsIcon from '../../assets/images/info-grey.svg';
import SiteAddUserIcon from '../../assets/images/avatar-o.svg';
import Loader from '../../components/loader/Loader';
import UserForm from '../../components/userForm/UserForm';
import HealthFacilityDetailsForm from './HealthFacilityDetailsForm';
import Workflows from '../healthFacility/Workflows';
import APPCONSTANTS, { NAME_CONSTANTS } from '../../constants/appConstants';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { clearAllDependentData, createHFRequest, fetchWorkflowListRequest } from '../../store/healthFacility/actions';
import { useDispatch, useSelector } from 'react-redux';
import { formatHealthFacility, formatHFUserData } from '../healthFacility/HealthFacilitySummary';
import { IHFUserGet, IHealthFacility } from '../../store/healthFacility/types';
import { PROTECTED_ROUTES } from '../../constants/route';
import {
  healthFacilityLoadingSelector,
  workflowListSelector,
  workflowLoadingSelector
} from '../../store/healthFacility/selectors';
import { roleSelector, countryIdSelector } from '../../store/user/selectors';

interface IMatchParams {
  regionId?: string;
  districtId?: string;
  chiefdomId?: string;
  tenantId: string;
}

interface IRouteProps extends RouteComponentProps<IMatchParams> {}

/**
 * Renders the form for create site
 */
const CreateHealthFacility = (props: IRouteProps): React.ReactElement => {
  const dispatch = useDispatch();
  let formInstance: FormApi<any>;
  const history = useHistory();
  const workflows = useSelector(workflowListSelector);
  const isWorkflowLoading = useSelector(workflowLoadingSelector);
  const loading = useSelector(healthFacilityLoadingSelector);
  const [submittedData, setSubmittedData] = useState({
    data: {
      healthFacility: {},
      users: [] as IHFUserGet[]
    },
    isNextClicked: false
  });

  const [autoFetch, setAutoFetchState] = useState([] as any[]);

  const { regionId, districtId, chiefdomId, tenantId } = useParams<IMatchParams>();
  const country = useSelector(countryIdSelector);
  const countryId = Number(regionId || country?.id);
  const role = useSelector(roleSelector);
  const {
    healthFacility: { s: healthFacilitySName }
  } = NAME_CONSTANTS;

  useEffect(() => {
    return () => {
      dispatch(clearAllDependentData());
    };
  }, [dispatch]);

  /**
   * Handler for form cancel
   */
  const onCancel = () => {
    if (submittedData.isNextClicked) {
      setSubmittedData({ ...submittedData, isNextClicked: !submittedData.isNextClicked });
    } else {
      onGotoList();
    }
  };

  const onGotoList = () => {
    const url = ((regionId && PROTECTED_ROUTES.healthFacilityByRegion) ||
      (districtId && PROTECTED_ROUTES.healthFacilityByDistrict) ||
      (chiefdomId && role === APPCONSTANTS.ROLES.CHIEFDOM_ADMIN && PROTECTED_ROUTES.healthFacilityDashboard) ||
      (chiefdomId && PROTECTED_ROUTES.healthFacilityByChiefdom)) as string;
    history.push(
      url
        .replace(':tenantId', tenantId)
        .replace(/(:regionId)|(:districtId)|(:chiefdomId)/, (regionId || chiefdomId || districtId) as string)
    );
  };

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

  const onCreateSuccess = () => {
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.HEALTH_FACILITY_CREATION_SUCCESS);
    setSubmittedData({ ...submittedData, isNextClicked: !submittedData.isNextClicked });
    formInstance.change('healthFacility', {});
    onGotoList();
  };

  const onCreateFailure = (e: Error) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.HEALTH_FACILITY_CREATION_ERROR));

  /**
   * Handler for form submition action
   * @param values
   */
  const onSubmit = ({ healthFacility, users }: { healthFacility: IHealthFacility; users: any }) => {
    if (submittedData.isNextClicked && countryId) {
      const postData = {
        ...formatHealthFacility({ ...healthFacility }, countryId),
        users: formatHFUserData(users, countryId, undefined, true)
      };
      if (postData.clinicalWorkflowIds.length) {
        dispatch(createHFRequest({ data: postData, successCb: onCreateSuccess, failureCb: onCreateFailure }));
      }
    } else {
      if (!workflows.length) {
        dispatch(
          fetchWorkflowListRequest({
            countryId,
            successCb: (flows) => {
              setSubmittedData({
                data: { healthFacility: { ...healthFacility, workflows: flows.map((v: any) => v.id) }, users },
                isNextClicked: true
              });
            },
            failureCb: (error) =>
              toastCenter.error(
                ...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.CLINICAL_WORKFLOW_FETCH_SUCCESS)
              )
          })
        );
      } else {
        setSubmittedData({
          data: { healthFacility: { ...healthFacility, workflows: workflows.map((v: any) => v.id) }, users },
          isNextClicked: true
        });
      }
    }
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={submittedData.data}
        mutators={{
          ...arrayMutators,
          resetFields
        }}
        render={({ handleSubmit, form }: FormRenderProps<any>) => {
          formInstance = form;
          return (
            <form onSubmit={handleSubmit} data-testid='create-site-form'>
              <div className='row g-1dot25'>
                {submittedData.isNextClicked ? (
                  <FormContainer label='Workflows Involved' required={true} icon={SiteDetailsIcon}>
                    <Workflows formName='healthFacility' form={form} />
                  </FormContainer>
                ) : (
                  <>
                    <div className='col-lg-6 col-12'>
                      <FormContainer label={`${healthFacilitySName} Details`} icon={SiteDetailsIcon}>
                        <HealthFacilityDetailsForm
                          formName='healthFacility'
                          form={formInstance}
                          data={submittedData.data.healthFacility}
                        />
                      </FormContainer>
                    </div>
                    <div className='col-lg-6 col-12'>
                      <FormContainer label={`Add User`} icon={SiteAddUserIcon}>
                        <UserForm
                          countryId={countryId}
                          form={form}
                          enableAutoPopulate={true}
                          isHFCreate={true}
                          entityName='healthFacility'
                          data={submittedData.data.users}
                          autoFetchedState={{ autoFetch, setAutoFetchState }}
                          parentOrgId={chiefdomId}
                          ignoreTenantId={tenantId}
                          isSiteUser={true}
                        />
                        <></>
                      </FormContainer>
                    </div>
                  </>
                )}
              </div>
              <div className='col-12 mt-1dot25 d-flex'>
                <button type='button' className='btn secondary-btn me-0dot625 px-1dot125 ms-auto' onClick={onCancel}>
                  {submittedData.isNextClicked ? 'Back' : 'Cancel'}
                </button>
                <button type='submit' className='btn primary-btn px-1dot75'>
                  {submittedData.isNextClicked ? 'Submit' : 'Next'}
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
