import { StatusCodes } from 'http-status-codes';
import CustomAPIError from '../errors/custom-api.js';

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  const message = err.message || 'Internal Server Error';
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
};

export default errorHandlerMiddleware;
