'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tripByOrigin = exports.deleteBooking = exports.getBooking = exports.dummyTrip = exports.userAllBooking = exports.adminAllBooking = exports.clearBookingTable = exports.bookingData = exports.bookingCheck = exports.getAllTrips = exports.clearTripTable = exports.cancelTrip = exports.getTrip = exports.createTrip = exports.clearTable = exports.insertUsers = exports.getUserEmail = undefined;

var _pg = require('pg');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var connectionString = void 0;
connectionString = process.env.TEST_DATABASE_URL;
connectionString = process.env.TEST_DATABASE_URL;
if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_URL;
} else if (process.env.current_env === 'test') {
  connectionString = process.env.TEST_DATABASE_URL;
}

var usersTable = 'users';
var tripsTable = 'trips';
var bookingTable = 'bookings';

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

var createTrip = function createTrip(details) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'INSERT INTO ' + tripsTable + '\n      (bus_id,origin,destination,trip_date,trip_time,fare)VALUES($1,$2,$3,$4,$5,$6)';
      var params = [details.busId, details.origin, details.destination, details.tripDate, details.tripTime, details.fare];
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

var getTrip = function getTrip(tripId) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'SELECT * FROM ' + tripsTable + ' WHERE trip_id=$1';
      var params = [tripId];
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

var tripByOrigin = function tripByOrigin(origin) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'SELECT * FROM ' + tripsTable + ' WHERE LOWER(origin) LIKE $1 AND status=true';
      var params = [origin];
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

var getAllTrips = function getAllTrips() {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'SELECT * FROM ' + tripsTable;
      client.query(sql).then(function (result) {
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

var adminAllBooking = function adminAllBooking() {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'SELECT ' + bookingTable + '.booking_id,' + bookingTable + '.trip_id,' + bookingTable + '.user_id,\n      ' + bookingTable + '.seat_number,' + tripsTable + '.trip_id,' + usersTable + '.first_name,\n      ' + usersTable + '.last_name,' + usersTable + '.user_email FROM ' + bookingTable + ', ' + tripsTable + ', ' + usersTable + ' \n      WHERE ' + bookingTable + '.trip_id = ' + tripsTable + '.trip_id\n      AND ' + bookingTable + '.user_id=' + usersTable + '.user_id';
      client.query(sql).then(function (result) {
        resolve(result.rows);
        client.end();
      }).catch(function (e) {
        return reject(e);
      });
    }).catch(function (e) {
      return reject(e);
    });
  });
};

var userAllBooking = function userAllBooking(userEmail) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'SELECT ' + bookingTable + '.booking_id,' + bookingTable + '.trip_id,' + bookingTable + '.user_id,\n      ' + bookingTable + '.seat_number,' + tripsTable + '.trip_id,' + usersTable + '.first_name,\n      ' + usersTable + '.last_name,' + usersTable + '.user_email FROM ' + bookingTable + ', ' + tripsTable + ', ' + usersTable + ' \n      WHERE ' + bookingTable + '.trip_id = ' + tripsTable + '.trip_id\n      AND ' + bookingTable + '.user_id=' + usersTable + '.user_id AND ' + usersTable + '.user_email=$1';
      var params = [userEmail];
      client.query(sql, params).then(function (result) {
        resolve(result.rows);
        client.end();
      }).catch(function (e) {
        return reject(e);
      });
    }).catch(function (e) {
      return reject(e);
    });
  });
};

var bookingCheck = function bookingCheck(tripId, seatNumber) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'SELECT * FROM ' + bookingTable + ' WHERE trip_id=$1 AND seat_number=$2';
      var params = [tripId, seatNumber];
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

var bookingData = function bookingData(data) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'INSERT INTO ' + bookingTable + '(trip_id,user_id,created_on,seat_number)\n      VALUES($1,$2,$3,$4)';
      var params = [data.tripId, data.userId, data.date, data.seatNumber];
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

var cancelTrip = function cancelTrip(tripId) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'UPDATE ' + tripsTable + ' SET status=false WHERE trip_id=$1';
      var params = [tripId];
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

var getBooking = function getBooking(userId, bookingId) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'SELECT * FROM ' + bookingTable + ' WHERE user_id=$1 AND booking_id=$2';
      var params = [userId, bookingId];
      client.query(sql, params).then(function (result) {
        resolve(result.rows);
        client.end();
      }).catch(function (e) {
        return reject(e);
      });
    }).catch(function (e) {
      return reject(e);
    });
  });
};

var deleteBooking = function deleteBooking(userId, bookingId) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'DELETE FROM ' + bookingTable + ' WHERE user_id=$1 AND booking_id=$2';
      var params = [userId, bookingId];
      client.query(sql, params).then(function (result) {
        resolve(result.rows);
        client.end();
      }).catch(function (e) {
        return reject(e);
      });
    }).catch(function (e) {
      return reject(e);
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

var clearTripTable = function clearTripTable() {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'DELETE FROM ' + tripsTable + ';';
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

var clearBookingTable = function clearBookingTable() {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'DELETE FROM ' + bookingTable + ';';
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

var dummyTrip = function dummyTrip(tripId, busId, origin, destination, tripDate, tripTime, fare, status) {
  return new Promise(function (resolve, reject) {
    var client = new _pg.Client(connectionString);
    client.connect().then(function () {
      var sql = 'INSERT INTO trips\n      (trip_id,bus_id,origin,destination,trip_date,trip_time,fare,status)VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
      var params = [tripId, busId, origin, destination, tripDate, tripTime, fare, status];
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

exports.getUserEmail = getUserEmail;
exports.insertUsers = insertUsers;
exports.clearTable = clearTable;
exports.createTrip = createTrip;
exports.getTrip = getTrip;
exports.cancelTrip = cancelTrip;
exports.clearTripTable = clearTripTable;
exports.getAllTrips = getAllTrips;
exports.bookingCheck = bookingCheck;
exports.bookingData = bookingData;
exports.clearBookingTable = clearBookingTable;
exports.adminAllBooking = adminAllBooking;
exports.userAllBooking = userAllBooking;
exports.dummyTrip = dummyTrip;
exports.getBooking = getBooking;
exports.deleteBooking = deleteBooking;
exports.tripByOrigin = tripByOrigin;
//# sourceMappingURL=db.js.map