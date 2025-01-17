import arrayMutators from 'final-form-arrays';
import ModalForm from '../../components/modal/ModalForm';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  countryIdSelector,
  getUserSuiteAccessSelector,
  isTACLoadingSelector,
  roleSelector,
  termsAndConditionsSelector,
  userIdSelector
} from '../../store/user/selectors';
import Loader from '../../components/loader/Loader';
import { ITermsAndConditions } from '../../store/user/types';
import {
  fetchTermsAndConditionsRequest,
  logoutRequest,
  updateTermsAndConditionsRequest
} from '../../store/user/actions';
import TextEditor from '../../components/editor/WysiwygEditor';
import './TermsAndConditions.scss';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import APPCONSTANTS from '../../constants/appConstants';
import localStorageService from '../../global/localStorageServices';
import { SU_SA } from '../../routes';
import { districtLoadingSelector } from '../../store/district/selectors';
import { getLoadingSelector } from '../../store/region/selectors';
import { chiefdomDropdownLoadingSelector } from '../../store/chiefdom/selectors';
import { healthFacilityLoadingSelector } from '../../store/healthFacility/selectors';

const TermsAndConditions = () => {
  const dispatch = useDispatch();
  const role = useSelector(roleSelector);
  const countryId = useSelector(countryIdSelector);
  const userId = useSelector(userIdSelector);
  const [showModal, setShowModal] = useState(true);
  const termsAndConditionsData = useSelector(termsAndConditionsSelector);
  const isTACLoading = useSelector(isTACLoadingSelector);
  const accountLoading = useSelector(districtLoadingSelector);
  const regiontLoading = useSelector(getLoadingSelector);
  const ouLoading = useSelector(chiefdomDropdownLoadingSelector);
  const siteLoading = useSelector(healthFacilityLoadingSelector);
  const userSuiteAccess = useSelector(getUserSuiteAccessSelector);
  const { formInput: tacData, countryId: termsCountryId } = termsAndConditionsData as ITermsAndConditions;

  const getTACDismissed = useCallback(() => {
    const item = localStorageService.getItem(APPCONSTANTS.IS_TERMS_CONDITIONS_DISMISSED);
    // Default to `false` if item is null, undefined, or "undefined"
    return item && item !== 'undefined' ? JSON.parse(item) : false;
  }, []);

  const getTACDStatus = useCallback(() => {
    const item = localStorageService.getItem(APPCONSTANTS.TAC_STATUS);

    // Check if item is already parsed as an object
    if (typeof item === 'object') {
      return item;
    }

    // Check if item is a valid JSON string and parse if needed
    try {
      return item && item !== 'undefined' ? JSON.parse(item) : false;
    } catch (error) {
      console.error('Failed to parse TAC Status:', error);
      return {}; // Default to empty object if JSON parsing fails
    }
  }, []);

  const showTACCondition = !getTACDismissed() && !getTACDStatus() && !SU_SA.includes(role);
  useEffect(() => {
    if (
      ((!termsAndConditionsData?.formInput && countryId?.id) || countryId?.id !== termsCountryId || !termsCountryId) &&
      showTACCondition &&
      userSuiteAccess.includes(APPCONSTANTS.SUITE_ACCESS.ADMIN)
    ) {
      dispatch(
        fetchTermsAndConditionsRequest({
          countryId: countryId?.id,
          successCB: (data) => {
            if (!data.formInput) {
              setShowModal(false);
              localStorageService.setItem(APPCONSTANTS.IS_TERMS_CONDITIONS_DISMISSED, true);
            }
          },
          failureCB: () => {
            setShowModal(false);
            localStorageService.setItem(APPCONSTANTS.IS_TERMS_CONDITIONS_DISMISSED, true);
          }
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId, dispatch, getTACDStatus, getTACDismissed, role, showTACCondition]);

  const basicEditorConfig = {
    toolbar: false,
    iframe: false
  };

  const initialEditorConfig: any = {
    disabled: false,
    readonly: true,
    buttons: undefined
  };

  const editModalRender = () => {
    return (
      <div className='tacDiv'>
        <TextEditor
          editorConfig={initialEditorConfig}
          editorContent={tacData}
          basicConfig={basicEditorConfig}
          removeCustomHeight={true}
        />
      </div>
    );
  };

  const handleSubmit = () => {
    dispatch(
      updateTermsAndConditionsRequest({
        userId: Number(userId),
        isTermsAndConditionAccepted: true,
        successCB: () => {
          setShowModal(false);
          localStorageService.setItem(APPCONSTANTS.TAC_STATUS, true);
        },
        failureCB: (e) => {
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.TERMSCONDITIONS_UPDATE_FAIL));
        }
      })
    );
  };

  const handleDecline = () => {
    dispatch(logoutRequest());
  };

  return showTACCondition ? (
    <>
      {isTACLoading && !(accountLoading || regiontLoading || ouLoading || siteLoading) && <Loader />}
      {tacData && (
        <ModalForm
          show={showModal}
          title={`Terms and Conditions`}
          cancelText='Decline'
          submitText='Accept'
          handleCancel={handleDecline}
          handleFormSubmit={handleSubmit}
          mutators={arrayMutators}
          render={editModalRender}
          showCloseBtn={false}
          size='modal-lg'
        />
      )}
    </>
  ) : (
    <></>
  );
};

export default TermsAndConditions;
