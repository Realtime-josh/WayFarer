import express from 'express';
import { validateUserSignup } from '../helpers/validators';

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

export default authRouter;
