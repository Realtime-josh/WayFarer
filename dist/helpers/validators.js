'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUserSignIn = exports.trimAllSpace = exports.atAdminMail = exports.filterInput = exports.isPositiveInteger = exports.validateUserSignup = undefined;

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
  return (/^\+?[1-9][\d]*$/.test(s)
  );
};

var filterInput = function filterInput(input) {
  var pattern = /[~!#$%^&*()+={}:'"<>?;',]/;
  var result = pattern.test(input);
  return result;
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
      var _req$body2 = req.body,
          _firstName = _req$body2.firstName,
          _lastName = _req$body2.lastName,
          _email = _req$body2.email,
          _password = _req$body2.password;

      var payload = {
        firstName: _firstName,
        lastName: _lastName,
        email: _email
      };
      var token = _jsonwebtoken2.default.sign(payload, process.env.SECRET_KEY);
      var returnedData = {};
      req.token = token;
      (0, _db.getUserEmail)(_email).then(function (result) {
        if (result.length > 0) {
          (0, _response2.default)(res, 401, null, 'User already signed up');
        } else {
          var hashedPassword = _bcryptjs2.default.genSalt(10, function (err, salt) {
            _bcryptjs2.default.hash(_password, salt, function (err, hash) {
              if (atAdminMail(_email)) {
                (0, _db.insertUsers)(_firstName, _lastName, _email, hash, true).then(function () {
                  (0, _db.getUserEmail)(_email).then(function (data) {
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
                (0, _db.insertUsers)(_firstName, _lastName, _email, hash, false).then(function () {
                  (0, _db.getUserEmail)(_email).then(function (feedback) {
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
  var _req$body3 = req.body,
      email = _req$body3.email,
      password = _req$body3.password;

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

// const verifyToken = (req, res, next) => {
//   const bearerHeader = req.get('Authorization');
//   if (typeof bearerHeader !== 'undefined') {
//     const splitBearerHeader = bearerHeader.split(' ');
//     const token = splitBearerHeader[1];
//     jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
//       if (err) {
//         sendResponse(res, 400, null, 'authentication failed!');
//       } else {
//         const decrypt = data;
//         req.body.decrypted = decrypt;
//         getUserEmail(req.body.decrypted.email)
//           .then((result) => {
//             req.body.userDetails = result;
//             next();
//           })
//           .catch(() => {
//             sendResponse(res, 403, null, 'Invalid user');
//           });
//       }
//     });
//   } else {
//     sendResponse(res, 404, null, 'Cannot authenticate user');
//   }
// };


exports.validateUserSignup = validateUserSignup;
exports.isPositiveInteger = isPositiveInteger;
exports.filterInput = filterInput;
exports.atAdminMail = atAdminMail;
exports.trimAllSpace = trimAllSpace;
exports.validateUserSignIn = validateUserSignIn;
//# sourceMappingURL=validators.js.map