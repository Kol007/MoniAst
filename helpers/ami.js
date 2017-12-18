const config = require('../config/config');

const AMI = new require('asterisk-manager')(
  config.AMI.port,
  config.AMI.ip,
  config.AMI.login, config.AMI.pass, true
);

AMI.keepConnected();

module.exports = AMI;