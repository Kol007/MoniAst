const AMI = require('../helpers/ami');
const getList = require('../helpers/helpers').getList;
const convertDurationToSeconds = require('../helpers/helpers').convertDurationToSeconds;

// 0 Channel is down and available
// 1 Channel is down, but reserved
// 2 Channel is off hook
// 3 Digits (or equivalent) have been dialed
// 4 Line is ringing
// 5 Remote end is ringing
// 6 Line is up
// 7 Line is busy
const CHANNEL_STATUS_DOWN_AVAILABLE = 'CHANNEL_STATUS_DOWN_AVAILABLE';
const CHANNEL_STATUS_DOWN_RESERVED = 'CHANNEL_STATUS_DOWN_RESERVED';
const CHANNEL_STATUS_OFF_HOOK = 'CHANNEL_STATUS_OFF_HOOK';
const CHANNEL_STATUS_DIGITS_DIALED = 'CHANNEL_STATUS_DIGITS_DIALED';
const CHANNEL_STATUS_OUT_RINGING = 'CHANNEL_STATUS_OUT_RINGING';
const CHANNEL_STATUS_IN_RINGING = 'CHANNEL_STATUS_IN_RINGING';
const CHANNEL_STATUS_UP = 'CHANNEL_STATUS_UP';
const CHANNEL_STATUS_BUSY = 'CHANNEL_STATUS_BUSY';

const CHANNEL_STATUS_CODE_DOWN_AVAILABLE = 0;
const CHANNEL_STATUS_CODE_DOWN_RESERVED = 1;
const CHANNEL_STATUS_CODE_OFF_HOOK = 2;
const CHANNEL_STATUS_CODE_DIGITS_DIALED = 3;
const CHANNEL_STATUS_CODE_OUT_RINGING = 4;
const CHANNEL_STATUS_CODE_IN_RINGING = 5;
const CHANNEL_STATUS_CODE_UP = 6;
const CHANNEL_STATUS_CODE_BUSY = 7;

const CHANNEL_STATUS = {
  0: 'CHANNEL_STATUS_DOWN_AVAILABLE',
  1: 'CHANNEL_STATUS_DOWN_RESERVED',
  2: 'CHANNEL_STATUS_OFF_HOOK',
  3: 'CHANNEL_STATUS_DIGITS_DIALED',
  4: 'CHANNEL_STATUS_OUT_RINGING',
  5: 'CHANNEL_STATUS_IN_RINGING',
  6: 'CHANNEL_STATUS_UP',
  7: 'CHANNEL_STATUS_BUSY'
};

exports.getChannels = function (req, res, next) {
  getList(AMI, 'CoreShowChannels', 'CoreShowChannelsComplete', function(
    err,
    list
  ) {
    if (!list) {
      return res.json([]);
    }

    list.map((item) => {
      item.id = item.uniqueid;

      item.sip = item.channel.match(/\/(\w+)-/);
      item.sip = item.sip ? item.sip[1] : '';

      item.duration = convertDurationToSeconds(item.duration);
      item.date = new Date();
      item.status = CHANNEL_STATUS[item.channelstate]; // 6 is UP

      if (item.channelstate === CHANNEL_STATUS_UP) {
        return item;
      }

      // return undefined;
      return null;
    });

    return res.json(list);
  });
};

// router.get('/channelSpy/:recipient/:sip', function(req, res, next) {
exports.spyChannel = function(req, res, next) {
  const mode = req.params.whisper ? 'qwEx' : 'qEx';
  const recipient = req.params.recipient;
  const spyingSip = req.params.sip;

  const action = {
    action: 'Originate',
    channel: `SIP/${recipient}`,
    application: 'ChanSpy',
    data: `SIP/${req.params.sip},${mode}`,
    async: 'yes',
    priority: 1,
    exten: req.params.sip,
    context: 'from-internal',
    callerid: `Spy-${spyingSip} <${spyingSip}>`
  };

  const event = 'originateresponse';

  const Reason = {
    0: 'Extension is turned off',
    1: 'no answer',
    4: 'answered',
    5: 'busy',
    8: 'congested or not available (Disconnected Number)',
  };

  const promise = new Promise((resolve, reject) => {
    AMI.action(action, function(err2, res2) {
      const f = evt => {
        if (evt.actionid === res2.actionid) {
          AMI.removeListener(event, f);

          resolve(evt);
        }
      };

      AMI.on(event, f);
    });
  });

  promise.then(function(result) {
    res.json({
      status: result.response,
      reason: Reason[result.reason]
    });
  });
};

// // STATUS OF SIP EXTENSION IS CHANGED
// AMI.on('extensionstatus', function(evt) {
//   global.io.emit('change-sip-status', {
//     sip: evt.exten,
//     status: SIP_STATUS[evt.status],
//     online: SIP_STATUS_CODE_UNAVAILABLE !== evt.status
//   });
// });
//
// AMI.on('dial', function(evt) {
//   // Dial -> Hangup
//   //
//   // Ring 4
//   // Dial 5
//   // UP   6
//
//   //   channel: 'SIP/Dinstar-0002e23e',
//   //   calleridnum: '+380662348514',
//   //   calleridname: '37925 (len_oboron_16_5)',
//   //   uniqueid: '1484053962.188999',
//   //   destuniqueid: '1484053999.189011',
//   //   dialstring: '129' }
//
//   // sip               : 0,
//   //   connectedlinenum  : 0,
//   //   id                : '',
//   //   duration          : 0,
//   //   date              : 0,
//   //   status            : 0
//
//   if (evt.subevent === 'Begin') {
//     global.io.emit('new-channel', {
//       id: evt.destuniqueid,
//       sip: evt.dialstring,
//       connectedlinenum: evt.calleridnum,
//       duration: 0,
//       date: 0,
//       status: CHANNEL_STATUS_OUT_RINGING //Ring
//     });
//
//     // console.dir(evt, {colors: true});
//   }
// });
//
// AMI.on('hangup', function(evt) {
//   // console.dir(evt, 'HANGUP', { colors: true });
//   // console.log('---', evt.cause , '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
//
//   global.io.emit('remove-channel', evt.uniqueid);
// });
//
// AMI.on('newstate', function(evt) {
//   // console.log('-------- Newstate !!!----------', evt);
// });
//
// AMI.on('newchannel', function(evt) {
//   // console.log('-------- Newstate !!!----------', evt);
//
//   // evt.status   = CHANNEL_STATUS_UP;
//   evt.date = new Date();
//   const chn1 = evt.channel.match('/([^-]+)')[1];
//
//   global.io.emit('new-channel', {
//     id: evt.uniqueid,
//     sip: chn1,
//     connectedlinenum: evt.exten,
//     duration: 0,
//     date: evt.date,
//     status: evt.status,
//     channel: evt.channel
//   });
// });
// // -------- Newstate !!!---------- { event: 'Newchannel',
// //     privilege: 'call,all',
// //     channel: 'SIP/Dinstar-00006612',
// //     channelstate: '0',
// //     channelstatedesc: 'Down',
// //     calleridnum: '+380505956526',
// //     calleridname: '+380505956526',
// //     accountcode: '',
// //     exten: '610',
// //     context: 'from-internal',
// //     uniqueid: '1497356808.26130' }
//
// AMI.on('bridge', function(evt) {
//   var chn1 = evt.channel1.match('/([^-]+)')[1];
//   var chn2 = evt.channel2.match('/([^-]+)')[1];
//
//   // console.log('---', evt);
//   if (evt.bridgestate === 'Link') {
//     evt.date = new Date();
//     evt.status = CHANNEL_STATUS_UP;
//
//     global.io.emit('new-channel', {
//       id: evt.uniqueid1,
//       sip: chn1,
//       connectedlinenum: evt.callerid2,
//       duration: 0,
//       date: evt.date,
//       status: evt.status,
//       channel: evt.channel1
//     });
//
//     global.io.emit('new-channel', {
//       id: evt.uniqueid2,
//       sip: chn2,
//       connectedlinenum: evt.callerid1,
//       duration: 0,
//       date: evt.date,
//       status: evt.status,
//       channel: evt.channel2
//     });
//
//     ///////////////////////
//     // channel1: 'SIP/Dinstar_066-00002e6e',
//     //     channel2: 'SIP/123-00002e72',
//     //     uniqueid1: '1458916129.11957',
//     //     uniqueid2: '1458916130.11961',
//     //     callerid1: '+380509643801',
//     //     callerid2: '123' }
//     //      bridgestate: 'Link',
//     //      bridgestate: 'Unlink',
//     //
//   }
//
//   // if (evt.bridgestate === 'Unlink') {
//   //   global.io.emit('remove-channel', evt.uniqueid1);
//   //   global.io.emit('remove-channel', evt.uniqueid2);
//   // }
// });