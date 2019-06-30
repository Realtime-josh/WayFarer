import expect from 'expect';
import request from 'supertest';
import app from '../app';
import { getUserEmail, clearTable } from '../crud/db';

describe('POST /signup', () => {
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

  it('should check that all input fields are filled correctly', (done) => {
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

  it('should check for strong password', (done) => {
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

  it('should check check for edge cases where input are not defined', (done) => {
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
});
