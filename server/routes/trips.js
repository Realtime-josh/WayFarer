import express from 'express';
import { createTripValidate, verifyToken } from '../helpers/validators';
import { createTrip } from '../crud/db';
import sendResponse from '../helpers/response';

const tripRouter = express.Router();

tripRouter.post('/createtrip', createTripValidate, verifyToken, (req, res) => {
  const { userDetails, tripDetails } = req.body;
  if (userDetails[0].is_admin) {
    createTrip(tripDetails)
      .then(() => {
        sendResponse(res, 201, 'trip created', null);
      }).catch(() => {
        sendResponse(res, 500, null, 'Error.Ensure bus id is valid');
      });
  } else {
    sendResponse(res, 401, null, 'Unauthorized user!');
  }
});

export default tripRouter;
