"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var passport = require("passport");

var express = require("express");

var jwt = require("jsonwebtoken");

var tokenList = {};
var router = express.Router();
router.get("/status", function (req, res, next) {
  res.status(200).json({
    status: "ok"
  });
});
router.post("/signup", passport.authenticate("signup", {
  session: false
}), /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.status(200).json({
              message: "signup successful"
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.post("/login", /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            passport.authenticate("login", /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err, user, info) {
                var error;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.prev = 0;

                        if (!(err || !user)) {
                          _context3.next = 4;
                          break;
                        }

                        error = new Error("An Error occured");
                        return _context3.abrupt("return", next(error));

                      case 4:
                        req.login(user, {
                          session: false
                        }, /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(error) {
                            var body, token, refreshToken;
                            return _regenerator["default"].wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    if (!error) {
                                      _context2.next = 2;
                                      break;
                                    }

                                    return _context2.abrupt("return", next(error));

                                  case 2:
                                    body = {
                                      _id: user._id,
                                      email: user.email,
                                      name: user.name
                                    };
                                    token = jwt.sign({
                                      user: body
                                    }, "top_secret", {
                                      expiresIn: 300
                                    });
                                    refreshToken = jwt.sign({
                                      user: body
                                    }, "top_secret_refresh", {
                                      expiresIn: 86400
                                    }); // store tokens in cookie

                                    res.cookie("jwt", token);
                                    res.cookie("refreshJwt", refreshToken); // store tokens in memory

                                    tokenList[refreshToken] = {
                                      token: token,
                                      refreshToken: refreshToken,
                                      email: user.email,
                                      _id: user._id,
                                      name: user.name
                                    }; //Send back the token to the user

                                    return _context2.abrupt("return", res.status(200).json({
                                      token: token,
                                      refreshToken: refreshToken
                                    }));

                                  case 9:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x10) {
                            return _ref4.apply(this, arguments);
                          };
                        }());
                        _context3.next = 10;
                        break;

                      case 7:
                        _context3.prev = 7;
                        _context3.t0 = _context3["catch"](0);
                        return _context3.abrupt("return", next(_context3.t0));

                      case 10:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[0, 7]]);
              }));

              return function (_x7, _x8, _x9) {
                return _ref3.apply(this, arguments);
              };
            }())(req, res, next);

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.post("/token", function (req, res) {
  var refreshToken = req.body.refreshToken;

  if (refreshToken in tokenList) {
    var body = {
      email: tokenList[refreshToken].email,
      _id: tokenList[refreshToken]._id,
      name: tokenList[refreshToken].name
    };
    var token = jwt.sign({
      user: body
    }, "top_secret", {
      expiresIn: 300
    }); // update jwt

    res.cookie("jwt", token);
    tokenList[refreshToken].token = token;
    res.status(200).json({
      token: token
    });
  } else {
    res.status(401).json({
      message: "Unauthorized"
    });
  }
});
router.post("/logout", function (req, res) {
  if (req.cookies) {
    var refreshToken = req.cookies["refreshJwt"];
    if (refreshToken in tokenList) delete tokenList[refreshToken];
    res.clearCookie("refreshJwt");
    res.clearCookie("jwt");
  }

  res.status(200).json({
    message: "logged out"
  });
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=main.js.map