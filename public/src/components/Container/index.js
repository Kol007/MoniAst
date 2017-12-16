import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from 'store';

import 'Component/App/css/bootstrap/bootstrap.min.css';
import 'Component/App/css/main.css';

class Container extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>{this.props.children}</div>
      </Provider>
    );
  }
}

export default Container;
