import React, { Component } from 'react';

import Header from 'components/Header/index';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './content.css';

class Content extends Component {
  render() {
    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />

        <Header />

        <div>{this.props.children}</div>
      </div>
    );
  }
}

export default Content;
