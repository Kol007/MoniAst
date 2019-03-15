import { createImmutableEqualSelector } from './_helper';

export const getChannelsState = state => state.get('channels');

const getChannelsBySip = (state, sipPeer) =>
  state.get('channels').filter(item => item.sip === sipPeer.sip);

export const getChannelsBySipState = () => {
  return createImmutableEqualSelector([getChannelsBySip], channels => channels);
};
