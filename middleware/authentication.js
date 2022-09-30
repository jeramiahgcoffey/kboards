import UnauthenticatedError from '../errors/unauthenticated.js';
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   throw new UnauthenticatedError('Invalid authentication');
  // }

  // const token = authHeader.split(' ')[1];
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzMzOGY5NWNiOTVlOTAyNGMwZmExMGEiLCJlbWFpbCI6Impha2VAZ21haWwuY29tIiwiaWF0IjoxNjY0NTYzOTMzLCJleHAiOjE2NjQ5OTU5MzN9.BX00nXCG9JK6t5hD0PAagZdDolY-MQxAgPNtLWxdJFg';

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication');
  }
};

export default auth;
