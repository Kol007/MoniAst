import React, { PureComponent } from 'react';
import { NavLink as RRNavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

import { logOutUser } from 'AC/auth';

class Header extends PureComponent{
  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleLogOut = () => {
    this.props.logOutUser();
  };

  render() {
    return (
      <header >
        <Navbar color="primary" dark expand="md">
          <NavbarBrand tag={RRNavLink} to="/dashboard">
            MoniAst
          </NavbarBrand>

          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink tag={RRNavLink} to="/dashboard" >
                  Dashboard
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="/users">
                  Users
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={this.handleLogOut} href="#">
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

function mapStateToProps() {
  return {};
}

export default withRouter(connect(() => ({}), { logOutUser })(Header));
