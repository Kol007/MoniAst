import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import SipPeer from "Component/SipPeer";
import QueueEntry from "Component/QueueEntry";
import SipToolbar from "Component/SipToolbar";

const QueueComponent = props => {
  const {
    queueMembers,
    queueEntries,
    entity: queueName,
    queueDetail,
    selectSip,
    selectedSip
  } = props;


  if (!queueMembers || !queueMembers.size) {
    return null;
  }

  const members = queueMembers.entrySeq().map(([key, sipPeer]) => {
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

  const entries = queueEntries.entrySeq().map(([key, sipPeer]) => {
    return <QueueEntry key={sipPeer.uniqueid} sipPeer={sipPeer}  />;
  });

  return (
    <Card className={"queue"}>
      <SipToolbar queueEntity={queueName} />

      {/*<small>*/}
        {/*<ul>*/}
          {/*<li>Answered - {queueDetail.completed}</li>*/}
          {/*<li>Missed - {queueDetail.abandoned}</li>*/}
        {/*</ul>*/}
      {/*</small>*/}
      <CardBody>
        <Row>
          <div className="col-md-9">
            <Row>{members}</Row>
          </div>
          <div className="col-md-3 left-divider">
            <Row>{entries}</Row>
          </div>
        </Row>
      </CardBody>
    </Card>
  );
};

export default QueueComponent;
