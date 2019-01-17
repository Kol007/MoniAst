import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getQueues } from 'AC/queue';
import { loadSipPeers } from 'AC/sip';
import { loadChannels } from 'AC/channels';
import Queue from 'components/Queue';

import { getQueuesKeysState} from 'store/selectors';


export class PanelQueues extends Component {
  componentDidMount() {
    const { isLoading, isLoaded, isLoadedSip, isLoadingSip } = this.props;

    if (!isLoaded && !isLoading) {
      this.props.getQueues();
    }

    if (!isLoadedSip && !isLoadingSip) {
      this.props.loadSipPeers();
      this.props.loadChannels();
    }
  }

  render() {
    const { queues } = this.props;

    const { isLoaded, isLoadedSip } = this.props;

    if (!isLoaded || !isLoadedSip) {
      return (<h1>Loading..</h1>)
    }

    const queuesComponent = queues.entrySeq().map(([key, item]) => {
      return (
        <Queue key={key} entity={key}>{key}</Queue>
      )
    });

    return (
      <div className="container-fluid">
        <div className="row extensions-container">
          <div className="col-12">
            {queuesComponent}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    queues: getQueuesKeysState(state),
    isLoading: state.queue.get('isLoading'),
    isLoaded: state.queue.get('isLoaded'),

    isLoadingSip: state.sip.get('isLoading'),
    isLoadedSip: state.sip.get('isLoaded'),
  }
}
export default connect(mapStateToProps, { getQueues, loadSipPeers, loadChannels })(PanelQueues);

