import React, { Component } from 'react';
import PropTypes from 'prop-types';

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


class SipPeerChannel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null,
      duration: null
    };
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.props.channel.status === CHANNEL_STATUS_UP && !this.intervalId) {
      this.handleStartInterval();
    }
  }

  componentDidUpdate() {
    if (this.props.channel.status === CHANNEL_STATUS_UP && !this.intervalId) {
      this.handleStartInterval();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    if (this.intervalId) {
      this.handleStopInterval();
    }
  }

  handleStartInterval = () => {
    const { duration, date } = this.props.channel;
    const startDate = new Date(date);

    this.intervalId = setInterval(() => {
      if (this._isMounted) {
        const currentDate = new Date();
        this.setState({
          duration: parseInt((currentDate - startDate) / 1000) + duration
        });
      }
    }, 1000);
  };

  handleStopInterval = () => {
    clearInterval(this.state.intervalId);
    this.intervalId = null;
  };

  render() {
    const { channel } = this.props;

    const { duration } = this.state;

    const durationHuman = channel.status === CHANNEL_STATUS_UP
      ? secToHuman(duration)
      : '';

    // const statusIcon = channel.status === CHANNEL_STATUS_UP
    //   ? 'O: '
    //   : 'R: ';

    const statusIcon = channel.status === CHANNEL_STATUS_UP
      ? <FontAwesome name="phone" />
      : <span className="channel-ringing">
          <FontAwesome name="volume-control-phone" />
        </span>;

    return (
      <div title={channel.status}>
        {statusIcon} {channel.connectedlinenum}

        <span className="pull-right">
          {durationHuman}
        </span>
      </div>
    );
  }
}

SipPeerChannel.propTypes = {
  channel: PropTypes.object.isRequired,
  // sip: PropTypes.string
};

export default SipPeerChannel;
