import { Record, Map } from 'immutable';
import {
  LOAD_USERS,
  POST_USER,
  ADD_USER,
  DELETE_USER,
  PATCH_USER,
  SUCCESS,
  START,
  FAIL
} from '../constants';
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

  isError: false,
  isLoading: false,
  isLoaded: false
});

export default (state = defaultState, action) => {
  const { type, payload, response } = action;

  switch (type) {
    case LOAD_USERS + START:
      return state.set('isLoading', true);

    case LOAD_USERS + SUCCESS:
      return state
        .update('entities', entities =>
          entities.merge(
            arrayToMapCustomKey(
              response,
              user => new UserModel(user),
              'username'
            )
          )
        )
        .set('isLoading', false)
        .set('isLoaded', true);

    case LOAD_USERS + FAIL:
      console.log('---', LOAD_USERS + FAIL, response);
      return state
        .set('isLoading', false)
        .set('isLoaded', false)
        .set('isError', true);

    case POST_USER + START:
      return state.setIn(['entities', payload.username, 'isLoading'], true);

    case POST_USER + SUCCESS:
      return state.setIn(
        ['entities', payload.username],
        new UserModel(response)
      );

    case PATCH_USER + START:
      return state.setIn(['entities', payload.username, 'isLoading'], true);

    case PATCH_USER + SUCCESS:
      return state.setIn(
        ['entities', payload.username],
        new UserModel(response)
      );
  }

  return state;
};
