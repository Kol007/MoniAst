import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loginUser } from 'AC/auth';
import { withRouter } from 'react-router-dom';

import './login.css';
import {
  getAuthErrorCodeState,
  getAuthErrorMessageState,
  getAuthIsErrorState,
  getAuthIsLoadingInState,
  getAuthIsLoggedInState
} from '../../store/selectors/auth';

class Login extends Component {
  state = {
    username: '',
    password: ''
  };

  componentDidMount() {
    if (this.props.isLoggedIn) {
      const locationState = this.props.location.state;

      this.props.history.push(locationState ? locationState.from : '/dashboard');
    }
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.isLoggedIn) {
      const locationState = this.props.location.state;

      this.props.history.push(
        locationState && locationState.from ? locationState.from.pathname : '/dashboard'
      );
    }
  }

  handleChangeInput = ev => {
    this.setState({ [ev.target.getAttribute('name')]: ev.target.value });
  };

  render() {
    const { isError, isLoading, errorCode } = this.props;

    let errorMessage = '';
    if (isError) {
      errorMessage =
        errorCode === 401 || errorCode === 403
          ? 'Wrong username or password'
          : 'Error has occurred';
    }

    return (
      <div className="container">
        <h1 className="sr-only">
          MoniAst - Asterisk real-time monitoring calls, agents, queues
        </h1>
        <form className="form-signin" onSubmit={this.handleSubmitForm}>
          <h2 className="form-signin-heading">Please sign in</h2>

          {isError && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <label htmlFor="inputUsername" className="sr-only">
            Username
          </label>
          <input
            type="text"
            id="inputUsername"
            name="username"
            className="form-control"
            placeholder="Username"
            required
            autoFocus
            value={this.state.username}
            onChange={this.handleChangeInput}
            aria-label="Username"
          />

          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input
            type="password"
            id="inputPassword"
            name="password"
            className="form-control"
            placeholder="Password"
            required
            value={this.state.password}
            onChange={this.handleChangeInput}
            aria-label="Password"
          />

          <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isLoading}>
            Sign in &nbsp;
            {isLoading && <i className="fa fa-circle-o-notch fa-spin login-spinner" />}
          </button>
        </form>
      </div>
    );
  }

  handleSubmitForm = ev => {
    ev.preventDefault();
    const locationState = this.props.location.state;
    const { username, password } = this.state;

    this.props.loginUser({
      username,
      password,
      from: locationState && locationState.from && locationState.from.pathname
    });
  };
}

Login.propTypes = {
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLoggedIn: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedInState(state),
    isLoading: getAuthIsLoadingInState(state),

    isError: getAuthIsErrorState(state),
    errorCode: getAuthErrorCodeState(state),
    errorMessage: getAuthErrorMessageState(state)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { loginUser }
  )(Login)
);
