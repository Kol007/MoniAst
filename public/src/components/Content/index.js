import React, { Component } from 'react';

import Header from '../Header/index';
import Footer from '../Footer/index';

import './content.css';

class Container extends Component {
  render() {
    return (
        <div>
          <Header />

          <div>
            {this.props.children}
          </div>

          <Footer />
        </div>
    );
  }
}

export default Container;