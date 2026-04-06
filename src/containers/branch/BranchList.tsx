import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import ModalForm from '../../components/modal/ModalForm';
import Loader from '../../components/loader/Loader';
import { useTablePaginationHook } from '../../hooks/tablePagination';
import APPCONSTANTS from '../../constants/appConstants';
import BranchForm from './BranchForm';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  fetchBranchListRequest,
  clearBranchList,
  createBranchRequest,
  updateBranchRequest
} from '../../store/branch/actions';
import { fetchDistrictListRequest } from '../../store/district/actions';
import { branchListSelector, branchLoadingSelector, branchTotalCountSelector } from '../../store/branch/selectors';
import { IBranch, ICreateBranchRequestPayload, IUpdateBranchRequestPayload } from '../../store/branch/types';
import { FormApi } from 'final-form';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';
import { getDistrictListSelector } from '../../store/district/selectors';
import { chiefdomListSelector as getAllChiefdomsSelector } from '../../store/healthFacility/selectors';
import useCountryId from '../../hooks/useCountryId';
import { formatUserToastMsg } from '../../utils/commonUtils';
import { clearChiefdomList, fetchChiefdomListRequest } from '../../store/healthFacility/actions';
import { mapBranchToCreatePayload, mapBranchToUpdatePayload } from '../../utils/formatObjectUtils';
import { PROTECTED_ROUTES } from '../../constants/route';

interface IMatchParams {
  regionId: string;
  tenantId: string;
}

interface IBranchFilters {
  districtIds: number[];
  chiefdomIds: number[];
  skip: number | null;
}

interface IFetchDetailsParams {
  skip?: number | null;
  districtIds?: number[] | null;
  chiefdomIds?: number[] | null;
}

/**
 * BranchList component for displaying branch list with Add button and edit functionality
 * @returns {React.ReactElement}
 */
const BranchList = (): React.ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { regionId, tenantId } = useParams<IMatchParams>();
  const countryId = useCountryId({ regionId });
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();

  const branchList = useSelector(branchListSelector);
  const branchCount = useSelector(branchTotalCountSelector);
  const loading = useSelector(branchLoadingSelector);
  const districtList = useSelector(getDistrictListSelector);
  const chiefdomList = useSelector(getAllChiefdomsSelector);
  const [branchModal, setBranchModal] = useState<{
    isOpen: boolean;
    data: IBranch | null;
    isEdit: boolean;
  }>({ isOpen: false, data: null, isEdit: false });
  const [filters, setFilters] = useState<IBranchFilters>({
    districtIds: [],
    chiefdomIds: [],
    skip: null
  });
  const {
    district: { s: districtSName },
    chiefdom: { s: chiefdomSName }
  } = useAppTypeConfigs();

  /**
   * Fetch branch list API
   */
  const fetchDetails = useCallback(
    ({ skip = null, districtIds = null, chiefdomIds = null }: IFetchDetailsParams) => {
      dispatch(
        fetchBranchListRequest({
          payload: {
            countryId,
            limit: listParams.rowsPerPage,
            skip: skip ?? (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
            searchTerm: listParams.searchTerm ?? '',
            districtIds: districtIds ?? filters.districtIds,
            chiefdomIds: chiefdomIds ?? filters.chiefdomIds
          },
          failureCb: (e) => {
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, APPCONSTANTS.ERROR));
          }
        })
      );
    },
    [
      dispatch,
      listParams.page,
      listParams.rowsPerPage,
      listParams.searchTerm,
      countryId,
      filters.districtIds,
      filters.chiefdomIds
    ]
  );

  /**
   * Fetch district options on initial page load
   */
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
  }, [dispatch, districtList.length, countryId, tenantId]);

  /**
   * Invoke fetch on mount and when listParams (search/page) change
   */
  useEffect(() => {
    fetchDetails({ ...filters });
  }, [fetchDetails]);

  /**
   * Clear branch list on unmount
   */
  useEffect(() => {
    return () => {
      dispatch(clearBranchList());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearChiefdomList());
    setFilters((prev) => ({ ...prev, chiefdomIds: [] }));
    if (filters.districtIds.length) {
      dispatch(
        fetchChiefdomListRequest({
          countryId: Number(countryId),
          districtIds: filters.districtIds
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.districtIds, countryId, tenantId]);

  const handleAddClick = useCallback(() => {
    setBranchModal({ isOpen: true, data: null, isEdit: false });
  }, []);

  const openBranchModal = useCallback((data: IBranch) => {
    setBranchModal({ isOpen: true, data: { ...data }, isEdit: true });
  }, []);

  const closeBranchModal = useCallback(() => {
    setBranchModal({ isOpen: false, data: null, isEdit: false });
  }, []);

  const handleEditSubmit = useCallback(
  ({ branch }: { branch: IBranch }) => {
    // early exit if invalid
    if (!branch || (branchModal.isEdit && !branchModal.data)) { return; }

    // Define messages based on flow
    const successMessage = branchModal.isEdit
      ? APPCONSTANTS.BRANCH_UPDATE_SUCCESS
      : APPCONSTANTS.BRANCH_CREATE_SUCCESS;

    const failureMessage = branchModal.isEdit
      ? APPCONSTANTS.BRANCH_UPDATE_FAIL
      : APPCONSTANTS.BRANCH_CREATE_FAIL;

    // shared success callback
    const onSuccess = () => {
      toastCenter.success(APPCONSTANTS.SUCCESS, successMessage);
      closeBranchModal();
      fetchDetails({});
    };

    // shared failure callback
    const onFailure = (e: Error) => {
      toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.OOPS, failureMessage));
    };

    if (branchModal.isEdit) {
      const payload: IUpdateBranchRequestPayload = mapBranchToUpdatePayload(branch);
      dispatch(updateBranchRequest({ payload, successCb: onSuccess, failureCb: onFailure }));
    } else {
      const payload: ICreateBranchRequestPayload = mapBranchToCreatePayload(branch);
      dispatch(createBranchRequest({ payload, successCb: onSuccess, failureCb: onFailure }));
    }
  },
  [branchModal.isEdit, branchModal.data, dispatch, fetchDetails, closeBranchModal]
);

  const handleFilterChange = (option: number[], name: string) => {
    let newFilters: IBranchFilters = { ...filters };
    newFilters = {
      ...newFilters,
      [name]: option,
      skip: null
    };
    if (!newFilters.districtIds.length) {
      newFilters.chiefdomIds = [];
    }
    handlePage(1);
    setFilters(newFilters);
  };

  const handleRowClick = (data: any) => {
    history.push(
      PROTECTED_ROUTES.branchSummary.replace(':branchId', data.id).replace(':tenantId', tenantId)
    );
  };

  return (
    <>
      {loading && <Loader />}
      <div className='col-12'>
        <DetailCard
          buttonLabel='Add'
          header='Branch'
          isSearch={true}
          searchPlaceholder={APPCONSTANTS.SEARCH_BY_NAME_CODE}
          onSearch={handleSearch}
          onButtonClick={handleAddClick}
          onChange={handleFilterChange}
          updatedFilterData={filters}
          isFilter={true}
          onFilterData={[
            {
              id: 1,
              name: districtSName,
              key: 'districtIds',
              isFacility: false,
              isGeneric: true,
              isSearchable: true,
              placeholder: `Search ${districtSName}`,
              data: districtList,
              isShow: true
            },
            {
              id: 2,
              name: chiefdomSName,
              key: 'chiefdomIds',
              isFacility: false,
              isGeneric: true,
              isSearchable: true,
              placeholder: `Search ${chiefdomSName}`,
              data: chiefdomList,
              isShow: true
            }
          ]}
        >
          <CustomTable
            rowData={branchList}
            columnsDef={[
              {
                id: 1,
                name: 'name',
                label: 'Name',
                width: '30%'
              },
              {
                id: 2,
                name: 'code',
                label: 'Code',
                width: '20%'
              },
              {
                id: 3,
                name: 'district',
                label: districtSName,
                width: '30%',
                cellFormatter: ({ district }) => district?.name
              },
              {
                id: 4,
                name: 'chiefdom',
                label: chiefdomSName,
                width: '30%',
                cellFormatter: ({ chiefdom }) => chiefdom?.name
              }
            ]}
            isEdit={true}
            isDelete={false}
            page={branchCount > APPCONSTANTS.ROWS_PER_PAGE_OF_TABLE ? listParams.page : 0}
            rowsPerPage={listParams.rowsPerPage}
            count={branchCount}
            onRowEdit={openBranchModal}
            handlePageChange={handlePage}
            handleRowClick={(rowData) => (rowData.isActive ? handleRowClick(rowData) : undefined)}
          />
        </DetailCard>
      </div>

      <ModalForm
        show={branchModal.isOpen}
        title={branchModal.isEdit ? 'Edit Branch' : 'Add Branch'}
        cancelText='Cancel'
        submitText='Submit'
        handleCancel={closeBranchModal}
        handleFormSubmit={handleEditSubmit}
        initialValues={{
          branch: branchModal.data
        }}
        render={(form) => <BranchForm formName='branch' form={form as FormApi<any>} isEdit={branchModal.isEdit} />}
        size='modal-md'
      />
    </>
  );
};

export default BranchList;
