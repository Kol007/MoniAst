import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Providers from 'helpers/Provider';
import PrivateRoute from './routeHandlers/PrivateRoute';
import store from 'store';

import Content from './components/Content';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PanelQueues from './components/PanelQueues';
import PanelUsers from './components/PanelUsers';
import User from './components/User';

import NotFoundPage from './routeHandlers/NotFoundPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/App/css/main.css';

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update');
  // whyDidYouUpdate(React);
  // whyDidYouUpdate(React, { exclude: [/Duration Timer$/] });
  //   whyDidYouUpdate(React, { include: [/^PanelQueues/], exclude: [/^Connect/] });
  //   whyDidYouUpdate(React, { include: [/^QueueMembers/], exclude: [/^Connect/] });
  //   whyDidYouUpdate(React, { include: [/^QueueEntryContainer/]});
  //   whyDidYouUpdate(React, { include: [/^QueueEntries/], exclude: [/^Connect/] });
// }

// v4
export default (
  <Providers store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />

        <Content>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/dashboard" component={Dashboard} />

            <PrivateRoute path="/queues" component={PanelQueues} />

            <PrivateRoute exact path="/users" component={PanelUsers} />
            <PrivateRoute path="/users/:id" component={User} />
          </Switch>
        </Content>

        <Route path="*" component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  </Providers>
);
