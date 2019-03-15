import React, { PureComponent } from 'react';
import { Card, CardHeader } from 'reactstrap';
import DurationTimer from '../DurationTimer/DurationTimer';

// TODO move styles to QueueEntry.module.css
function QueueEntry({ queueEntry }) {
  return (
    <Card style={{ width: '100%', margin: '5px 15px' }}>
      <CardHeader className={'sip-peer-header'}>
        {queueEntry.position}){`  `}
        {queueEntry.calleridnum}
        <div className="float-right">
          <DurationTimer duration={+queueEntry.wait} date={queueEntry.date} isTicking={true} />
        </div>
      </CardHeader>
    </Card>
  );
}

class QueueEntries extends PureComponent {
  render() {
    const { queueEntries } = this.props;

    if (!queueEntries && !queueEntries.size) {
      return null;
    }

    return queueEntries.entrySeq().map(([key, queueEntry]) => {
      return <QueueEntry key={queueEntry.uniqueid} queueEntry={queueEntry} />;
    });
  }
}

export default QueueEntries;
