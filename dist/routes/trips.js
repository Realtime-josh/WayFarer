'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _validators = require('../helpers/validators');

var _db = require('../crud/db');

var _response = require('../helpers/response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tripRouter = _express2.default.Router();

tripRouter.post('/createtrip', _validators.createTripValidate, _validators.verifyToken, function (req, res) {
  var _req$body = req.body,
      userDetails = _req$body.userDetails,
      tripDetails = _req$body.tripDetails;

  if (userDetails[0].is_admin) {
    (0, _db.createTrip)(tripDetails).then(function () {
      (0, _response2.default)(res, 201, 'trip created', null);
    }).catch(function () {
      (0, _response2.default)(res, 500, null, 'Error.Ensure bus id is valid');
    });
  } else {
    (0, _response2.default)(res, 401, null, 'Unauthorized user!');
  }
});

exports.default = tripRouter;
//# sourceMappingURL=trips.js.map