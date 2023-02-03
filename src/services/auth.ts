import User from '../models/User.js';
import NotFoundError from '../errors/not-found.js';

export const loginUser = async (email: string, password: string) => {
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

export const registerUser = async (email: string, password: string) => {
  const user = await User.create({ email, password });
  const token = user.createJWT();

  return { user: { email: user.email }, token };
};
