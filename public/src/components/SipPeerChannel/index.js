import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import DurationTimer from '../DurationTimer/DurationTimer';

import { secToHuman } from 'helpers/common';

import './sipPeerChannel.css';

import {
  CHANNEL_STATUS_DOWN_AVAILABLE,
  CHANNEL_STATUS_DOWN_RESERVED,
  CHANNEL_STATUS_OFF_HOOK,
  CHANNEL_STATUS_DIGITS_DIALED,
  CHANNEL_STATUS_UP,
  CHANNEL_STATUS_OUT_RINGING,
  CHANNEL_STATUS_IN_RINGING,
  CHANNEL_STATUS_BUSY
} from 'helpers/constants';

import FontAwesome from 'react-fontawesome';
import { Card } from "reactstrap";


class SipPeerChannel extends PureComponent {
  render() {
    const { channel } = this.props;

    const statusIcon = channel.status === CHANNEL_STATUS_UP
      ? <FontAwesome name="phone" />
      : <FontAwesome name="volume-control-phone" className="channel-ringing" />;

    return (
      <div title={channel.status}>
        {statusIcon} {channel.connectedlinenum}

        <span className="pull-right">
          <DurationTimer duration={channel.duration} date={channel.date} isTicking={channel.status === CHANNEL_STATUS_UP} />
        </span>
      </div>
    );
  }
}

SipPeerChannel.propTypes = {
  channel: PropTypes.object.isRequired,
};

export default SipPeerChannel;
