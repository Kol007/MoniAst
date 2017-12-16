import {
  API_URL,
  POST_USER,
  LOAD_USERS,
  PATCH_USER,
  DELETE_USER,
  REDIRECT_COMPLETE
} from '../helpers/constants';

export function getUsers() {
  return {
    type: LOAD_USERS,
    callAPI: `${API_URL}/users`,
    needAuth: true
  };
}

export function getUser(username) {
  return {
    type: POST_USER,
    payload: { username },
    callAPI: `${API_URL}/users/${username}`,
    needAuth: true
  };
}

export function patchUser(username, params) {
  return {
    type: PATCH_USER,
    payload: { username, params },
    callAPI: `${API_URL}/users/${username}`,
    needAuth: true,
    methodAPI: 'PATCH',
    params
  };
}

export function postUser(params) {
  return {
    type: POST_USER,
    payload: { params },
    callAPI: `${API_URL}/users/register`,
    needAuth: true,
    methodAPI: 'POST',
    params
  };
}

export function deleteUser(username) {
  return {
    type: DELETE_USER,
    payload: { username },
    callAPI: `${API_URL}/users/${username}`,
    needAuth: true,
    methodAPI: 'DELETE',
  };
}

export function redirectComplete() {
  return {
    type: REDIRECT_COMPLETE
  }
}