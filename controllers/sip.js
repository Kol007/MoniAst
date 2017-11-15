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

function getSipInfo(item, callback) {
  const online = item.ipaddress !== '-none-';
  const status = online ? SIP_STATUS_IDLE : SIP_STATUS_UNAVAILABLE;

  AMI.action({ action: 'SIPshowpeer', Peer: item.objectname }, (err, res) => {
    let login = res.callerid.match(/"(\w+)"/);

    callback(null, {
      id: item.objectname,
      sip: item.objectname,
      login: login ? login[1] : '',
      status,
      online
    });
  });
}

exports.getSip = function (req, res, next) {
  getList(AMI, 'SIPpeers', 'PeerlistComplete', function(err, list) {
    async.map(list, getSipInfo, (err, result) => {
      if (!err) {
        return res.json(result);
      }

      // console.log('Error: ');
    });
  });
};