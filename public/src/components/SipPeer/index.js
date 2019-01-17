import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getChannelsBySipState } from "store/selectors";

import { Card, CardBody, CardHeader, CardFooter } from "reactstrap";

import SipPeerChannel from "Component/SipPeerChannel";
import SipPeerQueueDetail from "Component/SipPeer/SipPeerQueueDetail";
import "./sipPeer.css";

import {
  CHANNEL_STATUS_OUT_RINGING,
  CHANNEL_STATUS_UP,
  SIP_STATUS_IN_USE,
  SIP_STATUS_RINGING
} from "helpers/constants";

import moment from "moment";

const statusStyle = {
  SIP_STATUS_IDLE: "success",
  SIP_STATUS_IN_USE: "primary", // ring
  SIP_STATUS_BUSY: "warning",
  SIP_STATUS_UNAVAILABLE: "default",
  SIP_STATUS_RINGING: "warning", // ringing
  SIP_STATUS_ON_HOLD: "success" // UP
};

class SipPeer extends PureComponent {
  static propTypes = {
    selectSip: PropTypes.func,
    sipPeer: PropTypes.object.isRequired,
    channels: PropTypes.object,
    isSelected: PropTypes.bool,
    isTrunk: PropTypes.bool
  };

  handleSelectSip = ev => {
    ev.preventDefault();

    const { selectSip, sipPeer } = this.props;

    selectSip(sipPeer.sip);
  };

  _isSipUp = channels => {
    return (
      channels &&
      channels.size &&
      !!channels.find(obj => obj.get("status") === CHANNEL_STATUS_UP) &&
      SIP_STATUS_IN_USE
    );
  };

  _isSipRinging = channels => {
    return (
      channels &&
      channels.size &&
      !!channels.find(
        obj => obj.get("status") === CHANNEL_STATUS_OUT_RINGING
      ) &&
      SIP_STATUS_RINGING
    );
  };

  render() {
    const {
      channels,
      sipPeerDetail,
      sipPeer,
      isSelected,
      isTrunk,
      memberOfQueue
    } = this.props;

    const { login, sip, status } = sipPeerDetail;

    const SipUp = this._isSipUp(channels);

    const SipRinging = this._isSipRinging(channels);

    const peerStatusClass =
      statusStyle[SipUp] || statusStyle[SipRinging] || statusStyle[status];

    const sipChannels =
      channels && channels.size
        ? channels.entrySeq().map(([key, channel]) => {
            return (
              <div key={channel.id}>
                <SipPeerChannel channel={channel} sip={sip} />
              </div>
            );
          })
        : "";

    const sipChannelsElement = sipChannels ? (
      <CardBody className={"sip-peer-body"}>{sipChannels}</CardBody>
    ) : (
      ""
    );

    const additionalClass = isSelected ? "selected-sip" : "";

    // const PeerQueueDetail = memberOfQueue ? (
    //   <SipPeerQueueDetail sipPeerDetail={sipPeerDetail} />
    // ) : null;

    return (
      <Card
        className={`${additionalClass} border border-${
          isSelected ? "danger" : peerStatusClass
        } text-${peerStatusClass} `}
      >
        <CardHeader
          className={`${!isTrunk ? "cursor-pointer" : ""} sip-peer-header`}
          onClick={!isTrunk ? this.handleSelectSip : null}
        >
          <div
            className={`rounded-circle bg-${peerStatusClass} sip-status-indicator`}
          />
          {` ${sip} ${login}`}
        </CardHeader>
        {sipChannelsElement}

        {/*{PeerQueueDetail}*/}
      </Card>
    );
  }
}

function mapStateToProps(state, props) {
  const getSipChannels = getChannelsBySipState();
  let sipPeerDetail;

  if (props.memberOfQueue) {
    sipPeerDetail = state.queue.getIn([
      "entities",
      props.memberOfQueue,
      "members",
      props.sipPeer.sip
    ]);
  } else {
    sipPeerDetail = state.sip.getIn(["entities", props.sipPeer.sip]);
  }

  return {
    channels: getSipChannels(state, props),
    sipPeerDetail
  };
}

export default connect(
  mapStateToProps,
  {}
)(SipPeer);
