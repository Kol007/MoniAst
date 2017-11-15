import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

class PrivateRoute extends Component {
  render() {
    const { exact } = this.props;

    return (
      this.props.isLoggedIn ?
        <Route exact={exact} path={this.props.path} component={this.props.component} /> :
        <Redirect
          to={{
            pathname: '/login',
            state: { from: this.props.path }
          }}
        />
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.get('isLoggedIn')
  };
}

export default withRouter(connect(mapStateToProps, {})(PrivateRoute));