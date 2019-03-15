import React, { PureComponent, memo } from 'react';
import PropTypes from 'prop-types';
import DurationTimer from '../DurationTimer/DurationTimer';

import { CHANNEL_STATUS_UP } from 'helpers/constants';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './sipPeerChannel.css';
import { CardBody } from 'reactstrap';

class SipPeerChannel extends PureComponent {
  render() {
    const { channel } = this.props;

    const statusIcon =
      channel.status === CHANNEL_STATUS_UP ? (
        <FontAwesomeIcon icon="phone" />
      ) : (
        <FontAwesomeIcon icon="phone-volume" className="channel-ringing" />
      );

    return (
      <div title={channel.status}>
        {statusIcon} {channel.connectedlinenum}
        <span className="float-right">
          <DurationTimer
            duration={channel.duration}
            date={channel.date}
            isTicking={channel.status === CHANNEL_STATUS_UP}
          />
        </span>
      </div>
    );
  }
}

SipPeerChannel.propTypes = {
  channel: PropTypes.object.isRequired
};

const SipPeerChannels = memo(({ channels, sip }) => {
  if (!channels || !channels.size) {
    return null;
  }

  const sipChannels = channels.entrySeq().map(([key, channel]) => {
    return (
      <div key={channel.id}>
        <SipPeerChannel channel={channel} sip={sip} />
      </div>
    );
  });

  return <CardBody className="sip-peer-body">{sipChannels}</CardBody>;
});

SipPeerChannels.propTypes = {
  channels: PropTypes.object,
  sip: PropTypes.string
};

export default SipPeerChannels;
