import React, { Component } from "react";
import PropTypes from 'prop-types';

import { Provider } from "react-redux";
import store from "../../store";
import { Link } from "react-router";

import { Grid, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { Snackbar } from 'react-redux-snackbar';

import "./css/bootstrap.min.css";
import "./css/main.css";

class Container extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>

          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Moniast</Link>
              </Navbar.Brand>
            </Navbar.Header>

            <Navbar.Collapse>
              <Nav navbar>

                <LinkContainer to="/">
                  <NavItem>Dashboard</NavItem>
                </LinkContainer>

                <LinkContainer to="/counter">
                  <NavItem>Счетчик</NavItem>
                </LinkContainer>

              </Nav>
            </Navbar.Collapse>
          </Navbar>

          <Grid style={{ width: 100 + "%" }}>
            {this.props.children}
          </Grid>

          <Snackbar />

        </div>

      </Provider>
    );
  }
}

export default Container;
