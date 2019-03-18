import React, { PureComponent } from 'react';
import { Card, CardHeader } from 'reactstrap';
import DurationTimer from '../DurationTimer/DurationTimer';

import styles from './QueueEntriy.module.css';

function QueueEntry({ queueEntry }) {
  return (
    <Card className={styles.content}>
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

    if (!(queueEntries && queueEntries.size)) {
      return (
        <div className="col-md-12 text-center">
          <p className={`text-muted ${styles['entries--empty']}`}>Queue is empty</p>
        </div>
      );
    }

    return queueEntries.entrySeq().map(([key, queueEntry]) => {
      return <QueueEntry key={queueEntry.uniqueid} queueEntry={queueEntry} />;
    });
  }
}

export default QueueEntries;
