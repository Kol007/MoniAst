const AMI = require('../helpers/ami');
// const getList                  = require('../helpers/helpers').getList;
const getListEvents = require('./common').getListEvents;
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

exports.getChannels = async function(req, res, next) {
  AMI.action({ action: 'CoreShowChannels' }, async function(err, res) {
    if (!err) {
      let response = await getListEvents(AMI, res.actionid, 'CoreShowChannelsComplete');
      response.map(item => {
        item.id = item.uniqueid;

        item.sip = item.channel.match(/\/(\w+)-/);
        item.sip = item.sip ? item.sip[1] : '';

        item.duration = convertDurationToSeconds(item.duration);
        item.date = new Date();
        item.status = CHANNEL_STATUS[item.channelstate]; // 6 is UP

        if (item.channelstate === CHANNEL_STATUS_UP) {
          return item;
        }

        return null;
      });

      req.data = response;
      next();
    } else {
      req.data = [];
      next();
    }
  });
};

// router.get('/channelSpy/:recipient/:sip', function(req, res, next) {
exports.spyChannel = function(req, res, next) {
  const isWhisperEnabled = req.query.whisper;
  const mode = isWhisperEnabled ? 'qwEx' : 'qEx';

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
    0: 'Your SIP phone is turned off',
    1: 'No answer',
    4: isWhisperEnabled ? 'Connected, you can whisper' : 'Connected',
    5: 'Busy',
    8: 'Congested or not available (Disconnected Number)'
  };

  const promise = new Promise((resolve, reject) => {
    AMI.action(action, function(err2, res2) {
      const f = evt => {
        if (evt.actionid === res2.actionid) {
          AMI.removeListener(event, f);

          resolve(evt);
        }
      };

      let listener = AMI.on(event, f);
      listener.removeListener('managerevent', f);
    });
  });

  promise.then(function(result) {
    res.json({
      status: result.response,
      reason: Reason[result.reason]
    });
  });
};
