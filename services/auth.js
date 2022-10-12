import User from '../models/User.js';
import NotFoundError from '../errors/not-found.js';

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new NotFoundError('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new NotFoundError('Invalid credentials');
  }

  const token = user.createJWT();
  return { user: { email: user.email }, token };
};

export const registerUser = async (email, password) => {
  const user = await User.create({ email, password });
  const token = user.createJWT();

  return { user: { email: user.email }, token };
};
