const AMI = require('../ami');
const async = require('async');
const getList = require('../helpers').getList;

const SIP_STATUS = require('../constants').SIP_STATUS;
const SIP_STATUS_IDLE = require('../constants').SIP_STATUS_IDLE;
const SIP_STATUS_IN_USE = require('../constants').SIP_STATUS_IN_USE;
const SIP_STATUS_BUSY = require('../constants').SIP_STATUS_BUSY;
const SIP_STATUS_UNAVAILABLE = require('../constants').SIP_STATUS_UNAVAILABLE;
const SIP_STATUS_RINGING = require('../constants').SIP_STATUS_RINGING;
const SIP_STATUS_ON_HOLDSIP_STATUS_CODE_IDLE = require('../constants').SIP_STATUS_ON_HOLDSIP_STATUS_CODE_IDLE;
const SIP_STATUS_CODE_IN_USE = require('../constants').SIP_STATUS_CODE_IN_USE;
const SIP_STATUS_CODE_BUSY = require('../constants').SIP_STATUS_CODE_BUSY;
const SIP_STATUS_CODE_UNAVAILABLE = require('../constants').SIP_STATUS_CODE_UNAVAILABLE;
const SIP_STATUS_CODE_RINGING = require('../constants').SIP_STATUS_CODE_RINGING;
const SIP_STATUS_CODE_ON_HOLD = require('../constants').SIP_STATUS_CODE_ON_HOLD;


const CHANNEL_STATUS_DOWN_AVAILABLE = require('../constants').CHANNEL_STATUS_DOWN_AVAILABLE;
const CHANNEL_STATUS_DOWN_RESERVED = require('../constants').CHANNEL_STATUS_DOWN_RESERVED;
const CHANNEL_STATUS_OFF_HOOK = require('../constants').CHANNEL_STATUS_OFF_HOOK;
const CHANNEL_STATUS_DIGITS_DIALED = require('../constants').CHANNEL_STATUS_DIGITS_DIALED;
const CHANNEL_STATUS_OUT_RINGING = require('../constants').CHANNEL_STATUS_OUT_RINGING;
const CHANNEL_STATUS_IN_RINGING = require('../constants').CHANNEL_STATUS_IN_RINGING;
const CHANNEL_STATUS_UP = require('../constants').CHANNEL_STATUS_UP;
const CHANNEL_STATUS_BUSY = require('../constants').CHANNEL_STATUS_BUSY;

const CHANNEL_STATUS_CODE_DOWN_AVAILABLE = require('../constants').CHANNEL_STATUS_CODE_DOWN_AVAILABLE;
const CHANNEL_STATUS_CODE_DOWN_RESERVED = require('../constants').CHANNEL_STATUS_CODE_DOWN_RESERVED;
const CHANNEL_STATUS_CODE_OFF_HOOK = require('../constants').CHANNEL_STATUS_CODE_OFF_HOOK;
const CHANNEL_STATUS_CODE_DIGITS_DIALED = require('../constants').CHANNEL_STATUS_CODE_DIGITS_DIALED;
const CHANNEL_STATUS_CODE_OUT_RINGING = require('../constants').CHANNEL_STATUS_CODE_OUT_RINGING;
const CHANNEL_STATUS_CODE_IN_RINGING = require('../constants').CHANNEL_STATUS_CODE_IN_RINGING;
const CHANNEL_STATUS_CODE_UP = require('../constants').CHANNEL_STATUS_CODE_UP;
const CHANNEL_STATUS_CODE_BUSY = require('../constants').CHANNEL_STATUS_CODE_BUSY;

const CHANNEL_STATUS = require('../constants').CHANNEL_STATUS;

const socketioJwt = require('socketio-jwt'); // аутентификация по JWT для socket.io
const config = require('../config/config');

module.exports = function(io) {
  io.use(socketioJwt.authorize({
    secret: config.secret,
    handshake: true
  }));

  io.on('connection', function (socket) {
    // in socket.io 1.0
    console.log('hello! ', socket.decoded_token.username);
  });

  // // STATUS OF SIP EXTENSION IS CHANGED
  AMI.on('extensionstatus', function(evt) {
    io.emit('change-sip-status', {
      sip: evt.exten,
      status: SIP_STATUS[evt.status],
      online: SIP_STATUS_CODE_UNAVAILABLE !== evt.status
    });
  });

  AMI.on('dial', function(evt) {
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
  });

  AMI.on('hangup', function(evt) {
    io.emit('remove-channel', evt.uniqueid);
  });

  AMI.on('newchannel', function(evt) {
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
  });


  AMI.on('bridge', function (evt) {
    var chn1 = evt.channel1.match('/([^-]+)')[1];
    var chn2 = evt.channel2.match('/([^-]+)')[1];

    // console.log('---', evt);
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
  });
};

