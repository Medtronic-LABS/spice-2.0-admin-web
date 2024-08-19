import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ProgramForm from './ProgramForm';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import APPCONSTANTS from '../../constants/appConstants';
import { formatDate } from '../../utils/validation';
import Loader from '../../components/loader/Loader';
import ModalForm from '../../components/modal/ModalForm';
import { PROTECTED_ROUTES } from '../../constants/route';
import { programListSelector, programListTotalSelector, programLoadingSelector } from '../../store/program/selectors';
import { IProgramDetails, IProgramList } from '../../store/program/types';
import toastCenter, { getErrorToastArgs } from '../../utils/toastCenter';
import {
  clearProgramList,
  deleteProgramRequest,
  fetchProgramDetailsRequest,
  fetchProgramListRequest,
  updateProgram
} from '../../store/program/actions';
import { useTablePaginationHook } from '../../hooks/tablePagination';

interface IModalState {
  data?: IProgramDetails;
  isOpen: boolean;
}

interface IMatchParams {
  regionId?: string;
  tenantId: string;
  OUId?: string;
  accountId?: string;
  siteId?: string;
}

const ProgramList = (): React.ReactElement => {
  const { regionId, tenantId } = useParams<IMatchParams>();
  const history = useHistory();
  const { listParams, handleSearch, handlePage } = useTablePaginationHook();
  const [editProgramDetailsModal, setEditProgramDetailsModal] = useState<IModalState>({
    isOpen: false
  });

  const dispatch = useDispatch();
  const programCount = useSelector(programListTotalSelector);
  const programs = useSelector(programListSelector);
  const loading = useSelector(programLoadingSelector);

  /**
   * To remove Program List cache in store
   */
  useEffect(() => {
    return () => {
      dispatch(clearProgramList());
    };
  }, [dispatch]);

  /**
   * to load Program List data.
   * @param program List
   */
  const fetchList = useCallback(() => {
    const query = {
      tenantId,
      country: regionId
    };
    dispatch(
      fetchProgramListRequest({
        data: {
          ...query,
          skip: (listParams.page - APPCONSTANTS.INITIAL_PAGE) * listParams.rowsPerPage,
          limit: listParams.rowsPerPage,
          search: listParams.searchTerm
        },
        failureCb: (e) => requestFailure(e, APPCONSTANTS.PROGRAM_FETCH_ERROR)
      })
    );
  }, [dispatch, regionId, tenantId, listParams]);

  useEffect(() => {
    fetchList();
  }, [dispatch, listParams, tenantId, fetchList]);

  const requestFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, errorMessage));

  const openCreateProgram = () => {
    const url = (regionId && PROTECTED_ROUTES.createProgramByRegion) as string;
    history.push(url.replace(':tenantId', tenantId).replace(/(:regionId)/, regionId as string));
  };

  const openEditDialogue = (data: IProgramList) => {
    dispatch(
      fetchProgramDetailsRequest({
        tenantId,
        id: data.id,
        successCb: openProgramEditModal,
        failureCb: (e) =>
          toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.PROGRAM_DETAILS_ERROR))
      })
    );
  };

  const openProgramEditModal = (programDetails: IProgramDetails) => {
    if (programDetails) {
      setEditProgramDetailsModal({
        isOpen: true,
        data: {
          ...programDetails
        } as IProgramDetails
      });
    } else {
      toastCenter.error(APPCONSTANTS.ERROR, APPCONSTANTS.PROGRAM_DETAILS_ERROR);
    }
  };

  const handleProgramEditSubmit = ({ program }: { program: IProgramDetails }) => {
    const oldSites = editProgramDetailsModal.data?.healthFacility.map((site) => site.id) || [];
    const newSites = program.healthFacility.map((healthFacility) => healthFacility.id);
    const deletedSites = editProgramDetailsModal.data?.deletedSites || [];

    const data = {
      id: program.id,
      tenantId,
      healthFacility: program.healthFacility.map((healthFacility) => healthFacility.id),
      deletedSites: getDeletedSites(oldSites, newSites, deletedSites),
      active: program.active
    };
    dispatch(updateProgram({ data, successCb: onUpdateSuccess, failureCb: onUpdateFail }));
  };

  /**
   * To get the program deleted HealthFacility.
   * @param oldHealthFacility List
   * @param newHealthFacility List
   * @param deletedHealthFacility List
   */
  const getDeletedSites = (
    oldHealthFacility: string[],
    newHealthFacility: string[],
    deletedHealthFacility: string[]
  ) => {
    const oldHealthFacilityObj: { [key: string]: boolean } = {};
    const deletedHealthFacilitySObj: { [key: string]: boolean } = {};
    oldHealthFacility.forEach((site) => (oldHealthFacilityObj[site] = true));
    deletedHealthFacility.forEach((site) => (deletedHealthFacilitySObj[site] = true));
    newHealthFacility.forEach((site) => {
      if (oldHealthFacilityObj[site]) {
        delete oldHealthFacilityObj[site];
      } else if (deletedHealthFacilitySObj[site]) {
        delete deletedHealthFacilitySObj[site];
      }
    });
    return [...Object.keys(deletedHealthFacilitySObj), ...Object.keys(oldHealthFacilityObj)];
  };

  const onUpdateSuccess = () => {
    fetchList();
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PROGRAM_UPDATE_SUCCESS);
    closeProgramEditModal();
  };

  const onUpdateFail = (e: Error) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.PROGRAM_UPDATE_ERROR));

  const closeProgramEditModal = () => {
    setEditProgramDetailsModal({
      isOpen: false,
      data: {} as IProgramDetails
    });
  };

  const editProgramModalRender = (form: any) => {
    if (editProgramDetailsModal.data) {
      return <ProgramForm isEdit={true} tenantId={tenantId} form={form} />;
    } else {
      toastCenter.error(APPCONSTANTS.ERROR, APPCONSTANTS.REGION_TENANT_ERROR);
      return <></>;
    }
  };

  /**
   * To delete program
   */
  const handleProgramDelete = useCallback(
    ({ data: { id }, pageNo }: { data: IProgramList; index: number; pageNo: number }) => {
      dispatch(
        deleteProgramRequest({
          id,
          tenantId,
          successCb: () => {
            toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PROGRAM_DELETE_SUCCESS);
            handlePage(
              listParams.page > 1 &&
                Math.ceil(programCount / listParams.rowsPerPage) === listParams.page &&
                (programCount - 1) % listParams.rowsPerPage === 0
                ? listParams.page - 1
                : listParams.page
            );
          },
          failureCb: (e) =>
            toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, APPCONSTANTS.PROGRAM_DELETE_ERROR))
        })
      );
    },
    [dispatch, tenantId, handlePage, programCount, listParams.rowsPerPage, listParams.page]
  );

  return (
    <>
      {loading && <Loader />}
      <div className='col-12'>
        <DetailCard
          buttonLabel='Add Program'
          header='Program'
          isSearch={true}
          onSearch={handleSearch}
          onButtonClick={openCreateProgram}
        >
          <CustomTable
            data-testid='custom-table'
            rowData={programs}
            columnsDef={[
              {
                id: 1,
                name: 'name',
                label: 'Name',
                width: '125px'
              },
              {
                id: 2,
                name: 'createdAt',
                label: 'Created At',
                width: '140px',
                cellFormatter: (data: IProgramList) =>
                  data?.createdAt ? formatDate(data.createdAt, { month: 'short', format: 'YYYY-MM-DD' }) : ''
              },
              {
                id: 3,
                name: 'active',
                label: 'Status',
                width: '140px',
                cellFormatter: (data: IProgramList) => (data?.active ? 'Active' : 'In-Active')
              }
            ]}
            isEdit={true}
            isDelete={true}
            count={programCount}
            onRowEdit={openEditDialogue}
            page={listParams.page}
            rowsPerPage={listParams.rowsPerPage}
            handlePageChange={handlePage}
            onDeleteClick={handleProgramDelete}
            confirmationTitle={APPCONSTANTS.PROGRAM_DELETE_CONFIRMATION}
            deleteTitle={APPCONSTANTS.PROGRAM_DELETE_TITLE}
          />
        </DetailCard>
      </div>
      <ModalForm
        show={editProgramDetailsModal.isOpen}
        title={`Edit Program`}
        cancelText='Cancel'
        submitText='Submit'
        handleCancel={closeProgramEditModal}
        handleFormSubmit={handleProgramEditSubmit}
        initialValues={{ program: editProgramDetailsModal.data }}
        render={editProgramModalRender}
        size='modal-lg'
      />
    </>
  );
};

export default ProgramList;
