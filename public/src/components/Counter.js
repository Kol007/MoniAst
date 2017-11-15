import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { increment } from '../AC/counter';
import { connect } from 'react-redux';

class Counter extends Component {
  static propTypes = {
    count: PropTypes.number
  };

  render() {
    const  count = this.props.count;
    return (
      <div>
          <h3>{count}</h3>
          <a href="#" onClick={this.handleIncrement}>Increment me!</a>
      </div>
    );
  }

  handleIncrement = ev => {
    ev.preventDefault();
    this.props.increment();
  }
}

export default connect(state => ({
  count: state.count
}), { increment })(Counter);
