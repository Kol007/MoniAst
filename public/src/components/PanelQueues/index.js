import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getQueues } from 'AC/queue';
import { loadSipPeers } from 'AC/sip';
import { loadChannels } from 'AC/channels';

import {
  getQueuesKeysState,
  getQueuesIsLoadedState,
  getQueuesIsLoadingState
} from 'store/selectors/queue';
import QueueComponent from '../Queue/QueueComponent';
import { getSipIsLoadedState, getSipIsLoadingState } from '../../store/selectors/sip';
import SipToolbar from '../SipToolbar';
import styles from './PanelQueues.module.css';

export class PanelQueues extends Component {
  componentDidMount() {
    const { isLoading, isLoaded, isLoadedSip, isLoadingSip } = this.props;

    if (!isLoaded && !isLoading) {
      this.props.getQueues();
    }

    if (!isLoadedSip && !isLoadingSip) {
      const { loadSipPeers, loadChannels } = this.props;

      loadSipPeers();
      loadChannels();
    }
  }

  render() {
    const { queues } = this.props;

    const { isLoaded, isLoadedSip } = this.props;

    if (!isLoaded || !isLoadedSip) {
      return <h1>Loading..</h1>;
    }

    const queuesComponent = queues.entrySeq().map(([key, item]) => {
      return <QueueComponent key={key} entity={key} />;
    });

    return (
      <div className="container-fluid">
        <h1 className="sr-only">All queues members and queue entries</h1>
        <div className="row">
          <SipToolbar isHideFilter={true} />

          <div className={`col-12 ${styles.content}`}>{queuesComponent}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    queues: getQueuesKeysState(state),
    isLoading: getQueuesIsLoadingState(state),
    isLoaded: getQueuesIsLoadedState(state),

    isLoadingSip: getSipIsLoadingState(state),
    isLoadedSip: getSipIsLoadedState(state)
  };
}
export default connect(
  mapStateToProps,
  { getQueues, loadSipPeers, loadChannels }
)(PanelQueues);
