'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearTable = exports.insertUsers = exports.getUserEmail = undefined;

var _pg = require('pg');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var connectionString = process.env.DATABASE_URL;

if (process.env.current_env === 'test') {
  connectionString = process.env.TEST_DATABASE_URL;
}
// let connectionString;
// connectionString = process.env.TEST_DATABASE_URL;
// if (process.env.NODE_ENV === 'production') {
//   connectionString = process.env.DATABASE_URL;
// }

var usersTable = 'users';
// const busesTable = 'bus';
// const tripTable = 'trips';
// const bookingTable = 'bookings';

var getUserEmail = function getUserEmail(email) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'SELECT * FROM ' + usersTable + ' WHERE user_email=$1';
      var params = [email];
      client.query(sql, params).then(function (result) {
        resolve(result.rows);
        client.end();
      }).catch(function (e) {
        reject(e);
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

var insertUsers = function insertUsers(firstName, lastName, email, password, isAdmin) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'INSERT INTO ' + usersTable + '(first_name,last_name,user_email,password,is_admin)VALUES($1,$2,$3,$4,$5)';
      var params = [firstName, lastName, email, password, isAdmin];
      client.query(sql, params).then(function (result) {
        resolve(result.rows);
        client.end();
      }).catch(function (e) {
        reject(e);
      });
    }).catch(function (e) {
      reject(e);
    });
  });
};

var clearTable = function clearTable() {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'DELETE FROM ' + usersTable + ';';
      client.query(sql).then(function (result) {
        resolve(result.rowCount);
        client.end();
      }).catch(function (e) {
        return reject(e);
      });
    }).catch(function (e) {
      return reject(e);
    });
  });
};

exports.getUserEmail = getUserEmail;
exports.insertUsers = insertUsers;
exports.clearTable = clearTable;
//# sourceMappingURL=db.js.map