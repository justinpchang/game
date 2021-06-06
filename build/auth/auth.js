"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var passport = require("passport");

var localStrategy = require("passport-local").Strategy;

var JWTstrategy = require("passport-jwt").Strategy;

var UserModel = require("../models/userModel"); // handle user registration


passport.use("signup", new localStrategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
}, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, email, password, done) {
    var name, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            name = req.body.name;
            _context.next = 4;
            return UserModel.create({
              email: email,
              password: password,
              name: name
            });

          case 4:
            user = _context.sent;
            return _context.abrupt("return", done(null, user));

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            done(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}())); // handle user login

passport.use("login", new localStrategy({
  usernameField: "email",
  passwordField: "password"
}, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(email, password, done) {
    var user, validate;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return UserModel.findOne({
              email: email
            });

          case 3:
            user = _context2.sent;

            if (user) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", done(null, false, {
              message: "User not found"
            }));

          case 6:
            _context2.next = 8;
            return user.isValidPassword(password);

          case 8:
            validate = _context2.sent;

            if (validate) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("return", done(null, false, {
              message: "Wrong Password"
            }));

          case 11:
            return _context2.abrupt("return", done(null, user, {
              message: "Logged in Successfully"
            }));

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", done(_context2.t0));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function (_x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}())); // verify token is valid

passport.use(new JWTstrategy({
  secretOrKey: "top_secret",
  jwtFromRequest: function jwtFromRequest(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies["jwt"];
    return token;
  }
}, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(token, done) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            return _context3.abrupt("return", done(null, token.user));

          case 4:
            _context3.prev = 4;
            _context3.t0 = _context3["catch"](0);
            done(_context3.t0);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 4]]);
  }));

  return function (_x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()));
//# sourceMappingURL=auth.js.map