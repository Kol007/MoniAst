import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { secToHuman } from '../../common';

import { selectSip } from '../../AC/sip';
import {
  Card,
  Button,
  CardHeader,
  CardBody,
  CardText,
  Row,
  Col
} from 'reactstrap';

import SipPeerChannel from '../SipPeerChannel';

import {
  SIP_STATUS_UNAVAILABLE,
  SIP_CHANGE_STATE,
  SIP_STATUS_BUSY,
  SIP_STATUS_IDLE,
  SIP_STATUS_IN_USE,
  SIP_STATUS_RINGING,
  SIP_STATUS_ON_HOLD,
  CHANNEL_STATUS_DOWN_AVAILABLE,
  CHANNEL_STATUS_DOWN_RESERVED,
  CHANNEL_STATUS_OFF_HOOK,
  CHANNEL_STATUS_DIGITS_DIALED,
  CHANNEL_STATUS_UP,
  CHANNEL_STATUS_OUT_RINGING,
  CHANNEL_STATUS_IN_RINGING,
  CHANNEL_STATUS_BUSY
} from '../../constants';

const statusStyle = {
  SIP_STATUS_IDLE: 'success',
  SIP_STATUS_IN_USE: 'primary', // ring
  SIP_STATUS_BUSY: 'warning',
  SIP_STATUS_UNAVAILABLE: 'default',
  SIP_STATUS_RINGING: 'warning', // ringing
  SIP_STATUS_ON_HOLD: 'success' // UP
};

class SipPeer extends PureComponent {
  handleSelectSip = (ev) => {
    ev.preventDefault();

    const { selectSip, sipPeer } = this.props;

    selectSip(sipPeer.sip);
  };

  _isSipUp = (channels) => {
    return channels &&
      channels.size &&
      !!channels.find(obj => obj.get('status') === CHANNEL_STATUS_UP) &&
      SIP_STATUS_IN_USE;
  };

  _isSipRinging = (channels) => {
    return channels &&
      channels.size &&
      !!channels.find(
        obj => obj.get('status') === CHANNEL_STATUS_OUT_RINGING
      ) &&
      SIP_STATUS_RINGING;
  };

  render() {
    const { channels, sipPeer, isSelected, isTrunk } = this.props;
    const { login, sip, status } = sipPeer;

    const SipUp = this._isSipUp(channels);

    const SipRinging = this._isSipRinging(channels);

    const peerStatusClass =
      statusStyle[SipUp] || statusStyle[SipRinging] || statusStyle[status];

    const sipChannels =
      channels && channels.size
        ? channels.entrySeq().map(([key, channel]) => {
            return (
              <div key={channel.id}>
                <SipPeerChannel channel={channel} sip={sip} />
              </div>
            );
          })
        : '';

    const sipChannelsElement = sipChannels ? (
      <CardBody>{sipChannels}</CardBody>
    ) : (
      ''
    );

    const additionalClass = isSelected ? 'selected-sip' : '';

    return (
      <Card
        className={`${additionalClass} border border-${
          isSelected ? 'danger' : peerStatusClass
        } text-${peerStatusClass}`}
      >
        <CardHeader
          className={isTrunk ? '' : 'cursor-pointer'}
          onClick={isTrunk ? () => {} : this.handleSelectSip}
        >
          <div
            className={`rounded-circle bg-${
              peerStatusClass
            } sip-status-indicator`}
          />
          {` ${sip} ${login}`}
        </CardHeader>
        {sipChannelsElement}
      </Card>
    );
  }
}

SipPeer.propTypes = {
  selectSip: PropTypes.func,
  sipPeer: PropTypes.object.isRequired,
  channels: PropTypes.object,
  isSelected: PropTypes.bool,
  isTrunk: PropTypes.bool
};

export default SipPeer;
