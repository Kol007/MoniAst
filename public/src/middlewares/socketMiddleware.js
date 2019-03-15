import { newChannel, removeChannel } from '../AC/channels';
import { changeSipStatus } from '../AC/sip';
import { changeQueueMemberStatus } from '../AC/queue';
import { BRIDGE_STOP } from '../helpers/constants';

import io from 'socket.io-client';
import { queueJoin, queueLeave } from 'AC/queue';

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

  // FIXME for DEV
  // eslint-disable-next-line
  const wsPort = process.env.NODE_ENV !== 'production' ? 3002 : location.port;

  // FIXME for DEV
  // eslint-disable-next-line
  const url = `${location.protocol}//${location.hostname}:${wsPort}`;
  const socket = io.connect(
    url,
    {
      query: {
        token: token.split(' ')[1]
      }
    }
  );

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

  socket.on('change-queue-member-status', data => {
    store.dispatch(changeQueueMemberStatus(data));
  });

  socket.on('queue-join', data => {
    store.dispatch(queueJoin({ entry: data, id: data.uniqueid }));
  });

  socket.on('queue-leave', data => {
    store.dispatch(queueLeave({ entry: data, id: data.uniqueid }));
  });
}
