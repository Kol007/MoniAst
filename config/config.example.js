module.exports = {
  'port': process.env.PORT || 3001,

  'secret': 'Push here your key',
  'database': 'mongodb://localhost:27017/DATABASE_NAME',

  AMI: {
    port: 5038,
    ip: '127.0.0.1',
    login: 'AMI_LOGIN',
    pass: 'AMI_PASSWORD'
  }
};

