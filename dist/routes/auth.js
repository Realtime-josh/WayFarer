'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

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

exports.default = authRouter;
//# sourceMappingURL=auth.js.map