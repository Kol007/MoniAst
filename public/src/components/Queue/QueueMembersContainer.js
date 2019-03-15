import { connect } from 'react-redux';
import { compose } from 'recompose';
import QueueMembers from './QueueMembers';

import { getDetailState, getFilteredMembersState } from 'store/selectors/queue';
import { selectSip } from 'AC/sip';

import './queue.css';
import { getSipSelectedSipState } from '../../store/selectors/sip';

function mapStateToProps(state, { queueId }) {
  const getMembers = getFilteredMembersState();
  const getDetail = getDetailState();
  return {
    queueDetail: getDetail(state, queueId),
    queueMembers: getMembers(state, queueId),
    selectedSip: getSipSelectedSipState(state)
  };
}

const enhance = compose(
  connect(
    mapStateToProps,
    {
      selectSip
    }
  )
);

export default enhance(QueueMembers);
