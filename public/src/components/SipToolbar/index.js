import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, ButtonGroup } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

import { filterSip, spySip } from 'AC/sip';

import { SIP_FILTER_ALL, SIP_FILTER_ONLINE  } from 'helpers/constants';
import { getFilteredSipsState } from 'store/selectors';

class SipToolbar extends Component {
  handleToggleOnline = ev => {
    ev.preventDefault();

    const { filterSip, filter } = this.props;

    if (filter === SIP_FILTER_ALL || !filter) {
      return filterSip(SIP_FILTER_ONLINE);
    }

    filterSip(SIP_FILTER_ALL);
  };

  handleSpy = () => {
    const { selectedSip, spySip, authSIP } = this.props;

    spySip(authSIP, selectedSip);
  };

  handleSpyAndWhisper = () => {
    const { selectedSip, spySip, authSIP } = this.props;

    spySip(authSIP, selectedSip, true);
  };

  render() {
    const { selectedSip, filter } = this.props;

    const buttonSpy = {
      disabled: !selectedSip
    };

    const filterStateText = filter === SIP_FILTER_ALL ? 'Show online' : 'Show all';

    return (
      <div style={{ margin: '10px 10px 10px 20px' }}>
        <ButtonGroup>
          <Button outline color="info" onClick={this.handleToggleOnline}>
            {filterStateText}
          </Button>
          <Button outline color="info" disabled={buttonSpy.disabled} onClick={this.handleSpy}>
            <FontAwesome name="user-secret" />
          </Button>

          <Button
            outline
            color="info"
            disabled={buttonSpy.disabled}
            onClick={this.handleSpyAndWhisper}
          >
            <FontAwesome name="microphone" />
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

SipToolbar.propTypes = {
  selectedSip: PropTypes.string,
  filterSip: PropTypes.func,
  filter: PropTypes.string,
  sipSpyStatus: PropTypes.object,
  snackBarActions: PropTypes.object
  // channelsDefault: PropTypes.object
};

function mapStateToProps(state) {
  const { sip, channels, auth } = state;

  return {
    sip: getFilteredSipsState(state),
    channels: channels,

    isLoading: sip.get('isLoading'),
    isLoaded: sip.get('isLoaded'),
    selectedSip: sip.get('selectedSip'),

    filter: sip.get('filter'),
    sipSpyStatus: sip.get('sipSpy').toJSON(),
    authSIP: auth.get('sip')
  };
}

export default connect(mapStateToProps, {
  filterSip,
  spySip
})(SipToolbar);
