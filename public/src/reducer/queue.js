import {
  FAIL,
  LOAD_ALL_QUEUES,
  QUEUE_JOIN,
  QUEUE_LEAVE,
  QUEUE_MEMBER_STATUS,
  START,
  SUCCESS
} from "../helpers/constants";

import { Map, Record, OrderedMap } from "immutable";

const QueueParamsModel = Record({
  queue: "",
  max: "0",
  strategy: "ringall",
  calls: "1",
  holdtime: "109",
  talktime: "97",
  completed: "116",
  abandoned: "42",
  servicelevel: "60",
  servicelevelperf: "52.6",
  weight: "0"
});

const QueueMemberModel = Record({
  queue: "",
  login: "",
  sip: "",
  location: "Local/143@from-queue/n",
  penalty: "0",
  callstaken: "5",
  lastcall: "1536960877",
  status: "",
  paused: "0",
  online: false
});

const QueueEntryModel = Record({
  queue: "Default",
  position: 0,
  channel: false,
  calleridnum: "",
  calleridname: "",
  connectedlinenum: "",
  connectedlinename: "",
  wait: "0",
  date: 0,
  uniqueid: ""
});

const defaultState = new Map({
  entities: new Map({}),
  isLoading: false,
  isLoaded: false,
  // selectedSip: '',
  // filter: SIP_FILTER_ALL,

  sipSpy: new Map({
    isError: false,
    status: "",
    message: ""
  })
});

export default (state = defaultState, action) => {
  const { type, payload, response } = action;

  switch (type) {
    case LOAD_ALL_QUEUES + START:
      return state.set("isLoading", true);

    case LOAD_ALL_QUEUES + SUCCESS:
      return state
        .update("entities", entities =>
          entities.merge(arrayToMapQueues(response))
        )
        .set("isLoading", false)
        .set("isLoaded", true);

    case LOAD_ALL_QUEUES + FAIL:
      return state;

    case QUEUE_JOIN:
      return state.setIn(
        ["entities", payload.entry.queue, "entries", payload.entry.uniqueid],
        new QueueEntryModel(payload.entry)
      );

    case QUEUE_LEAVE:
      return state.deleteIn([
        "entities",
        payload.entry.queue,
        "entries",
        payload.entry.uniqueid
      ]);

    case QUEUE_MEMBER_STATUS:
      return state.setIn(
        ["entities", payload.data.queue, "members", payload.data.sip],
        new QueueMemberModel(payload.data)
      );
  }

  return state;
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
          (acc, entity) =>
            acc.set(entity.uniqueid, new QueueEntryModel(entity)),
          new Map({})
        )
      })
    );
  }, new Map({}));

  return res;
}
