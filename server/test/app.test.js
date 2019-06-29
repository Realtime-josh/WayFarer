import expect from 'expect';
import request from 'supertest';
import app from '../app';

describe('GET /', () => {
  it('should respond with welcome message', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.message).toContain('Welcome');
      });
    done();
  });
});

describe('*', () => {
  it('should respond with error message', (done) => {
    request(app)
      .get('/noroute')
      .set('Accept', 'application/json')
      .expect(404)
      .then((response) => {
        expect(response.body.error).toContain('Invalid');
      });
    done();
  });
});
