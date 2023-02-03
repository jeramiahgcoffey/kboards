import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import { loginUser, registerUser } from '../services/auth.js';
import { createToken, resetPassword } from '../services/passwordReset.js';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await loginUser(email, password);
  res.status(StatusCodes.OK).json(user);
};

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError('Please provide email and password');

  const user = await registerUser(email, password);
  res.status(StatusCodes.CREATED).json(user);
};

const forgot = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) throw new BadRequestError('Please provide email');

  const response = await createToken(email);

  res.status(StatusCodes.CREATED).json(response);
};

const reset = async (req: Request, res: Response) => {
  const { userId, token, password } = req.body;

  if (!userId || !token || !password)
    throw new BadRequestError('Please provide a user, password and token');

  const response = await resetPassword(userId, token, password);
  res.status(StatusCodes.OK).json(response);
};

export default {
  login,
  register,
  forgot,
  reset,
};
