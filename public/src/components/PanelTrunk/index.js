import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { getFilteredTrunksState } from '../../store/selectors';

import { loadSipPeers, selectSip, filterSip, spySip } from '../../AC/sip';
import { loadChannels } from '../../AC/channels';

import { Card, CardText, CardBody, Button, Row, Col } from 'reactstrap';
import SipPeer from '../SipPeer';
import SipToolbar from '../SipToolbar';

import { SIP_FILTER_ONLINE, SIP_FILTER_ALL } from '../../constants';

class PanelTrunk extends Component {
  componentDidMount() {
    const { loadSipPeers, loadChannels, isLoaded, isLoading } = this.props;

    if (!isLoaded && !isLoading) {
      loadSipPeers();
      loadChannels();
    }
  }

  render() {
    const { sip, channels, selectedSip, selectSip } = this.props;

    const peers = sip.map(sipPeer => {
      const channelsBySip =
        channels && channels.filter(item => item.sip === sipPeer.sip);
      const isSelected = selectedSip && selectedSip === sipPeer.sip;

      return (
        <Col key={sipPeer.sip} md="12" style={{ marginBottom: '5px' }}>
          <SipPeer
            sipPeer={sipPeer}
            channels={channelsBySip}
            selectSip={selectSip}
            isSelected={!!isSelected}
            isTrunk={true}
          />
        </Col>
      );
    });

    return (
      <Card>
        <CardBody>
          <Row>{peers}</Row>
        </CardBody>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  const { sip, channels } = state;

  return {
    sip: getFilteredTrunksState(state),
    channels: channels,

    isLoading: sip.get('isLoading'),
    isLoaded: sip.get('isLoaded'),

    // filter: sip.get('filter')
  };
}

export default connect(mapStateToProps, {
  loadSipPeers,
  loadChannels,
  spySip
})(PanelTrunk);
