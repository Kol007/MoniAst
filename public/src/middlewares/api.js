import { START, SUCCESS, FAIL, LOG_OUT } from '../constants';

export default store => next => action => {
  const {
    callAPI,
    methodAPI,
    needAuth,
    payload,
    params,
    type,
    ...rest
  } = action;
  if (!callAPI) return next(action);

  next({ ...rest, type: type + START, payload });

  let options = {
    method: methodAPI || 'GET'
  };

  if (methodAPI === 'POST' || methodAPI === 'PUT' || methodAPI === 'PATCH') {
    options.headers = {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    };

    options.body = params ? paramsForAPI(params) : paramsForAPI(payload);
  }

  if (needAuth) {
    const token = store.getState().auth.get('token');
    options.headers = Object.assign({}, options.headers, {
      Authorization: `${token}`
    });
  }
console.log('---', options, type);
    fetch(callAPI, options)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        throw new UserException(res.statusText, res.status);
      })
      .then(response => next({ ...rest, type: type + SUCCESS, response, payload }))
      .catch(error => {
        if (error.status === 403 || error.status === 401) {
          next({ ...rest, payload, type: LOG_OUT });
        }

        return next({
          ...rest,
          type: type + FAIL,
          errorMessage: error.message,
          errorCode: error.status
        });
      });
};

function UserException(message, status) {
  this.message = message;
  this.status = status;
}

function paramsForAPI(params) {
  return Object.keys(params)
    .map(el => `${el}=${params[el]}`)
    .join('&');
}
