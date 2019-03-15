// const Rx = require('rx');
const User = require('../models/user');

const ROLE_CLIENT = require('./constants').ROLE_CLIENT;
const ROLE_ADMIN = require('./constants').ROLE_ADMIN;

const ROLE_STRING_CLIENT = require('./constants').ROLE_STRING_CLIENT;
const ROLE_STRING_ADMIN = require('./constants').ROLE_STRING_ADMIN;

function createDefaultAdmin() {
  const username = 'admin';
  const firstName = 'default';
  const lastName = 'admin';
  const password = 'admin';
  const role = ROLE_ADMIN;
  const sip = '0';

  const user = new User({
    username,
    password,
    role,
    profile: { firstName, lastName },
    sip
  });

  user.save((err, user) => {
    if (err) {
      console.log('error with creating default user:', err);
    }

    console.log('Created default user: admin/admin');
  });
}

exports.isAdminExists = function isAdminExists() {
  User.find({}, (err, users) => {
    if (err) {
      return console.log('Error with DB!');
    }

    if (users.length === 0) {
      createDefaultAdmin();
    }
  });
};

exports.convertDurationToSeconds = function convertDurationToSeconds(str) {
  const hash = {
    0: 3600,
    1: 60,
    2: 1
  };

  return str.split(':').reduce((sum, item, i) => {
    return +sum + +item * hash[i];
  }, 0);
};

// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    username: request.username,
    role: request.role,
    sip: request.sip || 0
  };

  return getUserInfo;
};

exports.getRole = function getRole(checkRole) {
  switch (checkRole) {
    case ROLE_STRING_ADMIN:
      return ROLE_ADMIN;
    case ROLE_STRING_CLIENT:
      return ROLE_CLIENT;
    default:
      return ROLE_CLIENT;
  }
};

/**
 * Normalize a port into a number, string, or false.
 */

exports.normalizePort = function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};
