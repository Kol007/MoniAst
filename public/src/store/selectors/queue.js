import { createImmutableEqualSelector } from './_helper';

export const getQueuesIsLoadedState = state => state.getIn(['queue', 'isLoaded']);

export const getQueuesIsLoadingState = state => state.getIn(['queue', 'isLoading']);

const getQueuesKeys = state => state.getIn(['queue', 'entities']).map((el, key) => key);

export const getQueuesKeysState = createImmutableEqualSelector([getQueuesKeys], queue => queue);

const getFilteredMembers = (state, entity) => state.getIn(['queue', 'entities', entity, 'members']);

export const getFilteredMembersState = () => {
  return createImmutableEqualSelector([getFilteredMembers], sip =>
    sip.filter(el => el.online).sort((a, b) => a.sip - b.sip)
  );
};

export const getFilteredMembersLengthState = () => {
  return createImmutableEqualSelector(
    [getFilteredMembers],
    sip => sip.filter(el => el.online).size
  );
};

const getDetail = (state, entity) => state.getIn(['queue', 'entities', entity, 'params']);

export const getDetailState = () => {
  return createImmutableEqualSelector([getDetail], state => state);
};

const getQueueEntries = (state, queueId) => state.getIn(['queue', 'entities', queueId, 'entries']);

export const getQueueEntriesState = () => {
  return createImmutableEqualSelector([getQueueEntries], entries => {
    return entries.sort((a, b) => b.wait - a.wait);
  });
};

const getQueueSipPeer = (state, { memberOfQueue, sip }) =>
  state.getIn(['queue', 'entities', memberOfQueue, 'members', sip]);
export const getQueueSipPeerState = () =>
  createImmutableEqualSelector([getQueueSipPeer], state => state);
