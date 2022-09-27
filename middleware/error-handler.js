import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  const message = err.message || 'Internal Server Error';
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
};

export default errorHandlerMiddleware;
