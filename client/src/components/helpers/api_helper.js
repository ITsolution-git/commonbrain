import axios from "axios";
// import { api } from "../../config.json";
import auth from "../../auth.js";

export function get(path) {
  return axios.get(path, {
    headers: auth.getHeaders()
  });
}

export function post(path, params = {}) {
  return axios.post(path, params, {
    headers: auth.getHeaders()
  });
}

export function put(path, params = {}) {
  return axios.put(path, params, {
    headers: auth.getHeaders()
  });
}

export function deleteRequest(path) {
  return axios.delete(path, {
    headers: auth.getHeaders()
  });
}
