import axios from 'axios'
import CONSTANTS from '@/shared/constants';

export default {

  get: (url, config = {}, $Progress) => { // eslint-disable-line
    $Progress && $Progress.start();
    return axios({
      method: 'get',
      url: CONSTANTS.API_BASE_URL + url,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(data => {
      $Progress && $Progress.finish();
      return data
    }).catch(err=> {
      $Progress && $Progress.fail()
      throw err;
    });
  },

  download: (url, config = {}, $Progress) => { // eslint-disable-line
    $Progress && $Progress.start();
    return axios({
      method: 'get',
      url: CONSTANTS.API_BASE_URL + url,
      headers: {
        Accept: "application/octet-stream",
        'Content-Type': "application/octet-stream",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      responseType:'arraybuffer'
    }).then(data => {
      $Progress && $Progress.finish();
      return data
    }).catch(err=> {
      $Progress && $Progress.fail()
      throw err;
    });
  },

  post: (url, data, config = {}, $Progress) => { // eslint-disable-line
    $Progress && $Progress.start();
    return axios({
      method: 'post',
      url: CONSTANTS.API_BASE_URL + url,
      data: data,
      ...config,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(data => {
      $Progress && $Progress.finish();
      return data
    }).catch(err=> {
      $Progress && $Progress.fail()
      throw err;
    });
  },

  put: (url, data, config = {}, $Progress) => { // eslint-disable-line
    $Progress && $Progress.start();
    return axios({
      method: 'put',
      url: CONSTANTS.API_BASE_URL + url,
      data: data,
      ...config,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(data => {
      $Progress && $Progress.finish();
      return data
    }).catch(err=> {
      $Progress && $Progress.fail()
      throw err;
    });
  },

  delete: (url, config = {}, $Progress) => { // eslint-disable-line
    $Progress && $Progress.start();
    return axios({
      method: 'delete',
      url: CONSTANTS.API_BASE_URL + url,
      ...config,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(data => {
      $Progress && $Progress.finish();
      return data
    }).catch(err=> {
      $Progress && $Progress.fail()
      throw err;
    });
  }
}
