import {
  API_URL,
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  PROTECTED_TEST,
  LOG_OUT,
  LOAD_USERS,
  ADD_USER,
  DELETE_USER
} from '../helpers/constants';

export function loginUser({ username, password, path }) {
  return {
    type: AUTH_USER,
    payload: { username, password, path },
    callAPI: `${API_URL}/auth/login`,
    methodAPI: 'POST'
  };
}

export function logOutUser() {
  localStorage.removeItem('token');
  return { type: LOG_OUT };
}

