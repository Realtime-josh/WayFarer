'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTime = exports.isDateFormat = exports.verifyToken = exports.createTripValidate = exports.validateUserSignIn = exports.trimAllSpace = exports.atAdminMail = exports.filterInput = exports.isPositiveInteger = exports.validateUserSignup = undefined;

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _db = require('../crud/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var isPositiveInteger = function isPositiveInteger(s) {
  return (/^\+?[0-9][\d]*$/.test(s)
  );
};

var filterInput = function filterInput(input) {
  var pattern = /[~!#$%^&*()+={}:'"<>?;',]/;
  var result = pattern.test(input);
  return result;
};

var isDateFormat = function isDateFormat(s) {
  return (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)
  );
};

var isTime = function isTime(s) {
  return (/^\d{1,2}\:\d{2}$/.test(s)
  );
};

var atAdminMail = function atAdminMail(input) {
  var result = input.match(/(\b@wayfareradmin.com\b)(?!.*\b\1\b)/g);
  if (result === null) {
    return false;
  }
  return true;
};

var trimAllSpace = function trimAllSpace(str) {
  return str.replace(/\s+/g, '');
};

var validateUserSignup = function validateUserSignup(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      firstName = _req$body.firstName,
      lastName = _req$body.lastName,
      password = _req$body.password;

  if (typeof email === 'undefined' || typeof firstName === 'undefined' || typeof lastName === 'undefined' || typeof password === 'undefined') {
    (0, _response2.default)(res, 400, null, 'Ensure that all fields are correctly filled out');
  } else {
    var trimFirstName = trimAllSpace(firstName);
    var trimLastName = trimAllSpace(lastName);
    var trimEmail = trimAllSpace(email);
    if (_validator2.default.isEmail(email) && !filterInput(trimFirstName) && trimFirstName.length > 2 && !filterInput(trimLastName) && trimLastName.length > 2 && !filterInput(trimEmail) && password.length > 5) {
      var payload = {
        firstName: firstName,
        lastName: lastName,
        email: email
      };
      var token = _jsonwebtoken2.default.sign(payload, process.env.SECRET_KEY);
      var returnedData = {};
      req.token = token;
      (0, _db.getUserEmail)(email).then(function (result) {
        if (result.length > 0) {
          (0, _response2.default)(res, 401, null, 'User already signed up');
        } else {
          var hashedPassword = _bcryptjs2.default.genSalt(10, function (err, salt) {
            _bcryptjs2.default.hash(password, salt, function (err, hash) {
              if (atAdminMail(email)) {
                (0, _db.insertUsers)(firstName, lastName, email, hash, true).then(function () {
                  (0, _db.getUserEmail)(email).then(function (data) {
                    returnedData.userId = data[0].user_id;
                    returnedData.isAdmin = data[0].is_admin;
                    req.returnedData = returnedData;
                    next();
                  }).catch(function () {
                    (0, _response2.default)(res, 500, null, 'Internal Server Error');
                  });
                }).catch(function () {
                  (0, _response2.default)(res, 500, null, 'Internal Server Error');
                });
              } else {
                (0, _db.insertUsers)(firstName, lastName, email, hash, false).then(function () {
                  (0, _db.getUserEmail)(email).then(function (feedback) {
                    returnedData.userId = feedback[0].user_id;
                    returnedData.isAdmin = feedback[0].is_admin;
                    req.returnedData = returnedData;
                    next();
                  }).catch(function () {
                    (0, _response2.default)(res, 500, null, 'Internal Server Error');
                  });
                }).catch(function () {
                  (0, _response2.default)(res, 500, null, 'Internal Server Error');
                });
              }
            });
          });
        }
      }).catch(function () {
        (0, _response2.default)(res, 500, null, 'Internal Server Error');
      });
    } else {
      (0, _response2.default)(res, 400, null, 'Ensure username, email and password are valid entries');
    }
  }
};

var validateUserSignIn = function validateUserSignIn(req, res, next) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;

  if (typeof email === 'undefined' || typeof password === 'undefined') {
    (0, _response2.default)(res, 403, null, 'Invalid Input');
  } else {
    var trimEmail = trimAllSpace(email);
    if (_validator2.default.isEmail(email) && !filterInput(trimEmail) && password.length > 4) {
      (0, _db.getUserEmail)(email).then(function (result) {
        _bcryptjs2.default.compare(password, result[0].password, function (err, data) {
          if (!data) {
            (0, _response2.default)(res, 406, null, 'Password Incorrect');
          } else {
            var payload = {};
            payload.userId = result[0].user_id;
            payload.firstName = result[0].first_name;
            payload.lastName = result[0].last_name;
            payload.email = result[0].user_email;
            payload.isAdmin = result[0].is_admin;
            req.payload = payload;
            next();
          }
        });
      }).catch(function () {
        (0, _response2.default)(res, 404, null, 'Email not registered');
      });
    } else {
      (0, _response2.default)(res, 400, null, 'Ensure email and password are valid entries');
    }
  }
};

var createTripValidate = function createTripValidate(req, res, next) {
  var _req$body3 = req.body,
      busId = _req$body3.busId,
      origin = _req$body3.origin,
      destination = _req$body3.destination,
      tripDate = _req$body3.tripDate,
      tripTime = _req$body3.tripTime,
      fare = _req$body3.fare;

  if (typeof busId === 'undefined' || typeof origin === 'undefined' || typeof destination === 'undefined' || typeof tripDate === 'undefined' || typeof tripTime === 'undefined' || typeof fare === 'undefined') {
    (0, _response2.default)(res, 403, null, 'Missing input details');
  } else {
    var convertBusId = parseInt(busId);
    var trimOrigin = trimAllSpace(origin);
    var trimDestination = trimAllSpace(destination);
    var trimDate = trimAllSpace(tripDate);
    var trimTime = trimAllSpace(tripTime);
    var trimFare = parseFloat(fare);
    if (isPositiveInteger(convertBusId) && !filterInput(trimOrigin) && !filterInput(trimDestination) && isDateFormat(trimDate) && isTime(trimTime) && !isNaN(trimFare)) {
      var tripDetails = {};
      tripDetails.busId = convertBusId;
      tripDetails.origin = trimOrigin;
      tripDetails.destination = trimDestination;
      tripDetails.tripDate = trimDate;
      tripDetails.tripTime = trimTime;
      tripDetails.fare = trimFare;
      req.body.tripDetails = tripDetails;
      next();
    } else {
      (0, _response2.default)(res, 403, null, 'Ensure all fields are filled in correctly.Date Format:DD/MM/YY.Time Format-hh:mm with a ');
    }
  }
};

var verifyToken = function verifyToken(req, res, next) {
  var bearerHeader = req.get('Authorization');
  if (typeof bearerHeader !== 'undefined') {
    var splitBearerHeader = bearerHeader.split(' ');
    var token = splitBearerHeader[1];
    _jsonwebtoken2.default.verify(token, process.env.SECRET_KEY, function (err, data) {
      if (err) {
        (0, _response2.default)(res, 407, null, 'authentication failed!');
      } else {
        var decrypt = data;
        req.body.decrypted = decrypt;
        (0, _db.getUserEmail)(req.body.decrypted.email).then(function (result) {
          req.body.userDetails = result;
          next();
        }).catch(function () {
          (0, _response2.default)(res, 403, null, 'Invalid user');
        });
      }
    });
  } else {
    (0, _response2.default)(res, 407, null, 'Cannot authenticate user');
  }
};

exports.validateUserSignup = validateUserSignup;
exports.isPositiveInteger = isPositiveInteger;
exports.filterInput = filterInput;
exports.atAdminMail = atAdminMail;
exports.trimAllSpace = trimAllSpace;
exports.validateUserSignIn = validateUserSignIn;
exports.createTripValidate = createTripValidate;
exports.verifyToken = verifyToken;
exports.isDateFormat = isDateFormat;
exports.isTime = isTime;
//# sourceMappingURL=validators.js.map