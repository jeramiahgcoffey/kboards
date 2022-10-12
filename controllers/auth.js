import BadRequestError from '../errors/bad-request.js';
import { StatusCodes } from 'http-status-codes';
import { loginUser, registerUser } from '../services/auth.js';
import { createToken, resetPassword } from '../services/passwordReset.js';

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
