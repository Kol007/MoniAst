import React from 'react';
import { Route, Router, Switch, Redirect } from 'react-router';

import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from './routeHandlers/PrivateRoute';

import Container from './components/Container';
import Content from './components/Content';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PanelUsers from './components/PanelUsers';
import User from './components/User';

import NotFoundPage from './routeHandlers/NotFoundPage';

// v4
export default (
  <BrowserRouter>
    <Container>
      <Switch>
        <Route exact path="/login" component={Login} />

        <Content>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/dashboard" component={Dashboard} />

          <PrivateRoute exact path="/users" component={PanelUsers} />
          <PrivateRoute path="/users/:id" component={User} />
        </Content>

        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Container>
  </BrowserRouter>
);
