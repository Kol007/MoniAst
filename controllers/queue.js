const AMI           = require('../helpers/ami');
// const async         = require('async');
const getListEvents = require('./common').getListEvents;

const QUEUE_MEMBER_STATUS = require('../helpers/constants').QUEUE_MEMBER_STATUS;

exports.getQueues = async function (req, res, next) {
  req.data = await getQueuesStatus();
  next();
};

function getQueuesStatus() {
  return new Promise((resolve, reject) => {
    AMI.action({ action: 'QueueStatus' }, async function (err, res) {
      if (!err) {
        let response = await getListEvents(AMI, res.actionid, 'QueueStatusComplete');
        let queues   = {};

        response.map(el => {
          if (el.queue === 'default') {
            return;
          }

          if (!queues[el.queue]) {
            queues[el.queue] = {
              members: [],
              entries: [],
              params : {}
            };
          }

          switch (el.event) {
            case 'QueueMember':
              let sip   = el.location ? el.location.match(/\d+/) : '';
              el.sip    = sip ? sip[0] : '';
              el.login  = el.name;
              el.online = el.status !== '0' && el.status !== '5';

              el.status = QUEUE_MEMBER_STATUS[el.status];

              queues[el.queue].members.push(el);
              break;
            case 'QueueParams':
              queues[el.queue].params = el;
              break;
            case 'QueueEntry':
              el.date = new Date();
              queues[el.queue].entries.push(el);
              break;
          }
        });

        resolve(queues);
      } else {
        resolve([]);
      }
    });
  });
}
