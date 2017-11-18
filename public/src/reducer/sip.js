import {
  CHANGE_SIP_STATUS,
  LOAD_ALL_SIPS,
  START,
  SUCCESS,
  FAIL,
  SIP_SPY,
  SIP_SPY_WHISPER
} from '../constants';

import { SIP_STATUS_UNAVAILABLE, SIP_SELECT, SIP_FILTER, SIP_FILTER_ALL } from '../constants';
import { Record, Map, OrderedMap } from 'immutable';
import { arrayToMap } from '../store/helpers';

const SipModel = Record({
  login: 'Default',
  sip: 0,
  online: false,
  status: SIP_STATUS_UNAVAILABLE
});

const defaultState = new Map({
  entities: new OrderedMap({}),
  isLoading: false,
  isLoaded: false,
  selectedSip: '',
  filter: SIP_FILTER_ALL,

  sipSpy: new Map({
    isError: false,
    status: '',
    message: ''
  })
});

export default (state = defaultState, action) => {
  const { type, payload, response } = action;

  switch (type) {
    case LOAD_ALL_SIPS + START:
      return state.set('isLoading', true);

    case LOAD_ALL_SIPS + SUCCESS:
      return state
        .update('entities', entities =>
          entities
            .merge(arrayToMap(response, sip => new SipModel(sip)))
            .sort((a, b) => a.sip - b.sip)
            .sort((a, b) => b.online - a.online)
        )
        .set('isLoading', false)
        .set('isLoaded', true);

    case LOAD_ALL_SIPS + FAIL:
      return state;

    case CHANGE_SIP_STATUS:
      return state
        .setIn(['entities', payload.sip, 'status'], payload.status)
        .setIn(['entities', payload.sip, 'online'], payload.online)
        .update('entities', entities =>
          entities
            .sort((a, b) => a.sip - b.sip)
            .sort((a, b) => b.online - a.online)
        );

    case SIP_SELECT:
      return state.set('selectedSip', payload.sip);

    case SIP_FILTER:
      return state.set('filter', payload.filter);

    case SIP_SPY + START:
      return state;
    case SIP_SPY + SUCCESS:
      return state
        .setIn(['sipSpy', 'isError'], response.status === 'Failure')
        .setIn(['sipSpy', 'message'], response.reason)
        .setIn(['sipSpy', 'status'], response.status);
    case SIP_SPY + FAIL:
      return state
        .setIn(['sipSpy', 'isError'], true)
        .setIn(['sipSpy', 'message'], 'Ошибка API.');

  }

  return state;
};
