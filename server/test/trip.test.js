import expect from 'expect';
import request from 'supertest';
import app from '../app';
import { clearTripTable } from '../crud/db';

describe('POST /trips', () => {
  before((done) => {
    clearTripTable()
      .then(() => {
        done();
      })
      .catch(e => done(e));
  });
  it('should create trip for signed in admin', () => request(app)
    .post('/api/v1/trips')
    .send({
      busId: 4,
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000',
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(201)
    .then((response) => {
      expect(response.body.status).toBe(201);
      expect(response.body.data).toContain('trip created');
      expect(response.body.data).toBeTruthy();
    }));

  it('should flag error for wrong input details', () => request(app)
    .post('/api/v1/trips')
    .send({
      busId: '4',
      origin: 'Mangala%^$#',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000',
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(403)
    .then((response) => {
      expect(response.body.status).toBe(403);
      expect(response.body.error).toContain('Ensure all fields are filled in correctly');
    }));

  it('should flag error for missing input details', () => request(app)
    .post('/api/v1/trips')
    .send({
      busId: '4',
      origin: 'Mangala',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000',
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(403)
    .then((response) => {
      expect(response.body.status).toBe(403);
      expect(response.body.error).toContain('Missing input details');
    }));

  it('should ensure non-admin does not create a trip', () => request(app)
    .post('/api/v1/trips')
    .send({
      busId: '4',
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000',
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg1LCJmaXJzdE5hbWUiOiJKb3NodWEiLCJsYXN0TmFtZSI6IkZyYW5rc29uIiwiZW1haWwiOiJqb3NodWFmcmFua3NvbkBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYyMTg5OTg4fQ.pS7g3oVP_4hVL1ugeJZpr5JoBqDRACZJlS7uG9cFFGw')
    .expect(401)
    .then((response) => {
      expect(response.body.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized user!');
    }));

  it('should raise error for wrongly authenticated user', () => request(app)
    .post('/api/v1/trips')
    .send({
      busId: '4',
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000',
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer w')
    .expect(407)
    .then((response) => {
      expect(response.body.status).toBe(407);
      expect(response.body.error).toContain('authentication failed!');
    }));

  it('should raise error for non-authenticated user', () => request(app)
    .post('/api/v1/trips')
    .send({
      busId: '4',
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000',
    })
    .set('Accept', 'application/json')
    .expect(407)
    .then((response) => {
      expect(response.body.status).toBe(407);
      expect(response.body.error).toContain('Cannot authenticate user');
    }));

  it('should raise error for invalid bus id', () => request(app)
    .post('/api/v1/trips')
    .send({
      busId: '3000000',
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/2019',
      tripTime: '12:30',
      fare: '100000',
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(500)
    .then((response) => {
      expect(response.body.status).toBe(500);
      expect(response.body.error).toContain('Error.Ensure bus id is valid');
    }));

  it('should raise error for invalid trip date', () => request(app)
    .post('/api/v1/trips')
    .send({
      busId: 4,
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/1942',
      tripTime: '12:30',
      fare: '100000',
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(405)
    .then((response) => {
      expect(response.body.status).toBe(405);
      expect(response.body.error).toContain('This Date is not allowed');
    }));

  it('should ensure unauthorized user does not cancel trip', () => request(app)
    .post('/api/v1/trips')
    .send({
      busId: 4,
      origin: 'Mangala',
      destination: 'Seoul',
      tripDate: '12/07/1942',
      tripTime: '12:30',
      fare: '100000',
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg1LCJmaXJzdE5hbWUiOiJKb3NodWEiLCJsYXN0TmFtZSI6IkZyYW5rc29uIiwiZW1haWwiOiJqb3NodWFmcmFua3NvbkBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYyMTg5OTg4fQ.pS7g3oVP_4hVL1ugeJZpr5JoBqDRACZJlS7uG9cFFGw')
    .expect(401)
    .then((response) => {
      expect(response.body.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    }));

  it('should raise error for unknown trip', () => request(app)
    .patch('/api/v1/trips/8')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(404)
    .then((response) => {
      expect(response.body.status).toBe(404);
      expect(response.body.error).toContain('Could not get trip');
    }));

  it('should get all trips for non-admin', () => request(app)
    .get('/api/v1/trips')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg1LCJmaXJzdE5hbWUiOiJKb3NodWEiLCJsYXN0TmFtZSI6IkZyYW5rc29uIiwiZW1haWwiOiJqb3NodWFmcmFua3NvbkBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYyMTg5OTg4fQ.pS7g3oVP_4hVL1ugeJZpr5JoBqDRACZJlS7uG9cFFGw')
    .expect(200)
    .then((response) => {
      expect(response.body.status).toBe(200);
    }));

  it('should get all trips for admin', () => request(app)
    .get('/api/v1/trips')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(200)
    .then((response) => {
      expect(response.body.status).toBe(200);
    }));

  it('should raise error for unauthorized cases', () => request(app)
    .get('/api/v1/trips')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(407)
    .then((response) => {
      expect(response.body.status).toBe(407);
      expect(response.body.error).toContain('authentication failed!');
    }));

  it('should raise error for unauthorized cases without token', () => request(app)
    .get('/api/v1/trips')
    .set('Accept', 'application/json')
    .expect(407)
    .then((response) => {
      expect(response.body.status).toBe(407);
      expect(response.body.error).toContain('Cannot authenticate user');
    }));
});
