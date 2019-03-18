import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import {
  getFilteredSipsState,
  getSipIsLoadedState,
  getSipIsLoadingState,
  getSipSelectedSipState
} from 'store/selectors/sip';

import { loadSipPeers, selectSip } from 'AC/sip';
import { loadChannels } from 'AC/channels';

import { Card, CardBody, Col, Row } from 'reactstrap';
import SipPeer from 'components/SipPeer';

class PanelSip extends Component {
  componentDidMount() {
    const { loadSipPeers, loadChannels, isLoaded, isLoading } = this.props;

    if (!isLoaded && !isLoading) {
      loadSipPeers();
      loadChannels();
    }
  }

  renderItems = () => {
    const { sip, selectedSip, selectSip } = this.props;

    return sip.entrySeq().map(([key, sipPeer]) => {
      const isSelected = selectedSip && selectedSip === sipPeer.sip;

      return (
        <Col key={sipPeer.sip} md="4" className="col-sip">
          <SipPeer sipPeer={sipPeer} selectSip={selectSip} isSelected={!!isSelected} />
        </Col>
      );
    });
  };

  render() {
    return (
      <>
        <h1 className="sr-only">All sips and trunks</h1>
        <Card>
          <CardBody>
            <Row>{this.renderItems()}</Row>
          </CardBody>
        </Card>
      </>
    );
  }
}

PanelSip.propTypes = {
  sip: PropTypes.object,

  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool,
  selectSip: PropTypes.func
};

function mapStateToProps(state) {
  return {
    sip: getFilteredSipsState(state),
    isLoading: getSipIsLoadingState(state),
    isLoaded: getSipIsLoadedState(state),
    selectedSip: getSipSelectedSipState(state)
  };
}

export default connect(
  mapStateToProps,
  {
    loadSipPeers,
    loadChannels,
    selectSip
  }
)(PanelSip);
