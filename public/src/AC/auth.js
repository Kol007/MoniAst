import {
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  PROTECTED_TEST,
  LOG_OUT,
  LOAD_USERS,
  ADD_USER,
  DELETE_USER
} from '../constants';

// const API_URL = 'http://localhost:3001/api';
const API_URL = 'http://93.89.215.83:3001/api';

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
  return {type: LOG_OUT}
}

// export function errorHandler(dispatch, error, type) {
//   let errorMessage = '';
//
//   if (error.data.error) {
//     errorMessage = error.data.error;
//   } else if (error.data) {
//     errorMessage = error.data;
//   } else {
//     errorMessage = error;
//   }
//
//   if (error.status === 401) {
//     dispatch({
//       type: type,
//       payload: 'You are not authorized to do this. Please login and try again.'
//     });
//     logoutUser();
//   } else {
//     dispatch({
//       type: type,
//       payload: errorMessage
//     });
//   }
// }