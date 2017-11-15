import {
  SIP_SELECT,
  LOAD_ALL_SIPS,
  CHANGE_SIP_STATUS,
  START,
  SUCCESS,
  FAIL,
  SIP_FILTER,
  SIP_SPY,
  SIP_SPY_WHISPER
} from '../constants';

// const API_URL = 'http://localhost:3001/api';
const API_URL = 'http://93.89.215.83:3001/api';

export function loadSipPeers() {
  return {
    type: LOAD_ALL_SIPS,
    callAPI: `${API_URL}/sip`,
    needAuth: true
  };
}

export function changeSipStatus({ sip, status, online }) {
  return {
    type: CHANGE_SIP_STATUS,
    payload: {
      sip,
      status,
      online
    },
    needAuth: true
  };
}

export function selectSip(sip) {
  return {
    type: SIP_SELECT,
    payload: {
      sip
    }
  };
}

export function filterSip(filter) {
  return {
    type: SIP_FILTER,
    payload: {
      filter
    },
    needAuth: true

  };
}

export function spySip(recipient, sip, whisper) {
  return {
    type: SIP_SPY,
    payload: { recipient, sip, whisper },
    callAPI: `${API_URL}/channels/spy/${recipient}/${sip}`,
    needAuth: true
  };
}

//// TESTS
export function stopBridgeTest() {
  const action = {
    type: BRIDGE_STOP
  };

  return action;
}
