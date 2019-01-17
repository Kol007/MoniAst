import React from 'react';
import { Card, CardHeader } from "reactstrap";
import DurationTimer from "Component/DurationTimer/DurationTimer";

function QueueEntry(props) {
  return (
    <Card style={{ width: '100%', margin: '5px 15px' }}>
      <CardHeader>
        {props.sipPeer.position}){`  `}

        {props.sipPeer.calleridnum}

        <div className='pull-right'>
          <DurationTimer duration={+props.sipPeer.wait} date={props.sipPeer.date} isTicking={true} />

        </div>

      </CardHeader>
    </Card>
  );
}

export default QueueEntry;