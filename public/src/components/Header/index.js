import React, { PureComponent } from 'react';
import { NavLink as RRNavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import { logOutUser } from 'AC/auth';
import { getQueues } from 'AC/queue';
import {
  getQueuesIsLoadedState,
  getQueuesIsLoadingState,
  getQueuesKeysState
} from '../../store/selectors/queue';

class Header extends PureComponent {
  state = {
    isOpen: false
  };

  componentDidMount() {
    const { isLoadingQueues, isLoadedQueues } = this.props;

    if (!isLoadingQueues && !isLoadedQueues) {
      this.props.getQueues();
    }
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { logOutUser, isQueuesExist } = this.props;

    return (
      <header>
        <Navbar color="primary" dark expand="md">
          <NavbarBrand tag={RRNavLink} to="/dashboard">
            MoniAst
          </NavbarBrand>

          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink tag={RRNavLink} to="/dashboard">
                  Dashboard
                </NavLink>
              </NavItem>
              {isQueuesExist && (
                <NavItem>
                  <NavLink tag={RRNavLink} to="/queues">
                    Queues
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink tag={RRNavLink} to="/users">
                  Users
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={logOutUser} href="#">
                  LogOut
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

function mapStateToProps(state) {
  const queues = getQueuesKeysState(state);

  return {
    isQueuesExist: queues ? !!queues.size : null,
    isLoadingQueues: getQueuesIsLoadingState(state),
    isLoadedQueues: getQueuesIsLoadedState(state)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { logOutUser, getQueues }
  )(Header)
);
