import React, { Component } from 'react';

import PanelTrunk from '../PanelTrunk';
import PanelSip from '../PanelSip';

export class Dashboard extends Component {
  render () {
    return (
      <div className="container-fluid">
        <div className="row" style={{marginTop: '10px', marginBottom: '10px'}}>
          <div className="col-9">
            <PanelSip />
          </div>

          <div className="col-3">
            <PanelTrunk />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;