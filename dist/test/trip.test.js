'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _db = require('../crud/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('POST /trips', function () {
  before(function (done) {
    (0, _db.clearTripTable)().then(function () {
      done();
    }).catch(function (e) {
      return done(e);
    });
  });
  it('should create trip for signed in admin', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/trips').send({
      busId: 4,
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000'
    }).set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(201).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(201);
      (0, _expect2.default)(response.body.data).toContain('trip created');
      (0, _expect2.default)(response.body.data).toBeTruthy();
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
    }).set('Accept', 'application/json').set('Authorization', 'Bearer w').expect(407).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(407);
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
    }).set('Accept', 'application/json').expect(407).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(407);
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

  it('should ensure unauthorized user does not cancel trip', function () {
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

  it('Admin should succesfully cancel trip', function () {
    return (0, _supertest2.default)(_app2.default).patch('/api/v1/trips/1').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(202).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(202);
      (0, _expect2.default)(response.body.error).toContain('Trip cancelled');
    });
  });

  it('should raise error for unknown trip', function () {
    return (0, _supertest2.default)(_app2.default).patch('/api/v1/trips/8').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(404).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(404);
      (0, _expect2.default)(response.body.error).toContain('Could not get trip');
    });
  });

  it('should spot already cancelled trip', function () {
    return (0, _supertest2.default)(_app2.default).patch('/api/v1/trips/1').set('Accept', 'application/json').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc').expect(207).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(207);
      (0, _expect2.default)(response.body.error).toContain('Could not get trip');
    });
  });
});
//# sourceMappingURL=trip.test.js.map