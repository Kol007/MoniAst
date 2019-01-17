import React from "react";

import PropTypes from "prop-types";
import { CardFooter } from "reactstrap";
import moment from "moment";

import './SipPeerQueueDetail.css';

const SipPeerQueueDetail = ({ sipPeerDetail }) => (
  <CardFooter className={"sip-peer-card-footer"}>
    <ul className={'sip-queue-details__list'}>
      <li>Answered - {sipPeerDetail.callstaken}</li>
      {!!+sipPeerDetail.callstaken && (
        <li>
          Last answered -{" "}
          {moment(sipPeerDetail.lastcall * 1000).format("HH:mm:ss")}
        </li>
      )}
    </ul>
  </CardFooter>
);

export default SipPeerQueueDetail;
