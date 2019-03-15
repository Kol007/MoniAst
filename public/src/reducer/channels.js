import {
  LOAD_ALL_CHANNELS,
  START,
  SUCCESS,
  FAIL,
  NEW_CHANNEL,
  REMOVE_CHANNEL
} from '../helpers/constants';
import { Record, Map } from 'immutable';
import { arrayToMap } from '../store/helpers';

const ChannelModel = Record({
  sip: 0,
  connectedlinenum: 0,
  id: '',
  duration: 0,
  date: 0,
  status: 0,
  channel: ''
});

const defaultState = new Map({});

export default (state = defaultState, action) => {
  const { type, payload, response } = action;

  switch (type) {
    case LOAD_ALL_CHANNELS + START:
      return state;

    case LOAD_ALL_CHANNELS + SUCCESS:
      return state.merge(arrayToMap(response, channel => new ChannelModel(channel)));

    case LOAD_ALL_CHANNELS + FAIL:
      return state;

    case NEW_CHANNEL:
      return state.setIn(
        [payload.channel.channel.id],
        new ChannelModel({ ...payload.channel.channel })
      );

    case REMOVE_CHANNEL:
      return state.delete(payload.id);

    default:
      return state;
  }
};
