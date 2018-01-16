import {
  API_URL,
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  PROTECTED_TEST,
  LOG_OUT,
  LOAD_USERS,
  ADD_USER,
  DELETE_USER,
  START,
  SUCCESS,
  FAIL
} from '../helpers/constants';

import axios from 'axios';

export function loginUser({ username, password, path }) {
  return dispatch => {
    dispatch({
      type: AUTH_USER + START
    });

    const url = `${API_URL}/auth/login`;

    axios({
      method: 'post',
      url: url,
      data: { username, password }
    })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('sip', response.data.user.sip);

        dispatch({
          type: AUTH_USER + SUCCESS,
          payload: { username, password, path },
          response: response.data
        });
      })
      .catch(error => {
        dispatch({
          type: AUTH_USER + FAIL,
          payload: { username, password, path },
          response: {
            errorMessage: error.response.data.errorMessage,
            field: error.response.data.field,
            errorCode: error.response.status
          }
        });
      });
  };
}

export function logOutUser() {
  localStorage.removeItem('token');
  return { type: LOG_OUT };
}
