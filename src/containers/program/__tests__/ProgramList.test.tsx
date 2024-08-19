import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import ProgramList from '../ProgramList';
import { deleteProgramRequest, fetchProgramListRequest } from '../../../store/program/actions';
import { IProgramList } from '../../../store/program/types';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useHistory: jest.fn()
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));
jest.mock('../../../components/modal/ModalForm', () => () => null);
const useTablePaginationHook = jest.fn();

describe('ProgramList', () => {
  const dispatchMock = jest.fn();
  const programsMock = ['program1', 'program2'];
  const programCountMock = 2;
  const loadingMock = false;

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as any).mockReturnValue(dispatchMock);
    (useSelector as any).mockImplementation((selector: any) =>
      selector({
        programList: programsMock,
        programListTotal: programCountMock,
        programLoading: loadingMock,
        program: {
          total: 10
        }
      })
    );
    (useParams as any).mockReturnValue({ regionId: 'region123', tenantId: 'tenant123' });
    (useHistory as any).mockReturnValue({ push: jest.fn() });

    useTablePaginationHook.mockReturnValue({
      listParams: { page: 1, rowsPerPage: 10, searchTerm: '' },
      handleSearch: jest.fn(),
      handlePage: jest.fn()
    });
  });

  it('should fetch program list on mount', () => {
    render(<ProgramList />);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(
      fetchProgramListRequest({
        data: expect.objectContaining({
          tenantId: 'tenant123',
          country: 'region123',
          skip: 0,
          limit: 10,
          search: ''
        }),
        failureCb: expect.any(Function)
      })
    );
  });
});
