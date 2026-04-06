import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FormApi } from 'final-form';

import DetailCard from '../../components/detailCard/DetailCard';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import APPCONSTANTS from '../../constants/appConstants';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { fetchBranchSummaryRequest, updateBranchRequest } from '../../store/branch/actions';
import { branchLoadingSelector, branchSummarySelector } from '../../store/branch/selectors';
import { IBranch, IUpdateBranchRequestPayload } from '../../store/branch/types';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import { mapBranchToUpdatePayload } from '../../utils/formatObjectUtils';
import BranchForm from './BranchForm';
import { fetchDistrictListRequest } from '../../store/district/actions';
import { getDistrictListSelector } from '../../store/district/selectors';
import useCountryId from '../../hooks/useCountryId';
import { formatUserToastMsg } from '../../utils/commonUtils';

interface IBranchSummaryRouteParams {
  branchId: string;
  tenantId: string;
}

const BranchSummary: React.FC = () => {
  const dispatch = useDispatch();
  const { branchId, tenantId } = useParams<IBranchSummaryRouteParams>();
  const countryId = useCountryId();
  const branchSummary = useSelector(branchSummarySelector);
  const loading = useSelector(branchLoadingSelector);
  const districtList = useSelector(getDistrictListSelector);
  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = useAppTypeConfigs();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const labelData = useMemo(
    () => [
      { label: 'Name', value: branchSummary?.name },
      { label: 'Code', value: branchSummary?.code },
      { label: 'Current Account Code', value: branchSummary?.currentAccountCode },
      { label: districtSName, value: branchSummary?.district?.name },
      { label: chiefdomSName, value: branchSummary?.chiefdom?.name },
      { label: 'SK Position Count', value: branchSummary?.skPositionCount },
      { label: 'SS Position Count', value: branchSummary?.ssPositionCount },
      { label: 'PO Position Count', value: branchSummary?.poPositionCount },
      { label: 'FO Position Count', value: branchSummary?.foPositionCount }
    ],
    [branchSummary, districtSName, chiefdomSName]
  );

  useEffect(() => {
    if (branchId) {
      dispatch(
        fetchBranchSummaryRequest({
          branchId: Number(branchId)
        })
      );
    }
  }, [branchId, dispatch]);

  useEffect(() => {
    if (tenantId && !districtList.length) {
      dispatch(
        fetchDistrictListRequest({
          countryId,
          tenantId,
          isActive: true,
          failureCb: (e) => {
            toastCenter.error(
              ...getErrorToastArgs(
                e,
                APPCONSTANTS.OOPS,
                formatUserToastMsg(APPCONSTANTS.DISTRICT_FETCH_ERROR, districtSName)
              )
            );
          }
        })
      );
    }
  }, [dispatch, districtList.length, countryId, tenantId, districtSName]);

  const openEditModal = useCallback(() => {
    setEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
  }, []);

  const handleEditSubmit = useCallback(
    ({ branch }: { branch: IBranch }) => {
      if (!branch || !branchSummary) { return; }
      const onSuccess = () => {
        toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.BRANCH_UPDATE_SUCCESS);
        closeEditModal();
        dispatch(fetchBranchSummaryRequest({ branchId: Number(branchId) }));
      };
      const onFailure = (e: Error) => {
        toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.BRANCH_UPDATE_FAIL));
      };
      const payload: IUpdateBranchRequestPayload = mapBranchToUpdatePayload(branch);
      dispatch(updateBranchRequest({ payload, successCb: onSuccess, failureCb: onFailure }));
    },
    [branchSummary, branchId, closeEditModal, dispatch]
  );

  return (
    <>
      {loading && <Loader />}
      <div className='row g-0dot625'>
        <div className='col-12'>
          <DetailCard
            header='Branch Summary'
            buttonLabel='Edit Branch'
            isEdit={true}
            onButtonClick={openEditModal}
          >
            <div className='row gy-1 mt-0dot25 mb-1dot25 mx-0dot5'>
              {labelData.map(({ label, value }) => (
                <div key={label} className='col-lg-4 col-sm-6'>
                  <div className='fs-0dot875 charcoal-grey-text'>{label}</div>
                  <div className='primary-title text-ellipsis'>{value ?? '--'}</div>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>
      </div>

      <ModalForm
        show={editModalOpen}
        title='Edit Branch'
        cancelText='Cancel'
        submitText='Submit'
        handleCancel={closeEditModal}
        handleFormSubmit={handleEditSubmit}
        initialValues={{
          branch: branchSummary ?? undefined
        }}
        render={(form) => <BranchForm formName='branch' form={form as FormApi<any>} isEdit={true} />}
        size='modal-md'
      />
    </>
  );
};

export default BranchSummary;
