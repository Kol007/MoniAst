const AMI           = require('../helpers/ami');
const getListEvents = require('./common').getListEvents;

const SIP_STATUS                  = require('../helpers/constants').SIP_STATUS;
const PJSIP_STATUS                = require('../helpers/constants').PJSIP_STATUS;
const SIP_STATUS_IDLE             = require('../helpers/constants').SIP_STATUS_IDLE;
const SIP_STATUS_IN_USE           = require('../helpers/constants').SIP_STATUS_IN_USE;
const SIP_STATUS_BUSY             = require('../helpers/constants').SIP_STATUS_BUSY;
const SIP_STATUS_UNAVAILABLE      = require('../helpers/constants').SIP_STATUS_UNAVAILABLE;
const SIP_STATUS_RINGING          = require('../helpers/constants').SIP_STATUS_RINGING;
const SIP_STATUS_ON_HOLD          = require('../helpers/constants').SIP_STATUS_ON_HOLD;
const SIP_STATUS_CODE_IN_USE      = require('../helpers/constants').SIP_STATUS_CODE_IN_USE;
const SIP_STATUS_CODE_BUSY        = require('../helpers/constants').SIP_STATUS_CODE_BUSY;
const SIP_STATUS_CODE_UNAVAILABLE = require('../helpers/constants').SIP_STATUS_CODE_UNAVAILABLE;
const SIP_STATUS_CODE_RINGING     = require('../helpers/constants').SIP_STATUS_CODE_RINGING;
const SIP_STATUS_CODE_ON_HOLD     = require('../helpers/constants').SIP_STATUS_CODE_ON_HOLD;

exports.getSip = async function (req, res, next) {
  let pjSipPromise = getAllPjSipWithInfo();
  let sipPromise   = getAllSipWithInfo();

  Promise.all([sipPromise, pjSipPromise]).then(([sip, pjsip]) => {
    req.data = [...sip, ...pjsip];
    next();
  });
};

exports.getSipResponse = function (req, res, next) {
  res.json(req.data);
};

function getAllSipWithInfo() {
  return new Promise((resolve, reject) => {
    AMI.action({ action: 'SIPpeers' }, async function (err, res) {
      if (!err) {
        let response = await getListEvents(AMI, res.actionid, 'PeerlistComplete');

        let promisesSip = response.map(item => {
          const online = item.ipaddress !== '-none-';
          const status = online ? SIP_STATUS_IDLE : SIP_STATUS_UNAVAILABLE;

          return new Promise((resolve, reject) => {
            AMI.action({ action: 'SIPshowpeer', Peer: item.objectname }, (err, res) => {
              let login = res.callerid ? res.callerid.match(/"(\w+)"/) : '';
              login     = login ? login[1] : '';

              resolve({
                id     : item.objectname,
                sip    : item.objectname,
                isTrunk: !login,
                login,
                status,
                online
              });
            });
          });
        });

        Promise.all(promisesSip).then(results => {
          resolve(results);
        });
      } else {
        resolve([]);
      }
    });
  });
}

function getPjsipAdditionalInfo(item) {
  let result = {};
  let promise;

  promise = new Promise((resolve, reject) => {
    AMI.action({ action: 'PJSIPShowEndpoint', endpoint: item.objectname }, function (err, res) {
      let listener = AMI.on('managerevent', f);

      function f(evt) {
        if (evt.actionid === res.actionid) {
          if (evt.event === 'EndpointDetailComplete') {
            listener.removeListener('EndpointDetail', f);
            resolve(result);
          } else {
            if (evt.event === 'EndpointDetail') {
              let login = evt.callerid ? evt.callerid.match(/"(\w+)"/) : '';
              login     = login ? login[1] : '';

              const online = item.devicestate !== 'Unavailable';
              const status = PJSIP_STATUS[item.devicestate] || SIP_STATUS_UNAVAILABLE;

              result = {
                id     : item.objectname,
                sip    : item.objectname,
                isTrunk: !login,
                login,
                status,
                online
              };
            }
          }
        }
      }
    });
  });

  return promise;
}

function getAllPjSipWithInfo() {
  return new Promise((resolve, reject) => {
    AMI.action({ action: 'PJSIPShowEndpoints' }, async function (err, res) {
      if (!err) {
        let response = await getListEvents(AMI, res.actionid, 'EndpointListComplete');
        let promises = response.map(item => getPjsipAdditionalInfo(item));

        Promise.all(promises).then(results => {
          resolve(results);
        });
      } else {
        resolve([]);
      }
    });
  });
}
