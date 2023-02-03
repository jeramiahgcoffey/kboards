import { Request } from 'express';

export interface IUserRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

export interface IBoardRequest extends IUserRequest {
  body: {
    name: string;
    description?: string;
  };
}

export interface IColumnRequest extends IUserRequest {
  body: {
    name: string;
    color?: string;
  };
}
