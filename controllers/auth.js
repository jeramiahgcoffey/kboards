import User from '../models/User.js';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import { StatusCodes } from 'http-status-codes';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide username and password');
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new NotFoundError('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new NotFoundError('Invalid credentials');
  }

  res.json(user);
};

export const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  res.status(StatusCodes.CREATED).json(user);
};
