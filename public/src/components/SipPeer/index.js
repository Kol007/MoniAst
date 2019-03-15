import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannelsBySipState } from 'store/selectors/channels';

import { Card, CardHeader } from 'reactstrap';

import SipPeerChannels from 'components/SipPeerChannels';
// import SipPeerQueueDetail from "components/SipPeer/SipPeerQueueDetail";
import './sipPeer.css';

import {
  CHANNEL_STATUS_OUT_RINGING,
  CHANNEL_STATUS_UP,
  SIP_STATUS_IN_USE,
  SIP_STATUS_RINGING
} from 'helpers/constants';
import { getSipPeerState } from '../../store/selectors/sip';
import { getQueueSipPeerState } from '../../store/selectors/queue';

const statusStyle = {
  SIP_STATUS_IDLE: 'success',
  SIP_STATUS_IN_USE: 'primary', // ring
  SIP_STATUS_BUSY: 'warning',
  SIP_STATUS_UNAVAILABLE: 'default',
  SIP_STATUS_RINGING: 'warning', // ringing
  SIP_STATUS_ON_HOLD: 'success' // UP
};

class SipPeer extends PureComponent {
  static propTypes = {
    selectSip: PropTypes.func,
    sipPeer: PropTypes.object.isRequired,
    channels: PropTypes.object,
    isSelected: PropTypes.bool,
    isTrunk: PropTypes.bool
  };

  handleSelectSip = ev => {
    ev.preventDefault();

    const { selectSip, sipPeer } = this.props;

    selectSip(sipPeer.sip);
  };

  _isSipUp = channels => {
    return (
      channels &&
      channels.size &&
      !!channels.find(obj => obj.get('status') === CHANNEL_STATUS_UP) &&
      SIP_STATUS_IN_USE
    );
  };

  _isSipRinging = channels => {
    return (
      channels &&
      channels.size &&
      !!channels.find(obj => obj.get('status') === CHANNEL_STATUS_OUT_RINGING) &&
      SIP_STATUS_RINGING
    );
  };

  render() {
    const {
      channels,
      sipPeerDetail,
      isSelected,
      isTrunk
      // memberOfQueue
    } = this.props;

    const { login, sip, status } = sipPeerDetail;

    const SipUp = this._isSipUp(channels);

    const SipRinging = SipUp ? '' : this._isSipRinging(channels);

    const peerStatusClass = statusStyle[SipUp] || statusStyle[SipRinging] || statusStyle[status];

    const additionalClass = isSelected ? 'selected-sip' : '';

    // const PeerQueueDetail = memberOfQueue ? (
    //   <SipPeerQueueDetail sipPeerDetail={sipPeerDetail} />
    // ) : null;

    return (
      <Card
        className={`${additionalClass} border border-${
          isSelected ? 'danger' : peerStatusClass
        } text-${peerStatusClass} `}
      >
        <CardHeader
          className={`${!isTrunk ? 'cursor-pointer' : ''} sip-peer-header`}
          onClick={!isTrunk ? this.handleSelectSip : null}
        >
          <div className={`rounded-circle bg-${peerStatusClass} sip-status-indicator`} />
          {` ${sip} ${login}`}
        </CardHeader>

        <SipPeerChannels channels={channels} sip={sip} />
        {/*{sipChannelsElement}*/}

        {/*{PeerQueueDetail}*/}
      </Card>
    );
  }
}

function mapStateToProps(state, { sipPeer, memberOfQueue }) {
  const getSipChannels = getChannelsBySipState();
  const getQueueSipPeer = getQueueSipPeerState();
  const getSipPeer = getSipPeerState();
  let sipPeerDetail;

  if (memberOfQueue) {
    sipPeerDetail = getQueueSipPeer(state, { memberOfQueue, sip: sipPeer.sip });
  } else {
    sipPeerDetail = getSipPeer(state, sipPeer.sip);
  }

  return {
    channels: getSipChannels(state, sipPeer),
    sipPeerDetail
  };
}

export default connect(
  mapStateToProps,
  {}
)(SipPeer);
