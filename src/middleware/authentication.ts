import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from '../contracts/requests.js';
import UnauthenticatedError from '../errors/unauthenticated.js';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface Payload extends JwtPayload {
  userId: string;
  email: string;
}

const auth = (req: IUserRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Invalid authentication');
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as Payload;
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid authentication');
  }
};

export default auth;
