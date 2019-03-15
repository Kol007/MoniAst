import React, { memo } from 'react';
import SipPeer from '../SipPeer';
import { Col } from 'reactstrap';
import PropTypes from 'prop-types';

const QueueMembers = ({ queueMembers, selectedSip, queueName, queueId, selectSip }) => {
  if (!queueMembers.size) {
    return (
      <Col md="12" className="text-center text-muted">
        No active members
      </Col>
    );
  }

  return queueMembers.entrySeq().map(([key, sipPeer]) => {
    const isSelected = selectedSip && selectedSip === sipPeer.sip;

    return (
      <Col key={sipPeer.sip} md="4" className="col-sip">
        <SipPeer
          sipPeer={sipPeer}
          memberOfQueue={queueId}
          selectSip={selectSip}
          isSelected={!!isSelected}
        />
      </Col>
    );
  });
};

QueueMembers.propTypes = {
  queueMembers: PropTypes.object,
  queueName: PropTypes.string,
  selectSip: PropTypes.func,
  isSelected: PropTypes.string
};

export default memo(QueueMembers);
