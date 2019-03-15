const jwt = require('jsonwebtoken');
const User = require('../models/user');
const setUserInfo = require('../helpers/helpers').setUserInfo;
const getRole = require('../helpers/helpers').getRole;
const config = require('../config/config');

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 604800 // week in seconds
  });
}

//= =======================================
// Login Route
//= =======================================
exports.login = function(req, res, next) {
  const userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};

//= =======================================
// Registration Route
//= =======================================
exports.register = function(req, res, next) {
  // Check for registration errors
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const sip = req.body.sip;

  // Return error if no username provided
  if (!username) {
    return res.status(422).send({ error: 'You must enter an username.' });
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'You must enter your full name.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }
  // Return error if no SIP provided
  if (!sip) {
    return res.status(422).send({ error: 'You must enter a SIP number.' });
  }

  User.findOne({ username }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'That username address is already in use.' });
    }

    // If username is unique and password was provided, create account
    const user = new User({
      username,
      password,
      profile: { firstName, lastName },
      sip
    });

    user.save((err, user) => {
      if (err) {
        return next(err);
      }

      // Respond with JWT if user was created
      const userInfo = setUserInfo(user);

      res.status(201).json(userInfo);
    });
  });
};

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
exports.roleAuthorization = function(requiredRole) {
  return function(req, res, next) {
    const user = req.user[0];

    User.findById(user._id, (err, foundUser) => {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (getRole(foundUser.role) >= requiredRole) {
        return next();
      }

      return res.status(423).json({ errorMessage: 'You are not authorized to do this' });
    });
  };
};

//= =======================================
// Reset Password Route
//= =======================================

exports.verifyToken = function(req, res, next) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    (err, resetUser) => {
      // If query returned no results, token expired or was invalid. Return error.
      if (!resetUser) {
        res.status(422).json({
          error: 'Your token has expired. Please attempt to reset your password again.'
        });
      }

      // Otherwise, save new password and clear resetToken from database
      resetUser.password = req.body.password;
      resetUser.resetPasswordToken = null;
      resetUser.resetPasswordExpires = null;

      resetUser.save(err => {
        if (err) {
          return next(err);
        }

        // If password change saved successfully, alert user via username
        const message = {
          subject: 'Password Changed',
          text:
            'You are receiving this username because you changed your password. \n\n' +
            'If you did not request this change, please contact us immediately.'
        };

        return res.status(200).json({
          message: 'Password changed successfully. Please login with your new password.'
        });
      });
    }
  );
};
