import { Record, Map } from 'immutable';
import { AUTH_USER, SUCCESS, START, FAIL, LOG_OUT } from '../constants';

const localStorageToken = localStorage.getItem('token');
const localStorageSip = localStorage.getItem('sip');

const defaultState = new Map({
  isError: false,
  token: localStorageToken,
  sip: localStorageSip,
  isLoading: false,
  isLoggedIn: !!localStorageToken,
  expires: 0,
  errorMessage: '',
  errorCode: 100,

  from: '/'
});

export default function(state = defaultState, action) {
  const { type, payload, response, errorMessage, errorCode } = action;

  switch (type) {
    case AUTH_USER + SUCCESS:
      // const isNotExpired   = (moment(response.expires, "YYYY-MM-DD HH:mm:ssZZ").unix()) > moment().unix();

      localStorage.setItem('token', response.token);
      localStorage.setItem('sip', response.user.sip);

      return (
        state
          // .set('expires', moment(response.expires, "YYYY-MM-DD HH:mm:ssZZ").unix())
          .set('token', response.token)
          .set('sip', response.user.sip)
          .set('isLoggedIn', true)
          .set('isError', false)
          .set('isLoading', false)
      );

    case AUTH_USER + START:
      return state
        .set('isError', false)
        .set('isLoggedIn', false)
        .set('expires', 0)
        .set('isLoading', true);

    case AUTH_USER + FAIL:
      return state
        .set('isLoggedIn', false)
        .set('isError', true)
        .set('expires', 0)
        .set('errorCode', errorCode)
        .set('errorMessage', errorMessage)
        .set('isLoading', false);

    case LOG_OUT:
      return state
        .set('isLoggedIn', false)
        .set('isError', false)
        .set('token', '')
        .set('sip', '')
        .set('expires', 0)
        .set('isLoading', false);
  }

  return state;
}
