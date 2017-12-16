import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { getFilteredSipsState } from 'store/selectors';

import { loadSipPeers, selectSip, filterSip, spySip } from 'AC/sip';
import { loadChannels } from 'AC/channels';

import { Card, CardText, CardBody, Button, Row, Col } from 'reactstrap';
import SipPeer from 'Component/SipPeer';
import SipToolbar from 'Component/SipToolbar';

class PanelSip extends Component {
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
        <Col key={sipPeer.sip} md="4" style={{ marginBottom: '5px' }}>
          <SipPeer
            sipPeer={sipPeer}
            channels={channelsBySip}
            selectSip={selectSip}
            isSelected={!!isSelected}
          />
        </Col>
      );
    });

    return (
      <Card>
        <SipToolbar />

        <CardBody>
          <Row>{peers}</Row>
        </CardBody>
      </Card>
    );
  }
}

PanelSip.propTypes = {
  sip: PropTypes.array,
  channels: PropTypes.object,

  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool,
  selectSip: PropTypes.func,

  sipSpyStatus: PropTypes.object,
};

function mapStateToProps(state) {
  const { sip, channels } = state;

  return {
    sip: getFilteredSipsState(state),
    channels,

    isLoading: sip.get('isLoading'),
    isLoaded: sip.get('isLoaded'),
    selectedSip: sip.get('selectedSip'),

    // filter: sip.get('filter'),
    sipSpyStatus: sip.get('sipSpy').toJSON()
  };
}

export default connect(mapStateToProps, {
  loadSipPeers,
  loadChannels,
  selectSip,
  filterSip,
  spySip
})(PanelSip);
