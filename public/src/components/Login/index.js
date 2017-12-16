import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loginUser } from 'AC/auth';
import { withRouter } from 'react-router-dom';

import './login.css';

class Login extends Component {
  state = {
    redirectToReferrer: false,
    username: '',
    password: ''
  };

  componentDidMount() {
    if (this.props.isLoggedIn) {
      const locationState = this.props.location.state;

      this.props.history.push(locationState ? locationState.from : '/dashboard');
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.isLoggedIn) {
      const locationState = nextProps.location.state;

      this.props.history.push(
        locationState ? locationState.from.pathname : '/dashboard'
      );
    }
  }

  render() {
    const { isError, isLoading } = this.props;

    return (
      <div className="container">
        <form className="form-signin" onSubmit={this.handleSubmitForm}>
          <h2 className="form-signin-heading">Please sign in</h2>

          { isError &&
            <div className="alert alert-danger" role="alert">
              Wrong username or password
            </div>
          }
          <label htmlFor="inputUsername" className="sr-only">
            Username
          </label>
          <input
            type="text"
            id="inputUsername"
            className="form-control"
            placeholder="Username"
            required
            autoFocus
            value={this.state.username}
            onChange={ev => this.setState({ username: ev.target.value })}
          />

          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Password"
            required
            value={this.state.password}
            onChange={ev => this.setState({ password: ev.target.value })}
          />

          <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isLoading}>
            Sign in &nbsp;
            {isLoading && <i className="fa fa-circle-o-notch fa-spin" style={{fontSize: '24px'}}></i> }
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
      from: locationState && locationState.from.pathname
    });
  };
}

Login.propTypes = {
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.get('isLoggedIn'),
    isLoading: state.auth.get('isLoading'),

    isError: state.auth.get('isError'),
    errorCode: state.auth.get('errorCode'),
    errorMessage: state.auth.get('errorMessage'),
  };
}

export default withRouter(connect(mapStateToProps, { loginUser })(Login));
