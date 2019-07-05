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

tripRouter.post('/', _validators.createTripValidate, _validators.verifyToken, function (req, res) {
  var _req$body = req.body,
      userDetails = _req$body.userDetails,
      tripDetails = _req$body.tripDetails;

  if (typeof userDetails[0].is_admin === 'undefined') {
    (0, _response2.default)(res, 403, null, 'Unauthorized!');
  } else if (userDetails[0].is_admin) {
    var dateFromInput = tripDetails.tripDate;
    var timeFromInput = tripDetails.tripTime;
    var dateParts = dateFromInput.split('/');
    var timeParts = timeFromInput.split(':');
    var date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1]);
    // const dateISO = date.toISOString();
    if (!(date < new Date())) {
      (0, _db.createTrip)(tripDetails).then(function () {
        (0, _response2.default)(res, 201, 'trip created', null);
      }).catch(function () {
        (0, _response2.default)(res, 500, null, 'Error.Ensure bus id is valid');
      });
    } else {
      (0, _response2.default)(res, 405, null, 'This Date is not allowed');
    }
  } else {
    (0, _response2.default)(res, 401, null, 'Unauthorized user!');
  }
});

tripRouter.post('/:id', _validators.verifyToken, function (req, res) {
  var userDetails = req.body.userDetails;
  var id = req.params.id;

  var convertTripId = parseInt(id);
  if (userDetails[0].is_admin && (0, _validators.isPositiveInteger)(convertTripId)) {
    (0, _db.getTrip)(convertTripId).then(function (result) {
      if (result.length > 0) {
        if (result[0].status) {
          (0, _db.cancelTrip)(convertTripId).then(function () {
            (0, _response2.default)(res, 202, 'Trip cancelled', null);
          }).catch(function () {
            (0, _response2.default)(res, 500, null, 'Internal server error');
          });
        } else {
          (0, _response2.default)(res, 207, 'Trip already cancelled', 'null');
        }
      } else {
        (0, _response2.default)(res, 400, 'null', 'Could not get trip');
      }
    }).catch(function () {
      (0, _response2.default)(res, 500, null, 'Internal server error');
    });
  } else {
    (0, _response2.default)(res, 401, null, 'Unauthorized!');
  }
});

exports.default = tripRouter;
//# sourceMappingURL=trips.js.map