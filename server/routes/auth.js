import express from 'express';
import jwt from 'jsonwebtoken';
import { validateUserSignup, validateUserSignIn } from '../helpers/validators';

const authRouter = express.Router();

authRouter.post('/signup', validateUserSignup, (req, res) => {
  const { returnedData, token } = req;
  res.status(201).send({
    status: 201,
    data: {
      userId: returnedData.userId,
      isAdmin: returnedData.isAdmin,
      token,
    },
  });
});

authRouter.post('/signin', validateUserSignIn, (req, res) => {
  const { payload } = req;
  const token = jwt.sign(payload, process.env.SECRET_KEY);
  res.header('Authorization', `Bearer ${token}`);
  res.status(202).send({
    status: 202,
    message: 'successfully logged in',
    user_id: payload.userId,
    is_admin: payload.isAdmin,
    token,
  });
});

export default authRouter;
