const User = require('../models/user');
const setUserInfo = require('../helpers/helpers').setUserInfo;

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = async function(req, res, next) {
  const username = req.params.username;

  try {
    let user = await User.findOne({ username });
    const userToReturn = setUserInfo(user);

    return res.status(200).json(userToReturn);
  } catch (err) {
    res.status(400).json({ error: 'No user could be found for this ID.' });
    return next(err);
  }
};

exports.allUsers = async function(req, res, next) {
  try {
    let users = await User.find({});
    users = users.map(el => setUserInfo(el));

    return res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: 'No user could be found for this ID.' });
    return next(err);
  }
};

exports.patchUser = async function(req, res, next) {
  const username = req.params.username;

  try {
    let user = await User.findOne({ username });

    if (req.body.password === '') {
      delete req.body.password;
    }

    user = Object.assign(user, req.body);
    user.profile = {
      lastName: req.body.lastName,
      firstName: req.body.firstName
    };

    delete user.lastName;
    delete user.firstName;

    try {
      await user.save()
      return res.status(200).json(setUserInfo(user));
    } catch (err) {
      // If error in saving token, return it
      return next(err);
    }
  } catch (err) {
    res.status(400).json({ error: 'No user could be found for this ID.' });
    return next(err);
  }
};

exports.deleteUser = async function(req, res, next) {
  const username = req.params.username;

  try {
    await User.remove({ username });

    return res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ error: 'No user could be found for this ID.' });
    return next(err);
  }
};

//= =======================================
// Registration Route
//= =======================================
exports.postUser = async function(req, res, next) {
  // Check for registration errors
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const role = req.body.role;
  const sip = req.body.sip;

  // Return error if no username provided
  if (!username) {
    return res
      .status(422)
      .send({ errorMessage: 'You must enter an username.', field: 'username' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ errorMessage: 'You must enter a password.', field: 'password' });
  }

  // Return error if firstName not provided
  if (!firstName) {
    return res
      .status(422)
      .send({ errorMessage: 'You must enter your full name.', field: 'firstName' });
  }

  // Return error if lastName not provided
  if (!lastName) {
    return res
      .status(422)
      .send({ errorMessage: 'You must enter your full name.', field: 'lastName' });
  }

  // Return error if no SIP provided
  if (!sip) {
    return res.status(422).send({ errorMessage: 'You must enter a SIP number.', field: 'sip' });
  }

  try {
    let existingUser = await User.findOne({ username });
    // If user is not unique, return error
    if (existingUser) {
      return res
        .status(422)
        .send({ errorMessage: 'That username is already in use.', field: 'username' });
    }

    // If username is unique and password was provided, create account
    const user = new User({
      username,
      password,
      role,
      profile: { firstName, lastName },
      sip
    });

    try {
      user = await user.save();
      // Subscribe member to Mailchimp list
      // mailchimp.subscribeToNewsletter(user.username);

      // Respond with JWT if user was created

      const userInfo = setUserInfo(user);

      res.status(201).json(userInfo);
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};
