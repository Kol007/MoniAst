import { START, SUCCESS, FAIL, LOG_OUT } from '../helpers/constants';
import { paramsForAPI } from '../helpers/common';
import axios from 'axios';

export default store => next => action => {
  const { callAPI, methodAPI, needAuth, payload, params, type, ...rest } = action;

  if (!callAPI) {
    return next(action);
  }

  next({ ...rest, type: type + START, payload });

  let options = {
    method: methodAPI || 'GET'
  };

  if (methodAPI === 'POST' || methodAPI === 'PUT' || methodAPI === 'PATCH') {
    options.headers = {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=utf-8', //axios
    };

    options.body = params ? paramsForAPI(params) : paramsForAPI(payload);
    options.data = params ? (params) : (payload);
  }

  if (needAuth) {
    axios.defaults.headers.common['Authorization'] = store.getState().auth.get('token');
  }


  options.url = callAPI;
  // FIXME for DEV
  options.url = process.env.NODE_ENV !== 'production' ? `${location.protocol}//${location.hostname}:3002${options.url}`: options.url;

  axios(options)
    .then(
      response => next({ ...rest, type: type + SUCCESS, response: response.data, payload }),
    )
    .catch(error => {
      if (error.response.status === 403 || error.response.status === 401) {
        next({ ...rest, payload, type: LOG_OUT });
      }

      return next({
        ...rest,
        type: type + FAIL,
        response: {
          errorMessage: error.response.data.errorMessage,
          field: error.response.data.field,
          errorCode: error.response.status
        }
      });
    });
};
