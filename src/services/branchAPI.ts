import axios from 'axios';
import {
  IFetchBranchListRequestPayload,
  ICreateBranchRequestPayload,
  IUpdateBranchRequestPayload
} from '../store/branch/types';

export const fetchBranchList = (data: IFetchBranchListRequestPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/branch/list',
    data: data
  });

export const createBranch = (data: ICreateBranchRequestPayload) =>
  axios({
    method: 'POST',
    url: '/admin-service/branch/create',
    data
  });

export const updateBranch = (data: IUpdateBranchRequestPayload) =>
  axios({
    method: 'PUT',
    url: '/admin-service/branch/update',
    data
  });

export const fetchBranchById = (branchId: number) =>
  axios({
    method: 'GET',
    url: `/admin-service/branch/${branchId}`
  });

export const fetchBranchesByUnions = (unionIds: number[]) =>
  axios({
    method: 'POST',
    url: '/admin-service/branch/list-by-unions',
    data: { unionIds }
  });
