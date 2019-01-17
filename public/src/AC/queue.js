import {
  API_URL,
  LOAD_ALL_QUEUES,
  QUEUE_JOIN,
  QUEUE_LEAVE,
  QUEUE_MEMBER_STATUS
} from '../helpers/constants';

export function getQueues() {
  return {
    type    : LOAD_ALL_QUEUES,
    callAPI : `${API_URL}/queue`,
    needAuth: true
  };
}

export function queueJoin({ entry, id }) {
  return {
    type    : QUEUE_JOIN,
    payload : entry,
    needAuth: true
  };
}

export function queueLeave({ entry, id }) {
  return {
    type    : QUEUE_LEAVE,
    payload : entry,
    needAuth: true
  };
}

export function changeQueueMemberStatus(data) {
  return {
    type: QUEUE_MEMBER_STATUS,
    payload: { data },
    needAuth: true
  };
}