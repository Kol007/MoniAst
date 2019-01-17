import { createSelectorCreator, defaultMemoize } from "reselect";
import { is } from "immutable";
import { SIP_FILTER_ALL, SIP_FILTER_ONLINE } from "../helpers/constants";
// import moment from 'moment';

const filters = {
  [SIP_FILTER_ONLINE]: el => el.online,
  [SIP_FILTER_ALL]: () => true
};

const createImmutableEqualSelector = createSelectorCreator(defaultMemoize, is);

const getFilteredSips = state => state.sip.get("entitiesSimple");
const getSipFilter = state => state.sip.get("filter");

export const getFilteredSipsState = createImmutableEqualSelector(
  [getFilteredSips, getSipFilter],
  (sip, filter) => {
    if (filter === SIP_FILTER_ALL) {
      return sip
        .sort((a, b) => a.sip - b.sip)
        .sort((a, b) => b.online - a.online)
        .filter(sip => !sip.isTrunk);
    }

    return sip
      .sort((a, b) => a.sip - b.sip)
      .sort((a, b) => b.online - a.online)
      .filter(sip => !sip.isTrunk)
      .filter(filters[filter]);
  }
);

export const getFilteredTrunksState = createImmutableEqualSelector(
  [getFilteredSips, getSipFilter],
  (sip, filter) => {
    if (filter === SIP_FILTER_ALL) {
      return sip
        .filter(sip => sip.isTrunk)
        .sort((a, b) => a.sip > b.sip)
        .sort((a, b) => b.online - a.online);
    }

    return sip
      .filter(sip => sip.isTrunk)
      .filter(filters[filter])
      .sort((a, b) => a.sip > b.sip)
      .sort((a, b) => b.online - a.online);
  }
);

const getChannelsBySip = (state, props) =>
  state.channels.filter(item => item.sip === props.sipPeer.sip);
// const channelsBySip = channels && channels.filter(item => item.sip === sipPeer.sip);

export const getChannelsBySipState = () => {
  return createImmutableEqualSelector([getChannelsBySip], channels => {
    return channels;
  });
};

// QUEUES      queues: state.queue.get('entities').map((item, key) => key),
const getQueuesKeys = state =>
  state.queue.get("entities").map((item, key) => key);

export const getQueuesKeysState = createImmutableEqualSelector(
  [getQueuesKeys],
  sip => sip
);

const getFilteredMembers = (state, entity) =>
  state.queue.getIn(["entities", entity, "members"]);

export const getFilteredMembersState = () => {
  return createImmutableEqualSelector([getFilteredMembers], sip =>
    sip.filter(el => el.online).sort((a, b) => a.sip - b.sip)
  );
};

const getQueueEntries = (state, entity) =>
  state.queue.getIn(["entities", entity, "entries"]);

export const getQueueEntriesState = () => {
  return createImmutableEqualSelector([getQueueEntries], entries =>
    entries.sort((a, b) => a.position - b.position)
  );
};
