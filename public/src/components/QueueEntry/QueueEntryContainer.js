import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getQueueEntriesState } from 'store/selectors/queue';
import QueueEntries from './QueueEntries';

class QueueEntryContainer extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !nextProps.queueEntries.equals(this.props.queueEntries);
  }

  render() {
    const { queueEntries, queueId } = this.props;
    return <QueueEntries queueEntries={queueEntries} queueId={queueId} />;
  }
}

function mapStateToProps(state, { queueId }) {
  const getEntries = getQueueEntriesState();

  return {
    queueEntries: getEntries(state, queueId)
  };
}

export default connect(
  mapStateToProps,
  {}
)(QueueEntryContainer);
