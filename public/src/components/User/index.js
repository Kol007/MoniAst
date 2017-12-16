import React, { Component } from 'react';

import { connect } from 'react-redux';
import { getUser, patchUser, postUser, redirectComplete } from 'AC/user';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Redirect } from 'react-router'

import PropTypes from 'prop-types';

import {
  Container,
  Row,
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Col,
  Breadcrumb,
  BreadcrumbItem
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';

class User extends Component {
  state = {
    firstName: '',
    lastName: '',
    username: '',
    role: 'Client',
    sip: '',
    _id: '',
    password: ''
  };

  componentWillReceiveProps(nextProps) {
    const { getUser, user, match, isNew } = nextProps;
    if (isNew) {
      return;
    }

    const username = match.params.id;

    if (!user) {
      return getUser(username);
    }

    const { _id, isLoading } = user;
    if (!_id && !isLoading) {
      return getUser(username);
    }

    this.setState({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
      sip: user.sip,
      _id: user._id
    });
  }

  componentDidMount() {
    const { match, getUser, user, isNew } = this.props;
    if (isNew) {
      return;
    }

    const username = match.params.id;

    const {} = this.props;
    if (!user) {
      return getUser(username);
    }

    const { _id, isLoading } = user;
    if (!_id && !isLoading) {
      return getUser(username);
    }

    this.setState({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
      sip: user.sip
    });
  }

  handleSubmitForm = ev => {
    ev.preventDefault();
    const { firstName, lastName, sip, role, username, password } = this.state;
    const { isNew, patchUser, postUser } = this.props;

    if (isNew) {
      return postUser({
        username,
        firstName,
        lastName,
        sip,
        role,
        password
      });
    }

    patchUser(username, {
      firstName,
      lastName,
      sip,
      role,
      password
    });
  };

  render() {
    const { user, isNew, isError, errorMessage, errorField, shouldRedirect, redirectComplete } = this.props;
    const invalidFields = { [errorField]: { valid: false } };

    if (shouldRedirect) {
      redirectComplete();
      return <Redirect to={shouldRedirect}/>
    }

    return (
      <Container>
        <Breadcrumb style={{ margin: '20px' }}>
          <BreadcrumbItem>
            <RRNavLink to="/users/">Users</RRNavLink>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            {isNew && 'Create new user'}
            {!isNew && this.state.username}
          </BreadcrumbItem>
        </Breadcrumb>

        <div style={{ margin: '20px' }}>
          <Form onSubmit={this.handleSubmitForm}>
            {isNew && (
              <FormGroup row>
                <Label for="username" md={2}>
                  Username
                </Label>
                <Col md={10}>
                  <Input
                    disabled={!isNew}
                    type="text"
                    name="username"
                    id="username"
                    value={this.state.username}
                    {...invalidFields['username']}
                    // required={true}
                    onChange={ev => this.setState({ username: ev.target.value })}
                  />
                  {isError &&
                  errorField === 'username' && <FormFeedback>{errorMessage}</FormFeedback>}
                </Col>
              </FormGroup>
            )}

            <FormGroup row>
              <Label for="password" md={2}>
                Password
              </Label>
              <Col md={10}>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  value={this.state.password}
                  {...invalidFields['password']}
                  // required={true}
                  onChange={ev => this.setState({ password: ev.target.value })}
                />
                {isError &&
                errorField === 'password' && <FormFeedback>{errorMessage}</FormFeedback>}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="role" md={2}>
                Role
              </Label>
              <Col md={10}>
                <Input
                  type="select"
                  name="role"
                  id="role"
                  value={this.state.role}
                  {...invalidFields['role']}
                  onChange={ev => this.setState({ role: ev.target.value })}
                >
                  <option value={'Admin'}>Admin</option>
                  <option value={'Client'}>Client</option>
                </Input>
                {isError && errorField === 'role' && <FormFeedback>{errorMessage}</FormFeedback>}{' '}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="firstName" md={2}>
                First Name
              </Label>
              <Col md={10}>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={this.state.firstName}
                  {...invalidFields['firstName']}
                  // required={true}
                  onChange={ev => this.setState({ firstName: ev.target.value })}
                />
                {isError && errorField === 'firstName' && <FormFeedback>{errorMessage}</FormFeedback>}{' '}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="lastName" md={2}>
                Last Name
              </Label>
              <Col md={10}>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={this.state.lastName}
                  {...invalidFields['lastName']}
                  // required={true}
                  onChange={ev => this.setState({ lastName: ev.target.value })}
                />
                {isError && errorField === 'lastName' && <FormFeedback>{errorMessage}</FormFeedback>}{' '}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="sip" md={2}>
                SIP
              </Label>
              <Col md={10}>
                <Input
                  type="text"
                  name="sip"
                  id="sip"
                  value={this.state.sip}
                  {...invalidFields['sip']}
                  // required={true}
                  onChange={ev => this.setState({ sip: ev.target.value })}
                />
                {isError && errorField === 'sip' && <FormFeedback>{errorMessage}</FormFeedback>}{' '}
              </Col>
            </FormGroup>

            {isNew && <Button>Create User</Button>}

            {!isNew && (
              <Button disabled={!user}>
                Change &nbsp;
                {(!user || user.isLoading) && <FontAwesome name="circle-o-notch" spin />}
              </Button>
            )}
          </Form>
        </div>
      </Container>
    );

  }
}

User.propTypes = {
  user: PropTypes.object
};

function mapStateToProps(state, { match }) {
  const username = match.params.id;

  const isNew = username === 'register';
  const user = !isNew ? state.user.getIn(['entities', username]) : null;

  return {
    user,
    isNew,
    isError: state.user.get('isError'),
    errorMessage: state.user.get('errorMessage'),
    errorField: state.user.get('errorField'),
    shouldRedirect: state.user.get('shouldRedirect'),
  };
}

export default connect(mapStateToProps, { getUser, patchUser, postUser, redirectComplete })(User);
