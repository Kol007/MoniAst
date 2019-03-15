import { createImmutableEqualSelector } from './_helper';

import { SIP_FILTER_ALL, SIP_FILTER_ONLINE } from '../../helpers/constants';

export const getSipIsLoadedState = state => state.getIn(['sip', 'isLoaded']);
export const getSipIsLoadingState = state => state.getIn(['sip', 'isLoading']);

export const getSipSelectedSipState = state => state.getIn(['sip', 'selectedSip']);

export const getSipSpyIsErrorState = state => state.getIn(['sip', 'sipSpy', 'isError']);
export const getSipSpyStatusState = state => state.getIn(['sip', 'sipSpy', 'status']);
export const getSipSpyMessageState = state => state.getIn(['sip', 'sipSpy', 'message']);

export const getSipFilter = state => state.getIn(['sip', 'filter']);
export const getSipFilterState = getSipFilter;

const getSipPeer = (state, sip) => state.getIn(['sip', 'entities', sip]);
export const getSipPeerState = () => createImmutableEqualSelector([getSipPeer], state => state);

const filters = {
  [SIP_FILTER_ONLINE]: el => el.online,
  [SIP_FILTER_ALL]: () => true
};

const getFilteredSips = state => state.getIn(['sip', 'entitiesSimple']);

export const getFilteredSipsState = createImmutableEqualSelector(
  [getFilteredSips, getSipFilter],
  (sip, filter) => {
    if (filter === SIP_FILTER_ALL) {
      return sip
        .filter(sip => !sip.isTrunk)
        .sort((a, b) => a.sip - b.sip)
        .sort((a, b) => b.online - a.online);
    }

    return sip
      .filter(sip => !sip.isTrunk)
      .filter(filters[filter])
      .sort((a, b) => a.sip - b.sip)
      .sort((a, b) => b.online - a.online);
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
