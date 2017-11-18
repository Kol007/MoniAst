const jwt = require('jsonwebtoken'),
  User = require('../models/user');

module.exports = {
  'secret': 'Push here your key',
  'database': 'mongodb://localhost:27017/DATABASE_NAME',
  'port': process.env.PORT || 3001,

  testPort: 3001,
  testDb: 'TEST_DATABASE_NAME',
  testEnv: 'test',

  AMI: {
    port: 5038,
    ip: '127.0.0.1',
    login: 'AMI_LOGIN',
    pass: 'AMI_PASSWORD'
  }
};

