import React from 'react';
import { Route, Router, Switch, Redirect, Con } from 'react-router';

import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from './routeHandlers/PrivateRoute';

import Container from './components/Container';
import Content from './components/Content';
import Counter from './components/Counter';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PanelUsers from './components/PanelUsers';
import User from './components/User';
// import ClientInfo from './components/ClientInfo';

import NotFoundPage from './routeHandlers/NotFoundPage';

// v4
export default (
  <BrowserRouter>
    <Container>
      <Switch>
        <Route exact path="/login" component={Login} />

        <Route path="/cnt" component={Counter} />

        <Content>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/dashboard" component={Dashboard} />

          <PrivateRoute path="/counter" component={Counter} />
          <PrivateRoute exact path="/users" component={PanelUsers} />
          <PrivateRoute path="/users/:id" component={User} />
        </Content>

        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Container>
  </BrowserRouter>
);
