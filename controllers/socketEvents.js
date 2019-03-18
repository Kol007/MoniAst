const AMI = require('../helpers/ami');
const getList = require('../helpers/helpers').getList;

const QUEUE_MEMBER_STATUS = require('../helpers/constants').QUEUE_MEMBER_STATUS;
const SIP_STATUS = require('../helpers/constants').SIP_STATUS;
const SIP_STATUS_IDLE = require('../helpers/constants').SIP_STATUS_IDLE;
const SIP_STATUS_IN_USE = require('../helpers/constants').SIP_STATUS_IN_USE;
const SIP_STATUS_BUSY = require('../helpers/constants').SIP_STATUS_BUSY;
const SIP_STATUS_UNAVAILABLE = require('../helpers/constants').SIP_STATUS_UNAVAILABLE;
const SIP_STATUS_RINGING = require('../helpers/constants').SIP_STATUS_RINGING;
const SIP_STATUS_ON_HOLDSIP_STATUS_CODE_IDLE = require('../helpers/constants')
  .SIP_STATUS_ON_HOLDSIP_STATUS_CODE_IDLE;
const SIP_STATUS_CODE_IN_USE = require('../helpers/constants').SIP_STATUS_CODE_IN_USE;
const SIP_STATUS_CODE_BUSY = require('../helpers/constants').SIP_STATUS_CODE_BUSY;
const SIP_STATUS_CODE_UNAVAILABLE = require('../helpers/constants').SIP_STATUS_CODE_UNAVAILABLE;
const SIP_STATUS_CODE_RINGING = require('../helpers/constants').SIP_STATUS_CODE_RINGING;
const SIP_STATUS_CODE_ON_HOLD = require('../helpers/constants').SIP_STATUS_CODE_ON_HOLD;

const CHANNEL_STATUS_DOWN_AVAILABLE = require('../helpers/constants').CHANNEL_STATUS_DOWN_AVAILABLE;
const CHANNEL_STATUS_DOWN_RESERVED = require('../helpers/constants').CHANNEL_STATUS_DOWN_RESERVED;
const CHANNEL_STATUS_OFF_HOOK = require('../helpers/constants').CHANNEL_STATUS_OFF_HOOK;
const CHANNEL_STATUS_DIGITS_DIALED = require('../helpers/constants').CHANNEL_STATUS_DIGITS_DIALED;
const CHANNEL_STATUS_OUT_RINGING = require('../helpers/constants').CHANNEL_STATUS_OUT_RINGING;
const CHANNEL_STATUS_IN_RINGING = require('../helpers/constants').CHANNEL_STATUS_IN_RINGING;
const CHANNEL_STATUS_UP = require('../helpers/constants').CHANNEL_STATUS_UP;
const CHANNEL_STATUS_BUSY = require('../helpers/constants').CHANNEL_STATUS_BUSY;

const CHANNEL_STATUS_CODE_DOWN_AVAILABLE = require('../helpers/constants')
  .CHANNEL_STATUS_CODE_DOWN_AVAILABLE;
const CHANNEL_STATUS_CODE_DOWN_RESERVED = require('../helpers/constants')
  .CHANNEL_STATUS_CODE_DOWN_RESERVED;
const CHANNEL_STATUS_CODE_OFF_HOOK = require('../helpers/constants').CHANNEL_STATUS_CODE_OFF_HOOK;
const CHANNEL_STATUS_CODE_DIGITS_DIALED = require('../helpers/constants')
  .CHANNEL_STATUS_CODE_DIGITS_DIALED;
const CHANNEL_STATUS_CODE_OUT_RINGING = require('../helpers/constants')
  .CHANNEL_STATUS_CODE_OUT_RINGING;
const CHANNEL_STATUS_CODE_IN_RINGING = require('../helpers/constants')
  .CHANNEL_STATUS_CODE_IN_RINGING;
const CHANNEL_STATUS_CODE_UP = require('../helpers/constants').CHANNEL_STATUS_CODE_UP;
const CHANNEL_STATUS_CODE_BUSY = require('../helpers/constants').CHANNEL_STATUS_CODE_BUSY;

const CHANNEL_STATUS = require('../helpers/constants').CHANNEL_STATUS;

const socketioJwt = require('socketio-jwt'); // аутентификация по JWT для socket.io
const config = require('../config/config');

module.exports = function(io) {
  io.use(
    socketioJwt.authorize({
      secret: config.secret,
      handshake: true
    })
  );

  io.on('connection', function(socket) {
    console.log('hello! ', socket.decoded_token.username);
  });

  AMI.on('managerevent', function(evt) {
    // if (evt.event !== 'RTCPReceived' && evt.event !== 'RTCPSent' ) {
    //   console.log('---', evt);
    // }

    switch (evt.event) {
      case 'ExtensionStatus':
        sipStatusChangedEvent(io, evt);
        break;
      case 'Dial':
        dialEvent(io, evt);
        break;
      case 'Hangup':
        hangupEvent(io, evt);
        break;
      case 'Newchannel':
        newChannelEvent(io, evt);
        break;
      case 'Bridge':
        bridgeEvent(io, evt);
        break;
      case 'QueueMemberStatus':
        QueueMemberStatusChangedEvent(io, evt);
        break;
      case 'QueueCallerJoin':
      case 'Join':
        queueJoinEvent(io, evt);
        break;
      case 'Leave':
      case 'QueueCallerLeave':
        queueLeaveEvent(io, evt);
        break;
      default:
        break;
    }
  });
};

function newChannelEvent(io, evt) {
  evt.date = new Date();
  const chn1 = evt.channel.match('/([^-]+)')[1];

  io.emit('new-channel', {
    id: evt.uniqueid,
    sip: chn1,
    connectedlinenum: evt.exten,
    duration: 0,
    date: evt.date,
    status: evt.status,
    channel: evt.channel
  });
}

function queueJoinEvent(io, evt) {
  evt.wait = '0';
  evt.date = new Date();
  io.emit('queue-join', {
    entry: evt
  });
}

function queueLeaveEvent(io, evt) {
  evt.wait = '0';
  io.emit('queue-leave', {
    entry: evt
  });
}

// // STATUS OF SIP EXTENSION IS CHANGED
function sipStatusChangedEvent(io, evt) {
  if (evt.exten.substr(0, 3) !== '*47') {
    io.emit('change-sip-status', {
      sip: evt.exten,
      status: SIP_STATUS[evt.status],
      online: SIP_STATUS_CODE_UNAVAILABLE !== evt.status
    });
  }
}

// // STATUS OF SIP EXTENSION IS CHANGED
function QueueMemberStatusChangedEvent(io, evt) {
  let sip = evt.location ? evt.location.match(/\d+/) : '';
  evt.sip = sip ? sip[0] : '';
  evt.login = evt.name || evt.membername;
  evt.online = evt.status !== '0' && evt.status !== '5';

  evt.status = QUEUE_MEMBER_STATUS[evt.status];

  io.emit('change-queue-member-status', evt);
}

function dialEvent(io, evt) {
  if (evt.subevent === 'Begin') {
    io.emit('new-channel', {
      id: evt.destuniqueid,
      sip: evt.dialstring,
      connectedlinenum: evt.calleridnum,
      duration: 0,
      date: 0,
      status: CHANNEL_STATUS_OUT_RINGING //Ring
    });
  }
}

function hangupEvent(io, evt) {
  io.emit('remove-channel', evt.uniqueid);
}

function bridgeEvent(io, evt) {
  const chn1 = evt.channel1.match('/([^-]+)')[1];
  const chn2 = evt.channel2.match('/([^-]+)')[1];

  if (evt.bridgestate === 'Link') {
    evt.date = new Date();
    evt.status = CHANNEL_STATUS_UP;

    io.emit('new-channel', {
      id: evt.uniqueid1,
      sip: chn1,
      connectedlinenum: evt.callerid2,
      duration: 0,
      date: evt.date,
      status: evt.status,
      channel: evt.channel1
    });

    io.emit('new-channel', {
      id: evt.uniqueid2,
      sip: chn2,
      connectedlinenum: evt.callerid1,
      duration: 0,
      date: evt.date,
      status: evt.status,
      channel: evt.channel2
    });
  }
}
