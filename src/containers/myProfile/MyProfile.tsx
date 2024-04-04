import { FormApi } from 'final-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import arrayMutators from 'final-form-arrays';
import { useSelector } from 'react-redux';

import DetailCard from '../../components/detailCard/DetailCard';
import UserForm from '../../components/userForm/UserForm';
import ModalForm from '../../components/modal/ModalForm';
import { IEditUserDetail } from '../../store/user/types';
import Loader from '../../components/loader/Loader';
import { userDataSelector } from '../../store/user/selectors';
import { IHFUserGet, IUserRole } from '../../store/healthFacility/types';

const MyProfile = (): React.ReactElement => {
  const [showEditModal, setShowEditModal] = useState(false);
  const userForEdit = useRef({ users: [] as IHFUserGet[] });
  // const [userDetails, _setUserDetails] = useState<IEditUserDetail>();
  const userDetails = useMemo(
    () =>
      ({
        id: 1,
        firstName: 'Test',
        lastName: 'Last',
        gender: 'Male',
        phoneNumber: '1234567890',
        username: 'test@gmail.com',
        countryCode: '232',
        roles: [{ id: 4, name: 'ADMIN', displayName: 'Admin', groupName: 'SPICE' }],
        tenantId: 1,
        villages: [1, 2],
        supervisor: 'test',
        organizations: [{ id: 1, name: 'HF', parentOrganizationId: 1, formDataId: 1 }],
        country: { id: 1, phoneNumberCode: '232', name: 'SL', tenantId: 1 }
      } as IHFUserGet),
    []
  );
  const loading = false;
  const regionData = useSelector(userDataSelector).country;
  const formatRoles = (user: IHFUserGet) =>
    `${(user.roles || []).map((userRole: IUserRole) => userRole.displayName).join(',')}`;

  const lableData = useMemo(
    () => [
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
        value: formatRoles(userDetails)
      }
    ],
    [userDetails]
  );
  useEffect(() => {
    const postData: any = { ...userDetails };
    postData.suiteAccess = userDetails.roles[0] || {};
    postData.role = postData.roles.filter((r: IUserRole) => r.groupName === postData.suiteAccess.groupName) || [];
    postData.supervisor = {
      ...postData.supervisor,
      name: `${postData.supervisor?.firstName || ''} ${postData.supervisor?.lastName || ''}`
    };
    userForEdit.current = { users: [postData] as IHFUserGet[] };
  }, [userDetails]);

  const handleEditClick = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const handleEdit = ({ users: [user] }: { users: IEditUserDetail[] }) => {
    //
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
              isEdit={true}
              countryId={regionData?.id}
            />
          );
        }}
        mutators={{ ...arrayMutators }}
      />
    </>
  );
};

export default MyProfile;
