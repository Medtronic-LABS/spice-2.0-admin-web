import { FormApi } from 'final-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import arrayMutators from 'final-form-arrays';
import { useDispatch, useSelector } from 'react-redux';

import DetailCard from '../../components/detailCard/DetailCard';
import UserForm from '../../components/userForm/UserForm';
import ModalForm from '../../components/modal/ModalForm';
import Loader from '../../components/loader/Loader';
import {
  countryIdSelector,
  cultureListSelector,
  getAppTypeSelector,
  roleSelector,
  userIdSelector
} from '../../store/user/selectors';
import { IUserRole } from '../../store/healthFacility/types';
import { fetchCultureListRequest, fetchUserByIdReq, updateUserRequest } from '../../store/user/actions';
import toastCenter from '../../utils/toastCenter';
import APPCONSTANTS from '../../constants/appConstants';
import { IEditUserDetail } from '../../store/user/types';
import sessionStorageServices from '../../global/sessionStorageServices';
import { getAdminPayload } from '../../utils/formatObjectUtils';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

/**
 * MyProfile component for displaying and editing user profile information.
 * @return {React.ReactElement} The rendered MyProfile component
 */
const MyProfile = (): React.ReactElement => {
  const dispatch = useDispatch();
  const userId = useSelector(userIdSelector);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userDetails, setUserDetails] = useState<IEditUserDetail>();
  const [loading, setLoading] = useState<boolean>(false);
  const userForEdit = useRef({ users: [] as IEditUserDetail[] });
  const { isCommunity } = useAppTypeConfigs();
  const { HEALTH_FACILITY_ADMIN } = APPCONSTANTS.ROLES;
  const appTypes = useSelector(getAppTypeSelector);
  const role = useSelector(roleSelector);
  const cultureList = useSelector(cultureListSelector);
  const country = useSelector(countryIdSelector);
  const countryId = Number(country?.id || sessionStorageServices.getItem(APPCONSTANTS.FORM_ID));
  /**
   * Formats the roles of a user into a comma-separated string.
   * @param {IEditUserDetail} user - The user object containing roles
   */
  const formatRoles = (user: IEditUserDetail) =>
    `${(user.roles || []).map((userRole: IUserRole) => userRole.displayName).join(', ')}`;

  /**
   * Fetches user details by ID.
   */
  const fetchUser = useCallback(
    () =>
      dispatch(
        fetchUserByIdReq({
          payload: { id: userId },
          successCb: (payload) => {
            setUserDetails(payload);
          },
          failureCb: () => {
            toastCenter.error(APPCONSTANTS.OOPS, APPCONSTANTS.PROFILE_DETAIL_ERROR);
          }
        })
      ),
    [dispatch, userId]
  );

  useEffect(() => {
    fetchUser();
    if (role === HEALTH_FACILITY_ADMIN && cultureList && !cultureList.length) {
      dispatch(fetchCultureListRequest());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Prepares label data for display in the profile card.
   * @return {Array} An array of label-value pairs for profile information
   */
  const lableData = useMemo(() => {
    const data = [
      { label: 'Name', value: userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : null },
      { label: 'Email ID', value: userDetails?.username, colClassName: 'col-sm-6 col-lg-8' },
      {
        label: 'Mobile Number',
        value: `${userDetails?.countryCode ? '+' + userDetails?.countryCode : ''} ${
          userDetails?.phoneNumber ? userDetails?.phoneNumber : '--'
        }`,
        colClassName: 'col-sm-6 col-lg-4 col-md-6'
      },
      { label: 'Gender', value: userDetails?.gender },
      {
        label: 'Role',
        value: formatRoles(userDetails || ({} as IEditUserDetail))
      },
      {
        label: 'Timezone',
        value: userDetails?.timezone?.description,
        colClassName: 'col-12 col-sm-12'
      }
    ];
    if (userDetails?.id && (userDetails.roles || []).some((userRole: IUserRole) => userRole.name === 'CHW')) {
      data.push(
        {
          label: 'Supervisor',
          value: `${(userDetails.supervisor || {}).firstName} ${(userDetails.supervisor || {}).lastName}`
        },
        { label: 'Villages', value: (userDetails.villages || []).map((village: any) => village.name).join(', ') }
      );
    }

    return data;
  }, [userDetails]);

  useEffect(() => {
    if (userDetails && userDetails.id) {
      const postData: any = { ...userDetails };
      userForEdit.current = { users: [postData] as IEditUserDetail[] };
    }
  }, [userDetails]);

  /**
   * Handles the click event for editing the profile.
   */
  const handleEditClick = useCallback(() => {
    setShowEditModal(true);
  }, []);

  /**
   * Handles the submission of edited user data.
   * @param {Object} param - Object containing the users array
   * @param {IEditUserDetail[]} param.users - Array of edited user details
   */
  const handleEdit = ({ users }: { users: IEditUserDetail[] }) => {
    const userObj = getAdminPayload({
      appTypes,
      userFormData: users,
      countryId,
      isFromSummaryOrProfilePage: true
    });
    const payload = userObj[0];
    setLoading(true);
    dispatch(
      updateUserRequest({
        payload,
        successCb: () => {
          editSuccess();
        },
        failureCb: () => {
          setLoading(false);
          toastCenter.error(APPCONSTANTS.ERROR, APPCONSTANTS.USER_DETAILS_UPDATE_ERROR);
        }
      })
    );
  };

  /**
   * Handles successful edit operation.
   */
  const editSuccess = () => {
    setLoading(false);
    setShowEditModal(false);
    fetchUser();
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.USER_DETAILS_UPDATE_SUCCESS);
  };

  return (
    <>
      {loading && <Loader />}
      <DetailCard buttonLabel='Edit My Profile' isEdit={true} header='My Profile' onButtonClick={handleEditClick}>
        <div className='row gy-1 mt-0dot25 mb-1dot25 mx-0dot5'>
          {lableData.map(({ label, value, colClassName }) =>
            label === 'Timezone' && isCommunity ? (
              <></>
            ) : (
              <div key={label} className={colClassName || 'col-lg-4 col-sm-6'}>
                <div className='charcoal-grey-text'>{label}</div>
                <div className='primary-title text-ellipsis'>{value || '--'}</div>
              </div>
            )
          )}
        </div>
      </DetailCard>
      <ModalForm
        show={showEditModal}
        title='Edit My Profile'
        cancelText='Cancel'
        submitText='Submit'
        handleCancel={() => setShowEditModal(false)}
        handleFormSubmit={handleEdit}
        render={(form?: FormApi<any>) => {
          return (
            <UserForm
              form={form as FormApi<any>}
              initialEditValue={userForEdit.current.users[0]}
              disableOptions={true}
              isEdit={true}
              countryId={countryId}
              userFormParams={{ isProfile: true }}
            />
          );
        }}
        mutators={{ ...arrayMutators }}
      />
    </>
  );
};

export default MyProfile;
