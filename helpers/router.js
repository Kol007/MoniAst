const AuthenticationController = require('../controllers/authentication'),
  UserController = require('../controllers/user'),
  SipController = require('../controllers/sip'),
  ChannelsController = require('../controllers/channels'),
  express = require('express'),
  passportService = require('../config/passport'),
  passport = require('passport');

const ROLE_CLIENT = require('./constants').ROLE_CLIENT;
const ROLE_ADMIN = require('./constants').ROLE_ADMIN;

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Constants for role types
const REQUIRE_ADMIN = 'Admin',
  REQUIRE_CLIENT = 'Client';

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    sipRoutes = express.Router(),
    channelsRoutes = express.Router(),
    userRoutes = express.Router(),
    authRoutes = express.Router();

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', requireAuth, AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  //= ========================
  // SIP Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/sip', sipRoutes);

  // View user profile route
  sipRoutes.get('/', requireAuth, SipController.getSip, SipController.getSipResponse);

  //= ========================
  // Channels Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/channels', channelsRoutes);

  // View user profile route
  channelsRoutes.get('/', requireAuth, ChannelsController.getChannels);

  channelsRoutes.get('/spy/:recipient/:sip', requireAuth, ChannelsController.spyChannel);

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/users', userRoutes);

  // Get all users
  userRoutes.get('/', requireAuth, UserController.allUsers);
  // View user profile route
  userRoutes.get('/:username', requireAuth, UserController.viewProfile);

  userRoutes.patch('/:username', requireAuth, UserController.patchUser);

  userRoutes.post(
    '/register',
    requireAuth,
    AuthenticationController.roleAuthorization(ROLE_ADMIN),
    UserController.postUser
  );

  userRoutes.delete(
    '/:username',
    requireAuth,
    AuthenticationController.roleAuthorization(ROLE_ADMIN),
    UserController.deleteUser
  );

  // Test protected route
  apiRoutes.get('/protected', requireAuth, (req, res) => {
    res.send({ content: 'The protected test route is functional!' });
  });

  apiRoutes.get(
    '/admins-only',
    requireAuth,
    AuthenticationController.roleAuthorization(ROLE_ADMIN),
    (req, res) => {
      res.send({ content: 'Admin dashboard is working.' });
    }
  );
  // Set url for API group routes
  app.use('/api', apiRoutes);
};
