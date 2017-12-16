import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getUsers, deleteUser } from 'AC/user';
import {
  Container,
  Row,
  Table,
  ButtonGroup,
  Button,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

class PanelUsers extends Component {
  componentDidMount() {
    const { isLoaded, isLoading, getUsers } = this.props;

    if (!isLoaded && !isLoading) {
      getUsers();
    }
  }

  _handleDeleteUser(username) {
    if (confirm(`Delete ${username}?`)) {
      this.props.deleteUser(username);
    }
  }

  render() {
    const { entities: users, isLoaded, isLoading } = this.props;

    const usersComponent = users.map(user => {
      return (
        <tr key={user._id}>
          <td>
            <RRNavLink to={`/users/${user.username}`}>{user.username}</RRNavLink>
          </td>
          <td>{user.sip}</td>
          <td>{user.role}</td>
          <td>{`${user.firstName} ${user.lastName}`}</td>
          <td>
            <ButtonGroup>
              <Button tag={RRNavLink} to={`/users/${user.username}`} outline color="info">
                Edit
              </Button>
              <Button outline color="danger" onClick={() => this._handleDeleteUser(user.username)}>
                Delete
              </Button>
            </ButtonGroup>
          </td>
        </tr>
      );
    });

    return (
      <Container>
        <Row>
          <Card body={false} style={{ margin: '20px auto', padding: '20px', width: '100%' }}>

            <NavLink tag={RRNavLink} to="/users/register">
              <Button outline color="primary">
                Add User
              </Button>
            </NavLink>


            <Table bordered hover striped>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>SIP</th>
                  <th>Role</th>
                  <th>FullName</th>
                  <th />
                </tr>
              </thead>
              <tbody>{usersComponent}</tbody>
            </Table>
          </Card>
        </Row>
      </Container>
    );
  }
}

PanelUsers.propTypes = {
  entities: PropTypes.array,
  isLoading: PropTypes.bool,
  isLoaded: PropTypes.bool
};

function mapStateToProps(state) {
  const { user } = state;

  return {
    entities: user.get('entities').toArray(),
    isLoading: user.get('isLoading'),
    isLoaded: user.get('isLoaded')
  };
}

export default connect(mapStateToProps, { getUsers, deleteUser })(PanelUsers);
