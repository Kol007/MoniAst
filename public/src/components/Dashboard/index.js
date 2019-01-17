import React, { Component } from 'react';

import PanelTrunk from 'Component/PanelTrunk';
import PanelSip from 'Component/PanelSip';

export class Dashboard extends Component {
  render () {
    return (
      <div className="container-fluid">
        <div className="row extensions-container">
          <div className="col-md-9">
            <PanelSip />
          </div>

          <div className="col-md-3">
            <PanelTrunk />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;