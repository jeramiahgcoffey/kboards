import User from '../models/User.js';
import Token from '../models/Token.js';
import sendEmail from '../utils/sendEmail.js';
import NotFoundError from '../errors/not-found.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export const createToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError(`User ${email} not found`);

  let token = await Token.findOne({ userId: user._id });
  if (!token) {
    token = await Token.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
  }

  const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
  await sendEmail(user.email, 'password reset', link);

  return { success: true, message: 'Password reset sent successfully' };
};

export const resetPassword = async (userId, reset_token, password) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError(`Invalid link`);

  const token = await Token.findOne({
    userId: user._id,
    token: reset_token,
  });

  if (!token) throw new NotFoundError(`Invalid link`);

  user.password = password;
  await user.save();
  await token.delete();

  return { success: true, message: 'Password updated successfully' };
};
