import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import sendResponse from './response';
import { getUserEmail, insertUsers, bookingCheck } from '../crud/db';


dotenv.config();

const isPositiveInteger = s => /^\+?[0-9][\d]*$/.test(s);

const filterInput = (input) => {
  const pattern = /[~!#$%^&*()+={}:'"<>?;',]/;
  const result = pattern.test(input);
  return result;
};

const isDateFormat = s => /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s);

const isTime = s => /^\d{1,2}\:\d{2}$/.test(s);

const atAdminMail = (input) => {
  const result = input.match(/(\b@wayfareradmin.com\b)(?!.*\b\1\b)/g);
  if (result === null) {
    return false;
  }
  return true;
};

const trimAllSpace = str => str.replace(/\s+/g, '');

const validateUserSignup = (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    password,
  } = req.body;
  if (typeof email === 'undefined' || typeof firstName === 'undefined' || typeof lastName === 'undefined'
  || typeof password === 'undefined') {
    sendResponse(res, 400, null, 'Ensure that all fields are correctly filled out');
  } else {
    const trimFirstName = trimAllSpace(firstName);
    const trimLastName = trimAllSpace(lastName);
    const trimEmail = trimAllSpace(email);
    if (validator.isEmail(email) && !filterInput(trimFirstName) && trimFirstName.length > 2
      && !filterInput(trimLastName) && trimLastName.length > 2
      && !filterInput(trimEmail) && password.length > 5) {
      const payload = {
        firstName,
        lastName,
        email,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY);
      const returnedData = {};
      req.token = token;
      getUserEmail(email)
        .then((result) => {
          if (result.length > 0) {
            sendResponse(res, 401, null, 'User already signed up');
          } else {
            const hashedPassword = bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                if (atAdminMail(email)) {
                  insertUsers(firstName, lastName, email, hash, true)
                    .then(() => {
                      getUserEmail(email)
                        .then((data) => {
                          returnedData.userId = data[0].user_id;
                          returnedData.isAdmin = data[0].is_admin;
                          req.returnedData = returnedData;
                          next();
                        }).catch(() => {
                          sendResponse(res, 500, null, 'Internal Server Error');
                        });
                    }).catch(() => {
                      sendResponse(res, 500, null, 'Internal Server Error');
                    });
                } else {
                  insertUsers(firstName, lastName, email, hash, false)
                    .then(() => {
                      getUserEmail(email)
                        .then((feedback) => {
                          returnedData.userId = feedback[0].user_id;
                          returnedData.isAdmin = feedback[0].is_admin;
                          req.returnedData = returnedData;
                          next();
                        }).catch(() => {
                          sendResponse(res, 500, null, 'Internal Server Error');
                        });
                    }).catch(() => {
                      sendResponse(res, 500, null, 'Internal Server Error');
                    });
                }
              });
            });
          }
        }).catch(() => {
          sendResponse(res, 500, null, 'Internal Server Error');
        });
    } else {
      sendResponse(res, 400, null, 'Ensure username, email and password are valid entries');
    }
  }
};

const validateUserSignIn = (req, res, next) => {
  const { email, password } = req.body;
  if (typeof email === 'undefined' || typeof password === 'undefined') {
    sendResponse(res, 403, null, 'Invalid Input');
  } else {
    const trimEmail = trimAllSpace(email);
    if (validator.isEmail(email) && !filterInput(trimEmail) && password.length > 4) {
      getUserEmail(email)
        .then((result) => {
          bcrypt.compare(password, result[0].password, (err, data) => {
            if (!data) {
              sendResponse(res, 406, null, 'Password Incorrect');
            } else {
              const payload = {};
              payload.userId = result[0].user_id;
              payload.firstName = result[0].first_name;
              payload.lastName = result[0].last_name;
              payload.email = result[0].user_email;
              payload.isAdmin = result[0].is_admin;
              req.payload = payload;
              next();
            }
          });
        }).catch(() => {
          sendResponse(res, 404, null, 'Email not registered');
        });
    } else {
      sendResponse(res, 400, null, 'Ensure email and password are valid entries');
    }
  }
};

const createTripValidate = (req, res, next) => {
  const {
    busId, origin, destination, tripDate, tripTime, fare,
  } = req.body;
  if (typeof busId === 'undefined' || typeof origin === 'undefined'
  || typeof destination === 'undefined' || typeof tripDate === 'undefined'
  || typeof tripTime === 'undefined' || typeof fare === 'undefined') {
    sendResponse(res, 403, null, 'Missing input details');
  } else {
    const convertBusId = parseInt(busId);
    const trimOrigin = trimAllSpace(origin);
    const trimDestination = trimAllSpace(destination);
    const trimDate = trimAllSpace(tripDate);
    const trimTime = trimAllSpace(tripTime);
    const trimFare = parseFloat(fare);
    if (isPositiveInteger(convertBusId) && !filterInput(trimOrigin)
   && !filterInput(trimDestination) && isDateFormat(trimDate)
   && isTime(trimTime) && !isNaN(trimFare)) {
      const tripDetails = {};
      tripDetails.busId = convertBusId;
      tripDetails.origin = trimOrigin;
      tripDetails.destination = trimDestination;
      tripDetails.tripDate = trimDate;
      tripDetails.tripTime = trimTime;
      tripDetails.fare = trimFare;
      req.body.tripDetails = tripDetails;
      next();
    } else {
      sendResponse(res, 403, null, 'Ensure all fields are filled in correctly.Date Format:DD/MM/YY.Time Format-hh:mm with a ');
    }
  }
};

const bookingValidate = (req, res, next) => {
  const { tripId, seatNumber } = req.body;
  if (typeof tripId === 'undefined' || typeof seatNumber === 'undefined') {
    sendResponse(res, 403, null, 'Missing input details');
  } else {
    const convertTripId = parseInt(tripId);
    const intSeatNumber = parseInt(seatNumber);
    if (isPositiveInteger(convertTripId) && isPositiveInteger(intSeatNumber)
     && intSeatNumber <= 36) {
      bookingCheck(convertTripId, intSeatNumber)
        .then((result) => {
          if (result.length > 0) {
            sendResponse(res, 412, null, 'Seat already taken');
          } else {
            const bookingInfo = {};
            const date = new Date();
            bookingInfo.tripId = convertTripId;
            bookingInfo.seatNumber = intSeatNumber;
            bookingInfo.date = date;
            req.body.bookingInfo = bookingInfo;
            next();
          }
        }).catch(() => {
          sendResponse(res, 500, null, 'Internal server error');
        });
    } else {
      sendResponse(res, 403, null, 'Ensure all fields are filled in correctly.Maximum number of seats is 36');
    }
  }
};

const verifyToken = (req, res, next) => {
  const bearerHeader = req.get('Authorization');
  if (typeof bearerHeader !== 'undefined') {
    const splitBearerHeader = bearerHeader.split(' ');
    const token = splitBearerHeader[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
      if (err) {
        sendResponse(res, 401, null, 'authentication failed!');
      } else {
        const decrypt = data;
        req.body.decrypted = decrypt;
        getUserEmail(req.body.decrypted.email)
          .then((result) => {
            req.body.userDetails = result;
            next();
          })
          .catch(() => {
            sendResponse(res, 403, null, 'Invalid user');
          });
      }
    });
  } else {
    sendResponse(res, 401, null, 'Cannot authenticate user');
  }
};


export {
  validateUserSignup, isPositiveInteger,
  filterInput, atAdminMail, trimAllSpace,
  validateUserSignIn, createTripValidate, verifyToken, isDateFormat, isTime, bookingValidate,
};
