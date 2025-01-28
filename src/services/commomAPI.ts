import axios from 'axios';
import { IFetchSideMenuPayload } from '../store/common/types';
export const getSideMenu = (data: IFetchSideMenuPayload) =>
  axios({
    url: '/spice-service/static-data/menu',
    method: 'POST',
    data
  });
