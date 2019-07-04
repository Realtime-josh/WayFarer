'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _db = require('../crud/db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('POST /auth', function () {
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

  it('should check that all input fields are filled out correctly', function (done) {
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

  it('should check for reliable password', function (done) {
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

  it('should check for edge cases where inputs are not defined', function (done) {
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

  it('should log in a registered user', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'joshuafrankson@gmail.com',
      password: 'regarded'
    }).set('Accept', 'application/json').expect(202).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(202);
    });
  });

  it('should log in a registered user as non-admin', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'joshuafrankson@gmail.com',
      password: 'regarded'
    }).set('Accept', 'application/json').expect(202).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(202);
      (0, _expect2.default)(response.body.is_admin).toBeFalsy();
    });
  });

  it('should log in a registered user as non-admin and issue user id', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'joshuafrankson@gmail.com',
      password: 'regarded'
    }).set('Accept', 'application/json').expect(202).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(202);
      (0, _expect2.default)(response.body.is_admin).toBeFalsy();
      (0, _expect2.default)(response.body.user_id).toBeTruthy();
    });
  });

  it('should log in an admin', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'jaconmoore@wayfareradmin.com',
      password: 'history'
    }).set('Accept', 'application/json').expect(202).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(202);
      (0, _expect2.default)(response.body.is_admin).toBeTruthy();
    });
  });

  it('should log in a registered user as admin and issue user id', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'jaconmoore@wayfareradmin.com',
      password: 'history'
    }).set('Accept', 'application/json').expect(202).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(202);
      (0, _expect2.default)(response.body.is_admin).toBeTruthy();
      (0, _expect2.default)(response.body.user_id).toBeTruthy();
    });
  });

  it('should validate user password', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'jaconmoore@wayfareradmin.com',
      password: 'historyjdf'
    }).set('Accept', 'application/json').expect(406).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(406);
      (0, _expect2.default)(response.body.error).toContain('Password Incorrect');
    });
  });

  it('should not log in unregistered email', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'stephenjobs@yahoo.com',
      password: 'historyjdf'
    }).set('Accept', 'application/json').expect(404).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(404);
      (0, _expect2.default)(response.body.error).toContain('Email not registered');
    });
  });

  it('should validate email', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'stephenjobsyahoo.com',
      password: 'historyjdf'
    }).set('Accept', 'application/json').expect(400).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(400);
      (0, _expect2.default)(response.body.error).toContain('Ensure email and password are valid entries');
    });
  });

  it('should validate user email', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'stephenjobsyahooadmin.com',
      password: 'historyjdf'
    }).set('Accept', 'application/json').expect(400).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(400);
      (0, _expect2.default)(response.body.error).toContain('Ensure email and password are valid entries');
    });
  });

  it('should ensure password length greater than 4', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'stephenjobsyahoo.com',
      password: 'hi'
    }).set('Accept', 'application/json').expect(400).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(400);
      (0, _expect2.default)(response.body.error).toContain('Ensure email and password are valid entries');
    });
  });

  it('check for edge cases', function () {
    return (0, _supertest2.default)(_app2.default).post('/api/v1/auth/signin').send({
      email: 'stephenjobsyahoo.com'
    }).set('Accept', 'application/json').expect(403).then(function (response) {
      (0, _expect2.default)(response.body.status).toBe(403);
      (0, _expect2.default)(response.body.error).toContain('Invalid Input');
    });
  });
});
//# sourceMappingURL=auth.test.js.map