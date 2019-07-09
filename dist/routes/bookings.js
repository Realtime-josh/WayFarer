'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _response = require('../helpers/response');

var _response2 = _interopRequireDefault(_response);

var _validators = require('../helpers/validators');

var _db = require('../crud/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bookingRouter = _express2.default.Router();

bookingRouter.post('/', _validators.bookingValidate, _validators.verifyToken, function (req, res) {
  var _req$body = req.body,
      userDetails = _req$body.userDetails,
      bookingInfo = _req$body.bookingInfo;

  bookingInfo.userId = userDetails[0].user_id;
  (0, _db.getTrip)(bookingInfo.tripId).then(function (result) {
    if (result[0].status) {
      (0, _db.bookingData)(bookingInfo).then(function () {
        res.status(202).send({
          status: 202,
          message: 'Booking successfully created',
          user_id: userDetails[0].user_id,
          trip_id: result[0].trip_id,
          trip_date: result[0].trip_date,
          seat_number: bookingInfo.seatNumber,
          first_name: userDetails.first_name,
          last_name: userDetails[0].last_name,
          email: userDetails[0].user_email
        });
      }).catch(function (e) {
        (0, _response2.default)(res, 500, null, e);
      });
    } else {
      (0, _response2.default)(res, 406, null, 'Trip is currently cancelled');
    }
  }).catch(function () {
    (0, _response2.default)(res, 404, null, 'Could not get trip Information');
  });
});

bookingRouter.get('/', _validators.verifyToken, function (req, res) {
  var userDetails = req.body.userDetails;

  if (userDetails[0].is_admin && userDetails[0].is_admin) {
    (0, _db.adminAllBooking)().then(function (result) {
      if (result.length > 0) {
        res.status(200).send({
          status: 200,
          data: result
        });
      } else {
        (0, _response2.default)(res, 200, 'No booking recorded', null);
      }
    }).catch(function () {
      return (0, _response2.default)(res, 500, null, 'Internal server error');
    });
  } else if (!userDetails[0].is_admin && !userDetails[0].is_admin) {
    (0, _db.userAllBooking)(userDetails[0].user_email).then(function (result) {
      if (result.length > 0) {
        res.status(200).send({
          status: 200,
          data: result
        });
      } else {
        (0, _response2.default)(res, 200, 'No booking recorded', null);
      }
    }).catch(function () {
      return (0, _response2.default)(res, 500, null, 'Internal server error');
    });
  } else {
    (0, _response2.default)(res, 400, null, 'Request cannot be processed');
  }
});

exports.default = bookingRouter;
//# sourceMappingURL=bookings.js.map