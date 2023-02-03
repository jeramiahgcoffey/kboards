import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

class BadRequestError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequestError;
