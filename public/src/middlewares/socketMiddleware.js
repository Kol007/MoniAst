// import actions from './actions';
import { newChannel, removeChannel } from '../AC/channels';
import { changeSipStatus } from '../AC/sip';
import {
  BRIDGE_START,
  BRIDGE_STOP,
  LOAD_ALL_CHANNELS,
  NEW_CHANNEL,
  REMOVE_CHANNEL
} from '../constants';

import io from 'socket.io-client';

var socket = null;

export function webSocketMiddleware(store) {
  return next => action => {
    if (socket && action.type === BRIDGE_STOP) {
      socket.emit('message', action.message);
    }

    return next(action);
  };
}

export default function(store) {
  const token = localStorage.token;
  if (!token) {
    return;
  }

  const url = `${location.protocol}//${location.hostname}:${location.port}`;
  const socket = io.connect(url, {
    query: {
      token: token.split(' ')[1]
    }
  });

  socket.on('unauthorized', function(error) {
    if (error.data.type === 'UnauthorizedError' || error.data.code === 'invalid_token') {
      // redirect user to login page perhaps?
    }
  });

  socket.on('remove-channel', data => {
    store.dispatch(removeChannel(data));
  });

  socket.on('new-channel', data => {
    store.dispatch(newChannel({ channel: data, id: data.id }));
  });

  socket.on('change-sip-status', data => {
    store.dispatch(
      changeSipStatus({
        sip: data.sip,
        status: data.status,
        online: data.online
      })
    );
  });
}
