'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _db = require('../crud/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('POST /bookings, GET /bookings', function () {
  before(function (done) {
    (0, _db.clearBookingTable)().then(function () {
      done();
    }).catch(function (e) {
      return done(e);
    });
  });

  it('should raise error for no trip record for signed in admin', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/bookings').send({
      tripId: 30000,
      seatNumber: 2
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(404).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(404);
      (0, _expect2.default)(response.body.error).toContain('Could not get trip Information');
    });
  });

  it('should raise error for an undefined input', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/bookings').send({
      seatNumber: 2
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(403).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(403);
      (0, _expect2.default)(response.body.error).toContain('Missing input details');
    });
  });

  it('should raise error for booking a seat more than 36', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/bookings').send({
      tripId: 2,
      seatNumber: 39
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(403).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(403);
      (0, _expect2.default)(response.body.error).toContain('Ensure all fields are filled in correctly.Maximum number of seats is 36');
    });
  });

  it('should get all bookings for admin', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/bookings').send({
      tripId: 2,
      seatNumber: 5
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(200).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(200);
    });
  });
});
//# sourceMappingURL=booking.test.js.map