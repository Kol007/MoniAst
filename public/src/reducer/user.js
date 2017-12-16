import { Record, Map } from 'immutable';
import {
  LOAD_USERS,
  POST_USER,
  ADD_USER,
  DELETE_USER,
  PATCH_USER,
  SUCCESS,
  START,
  FAIL,
  REDIRECT_COMPLETE
} from '../helpers/constants';
import { arrayToMapCustomKey } from '../store/helpers';

const UserModel = Record({
  _id: '',
  firstName: '',
  lastName: '',
  role: 'Client',
  username: '',
  sip: '',

  isLoading: false
});

const defaultState = new Map({
  entities: new Map({}),
  errorMessage: '',
  errorField: '',
  isError: false,
  isLoading: false,
  isLoaded: false,
  submitSuccess: false,
  shouldRedirect: ''
});

export default (state = defaultState, action) => {
  const { type, payload, response } = action;

  switch (type) {
    case LOAD_USERS + START:
      return state.set('isLoading', true);

    case LOAD_USERS + SUCCESS:
      return state
        .update('entities', entities =>
          entities.merge(arrayToMapCustomKey(response, user => new UserModel(user), 'username'))
        )
        .set('isLoading', false)
        .set('isLoaded', true);

    case LOAD_USERS + FAIL:
      return state
        .set('isLoading', false)
        .set('isLoaded', false)
        .set('isError', true)
        .set('errorMessage', response.errorMessage);

    case POST_USER + START:
      return state.set('shouldRedirect', '');

    case POST_USER + SUCCESS:
      return state
        .setIn(['entities', payload.username], new UserModel(response))
        .set('shouldRedirect', '/user');

    case POST_USER + FAIL:
      return state
        .set('isLoading', false)
        .set('isLoaded', false)
        .set('isError', true)
        .set('errorMessage', response.errorMessage)
        .set('errorField', response.field);

    case PATCH_USER + START:
      return state
        .setIn(['entities', payload.username, 'isLoading'], true)
        .set('shouldRedirect', '')
        .set('isError', false)
        .set('errorMessage', '')
        .set('errorField', '');

    case PATCH_USER + SUCCESS:
      return state
        .setIn(['entities', payload.username, 'isLoading'], false)
        .setIn(['entities', payload.username], new UserModel(response))
        .set('shouldRedirect', '/users');

    case PATCH_USER + FAIL:
      return state
        .setIn(['entities', payload.username, 'isLoading'], false)
        .set('isError', true)
        .set('errorMessage', response.errorMessage)
        .set('errorField', response.field);

    case REDIRECT_COMPLETE:
      return state.set('shouldRedirect', '');
  }

  return state;
};
