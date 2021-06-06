"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _main = _interopRequireDefault(require("./routes/main"));

var _secure = _interopRequireDefault(require("./routes/secure"));

var _password = _interopRequireDefault(require("./routes/password"));

var _asyncMiddleware = _interopRequireDefault(require("./middleware/asyncMiddleware"));

var _chatModel = _interopRequireDefault(require("./models/chatModel"));

require('dotenv').config();

// setup mongo connection
var uri = process.env.MONGO_CONNECTION_URL;

_mongoose["default"].connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true
});

_mongoose["default"].connection.on('error', function (error) {
  console.log(error);
  process.exit(1);
});

_mongoose["default"].connection.on('connected', function () {
  console.log('connected to mongo');
});

_mongoose["default"].set('useFindAndModify', false); // create an instance of an express app


var app = (0, _express["default"])();

var server = require('http').Server(app);

var io = require('socket.io').listen(server);

var players = {};
io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id); // create a new player and add it to our players object

  players[socket.id] = {
    flipX: false,
    x: Math.floor(Math.random() * 400) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id
  }; // send the players object to the new player

  socket.emit('currentPlayers', players); // update all other players of the new player

  socket.broadcast.emit('newPlayer', players[socket.id]); // when a player disconnects, remove them from our players object

  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete players[socket.id]; // emit a message to all players to remove this player

    io.emit('disconnect', socket.id);
  }); // when a plaayer moves, update the player data

  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].flipX = movementData.flipX; // emit a message to all players about the player that moved

    socket.broadcast.emit('playerMoved', players[socket.id]);
  });
}); // update express settings

app.use(_bodyParser["default"].urlencoded({
  extended: false
})); // parse application/x-www-form-urlencoded

app.use(_bodyParser["default"].json()); // parse application/json

app.use((0, _cookieParser["default"])()); // require passport auth

require('./auth/auth');

app.get('/game.html', _passport["default"].authenticate('jwt', {
  session: false
}), function (req, res) {
  res.sendFile(__dirname + '/public/game.html');
});
app.get('/game.html', function (req, res) {
  res.sendFile(__dirname + '/public/game.html');
});
app.use(_express["default"]["static"](__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
}); // main routes

app.use('/', _main["default"]);
app.use('/', _password["default"]);
app.use('/', _passport["default"].authenticate('jwt', {
  session: false
}), _secure["default"]);
app.post('/submit-chatline', _passport["default"].authenticate('jwt', {
  session: false
}), (0, _asyncMiddleware["default"])( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var message, _req$user, email, name;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            message = req.body.message;
            _req$user = req.user, email = _req$user.email, name = _req$user.name;
            _context.next = 4;
            return _chatModel["default"].create({
              email: email,
              message: message
            });

          case 4:
            io.emit('new message', {
              username: name,
              message: message
            });
            res.status(200).json({
              status: 'ok'
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}())); // catch all other routes

app.use(function (req, res, next) {
  res.status(404).json({
    message: '404 - Not Found'
  });
}); // handle errors

app.use(function (err, req, res, next) {
  console.log(err.message);
  res.status(err.status || 500).json({
    error: err.message
  });
});
server.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port ".concat(process.env.PORT || 3000));
});
//# sourceMappingURL=app.js.map