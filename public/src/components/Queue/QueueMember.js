import React from 'react';
import PropTypes from 'prop-types';

import SipPeer from '../SipPeer';
import { Col } from 'reactstrap';

const QueueMember = ({ sipPeer, queueName, selectSip, isSelected }) => (
  <Col key={sipPeer.sip} md="4" className="col-sip">
    <SipPeer
      sipPeer={sipPeer}
      memberOfQueue={queueName}
      selectSip={selectSip}
      isSelected={!!isSelected}
    />
  </Col>
);

const QueueMembers = ({ queueMembers, selectedSip, queueName, selectSip }) => {
  return queueMembers.entrySeq().map(([key, sipPeer]) => {
    const isSelected = selectedSip && selectedSip === sipPeer.sip;

    return (
      <Col key={sipPeer.sip} md="4" className="col-sip">
        <SipPeer
          sipPeer={sipPeer}
          memberOfQueue={queueName}
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

export default QueueMember;
