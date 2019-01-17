import React from 'react';
import { compose, withState, withHandlers, withProps, lifecycle } from 'recompose';
import { CHANNEL_STATUS_UP } from '../../helpers/constants';
import { secToHuman } from '../../helpers/common';

const enchance = compose(
  withState('duration', 'setDuration', props => {
    const startDate = new Date(props.date);
    const currentDate = new Date();
    return parseInt((currentDate - startDate) / 1000) + props.duration
  }),
  withState('intervalId', 'setIntervalId', null),
  withHandlers({
    handleStartInterval: props => () => {
      const { duration, date } = props;
      const startDate = new Date(date);

      let intervalId = setInterval(() => {
        const currentDate = new Date();
        props.setDuration(parseInt((currentDate - startDate) / 1000) + duration);
      }, 1000);

      props.setIntervalId(intervalId);
    },

    handleStopInterval: props => () => {
      clearInterval(props.intervalId);
      props.setIntervalId(null);
    }
  }),
  lifecycle({
    componentDidMount() {
      if (this.props.isTicking && !this.props.intervalId) {
        this.props.handleStartInterval();
      }
    },
    componentDidUpdate() {
      if (this.props.isTicking && !this.props.intervalId) {
        this.props.handleStartInterval();
      }
    },
    componentWillUnmount() {
      if (this.props.intervalId) {
        this.props.handleStopInterval();
      }
    }
  })
);

function DurationTimer(props) {
  const durationHuman = props.isTicking ? secToHuman(props.duration) : '';

  return durationHuman ? durationHuman : null;
}

export default enchance(DurationTimer);
