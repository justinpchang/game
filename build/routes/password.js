"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require("express");

var hbs = require("nodemailer-express-handlebars");

var nodemailer = require("nodemailer");

var path = require("path");

var crypto = require("crypto");

var asyncMiddleware = require("../middleware/asyncMiddleware");

var UserModel = require("../models/userModel");

var email = process.env.EMAIL;
var pass = process.env.PASSWORD;
var smtpTransport = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: email,
    pass: pass
  }
});
var handlebarsOptions = {
  viewEngine: "handlebars",
  viewPath: path.resolve("./templates/"),
  extName: ".html"
};
smtpTransport.use("compile", hbs(handlebarsOptions));
var router = express.Router();
router.post("/forgot-password", asyncMiddleware( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var email, user, buffer, token, data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = req.body.email;
            _context.next = 3;
            return UserModel.findOne({
              email: email
            });

          case 3:
            user = _context.sent;

            if (user) {
              _context.next = 7;
              break;
            }

            res.status(400).json({
              message: "invalid email"
            });
            return _context.abrupt("return");

          case 7:
            // create user token
            buffer = crypto.randomBytes(20);
            token = buffer.toString("hex"); // update user reset password token and exp

            _context.next = 11;
            return UserModel.findByIdAndUpdate({
              _id: user._id
            }, {
              resetToken: token,
              resetTokenExp: Date.now() + 600000
            });

          case 11:
            // send user password reset email
            data = {
              to: user.email,
              from: email,
              template: "forgot-password",
              subject: "Phaser Leaderboard Password Reset",
              context: {
                url: "http://localhost:".concat(process.env.PORT || 3000, "/reset-password.html?token=").concat(token),
                name: user.name
              }
            };
            _context.next = 14;
            return smtpTransport.sendMail(data);

          case 14:
            res.status(200).json({
              message: "An email has been sent to your email. Password reset link is only valid for 10 minutes."
            });

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()));
router.post("/reset-password", asyncMiddleware( /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var user, data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return UserModel.findOne({
              resetToken: req.body.token,
              resetTokenExp: {
                $gt: Date.now()
              }
            });

          case 2:
            user = _context2.sent;

            if (user) {
              _context2.next = 6;
              break;
            }

            res.status(400).json({
              message: "invalid token"
            });
            return _context2.abrupt("return");

          case 6:
            if (!(req.body.password !== req.body.verifiedPassword)) {
              _context2.next = 9;
              break;
            }

            res.status(400).json({
              message: "passwords do not match"
            });
            return _context2.abrupt("return");

          case 9:
            // update user model
            user.password = req.body.password;
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            _context2.next = 14;
            return user.save();

          case 14:
            // send user password update email
            data = {
              to: user.email,
              from: email,
              template: "reset-password",
              subject: "Phaser Leaderboard Password Reset Confirmation",
              context: {
                name: user.name
              }
            };
            _context2.next = 17;
            return smtpTransport.sendMail(data);

          case 17:
            res.status(200).json({
              message: "password updated"
            });

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()));
module.exports = router;
//# sourceMappingURL=password.js.map