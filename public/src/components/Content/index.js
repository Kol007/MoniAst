import React, { Component } from 'react';

import Header from 'Component/Header/index';

import './content.css';

class Container extends Component {
  render() {
    return (
        <div>
          <Header />

          <div>
            {this.props.children}
          </div>
        </div>
    );
  }
}

export default Container;