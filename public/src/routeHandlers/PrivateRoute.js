import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAuthIsLoggedInState } from '../store/selectors/auth';

function PrivateRoute({ component: Component, ...rest }) {
  const { isLoggedIn } = rest;

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedInState(state)
  };
}

export default connect(
  mapStateToProps,
  {}
)(PrivateRoute);
