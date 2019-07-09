import expect from 'expect';
import request from 'supertest';
import {
  isPositiveInteger, trimAllSpace,
  filterInput, isDateFormat, isTime
} from '../helpers/validators';
import app from '../app';

describe('function tests', () => {
  it('should return a positive number', () => {
    const res = isPositiveInteger(2);
    const les = isPositiveInteger(1.09);
    const bless = isPositiveInteger(-3);
    const guess = isPositiveInteger('3');
    expect(res).toBe(true);
    expect(les).toBe(false);
    expect(bless).toBe(false);
    expect(guess).toBe(true);
  });

  it('should return correct time format', () => {
    const res = isTime('120/12/2018');
    const les = isTime('12:90023');
    const bless = isTime('18:009');
    const guess = isTime('12:30');
    expect(res).toBe(false);
    expect(les).toBe(false);
    expect(bless).toBe(false);
    expect(guess).toBe(true);
  });

  it('should return correct date format', () => {
    const res = isDateFormat('120/12/2018');
    const les = isDateFormat('32/84/40154');
    const bless = isDateFormat('0983/3/3020');
    const guess = isDateFormat('02/06/2019');
    expect(res).toBe(false);
    expect(les).toBe(false);
    expect(bless).toBe(false);
    expect(guess).toBe(true);
  });


  it('should trim all white spaces', () => {
    const res = trimAllSpace('  kelvin    ');
    const les = trimAllSpace('ma  r k ');
    const bless = trimAllSpace('  j a  k  e');
    const guess = trimAllSpace('Cla rke');
    expect(res).toBe('kelvin');
    expect(les).toBe('mark');
    expect(bless).toBe('jake');
    expect(guess).toBe('Clarke');
  });

  it('should flag special characters', () => {
    const firstCheck = filterInput('ke   lvin    %');
    const secondCheck = filterInput('ma  & r k ');
    const thridCheck = filterInput('  j a <  k  e');
    const fourthCheck = filterInput('Cla ~rke');
    expect(firstCheck).toBe(true);
    expect(secondCheck).toBe(true);
    expect(thridCheck).toBe(true);
    expect(fourthCheck).toBe(true);
  });

  it('should check email validity', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'frankson#$%joshua@gmail.com',
        firstName: 'Joshua',
        lastName: 'Frankson',
        password: 'jddhehndhr',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.error).toContain('Ensure username, email and password are valid entries');
        expect(res.body.status).toBe(400);
      });
    done();
  });

  it('should check firstName validity', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'franksonjoshua@gmail.com',
        firstName: 'Joshu%^$#@a',
        lastName: 'Frankson',
        password: 'jddhehndhr',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.error).toContain('Ensure username, email and password are valid entries');
        expect(res.body.status).toBe(400);
      });
    done();
  });


  it('should check lastName validity', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'franksonjoshua@gmail.com',
        firstName: 'Joshua',
        lastName: 'Fra$%#@nkson',
        password: 'jddhehndhr',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.error).toContain('Ensure username, email and password are valid entries');
        expect(res.body.status).toBe(400);
      });
    done();
  });

  it('should check password length is greater than 6', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'franksonjoshua@gmail.com',
        firstName: 'Joshua',
        lastName: 'Frankson',
        password: 'jddh',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.error).toContain('Ensure username, email and password are valid entries');
        expect(res.body.status).toBe(400);
      });
    done();
  });


  it('should return length of first name greater than 1', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'franksonjoshua@gmail.com',
        firstName: ' ',
        lastName: 'Frankson',
        password: 'jddhej',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.error).toContain('Ensure username, email and password are valid entries');
        expect(res.body.status).toBe(400);
      });
    done();
  });

  it('should return length of lastName greater than 1', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'franksonjoshua@gmail.com',
        firstName: 'Joshua',
        lastName: ' ',
        password: 'jddhe',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.error).toContain('Ensure username, email and password are valid entries');
        expect(res.body.status).toBe(400);
      });
    done();
  });

  it('should not return withspaces in names', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'franksonjoshua@gmail.com',
        firstName: '     ',
        lastName: ' ',
        password: 'jddhert',
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.error).toContain('Ensure username, email and password are valid entries');
        expect(res.body.status).toBe(400);
      });
    done();
  });
});
