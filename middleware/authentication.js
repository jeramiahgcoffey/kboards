import UnauthenticatedError from '../errors/unauthenticated.js';
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startWith('Bearer ')) {
    throw new UnauthenticatedError('Invalid authentication');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication');
  }
};

export default auth;
