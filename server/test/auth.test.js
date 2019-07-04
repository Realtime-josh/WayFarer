import expect from 'expect';
import request from 'supertest';
import app from '../app';
import { getUserEmail, clearTable } from '../crud/db';

describe('POST /auth', () => {
  before((done) => {
    clearTable()
      .then(() => {
        done();
      })
      .catch(e => done(e));
  });
  it('should create a new user', () => request(app)
    .post('/api/v1/auth/signup')
    .send({
      firstName: 'Joshua',
      lastName: 'Frankson',
      email: 'joshuafrankson@gmail.com',
      password: 'regarded',
    })
    .set('Accept', 'application/json')
    .expect(201)
    .then((response) => {
      expect(response.body.status).toBe(201);
      // ensure user is in database
      getUserEmail('joshuafrankson@gmail.com')
        .then((result) => {
          expect(result[0].user_email).toBe('joshuafrankson@gmail.com');
        });
    }));

  it('should not create a user twice', () => request(app)
    .post('/api/v1/auth/signup')
    .send({
      firstName: 'Joshua',
      lastName: 'Frankson',
      email: 'joshuafrankson@gmail.com',
      password: 'regarded',
    })
    .set('Accept', 'application/json')
    .expect(401)
    .then((response) => {
      expect(response.body.status).toBe(401);
      expect(response.body.error).toContain('User already signed up');
    }));

  it('should create an account and identify a non admin', () => request(app)
    .post('/api/v1/auth/signup')
    .send({
      firstName: 'Mark',
      lastName: 'Clarke',
      email: 'markclarke@gmail.com',
      password: 'history',
    })
    .set('Accept', 'application/json')
    .expect(201)
    .then((response) => {
      expect(response.body.status).toBe(201);
      expect(response.body.data.isAdmin).toBe(false);
      expect(response.body.data.userId).toBeTruthy();
      // ensure user is in database
      getUserEmail('markclarke@gmail.com')
        .then((result) => {
          expect(result[0].user_email).toBe('markclarke@gmail.com');
        }).catch(() => {
          console.log('Bug found');
        });
    }));

  it('should create an account and identify an admin', () => request(app)
    .post('/api/v1/auth/signup')
    .send({
      firstName: 'Jacob',
      lastName: 'Moore',
      email: 'jaconmoore@wayfareradmin.com',
      password: 'history',
    })
    .set('Accept', 'application/json')
    .expect(201)
    .then((response) => {
      expect(response.body.status).toBe(201);
      expect(response.body.data.isAdmin).toBe(true);
      expect(response.body.data.userId).toBeTruthy();
      // ensure user is in database
      getUserEmail('jaconmoore@wayfareradmin.com')
        .then((result) => {
          expect(result[0].user_email).toBe('jaconmoore@wayfareradmin.com');
        });
    }));

  it('should check that all input fields are filled out correctly', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'James',
        lastName: 'Clown',
        email: 'jamesclown@gmail.com',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.status).toBe(400);
        expect(res.body.isAdmin).toBeFalsy();
        expect(res.body.error).toContain('Ensure that all fields are correctly filled out');
      });
    done();
  });

  it('should check for an invalid email', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'James',
        lastName: 'Clown',
        email: 'jamesclowncorona.ysl',
        password: 'heyheyhey',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.status).toBe(400);
        expect(res.body.isAdmin).toBeFalsy();
        expect(res.body.error).toContain('Ensure username, email and password are valid entries');
      });
    done();
  });

  it('should check for reliable password', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'James',
        lastName: 'Clown',
        email: 'jamesclown@gmail.com',
        password: 'to',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.status).toBe(400);
        expect(res.body.isAdmin).toBeFalsy();
        expect(res.body.error).toContain('Ensure username, email and password are valid entries');
      });
    done();
  });

  it('should check for edge cases where inputs are not defined', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'James',
        lastName: 'Clown',
        email: 'jamesclown@gmail.com',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.status).toBe(400);
        expect(res.body.isAdmin).toBeFalsy();
        expect(res.body.error).toContain('Ensure that all fields are correctly filled out');
      });
    done();
  });

  it('should log in a registered user', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'joshuafrankson@gmail.com',
      password: 'regarded',
    })
    .set('Accept', 'application/json')
    .expect(202)
    .then((response) => {
      expect(response.body.status).toBe(202);
    }));

  it('should log in a registered user as non-admin', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'joshuafrankson@gmail.com',
      password: 'regarded',
    })
    .set('Accept', 'application/json')
    .expect(202)
    .then((response) => {
      expect(response.body.status).toBe(202);
      expect(response.body.is_admin).toBeFalsy();
    }));

  it('should log in a registered user as non-admin and issue user id', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'joshuafrankson@gmail.com',
      password: 'regarded',
    })
    .set('Accept', 'application/json')
    .expect(202)
    .then((response) => {
      expect(response.body.status).toBe(202);
      expect(response.body.is_admin).toBeFalsy();
      expect(response.body.user_id).toBeTruthy();
    }));

  it('should log in an admin', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'jaconmoore@wayfareradmin.com',
      password: 'history',
    })
    .set('Accept', 'application/json')
    .expect(202)
    .then((response) => {
      expect(response.body.status).toBe(202);
      expect(response.body.is_admin).toBeTruthy();
    }));

  it('should log in a registered user as admin and issue user id', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'jaconmoore@wayfareradmin.com',
      password: 'history',
    })
    .set('Accept', 'application/json')
    .expect(202)
    .then((response) => {
      expect(response.body.status).toBe(202);
      expect(response.body.is_admin).toBeTruthy();
      expect(response.body.user_id).toBeTruthy();
    }));

  it('should validate user password', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'jaconmoore@wayfareradmin.com',
      password: 'historyjdf',
    })
    .set('Accept', 'application/json')
    .expect(406)
    .then((response) => {
      expect(response.body.status).toBe(406);
      expect(response.body.error).toContain('Password Incorrect');
    }));

  it('should not log in unregistered email', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'stephenjobs@yahoo.com',
      password: 'historyjdf',
    })
    .set('Accept', 'application/json')
    .expect(404)
    .then((response) => {
      expect(response.body.status).toBe(404);
      expect(response.body.error).toContain('Email not registered');
    }));

  it('should validate email', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'stephenjobsyahoo.com',
      password: 'historyjdf',
    })
    .set('Accept', 'application/json')
    .expect(400)
    .then((response) => {
      expect(response.body.status).toBe(400);
      expect(response.body.error).toContain('Ensure email and password are valid entries');
    }));

  it('should validate user email', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'stephenjobsyahooadmin.com',
      password: 'historyjdf',
    })
    .set('Accept', 'application/json')
    .expect(400)
    .then((response) => {
      expect(response.body.status).toBe(400);
      expect(response.body.error).toContain('Ensure email and password are valid entries');
    }));

  it('should ensure password length greater than 4', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'stephenjobsyahoo.com',
      password: 'hi',
    })
    .set('Accept', 'application/json')
    .expect(400)
    .then((response) => {
      expect(response.body.status).toBe(400);
      expect(response.body.error).toContain('Ensure email and password are valid entries');
    }));

  it('check for edge cases', () => request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'stephenjobsyahoo.com',
    })
    .set('Accept', 'application/json')
    .expect(403)
    .then((response) => {
      expect(response.body.status).toBe(403);
      expect(response.body.error).toContain('Invalid Input');
    }));
});
