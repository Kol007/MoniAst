import React from 'react';
import { ButtonGroup, Card, CardBody, Row } from 'reactstrap';

import QueueEntryContainer from 'components/QueueEntry/QueueEntryContainer';
import QueueMembersContainer from 'components/Queue/QueueMembersContainer';

import styles from './QueueComponent.module.css';
import { getFilteredMembersLengthState } from '../../store/selectors/queue';
import connect from 'react-redux/es/connect/connect';

// const QueueDetails = ({ queueDetail }) => (
//   <small>
//     <ul>
//       <li>Answered - {queueDetail.completed}</li>
//       <li>Missed - {queueDetail.abandoned}</li>
//     </ul>
//   </small>
// );

const QueueComponent = props => {
  const { entity, isEmpty } = props;

  if (isEmpty) {
    return null;
  }

  return (
    <Card className={'queue'}>
      <CardBody>
        <Row>
          <ButtonGroup className={styles.title}>
            <span className="badge badge-info">Queue - {entity}</span>
          </ButtonGroup>
        </Row>

        <Row>
          <div className="col-md-9">
            <Row>
              <QueueMembersContainer queueId={entity} />
            </Row>
          </div>
          <div className={`col-md-3 ${styles.entries__divider}`}>
            <Row>
              <QueueEntryContainer queueId={entity} />
            </Row>
          </div>
        </Row>
      </CardBody>
    </Card>
  );
};

// export default QueueComponent;

function mapStateToProps(state, { entity }) {
  const getMembersLength = getFilteredMembersLengthState();

  return {
    isEmpty: !getMembersLength(state, entity)
  };
}
export default connect(
  mapStateToProps,
  {}
)(QueueComponent);
