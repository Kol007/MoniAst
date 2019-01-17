import React, { Component } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { getFilteredSipsState } from "store/selectors";

import { loadSipPeers, selectSip } from "AC/sip";
import { loadChannels } from "AC/channels";

import { Card, CardBody, Col, Row } from "reactstrap";
import SipPeer from "Component/SipPeer";
import SipToolbar from "Component/SipToolbar";

class PanelSip extends Component {
  componentDidMount() {
    const { loadSipPeers, loadChannels, isLoaded, isLoading } = this.props;

    if (!isLoaded && !isLoading) {
      loadSipPeers();
      loadChannels();
    }
  }

  render() {
    const { sip, selectedSip, selectSip, isLoaded, isLoading } = this.props;

    const peers = sip.entrySeq().map(([key, sipPeer]) => {
      const isSelected = selectedSip && selectedSip === sipPeer.sip;

      return (
        <Col key={sipPeer.sip} md="4" className="col-sip">
          <SipPeer
            sipPeer={sipPeer}
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
  sip: PropTypes.object,

  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool,
  selectSip: PropTypes.func
};

function mapStateToProps(state) {
  const { sip } = state;

  return {
    sip: getFilteredSipsState(state),
    isLoading: sip.get("isLoading"),
    isLoaded: sip.get("isLoaded"),
    selectedSip: sip.get("selectedSip")
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
