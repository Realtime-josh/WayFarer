import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import sendResponse from './response';
import { getUserEmail, insertUsers } from '../crud/db';


dotenv.config();

const isPositiveInteger = s => /^\+?[1-9][\d]*$/.test(s);

const filterInput = (input) => {
  const pattern = /[~!#$%^&*()+={}:'"<>?;',]/;
  const result = pattern.test(input);
  return result;
};

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
      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;
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


export {
  validateUserSignup, isPositiveInteger,
  filterInput, atAdminMail, trimAllSpace,
};
