import {
  FAIL,
  LOAD_ALL_QUEUES,
  QUEUE_JOIN,
  QUEUE_LEAVE,
  QUEUE_MEMBER_STATUS,
  START,
  SUCCESS
} from '../helpers/constants';

import { Map, Record, OrderedMap } from 'immutable';

const QueueParamsModel = Record({
  queue: '',
  max: '0',
  strategy: 'ringall',
  calls: '1',
  holdtime: '109',
  talktime: '97',
  completed: '116',
  abandoned: '42',
  servicelevel: '60',
  servicelevelperf: '52.6',
  weight: '0'
});

const QueueMemberModel = Record({
  queue: '',
  login: '',
  sip: '',
  location: 'Local/143@from-queue/n',
  penalty: '0',
  callstaken: '5',
  lastcall: '1536960877',
  status: '',
  paused: '0',
  online: false
});

const QueueEntryModel = Record({
  queue: 'Default',
  position: 0,
  channel: false,
  calleridnum: '',
  calleridname: '',
  connectedlinenum: '',
  connectedlinename: '',
  wait: '0',
  date: 0,
  uniqueid: ''
});

const defaultState = new Map({
  entities: new Map({}),
  isLoading: false,
  isLoaded: false,
  // selectedSip: '',
  // filter: SIP_FILTER_ALL,

  sipSpy: new Map({
    isError: false,
    status: '',
    message: ''
  })
});

export default (state = defaultState, action) => {
  const { type, payload, response } = action;
  let i = 0;

  switch (type) {
    case LOAD_ALL_QUEUES + START:
      return state.set('isLoading', true).set('isLoaded', false);

    case LOAD_ALL_QUEUES + SUCCESS:
      return state
        .update('entities', entities => entities.merge(arrayToMapQueues(response)))
        .set('isLoading', false)
        .set('isLoaded', true);

    case LOAD_ALL_QUEUES + FAIL:
      return state.set('isLoading', false).set('isLoaded', false);

    case QUEUE_JOIN:
      return state.withMutations(s =>
        s
          .setIn(
            ['entities', payload.entry.queue, 'entries', payload.entry.uniqueid],
            new QueueEntryModel(payload.entry)
          )
          .updateIn(['entities', payload.entry.queue, 'entries'], item =>
            item.map(keyValue => keyValue.set('position', ++i))
          )
      );

    case QUEUE_LEAVE:
      return state.withMutations(s =>
        s
          .deleteIn(['entities', payload.entry.queue, 'entries', payload.entry.uniqueid])
          .updateIn(
            ['entities', payload.entry.queue, 'entries'],
            item => (item ? item.map(keyValue => keyValue.set('position', ++i)) : [])
          )
      );

    case QUEUE_MEMBER_STATUS:
      return state.setIn(
        ['entities', payload.data.queue, 'members', payload.data.sip],
        new QueueMemberModel(payload.data)
      );

    default:
      return state;
  }
};

function arrayToMapQueues(queues) {
  let keys = Object.keys(queues);
  let res = keys.reduce((accMain, key) => {
    const el = queues[key];

    return accMain.set(
      key,
      new Map({
        params: new QueueParamsModel(el.params),
        members: el.members.reduce(
          (acc, entity) => acc.set(entity.sip, new QueueMemberModel(entity)),
          new OrderedMap({})
        ),
        entries: el.entries.reduce(
          (acc, entity) => acc.set(entity.uniqueid, new QueueEntryModel(entity)),
          new OrderedMap({})
        )
      })
    );
  }, new Map({}));

  return res;
}
