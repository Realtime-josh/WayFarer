'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _db = require('../crud/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('POST /signup', function () {
  before(function (done) {
    (0, _db.clearTable)().then(function () {
      done();
    }).catch(function (e) {
      return done(e);
    });
  });
  it('should create a new user', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signup').send({
      firstName: 'Joshua',
      lastName: 'Frankson',
      email: 'joshuafrankson@gmail.com',
      password: 'regarded'
    }).set('Accept', 'application/json').expect(201).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(201);
      // ensure user is in database
      (0, _db.getUserEmail)('joshuafrankson@gmail.com').then(function (result) {
        (0, _expect2.default)(result[0].user_email).toBe('joshuafrankson@gmail.com');
      });
    });
  });

  it('should not create a user twice', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signup').send({
      firstName: 'Joshua',
      lastName: 'Frankson',
      email: 'joshuafrankson@gmail.com',
      password: 'regarded'
    }).set('Accept', 'application/json').expect(401).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(401);
      (0, _expect2.default)(response.body.error).toContain('User already signed up');
    });
  });

  it('should create an account and identify a non admin', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signup').send({
      firstName: 'Mark',
      lastName: 'Clarke',
      email: 'markclarke@gmail.com',
      password: 'history'
    }).set('Accept', 'application/json').expect(201).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(201);
      (0, _expect2.default)(response.body.data.isAdmin).toBe(false);
      (0, _expect2.default)(response.body.data.userId).toBeTruthy();
      // ensure user is in database
      (0, _db.getUserEmail)('markclarke@gmail.com').then(function (result) {
        (0, _expect2.default)(result[0].user_email).toBe('markclarke@gmail.com');
      }).catch(function () {
        console.log('Bug found');
      });
    });
  });

  it('should create an account and identify an admin', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signup').send({
      firstName: 'Jacob',
      lastName: 'Moore',
      email: 'jaconmoore@wayfareradmin.com',
      password: 'history'
    }).set('Accept', 'application/json').expect(201).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(201);
      (0, _expect2.default)(response.body.data.isAdmin).toBe(true);
      (0, _expect2.default)(response.body.data.userId).toBeTruthy();
      // ensure user is in database
      (0, _db.getUserEmail)('jaconmoore@wayfareradmin.com').then(function (result) {
        (0, _expect2.default)(result[0].user_email).toBe('jaconmoore@wayfareradmin.com');
      });
    });
  });

  it('should check that all input fields are filled correctly', function (done) {
    (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signup').send({
      firstName: 'James',
      lastName: 'Clown',
      email: 'jamesclown@gmail.com'
    }).set('Accept', 'application/json').expect(400).expect('Content-Type', /json/).end(function (err, res) {
      if (err) done(err);
      (0, _expect2.default)(res.body.status).toBe(400);
      (0, _expect2.default)(res.body.isAdmin).toBeFalsy();
      (0, _expect2.default)(res.body.error).toContain('Ensure that all fields are correctly filled out');
    });
    done();
  });

  it('should check for an invalid email', function (done) {
    (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signup').send({
      firstName: 'James',
      lastName: 'Clown',
      email: 'jamesclowncorona.ysl',
      password: 'heyheyhey'
    }).set('Accept', 'application/json').expect(400).expect('Content-Type', /json/).end(function (err, res) {
      if (err) done(err);
      (0, _expect2.default)(res.body.status).toBe(400);
      (0, _expect2.default)(res.body.isAdmin).toBeFalsy();
      (0, _expect2.default)(res.body.error).toContain('Ensure username, email and password are valid entries');
    });
    done();
  });

  it('should check for strong password', function (done) {
    (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signup').send({
      firstName: 'James',
      lastName: 'Clown',
      email: 'jamesclown@gmail.com',
      password: 'to'
    }).set('Accept', 'application/json').expect(400).expect('Content-Type', /json/).end(function (err, res) {
      if (err) done(err);
      (0, _expect2.default)(res.body.status).toBe(400);
      (0, _expect2.default)(res.body.isAdmin).toBeFalsy();
      (0, _expect2.default)(res.body.error).toContain('Ensure username, email and password are valid entries');
    });
    done();
  });

  it('should check check for edge cases where input are not defined', function (done) {
    (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signup').send({
      firstName: 'James',
      lastName: 'Clown',
      email: 'jamesclown@gmail.com'
    }).set('Accept', 'application/json').expect(400).expect('Content-Type', /json/).end(function (err, res) {
      if (err) done(err);
      (0, _expect2.default)(res.body.status).toBe(400);
      (0, _expect2.default)(res.body.isAdmin).toBeFalsy();
      (0, _expect2.default)(res.body.error).toContain('Ensure that all fields are correctly filled out');
    });
    done();
  });
});
//# sourceMappingURL=auth.test.js.map