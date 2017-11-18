const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const setUserInfo = require('../helpers').setUserInfo;
const getRole = require('../helpers').getRole;
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
exports.login = function (req, res, next) {
  const userInfo = setUserInfo(req.user);

  console.log('---', userInfo);
  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};


//= =======================================
// Registration Route
//= =======================================
exports.register = function (req, res, next) {
  // Check for registration errors
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const sip = req.body.sip;

  // Return error if no username provided
  if (!username) {
    return res.status(422).send({ error: 'You must enter an username address.' });
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
    if (err) { return next(err); }

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
      if (err) { return next(err); }

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
exports.roleAuthorization = function (requiredRole) {
  return function (req, res, next) {
    const user = req.user[0];

    User.findById(user._id, (err, foundUser) => {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (getRole(foundUser.role) >= getRole(requiredRole)) {
        return next();
      }

      return res.status(401).json({ error: 'You are not authorized to view this content.' });
    });
  };
};

//= =======================================
// Forgot Password Route
//= =======================================

exports.forgotPassword = function (req, res, next) {
  const username = req.body.username;

  User.findOne({ username }, (err, existingUser) => {
    // If user is not found, return error
    if (err || existingUser == null) {
      res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
      return next(err);
    }

    // If user is found, generate and save resetToken

    // Generate a token with Crypto
    crypto.randomBytes(48, (err, buffer) => {
      const resetToken = buffer.toString('hex');
      if (err) { return next(err); }

      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      existingUser.save((err) => {
        // If error in saving token, return it
        if (err) { return next(err); }

        const message = {
          subject: 'Reset Password',
          text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
          'If you did not request this, please ignore this username and your password will remain unchanged.\n'
        };

        return res.status(200).json({ message: 'Please check your username for the link to reset your password.' });
      });
    });
  });
};

//= =======================================
// Reset Password Route
//= =======================================

exports.verifyToken = function (req, res, next) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
    // If query returned no results, token expired or was invalid. Return error.
    if (!resetUser) {
      res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
    }

    // Otherwise, save new password and clear resetToken from database
    resetUser.password = req.body.password;
    resetUser.resetPasswordToken = null;
    resetUser.resetPasswordExpires = null;

    resetUser.save((err) => {
      if (err) { return next(err); }

      // If password change saved successfully, alert user via username
      const message = {
        subject: 'Password Changed',
        text: 'You are receiving this username because you changed your password. \n\n' +
        'If you did not request this change, please contact us immediately.'
      };

      return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
    });
  });
};