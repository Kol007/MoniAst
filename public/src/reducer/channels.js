import { LOAD_ALL_CHANNELS, START, SUCCESS, FAIL, NEW_CHANNEL, REMOVE_CHANNEL } from '../constants';
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

export default (channels = defaultState, action) => {
  const { type, payload, response } = action;

  switch (type) {
    case LOAD_ALL_CHANNELS + SUCCESS:
      return channels.merge(arrayToMap(response, channel => new ChannelModel(channel)));

    case LOAD_ALL_CHANNELS + FAIL:
      return channels;

    case NEW_CHANNEL:
      return channels.setIn(
        [payload.channel.channel.id],
        new ChannelModel({ ...payload.channel.channel })
      );

    case REMOVE_CHANNEL:
      return channels.delete(payload.id);
  }

  return channels;
};
