import {
  API_URL,
  SIP_SELECT,
  LOAD_ALL_SIPS,
  CHANGE_SIP_STATUS,
  START,
  SUCCESS,
  FAIL,
  SIP_FILTER,
  SIP_SPY,
  SIP_SPY_WHISPER,
  BRIDGE_STOP
} from '../helpers/constants';

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
