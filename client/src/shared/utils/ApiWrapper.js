import axios from 'axios'
import CONSTANTS from '@/shared/constants';

export default {

  get: (url, config = {}) => { // eslint-disable-line
    return axios({
      method: 'get',
      url: CONSTANTS.API_BASE_URL + url,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(data => data);
  },

  post: (url, data, config = {}) => { // eslint-disable-line
    return axios({
      method: 'post',
      url: CONSTANTS.API_BASE_URL + url,
      data: data,
      ...config,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(data => data);
  },

  put: (url, data, config = {}) => { // eslint-disable-line
    return axios({
      method: 'put',
      url: CONSTANTS.API_BASE_URL + url,
      data: data,
      ...config,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(data => data);
  },

  delete: (url, config = {}) => { // eslint-disable-line
    return axios({
      method: 'delete',
      url: CONSTANTS.API_BASE_URL + url,
      ...config,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(data => data);
  }
}
