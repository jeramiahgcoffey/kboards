import { StatusCodes } from 'http-status-codes';
import CustomAPIError from '../errors/custom-api.js';
import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if ((err as MongoServerError)?.code === 11000) {
    const field = Object.keys((err as MongoServerError).keyValue)[0]
    return res.status(StatusCodes.CONFLICT).json({message: `That ${field} is already associated with an account.`})
  }

  const message = err.message || 'Internal Server Error';
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
};

export default errorHandlerMiddleware;
