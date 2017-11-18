import { API_URL, BRIDGE_START, BRIDGE_STOP, LOAD_ALL_CHANNELS, START, SUCCESS, FAIL, NEW_CHANNEL, REMOVE_CHANNEL } from '../constants';

export function loadChannels() {
  return {
    type: LOAD_ALL_CHANNELS,
    callAPI: `${API_URL}/channels`,
    needAuth: true
  }
}

export function newChannel(channel) {
  return {
    type: NEW_CHANNEL,
    payload: {channel},
    needAuth: true
  }
}

export function removeChannel(id) {
  return {
    type: REMOVE_CHANNEL,
    payload: { id },
    needAuth: true
  }
}