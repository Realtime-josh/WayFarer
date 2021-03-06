import express from 'express';
import {
  createTripValidate, verifyToken,
  isPositiveInteger,
} from '../helpers/validators';
import {
  createTrip, cancelTrip, getTrip,
  getAllTrips, tripByOrigin,
} from '../crud/db';
import sendResponse from '../helpers/response';

const tripRouter = express.Router();

tripRouter.post('/', createTripValidate, verifyToken, (req, res) => {
  const { userDetails, tripDetails } = req.body;
  if (typeof userDetails[0].is_admin === 'undefined') {
    sendResponse(res, 403, null, 'Unauthorized!');
  } else if (userDetails[0].is_admin) {
    const dateFromInput = tripDetails.tripDate;
    const timeFromInput = tripDetails.tripTime;
    const dateParts = dateFromInput.split('/');
    const timeParts = timeFromInput.split(':');
    const date = new Date(dateParts[2], dateParts[0] - 1,
      dateParts[1], timeParts[0], timeParts[1]);
    // const dateISO = date.toISOString();
    if (!(date < new Date())) {
      createTrip(tripDetails)
        .then(() => {
          sendResponse(res, 201, 'trip created', null);
        }).catch(() => {
          sendResponse(res, 500, null, 'Error.Ensure bus id is valid');
        });
    } else {
      sendResponse(res, 405, null, 'This Date is not allowed');
    }
  } else {
    sendResponse(res, 401, null, 'Unauthorized user!');
  }
});

tripRouter.patch('/:id', verifyToken, (req, res) => {
  const { userDetails } = req.body;
  const { id } = req.params;
  const convertTripId = parseInt(id);
  if (userDetails[0].is_admin && isPositiveInteger(convertTripId)) {
    getTrip(convertTripId)
      .then((result) => {
        if (result.length > 0) {
          if (result[0].status) {
            cancelTrip(convertTripId)
              .then(() => {
                sendResponse(res, 202, 'Trip cancelled', null);
              }).catch(() => {
                sendResponse(res, 500, null, 'Internal server error');
              });
          } else {
            sendResponse(res, 207, 'Trip already cancelled', 'null');
          }
        } else {
          sendResponse(res, 404, 'null', 'Could not get trip');
        }
      }).catch(() => {
        sendResponse(res, 500, null, 'Internal server error');
      });
  } else {
    sendResponse(res, 401, null, 'Unauthorized!');
  }
});

tripRouter.get('/', verifyToken, (req, res) => {
  const { userDetails } = req.body;
  if (userDetails[0].is_admin || !userDetails[0].is_admin) {
    getAllTrips()
      .then((result) => {
        res.status(200).send({
          status: 200,
          data: result,
        });
      }).catch(() => {
        sendResponse(res, 500, null, 'Internal server error');
      });
  } else {
    sendResponse(res, 400, null, 'Request could not be proccessed');
  }
});

tripRouter.get('/:param', verifyToken, (req, res) => {
  const { userDetails } = req.body;
  const { param } = req.params;
  const wildcard = param.concat('%');
  if (userDetails[0].is_admin || !userDetails[0].is_admin) {
    tripByOrigin(wildcard)
      .then((result) => {
        if (result.length > 0) {
          res.status(200).send({
            status: 200,
            message: 'Successfully fetched',
            data: result,
          });
        } else {
          sendResponse(res, 404, null, 'No trip is leaving this route');
        }
      }).catch(e => console.log(e));
  }
});


export default tripRouter;
