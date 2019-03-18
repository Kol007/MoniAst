import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getUsers, deleteUser } from 'AC/user';
import { Container, Row, Table, ButtonGroup, Button, NavLink, Card } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { getUserIsLoadedState, getUserIsLoadingState, getUsersState } from 'store/selectors/user';

import Toolbar from 'components/Toolbar';

import styles from './PanelUsers.module.css';

class PanelUsers extends Component {
  static propTypes = {
    entities: PropTypes.object,
    isLoading: PropTypes.bool,
    isLoaded: PropTypes.bool
  };

  componentDidMount() {
    const { isLoading, getUsers } = this.props;

    if (!isLoading) {
      getUsers();
    }
  }

  _handleDeleteUser = username => () => {
    if (window.confirm(`Delete ${username}?`)) {
      this.props.deleteUser(username);
    }
  };

  _renderTableHeader() {
    return (
      <thead>
        <tr>
          <th>Username</th>
          <th>SIP</th>
          <th>Role</th>
          <th>Full Name</th>
          <th />
        </tr>
      </thead>
    );
  }
  _renderTableItem(user) {
    if (!user) {
      return null;
    }

    return (
      <tr key={user._id}>
        <td>
          <RRNavLink to={`/users/${user.username}`}>{user.username}</RRNavLink>
        </td>
        <td>{user.sip}</td>
        <td>{user.role}</td>
        <td>
          {user.firstName} {user.lastName}
        </td>
        <td>
          <ButtonGroup>
            <Button
              tag={RRNavLink}
              to={`/users/${user.username}`}
              outline
              color="info"
              aria-label={`Edit user: ${user.username}`}
            >
              Edit
            </Button>
            <Button
              outline
              color="danger"
              onClick={this._handleDeleteUser(user.username)}
              aria-label={`Delete user: ${user.username}`}
            >
              Delete
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  }

  render() {
    const { entities: users } = this.props;

    const usersComponent = users.entrySeq().map(([key, user]) => this._renderTableItem(user));

    return (
      <>
        <h1 className="sr-only">Manage users</h1>
        <Toolbar isFluid={false}>
          <NavLink tag={RRNavLink} to="/users/register" className={styles.toolbar__link}>
            <Button outline color="primary">
              Add User
            </Button>
          </NavLink>
        </Toolbar>
        <Container>
          <Row>
            <Card body={false} className={styles.content}>
              <Table bordered hover striped responsive role="presentation">
                {this._renderTableHeader()}
                <tbody>{usersComponent}</tbody>
              </Table>
            </Card>
          </Row>
        </Container>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    entities: getUsersState(state),
    isLoading: getUserIsLoadingState(state),
    isLoaded: getUserIsLoadedState(state)
  };
}

export default connect(
  mapStateToProps,
  { getUsers, deleteUser }
)(PanelUsers);
