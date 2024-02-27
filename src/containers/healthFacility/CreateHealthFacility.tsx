import { FormApi, Tools } from 'final-form';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Form, FormRenderProps } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import FormContainer from '../../components/formContainer/FormContainer';
import SiteDetailsIcon from '../../assets/images/info-grey.svg';
import SiteAddUserIcon from '../../assets/images/avatar-o.svg';
import { ISelectOption } from '../../components/formFields/SelectInput';
import Loader from '../../components/loader/Loader';
import UserForm from '../../components/userForm/UserForm';
import HealthFacilityDetailsForm from './HealthFacilityDetailsForm';
import { ICulture } from '../../store/user/types';
import Workflows from './Workflows';

export interface IAddUserFormValues {
  email: string;
  firstName: string;
  lastName: string;
  countryCode: { countryCode?: string; id?: number };
  phoneNumber: string;
  timezone: { id: string; description: string };
  gender: string;
  roleName: ISelectOption;
  country: { countryCode?: string; id?: number };
  redRisk: boolean;
  culture: ICulture;
  cultureId: number;
  village?: string;
  union?: Array<{ id: string }>;
  unions?: { list: Array<{ id: number; name: string }>; subCounty: string };
  unionLoading?: boolean;
}

interface IMatchParams {
  regionId?: string;
  tenantId: string;
  OUId?: string;
  accountId?: string;
}

interface IRouteProps extends RouteComponentProps<IMatchParams> {}

/**
 * Renders the form for create site
 */
const CreateHealthFacility = (props: IRouteProps): React.ReactElement => {
  let formInstance: FormApi<any>;
  const history = useHistory();
  const [OUTenantId, setSelectedOUTenantId] = useState<string>('');
  const [submittedData, setSubmittedData] = useState({
    data: {
      healthFacility: {},
      users: [] as any[]
    },
    isNextClicked: false
  });

  const { regionId, tenantId, accountId, OUId } = props.match.params;

  useEffect(() => {
    formInstance?.subscribe(
      (formState) => {
        const nextOUTenantId = formState?.values?.site?.operatingUnit?.tenantId || '';
        if (nextOUTenantId !== OUTenantId) {
          setSelectedOUTenantId(nextOUTenantId);
        }
      },
      { values: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handler for form cancel
   */
  const onCancel = () => {
    if (submittedData.isNextClicked) {
      setSubmittedData({ ...submittedData, isNextClicked: !submittedData.isNextClicked });
    } else {
      const url = '';
      history.push(
        url
          .replace(':tenantId', tenantId)
          .replace(/(:regionId)|(:accountId)|(:OUId)/, (regionId || OUId || accountId) as string)
      );
    }
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

  /**
   * Handler for form submition action
   * @param values
   */
  const onSubmit = (data: any) => {
    if (submittedData.isNextClicked) {
      // Submit Actions
    } else {
      const { healthFacility, users }: { healthFacility: any; users: any[] } = data;
      setSubmittedData({ data: { healthFacility, users }, isNextClicked: true });
    }
  };

  const loading = false;

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
                  <FormContainer label='Clinical Workflows Involved' icon={SiteDetailsIcon}>
                    <Workflows />
                  </FormContainer>
                ) : (
                  <>
                    <div className='col-lg-6 col-12'>
                      <FormContainer label='Health Facility Details' icon={SiteDetailsIcon}>
                        <HealthFacilityDetailsForm form={formInstance} data={submittedData.data.healthFacility} />
                      </FormContainer>
                    </div>
                    <div className='col-lg-6 col-12'>
                      <FormContainer label='Add User' icon={SiteAddUserIcon}>
                        <UserForm
                          form={form}
                          isSiteUser={true}
                          enableAutoPopulate={true}
                          entityName='healthFacility'
                          data={submittedData.data.users}
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
              {loading && <Loader isFullScreen={true} className='translate-x-minus50' />}
            </form>
          );
        }}
      />
    </>
  );
};

export default CreateHealthFacility;
