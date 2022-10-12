import BadRequestError from '../errors/bad-request.js';
import { StatusCodes } from 'http-status-codes';
import { loginUser, registerUser } from '../services/auth.js';
import {
  createToken,
  resetPassword as reset,
} from '../services/passwordReset.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await loginUser(email, password);
  res.status(StatusCodes.OK).json(user);
};

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError('Please provide email and password');

  const user = await registerUser(email, password);
  res.status(StatusCodes.CREATED).json(user);
};

export const requestToken = async (req, res) => {
  const { email } = req.body;

  if (!email) throw new BadRequestError('Please provide email');

  const response = await createToken(email);

  res.status(StatusCodes.CREATED).json(response);
};

export const resetPassword = async (req, res) => {
  const { userId, token, password } = req.body;

  if (!userId || !token || !password)
    throw new BadRequestError('Please provide a user, password and token');

  const response = await reset(userId, token, password);
  res.status(StatusCodes.OK).json(response);
};
