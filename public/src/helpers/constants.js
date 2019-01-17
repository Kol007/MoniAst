export const API_URL = '/api';

export const START   = '_START';
export const SUCCESS = '_SUCCESS';
export const FAIL    = '_FAIL';

// AUTH
export const AUTH_USER         = 'AUTH_USER';
export const UNAUTH_USER       = 'UNAUTH_USER';
export const AUTH_ERROR        = 'AUTH_ERROR';
export const PROTECTED_TEST    = 'PROTECTED_TEST';
export const LOG_OUT           = 'LOG_OUT';
// USERS
export const LOAD_USERS        = 'LOAD_USERS';
export const POST_USER         = 'POST_USER';
export const ADD_USER          = 'ADD_USER';
export const PATCH_USER        = 'PATCH_USER';
export const DELETE_USER       = 'DELETE_USER';
export const REDIRECT_COMPLETE = 'REDIRECT_COMPLETE';

// SIP
export const LOAD_ALL_SIPS     = 'LOAD_ALL_SIPS';
export const SIP_CHANGE_STATE  = 'SIP_CHANGE_STATE';
export const CHANGE_SIP_STATUS = 'CHANGE_SIP_STATUS';
export const SIP_SELECT        = 'SIP_SELECT';
export const SIP_FILTER        = 'SIP_FILTER';
export const SIP_FILTER_ONLINE = 'SIP_FILTER_ONLINE';
export const SIP_FILTER_ALL    = 'SIP_FILTER_ALL';
// SIP SPY
export const SIP_SPY           = 'SIP_SPY';
export const SIP_SPY_WHISPER   = 'SIP_SPY_WHISPER';

// CHANNELS
export const BRIDGE_START        = 'BRIDGE_START';
export const BRIDGE_STOP         = 'BRIDGE_STOP';
export const LOAD_ALL_CHANNELS   = 'LOAD_ALL_CHANNELS';
export const NEW_CHANNEL         = 'NEW_CHANNEL';
export const REMOVE_CHANNEL      = 'REMOVE_CHANNEL';
// QUEUE
export const LOAD_ALL_QUEUES     = 'LOAD_ALL_QUEUES';
export const QUEUE_JOIN          = 'QUEUE_JOIN';
export const QUEUE_LEAVE         = 'QUEUE_LEAVE';
export const QUEUE_MEMBER_STATUS = 'QUEUE_MEMBER_STATUS';

// Asterisk statuses
export const SIP_STATUS_IDLE        = 'SIP_STATUS_IDLE';
export const SIP_STATUS_IN_USE      = 'SIP_STATUS_IN_USE';
export const SIP_STATUS_BUSY        = 'SIP_STATUS_BUSY';
export const SIP_STATUS_UNAVAILABLE = 'SIP_STATUS_UNAVAILABLE';
export const SIP_STATUS_RINGING     = 'SIP_STATUS_RINGING';
export const SIP_STATUS_ON_HOLD     = 'SIP_STATUS_ON_HOLD';

export const CHANNEL_STATUS_DOWN_AVAILABLE = 'CHANNEL_STATUS_DOWN_AVAILABLE';
export const CHANNEL_STATUS_DOWN_RESERVED  = 'CHANNEL_STATUS_DOWN_RESERVED';
export const CHANNEL_STATUS_OFF_HOOK       = 'CHANNEL_STATUS_OFF_HOOK';
export const CHANNEL_STATUS_DIGITS_DIALED  = 'CHANNEL_STATUS_DIGITS_DIALED';
export const CHANNEL_STATUS_OUT_RINGING    = 'CHANNEL_STATUS_OUT_RINGING';
export const CHANNEL_STATUS_IN_RINGING     = 'CHANNEL_STATUS_IN_RINGING';
export const CHANNEL_STATUS_UP             = 'CHANNEL_STATUS_UP';
export const CHANNEL_STATUS_BUSY           = 'CHANNEL_STATUS_BUSY';