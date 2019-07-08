import expect from 'expect';
import request from 'supertest';
import app from '../app';
import { clearBookingTable } from '../crud/db';

describe('POST /bookings, GET /bookings', () => {
  before((done) => {
    clearBookingTable()
      .then(() => {
        done();
      })
      .catch(e => done(e));
  });

  it('should raise error for no trip record for signed in admin', () => request(app)
    .post('/api/v1/bookings')
    .send({
      tripId: 30000,
      seatNumber: 2,
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(404)
    .then((response) => {
      expect(response.body.status).toBe(404);
      expect(response.body.error).toContain('Could not get trip Information');
    }));

  it('should raise error for an undefined input', () => request(app)
    .post('/api/v1/bookings')
    .send({
      seatNumber: 2,
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(403)
    .then((response) => {
      expect(response.body.status).toBe(403);
      expect(response.body.error).toContain('Missing input details');
    }));

  it('should raise error for booking a seat more than 36', () => request(app)
    .post('/api/v1/bookings')
    .send({
      tripId: 2,
      seatNumber: 39,
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(403)
    .then((response) => {
      expect(response.body.status).toBe(403);
      expect(response.body.error).toContain('Ensure all fields are filled in correctly.Maximum number of seats is 36');
    }));

  it('should raise error for already cancelled booking', () => request(app)
    .post('/api/v1/bookings')
    .send({
      tripId: 3,
      seatNumber: 6,
    })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYzLCJmaXJzdE5hbWUiOiJKYWNvYiIsImxhc3ROYW1lIjoiTW9vcmUiLCJlbWFpbCI6ImphY29ubW9vcmVAd2F5ZmFyZXJhZG1pbi5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjIxODc4Njd9.QxKWLYmLbt_YzkuOcnm6znMgx6iuFFHwFwGn715DPNc')
    .expect(406)
    .then((response) => {
      expect(response.body.status).toBe(406);
      expect(response.body.error).toContain('Trip is currently cancelled');
    }));
});
