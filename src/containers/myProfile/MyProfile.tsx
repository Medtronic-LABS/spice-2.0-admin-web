import { FormApi } from 'final-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import arrayMutators from 'final-form-arrays';
import { useDispatch, useSelector } from 'react-redux';

import DetailCard from '../../components/detailCard/DetailCard';
import UserForm from '../../components/userForm/UserForm';
import ModalForm from '../../components/modal/ModalForm';
import Loader from '../../components/loader/Loader';
import { userDataSelector, userIdSelector } from '../../store/user/selectors';
import { IUserRole } from '../../store/healthFacility/types';
import { fetchUserByIdReq, updateUserRequest } from '../../store/user/actions';
import toastCenter from '../../utils/toastCenter';
import APPCONSTANTS from '../../constants/appConstants';
import { IEditUserDetail, IRoles } from '../../store/user/types';

const MyProfile = (): React.ReactElement => {
  const dispatch = useDispatch();
  const userId = useSelector(userIdSelector);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userDetails, setUserDetails] = useState<IEditUserDetail>();
  const [loading, setLoading] = useState<boolean>(false);
  const userForEdit = useRef({ users: [] as IEditUserDetail[] });

  const regionData = useSelector(userDataSelector);
  const formatRoles = (user: IEditUserDetail) =>
    `${(user.roles || []).map((userRole: IUserRole) => userRole.displayName).join(', ')}`;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const allSuiteAccess = postData.roles.map((r: IRoles) => ({ groupName: r.groupName, id: r.groupName }));
      postData.suiteAccess = [...new Map(allSuiteAccess.map((item: any) => [item.groupName, item])).values()];
      postData.role = postData.roles.filter((r: IRoles) => r.groupName === 'SPICE') || [];
      postData.spiceInsightsRole = postData.roles.filter((r: IRoles) => r.groupName === 'SPICE INSIGHTS') || [];
      postData.supervisor = {
        ...postData.supervisor,
        name: `${postData.supervisor?.firstName || ''} ${postData.supervisor?.lastName || ''}`
      };
      userForEdit.current = { users: [postData] as IEditUserDetail[] };
    }
  }, [userDetails]);

  const handleEditClick = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const handleEdit = ({ users: [user] }: { users: IEditUserDetail[] }) => {
    const payload = {
      id: user.id,
      gender: user.gender,
      firstName: user.firstName,
      lastName: user.lastName,
      countryCode: user?.country?.phoneNumberCode,
      phoneNumber: user.phoneNumber
    };
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
          {lableData.map(({ label, value, colClassName }) => (
            <div key={label} className={colClassName || 'col-lg-4 col-sm-6'}>
              <div className='charcoal-grey-text'>{label}</div>
              <div className='primary-title text-ellipsis'>{value || '--'}</div>
            </div>
          ))}
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
              isProfile={true}
              isEdit={true}
              countryId={regionData?.country?.id}
            />
          );
        }}
        mutators={{ ...arrayMutators }}
      />
    </>
  );
};

export default MyProfile;
