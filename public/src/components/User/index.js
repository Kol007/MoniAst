import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { getUser, patchUser, postUser } from 'AC/user';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Redirect } from 'react-router';

import PropTypes from 'prop-types';

import {
  Container,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  getUserErrorFieldState,
  getUserIsErrorMsgState,
  getUserIsErrorState,
  getUserIsSubmittedState,
  getUserState
} from '../../store/selectors/user';

import { toast } from 'react-toastify';
import styles from './User.module.css';

class User extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    isSubmitSuccess: PropTypes.bool,
    isNew: PropTypes.bool,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    errorField: PropTypes.string
  };

  state = {
    firstName: '',
    lastName: '',
    username: '',
    role: 'Client',
    sip: '',
    _id: '',
    password: '',
    isSubmitSuccess: false
  };

  componentDidMount() {
    const { match, getUser, user, isNew } = this.props;
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
      ...user
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user && nextProps.user.username !== prevState.username) {
      return {
        firstName: nextProps.user.firstName,
        lastName: nextProps.user.lastName,
        username: nextProps.user.username,
        role: nextProps.user.role,
        sip: nextProps.user.sip,
        _id: nextProps.user._id
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    const { isNew } = this.props;
    if (this.props.isSubmitSuccess === true && prevProps.isSubmitSuccess === false) {
      const message = isNew ? 'User successful created' : 'User successful updated';

      toast.success(message);

      this.setState({ isSubmitSuccess: true });
    }

    if (this.props.isError === true) {
      toast.error(this.props.errorMessage || 'Error has occurred');
    }
  }

  handleChangeInput = ev => {
    this.setState({
      [ev.target.name]: ev.target.value
    });
  };

  handleSubmitForm = ev => {
    ev.preventDefault();
    const { firstName, lastName, sip, role, username, password } = this.state;
    const { isNew, patchUser, postUser } = this.props;

    const user = {
      username,
      firstName,
      lastName,
      sip,
      role,
      password
    };

    if (isNew) {
      return postUser(user);
    }

    patchUser(user);
  };

  _renderFormItem({ label, field, type = 'text', isInvalid = false, ...attributes }) {
    const { errorMessage } = this.props;

    return (
      <FormGroup row>
        <Label for={field} md={2} className="text-capitalize">
          {label || field}
        </Label>
        <Col md={10}>
          <Input
            {...attributes}
            type={type}
            name={field}
            id={field}
            value={this.state[field]}
            invalid={isInvalid}
            onChange={this.handleChangeInput}
          />
          {isInvalid && errorMessage && <FormFeedback>{errorMessage}</FormFeedback>}
        </Col>
      </FormGroup>
    );
  }

  render() {
    const { user, isNew, isError, errorMessage, errorField } = this.props;

    if (this.state.isSubmitSuccess) {
      return <Redirect to={'/users'} />;
    }

    return (
      <Container>
        <h1 className="sr-only">
          {isNew && 'Create new user'}
          {!isNew && `Edit user: ${this.state.username}`}
        </h1>
        <Breadcrumb className={styles['bread-crumbs']}>
          <BreadcrumbItem>
            <RRNavLink to="/users/">Users</RRNavLink>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            {isNew && 'Create new user'}
            {!isNew && this.state.username}
          </BreadcrumbItem>
        </Breadcrumb>

        <div className={styles.content}>
          <Form onSubmit={this.handleSubmitForm}>
            {isNew && (
              <FormItem
                value={this.state.username}
                field="username"
                isInvalid={isError && errorField === 'username'}
                errorMessage={errorMessage}
                handleOnChange={this.handleChangeInput}
              />
            )}

            <FormItem
              type="password"
              value={this.state.password}
              field="password"
              isInvalid={isError && errorField === 'password'}
              errorMessage={errorMessage}
              handleOnChange={this.handleChangeInput}
            />

            <FormItem
              value={this.state.role}
              field="role"
              type="select"
              isInvalid={isError && errorField === 'role'}
              errorMessage={errorMessage}
              handleOnChange={this.handleChangeInput}
              options={[{ key: 'Admin' }, { key: 'Client' }]}
            />

            <FormItem
              value={this.state.firstName}
              field="firstName"
              label="First Name"
              isInvalid={isError && errorField === 'firstName'}
              errorMessage={errorMessage}
              handleOnChange={this.handleChangeInput}
            />

            <FormItem
              value={this.state.lastName}
              field="lastName"
              label="Last Name"
              isInvalid={isError && errorField === 'lastName'}
              errorMessage={errorMessage}
              handleOnChange={this.handleChangeInput}
            />

            <FormItem
              value={this.state.sip}
              field="sip"
              isInvalid={isError && errorField === 'sip'}
              errorMessage={errorMessage}
              handleOnChange={this.handleChangeInput}
            />

            {isNew && <Button>Create User</Button>}

            {!isNew && (
              <Button disabled={!user}>
                Change &nbsp;
                {(!user || user.isLoading) && <FontAwesomeIcon icon="circle-notch" spin />}
              </Button>
            )}
          </Form>
        </div>
      </Container>
    );
  }
}

const FormItem = ({
  value,
  label,
  field,
  type = 'text',
  isInvalid = false,
  errorMessage,
  handleOnChange,
  ...attributes
}) => {
  const { options, ...rest } = attributes;
  let Options = null;

  if (options) {
    Options = options.map(el => (
      <option key={el.key} value={el.key}>
        {el.label || el.key}
      </option>
    ));
  }

  return (
    <FormGroup row>
      <Label for={field} md={2} className="text-capitalize">
        {label || field}
      </Label>
      <Col md={10}>
        <Input
          {...rest}
          type={type}
          name={field}
          id={field}
          value={value}
          invalid={isInvalid}
          onChange={handleOnChange}
        >
          {Options}
        </Input>
        {isInvalid && errorMessage && <FormFeedback>{errorMessage}</FormFeedback>}
      </Col>
    </FormGroup>
  );
};

function mapStateToProps(state, { match }) {
  const username = match.params.id;
  const isNew = username === 'register';

  return {
    user: !isNew ? getUserState(state, username) : null,
    isNew: isNew,
    isError: getUserIsErrorState(state),
    errorMessage: getUserIsErrorMsgState(state),
    errorField: getUserErrorFieldState(state),
    isSubmitSuccess: getUserIsSubmittedState(state)
  };
}

export default connect(
  mapStateToProps,
  { getUser, patchUser, postUser }
)(User);
