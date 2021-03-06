'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _db = require('../crud/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('POST /trips, GET /trips', function () {
  before(function (done) {
    (0, _db.clearTripTable)().then(function () {
      (0, _db.dummyTrip)(1, 1, 'Mangala', 'Seoul', '12/04/2067', '12:30', '100000', true).then(function () {
        (0, _db.dummyTrip)(2, 1, 'Johannesburg', 'Dakota', '12/04/2067', '12:30', '100000', false).then(function () {
          (0, _db.dummyTrip)(3, 1, 'New York', 'Paris', '12/04/2067', '12:30', '100000', false).then(function () {
            (0, _db.dummyTrip)(4, 1, 'San Diego', 'Monrovia', '12/04/2067', '12:30', '100000', true).then(function () {
              done();
            }).catch(function (e) {
              return done(e);
            });
          }).catch(function (e) {
            return done(e);
          });
        }).catch(function (e) {
          return done(e);
        });
      }).catch(function (e) {
        return done(e);
      });
    }).catch(function (e) {
      return done(e);
    });
  });

  it('should flag error for wrong input details', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/trips').send({
      busId: '4',
      origin: 'Mangala%^$#',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000'
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(403).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(403);
      (0, _expect2.default)(response.body.error).toContain('Ensure all fields are filled in correctly');
    });
  });

  it('should flag error for missing input details', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/trips').send({
      busId: '4',
      origin: 'Mangala',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000'
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(403).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(403);
      (0, _expect2.default)(response.body.error).toContain('Missing input details');
    });
  });

  it('should ensure non-admin does not create a trip', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/trips').send({
      busId: '4',
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000'
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg1LCJmaXJzdE5hbWUiOiJKb3NodWEiLCJsYXN0TmFtZSI6IkZyYW5rc29uIiwiZW1haWwiOiJqb3NodWFmcmFua3NvbkBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYyMTg5OTg4fQ.pS7g3oVP_4hVL1ugeJZpr5JoBqDRACZJlS7uG9cFFGw').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('Unauthorized user!');
    });
  });

  it('should raise error for wrongly authenticated user', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/trips').send({
      busId: '4',
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000'
    }).set('Accept', 'application/json').set('Authorization', 'Bearer w').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('authentication failed!');
    });
  });

  it('should raise error for non-authenticated user', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/trips').send({
      busId: '4',
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000'
    }).set('Accept', 'application/json').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('Cannot authenticate user');
    });
  });

  it('should raise error for invalid bus id', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/trips').send({
      busId: '3000000',
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000'
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(500).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(500);
      (0, _expect2.default)(response.body.error).toContain('Error.Ensure bus id is valid');
    });
  });

  it('should raise error for invalid trip date', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/trips').send({
      busId: 4,
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/1942',
      tripTime: '12:30',
      fare: '100000'
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(405).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(405);
      (0, _expect2.default)(response.body.error).toContain('This Date is not allowed');
    });
  });

  it('should ensure unauthorized user does not create trip', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/trips').send({
      busId: 4,
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/1942',
      tripTime: '12:30',
      fare: '100000'
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg1LCJmaXJzdE5hbWUiOiJKb3NodWEiLCJsYXN0TmFtZSI6IkZyYW5rc29uIiwiZW1haWwiOiJqb3NodWFmcmFua3NvbkBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYyMTg5OTg4fQ.pS7g3oVP_4hVL1ugeJZpr5JoBqDRACZJlS7uG9cFFGw').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('Unauthorized');
    });
  });

  it('should raise error for unknown trip', function () {
    return (0, _supertest2.default)(_app2.default).patch('/api/v1/trips/8').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(404).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(404);
      (0, _expect2.default)(response.body.error).toContain('Could not get trip');
    });
  });

  it('should cancel trip for admin', function () {
    return (0, _supertest2.default)(_app2.default).patch('/api/v1/trips/1').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(202).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(202);
      (0, _expect2.default)(response.body.data).toContain('Trip cancelled');
    });
  });

  it('should raise error for already cancelled trip', function () {
    return (0, _supertest2.default)(_app2.default).patch('/api/v1/trips/1').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(207).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(207);
      (0, _expect2.default)(response.body.data).toContain('Trip already cancelled');
    });
  });

  it('should not allow non-admin cancel trip', function () {
    return (0, _supertest2.default)(_app2.default).patch('/api/v1/trips/1').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg1LCJmaXJzdE5hbWUiOiJKb3NodWEiLCJsYXN0TmFtZSI6IkZyYW5rc29uIiwiZW1haWwiOiJqb3NodWFmcmFua3NvbkBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYyMTg5OTg4fQ.pS7g3oVP_4hVL1ugeJZpr5JoBqDRACZJlS7uG9cFFGw').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('Unauthorized');
    });
  });

  it('should get all trips for non-admin', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/trips').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg1LCJmaXJzdE5hbWUiOiJKb3NodWEiLCJsYXN0TmFtZSI6IkZyYW5rc29uIiwiZW1haWwiOiJqb3NodWFmcmFua3NvbkBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYyMTg5OTg4fQ.pS7g3oVP_4hVL1ugeJZpr5JoBqDRACZJlS7uG9cFFGw').expect(200).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(200);
    });
  });

  it('should get all trips for admin', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/trips').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(200).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(200);
    });
  });

  it('should raise error for unauthorized cases', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/trips').set('Accept', 'application/json').set('Authorization', 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('authentication failed!');
    });
  });

  it('should raise error for unauthorized cases without token', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/trips').set('Accept', 'application/json').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('Cannot authenticate user');
    });
  });

  it('should raise error for already cancelled booking', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/bookings').send({
      tripId: 3,
      seatNumber: 6
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(406).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(406);
      (0, _expect2.default)(response.body.error).toContain('Trip is currently cancelled');
    });
  });

  it('should create booking', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/bookings').send({
      tripId: 4,
      seatNumber: 6
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(202).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(202);
      (0, _expect2.default)(response.body.message).toContain('Booking successfully created');
    });
  });

  it('should allow admin get requested trip by origin', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/trips/san diego').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(200).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(200);
      (0, _expect2.default)(response.body.message).toContain('Successfully fetched');
    });
  });

  it('should allow admin get requested trip by origin', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/trips/san diego').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(200).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(200);
      (0, _expect2.default)(response.body.message).toContain('Successfully fetched');
    });
  });

  it('should raise error for unauthorized cases', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/trips/monrovia').set('Accept', 'application/json').set('Authorization', 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('authentication failed!');
    });
  });

  it('should raise error for unauthorized cases without token', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/trips/san diego').set('Accept', 'application/json').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('Cannot authenticate user');
    });
  });

  it('should raise error for non-listed trips by origin search', function () {
    return (0, _supertest2.default)(_app2.default).get('/api/v1/trips/Monrovia').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(404).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(404);
      (0, _expect2.default)(response.body.error).toContain('No trip is leaving this route');
    });
  });
});
//# sourceMappingURL=trip.test.js.map