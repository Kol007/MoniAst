import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getFilteredTrunksState,
  getSipIsLoadedState,
  getSipIsLoadingState
} from 'store/selectors/sip';

import { loadSipPeers } from 'AC/sip';
import { loadChannels } from 'AC/channels';

import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import SipPeer from 'components/SipPeer';

class PanelTrunk extends Component {
  componentDidMount() {
    const { loadSipPeers, loadChannels, isLoaded, isLoading } = this.props;

    if (!isLoaded && !isLoading) {
      loadSipPeers();
      loadChannels();
    }
  }

  render() {
    const { sip } = this.props;

    const peers = sip.entrySeq().map(([key, sipPeer]) => {
      return (
        <Col key={sipPeer.sip} md="12" style={{ marginBottom: '5px' }}>
          <SipPeer sipPeer={sipPeer} isTrunk={true} />
        </Col>
      );
    });

    return (
      <Card>
        <CardBody>
          <CardTitle>Trunks</CardTitle>
          <Row>{peers}</Row>
        </CardBody>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    sip: getFilteredTrunksState(state),

    isLoading: getSipIsLoadingState(state),
    isLoaded: getSipIsLoadedState(state)
  };
}

export default connect(
  mapStateToProps,
  {
    loadSipPeers,
    loadChannels
  }
)(PanelTrunk);
