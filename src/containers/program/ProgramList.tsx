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

/**
 * Interface for modal state
 */
interface IModalState {
  data?: IProgramDetails;
  isOpen: boolean;
}

/**
 * Interface for route parameters
 */
interface IMatchParams {
  regionId?: string;
  tenantId: string;
  OUId?: string;
  accountId?: string;
  siteId?: string;
}

/**
 * ProgramList component for displaying and managing programs
 * @returns {React.ReactElement} The rendered component
 */
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
   * Fetches the program list based on current parameters
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

  /**
   * Handles the failure of API requests
   * @param {Error} e - The error object
   * @param {string} errorMessage - The error message to display
   */
  const requestFailure = (e: Error, errorMessage: string) =>
    toastCenter.error(...getErrorToastArgs(e, APPCONSTANTS.ERROR, errorMessage));

  /**
   * Opens the create program page
   */
  const openCreateProgram = () => {
    const url = (regionId && PROTECTED_ROUTES.createProgramByRegion) as string;
    history.push(url.replace(':tenantId', tenantId).replace(/(:regionId)/, regionId as string));
  };

  /**
   * Opens the edit dialogue for a program
   * @param {IProgramList} data - The program data to edit
   */
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

  /**
   * Opens the program edit modal
   * @param {IProgramDetails} programDetails - The details of the program to edit
   */
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

  /**
   * Handles the submission of program edits
   * @param {{ program: IProgramDetails }} param0 - The edited program details
   */
  const handleProgramEditSubmit = ({ program }: { program: IProgramDetails }) => {
    const existingHFData = editProgramDetailsModal.data?.healthFacilities.map((site) => site.id) || [];
    const newHFData = program.healthFacilities.map((healthFacility) => healthFacility.id);
    const deletedHealthFacilities = editProgramDetailsModal.data?.deletedHealthFacilities || [];

    const data = {
      id: program.id,
      tenantId,
      healthFacilities: program.healthFacilities.map((healthFacility) => healthFacility.id),
      deletedHealthFacilities: getDeletedSites(existingHFData, newHFData, deletedHealthFacilities),
      active: program.active
    };
    dispatch(updateProgram({ data, successCb: onUpdateSuccess, failureCb: onUpdateFail }));
  };

  /**
   * Determines which health facilities have been deleted
   * @param {string[]} oldHealthFacility - List of old health facility IDs
   * @param {string[]} newHealthFacility - List of new health facility IDs
   * @param {string[]} deletedHealthFacility - List of previously deleted health facility IDs
   * @returns {string[]} List of deleted health facility IDs
   */
  const getDeletedSites = (
    oldHealthFacility: string[],
    newHealthFacility: string[],
    deletedHealthFacility: string[]
  ): string[] => {
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

  /**
   * Callback for successful program update
   */
  const onUpdateSuccess = () => {
    fetchList();
    toastCenter.success(APPCONSTANTS.SUCCESS, APPCONSTANTS.PROGRAM_UPDATE_SUCCESS);
    closeProgramEditModal();
  };

  /**
   * Callback for failed program update
   * @param {Error} error - The error object
   */
  const onUpdateFail = (error: Error) =>
    toastCenter.error(...getErrorToastArgs(error, APPCONSTANTS.ERROR, APPCONSTANTS.PROGRAM_UPDATE_ERROR));

  /**
   * Closes the program edit modal
   */
  const closeProgramEditModal = () => {
    setEditProgramDetailsModal({
      isOpen: false,
      data: {} as IProgramDetails
    });
  };

  /**
   * Renders the edit program form
   * @param {any} form - The form object
   * @returns {React.ReactElement} The rendered form
   */
  const editProgramModalRender = (form: any): React.ReactElement => {
    if (editProgramDetailsModal.data) {
      return <ProgramForm isEdit={true} tenantId={tenantId} form={form} />;
    } else {
      toastCenter.error(APPCONSTANTS.ERROR, APPCONSTANTS.REGION_TENANT_ERROR);
      return <></>;
    }
  };

  /**
   * Handles program deletion
   * @param {{ data: IProgramList; index: number; pageNo: number }} param0
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
