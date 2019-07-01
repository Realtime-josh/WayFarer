'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _validators = require('../helpers/validators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authRouter = _express2.default.Router();

authRouter.post('/signup', _validators.validateUserSignup, function (req, res) {
  var returnedData = req.returnedData,
      token = req.token;

  res.status(201).send({
    status: 201,
    data: {
      userId: returnedData.userId,
      isAdmin: returnedData.isAdmin,
      token: token
    }
  });
});

authRouter.post('/signin', _validators.validateUserSignIn, function (req, res) {
  var payload = req.payload;

  var token = _jsonwebtoken2.default.sign(payload, process.env.SECRET_KEY);
  res.header('Authorization', 'Bearer ' + token);
  res.status(202).send({
    status: 202,
    message: 'successfully logged in',
    user_id: payload.userId,
    is_admin: payload.isAdmin,
    token: token
  });
});

exports.default = authRouter;
//# sourceMappingURL=auth.js.map