import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import { filterSip, spySip, spySipResetError } from 'AC/sip';

import { SIP_FILTER_ALL, SIP_FILTER_ONLINE } from 'helpers/constants';
import {
  getFilteredSipsState,
  getSipFilterState,
  getSipIsLoadedState,
  getSipIsLoadingState,
  getSipSelectedSipState,
  getSipSpyIsErrorState,
  getSipSpyStatusState,
  getSipSpyMessageState
} from 'store/selectors/sip';
import { getAuthSipState } from '../../store/selectors/auth';
import { getChannelsState } from '../../store/selectors/channels';

import styles from './SipToolbar.module.css';

class SipToolbar extends Component {
  static propTypes = {
    selectedSip: PropTypes.string,
    filterSip: PropTypes.func,
    spySip: PropTypes.func,
    filter: PropTypes.string,
    snackBarActions: PropTypes.object,

    sipSpyIsError: PropTypes.bool,
    sipSpyStatus: PropTypes.string,
    sipSpyMessage: PropTypes.string,

    isHideFilter: PropTypes.bool
  };

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.sipSpyIsError && prevProps.sipSpyIsError !== true) {
      toast.error(this.props.sipSpyMessage || 'An error has occurred');

      prevProps.spySipResetError();
    }

    if (
      !this.props.sipSpyIsError &&
      this.props.sipSpyStatus !== prevProps.sipSpyStatus &&
      this.props.sipSpyMessage
    ) {
      toast.info(this.props.sipSpyMessage);
    }
  }

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
    const { selectedSip, filter, queueEntity, isHideFilter } = this.props;

    const filterStateText = filter === SIP_FILTER_ALL ? 'Show online' : 'Show all';

    return (
      <div className={`nav-scroller bg-white shadow-sm ${styles.container}`}>
        <div className={`col-md-12 ${styles.content}`}>
          <nav className="nav nav-underline">
            <ButtonGroup>
              {!queueEntity &&
                !isHideFilter && (
                  <Button outline color="info" onClick={this.handleToggleOnline}>
                    {filterStateText}
                  </Button>
                )}

              <Button outline color="info" disabled={!selectedSip} onClick={this.handleSpy} title="Spy">
                <FontAwesomeIcon icon="user-secret" />
              </Button>

              <Button
                outline
                color="info"
                disabled={!selectedSip}
                onClick={this.handleSpyAndWhisper}
                title="Spy & whisper"
              >
                <FontAwesomeIcon icon="microphone" />
              </Button>
            </ButtonGroup>

            {!!queueEntity && (
              <ButtonGroup className="float-right">
                <span className="badge badge-primary">Queue - {queueEntity}</span>
              </ButtonGroup>
            )}
          </nav>
        </div>
      </div>
    );

    return (
      <div className={styles.content}>
        <ButtonGroup>
          {!queueEntity &&
            !isHideFilter && (
              <Button outline color="info" onClick={this.handleToggleOnline}>
                {filterStateText}
              </Button>
            )}

          <Button outline color="info" disabled={!selectedSip} onClick={this.handleSpy}>
            <FontAwesomeIcon icon="user-secret" />
          </Button>

          <Button
            outline
            color="info"
            disabled={!selectedSip}
            onClick={this.handleSpyAndWhisper}
            title=""
          >
            <FontAwesomeIcon icon="microphone" />
          </Button>
        </ButtonGroup>

        {!!queueEntity && (
          <ButtonGroup className="float-right">
            <span className="badge badge-primary">Queue - {queueEntity}</span>
          </ButtonGroup>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sip: getFilteredSipsState(state),
    channels: getChannelsState(state),

    isLoading: getSipIsLoadingState(state),
    isLoaded: getSipIsLoadedState(state),
    selectedSip: getSipSelectedSipState(state),

    filter: getSipFilterState(state),
    authSIP: getAuthSipState(state),

    sipSpyIsError: getSipSpyIsErrorState(state),
    sipSpyStatus: getSipSpyStatusState(state),
    sipSpyMessage: getSipSpyMessageState(state)
  };
}

export default connect(
  mapStateToProps,
  {
    filterSip,
    spySip,
    spySipResetError
  }
)(SipToolbar);
