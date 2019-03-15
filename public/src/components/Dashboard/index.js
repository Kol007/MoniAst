import React, { Component } from 'react';

import PanelTrunk from 'components/PanelTrunk';
import PanelSip from 'components/PanelSip';
import SipToolbar from '../SipToolbar';
import { Card } from 'reactstrap';

export class Dashboard extends Component {
  render() {
    return (
      <>
        <SipToolbar />

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
      </>
    );
  }
}

export default Dashboard;
