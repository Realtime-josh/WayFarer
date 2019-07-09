import express from 'express';
import sendResponse from '../helpers/response';
import { bookingValidate, verifyToken } from '../helpers/validators';
import {
  getTrip, bookingData,
  adminAllBooking, userAllBooking,
} from '../crud/db';

const bookingRouter = express.Router();

bookingRouter.post('/', bookingValidate, verifyToken, (req, res) => {
  const { userDetails, bookingInfo } = req.body;
  bookingInfo.userId = userDetails[0].user_id;
  getTrip(bookingInfo.tripId)
    .then((result) => {
      if (result[0].status) {
        bookingData(bookingInfo)
          .then(() => {
            res.status(202).send({
              status: 202,
              message: 'Booking successfully created',
              user_id: userDetails[0].user_id,
              trip_id: result[0].trip_id,
              trip_date: result[0].trip_date,
              seat_number: bookingInfo.seatNumber,
              first_name: userDetails.first_name,
              last_name: userDetails[0].last_name,
              email: userDetails[0].user_email,
            });
          }).catch((e) => {
            sendResponse(res, 500, null, e);
          });
      } else {
        sendResponse(res, 406, null, 'Trip is currently cancelled');
      }
    }).catch(() => {
      sendResponse(res, 404, null, 'Could not get trip Information');
    });
});

bookingRouter.get('/', verifyToken, (req, res) => {
  const { userDetails } = req.body;
  if (userDetails[0].is_admin && userDetails[0].is_admin) {
    adminAllBooking()
      .then((result) => {
        if (result.length > 0) {
          res.status(200).send({
            status: 200,
            data: result,
          });
        } else {
          sendResponse(res, 200, 'No booking recorded', null);
        }
      }).catch(() => sendResponse(res, 500, null, 'Internal server error'));
  } else if (!userDetails[0].is_admin && !userDetails[0].is_admin) {
    userAllBooking(userDetails[0].user_email)
      .then((result) => {
        if (result.length > 0) {
          res.status(200).send({
            status: 200,
            data: result,
          });
        } else {
          sendResponse(res, 200, 'No booking recorded', null);
        }
      }).catch(() => sendResponse(res, 500, null, 'Internal server error'));
  } else {
    sendResponse(res, 400, null, 'Request cannot be processed');
  }
});

export default bookingRouter;
