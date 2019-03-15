import { Record, Map, fromJS } from 'immutable';
import {
  LOAD_USERS,
  POST_USER,
  PATCH_USER,
  SUCCESS,
  START,
  FAIL,
  DELETE_USER,
  LOAD_USER
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
      return state.withMutations(s =>
        s
          .update('entities', entities =>
            entities.merge(arrayToMapCustomKey(response, user => new UserModel(user), 'username'))
          )
          .set('isLoading', false)
          .set('isLoaded', true)
      );

    case LOAD_USERS + FAIL:
      return state.withMutations(s =>
        s
          .set('isLoading', false)
          .set('isLoaded', false)
          .set('isError', true)
          .set('errorMessage', response.errorMessage)
      );

    case LOAD_USER + START:
      return state.set('isLoading', true);

    case LOAD_USER + SUCCESS:
      return state.withMutations(s =>
        s
          .update('entities', entities =>
            entities.merge(fromJS({ [response.username]: new UserModel(response) }))
          )
          .set('isLoading', false)
          .set('isLoaded', true)
      );

    case LOAD_USER + FAIL:
      return state.withMutations(s =>
        s
          .set('isLoading', false)
          .set('isLoaded', false)
          .set('isError', true)
          .set('errorMessage', response.errorMessage)
      );

    case POST_USER + START:
      return state
        .set('submitSuccess', false)
        .set('isError', false)
        .set('errorMessage', '')
        .set('errorField', '');

    case POST_USER + SUCCESS:
      return state.withMutations(s =>
        s
          .setIn(['entities', payload.username], new UserModel(response))
          .set('isLoading', false)
          .set('isLoaded', true)
          .set('isError', false)
          .set('errorMessage', '')
          .set('errorField', '')
          .set('submitSuccess', true)
      );

    case POST_USER + FAIL:
      return state
        .set('isLoading', false)
        .set('isLoaded', false)
        .set('isError', true)
        .set('errorMessage', response.errorMessage)
        .set('errorField', response.field)
        .set('submitSuccess', false);

    case DELETE_USER + START:
      return state.set('submitSuccess', false);

    case DELETE_USER + SUCCESS:
      return state.withMutations(s =>
        s
          .removeIn(['entities', payload.username], new UserModel(response))
          .set('submitSuccess', true)
      );

    case DELETE_USER + FAIL:
      return state.withMutations(s =>
        s
          .set('isLoading', false)
          .set('isLoaded', false)
          .set('isError', true)
          .set('errorMessage', response.errorMessage)
          .set('errorField', response.field)
          .set('submitSuccess', false)
      );

    case PATCH_USER + START:
      return state.withMutations(s =>
        s
          .setIn(['entities', payload.username, 'isLoading'], true)
          .set('isError', false)
          .set('errorMessage', '')
          .set('errorField', '')
          .set('submitSuccess', false)
      );

    case PATCH_USER + SUCCESS:
      return state.withMutations(s =>
        s
          .setIn(['entities', payload.username, 'isLoading'], false)
          .setIn(['entities', payload.username], new UserModel(response))
          .set('submitSuccess', true)
      );

    case PATCH_USER + FAIL:
      return state.withMutations(s =>
        s
          .setIn(['entities', payload.username, 'isLoading'], false)
          .set('isError', true)
          .set('errorMessage', response.errorMessage)
          .set('errorField', response.field)
          .set('submitSuccess', false)
      );

    default:
      return state;
  }
};
