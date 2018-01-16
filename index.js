// Importing Node modules and initializing Express
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  router = require('./helpers/router'),
  mongoose = require('mongoose'),
  config = require('./config/config'),
  helpers = require('./helpers/helpers');

const path = require('path');
const debug = require('debug')('mon-gen:server');

// Database Setup
if (process.env.NODE_ENV !== config.testEnv) {
  mongoose.connect(config.database, {
    useMongoClient: true
  });
} else {
  mongoose.connect(config.testDb, {
    useMongoClient: true
  });
}

mongoose.connection.on('connected', function(ref) {
  helpers.isAdminExists();
});

// Start the server
let server;
if (process.env.NODE_ENV !== config.testEnv) {
  const port = helpers.normalizePort(config.port);
  const host = config.port || '0.0.0.0';

  server = app.listen(port, host);
} else {
  server = app.listen(config.testPort);
}

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.error('Failed to connect to DB on startup ');
  process.exit(0);
});

server.on('listening', function() {
  console.log(
    `Express server started on port ${server.address().port} at ${server.address().address}`
  );
});

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  next();
});
// Import routes to be served
router(app);

// // Serve static assets
app.use(express.static(`${__dirname}/public`));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const socketIO = require('socket.io');
let io = socketIO(server);

require('./controllers/socketEvents')(io);

// necessary for testing
module.exports = server;
