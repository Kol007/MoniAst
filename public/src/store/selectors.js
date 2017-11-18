import { createSelector } from 'reselect';
// import moment from 'moment';

import { SIP_FILTER_ONLINE, SIP_FILTER_ALL } from '../constants';

const filters = {
  [SIP_FILTER_ONLINE]: el => el.online,
  [SIP_FILTER_ALL]: () => true
};

const getFilteredSips = state => state.sip.get('entities').toArray();
const getSipFilter = state => state.sip.get('filter');

export const getFilteredSipsState = createSelector(
  [getFilteredSips, getSipFilter],
  (sip, filter) => {
    return sip.filter(sip => sip.login).filter(filters[filter]);
  }
);

export const getFilteredTrunksState = createSelector(
  [getFilteredSips, getSipFilter],
  (sip, filter) => {
    return sip
      .filter(sip => !sip.login)
      .filter(filters[filter])
      .sort((a, b) => a.sip > b.sip)
      .sort((a, b) => b.online - a.online);
  }
);

///////////////////////////////////////////////////////////////////////////
// const getNotifications = state =>
//   state
//     .get('clientNotification')
//     .get('data')
//     .toArray();
//
// export const getNotificationsState = createSelector(
//   [getNotifications],
//   notifications => notifications.sort(sortByDatesAsc)
// );
