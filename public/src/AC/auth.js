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

    const url = process.env.NODE_ENV === 'production' ? `${API_URL}/auth/login` : `${location.protocol}//${location.hostname}:3002${API_URL}/auth/login`;
    // const url = `${API_URL}/auth/login`;

    axios({
      url,
      method: 'post',
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
            errorMessage: error.response ? error.response.data : 'No response',
            field: error.response ? error.response.data.field : '',
            errorCode: error.response ? error.response.status : 0
          }
        });
      });
  };
}

export function logOutUser() {
  localStorage.removeItem('token');
  return { type: LOG_OUT };
}
