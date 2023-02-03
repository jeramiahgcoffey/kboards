import { Response } from 'express';
import { IUserRequest } from './requests.js';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import tasks from '../services/tasks.js';

const postTask = async (req: IUserRequest, res: Response) => {
  const { boardId } = req.params;
  const { title, status, description, subtasks } = req.body;
  const { userId } = req.user;

  if (!status) throw new BadRequestError('No column found');

  const board = await tasks.createTask(
    userId,
    boardId,
    title,
    status,
    description,
    subtasks
  );
  res.status(StatusCodes.CREATED).json({ board });
};

const patchTask = async (req: IUserRequest, res: Response) => {
  const { userId } = req.user;
  const { taskId } = req.params;
  const {
    task: { title, status },
  } = req.body;

  if (!title || !status)
    throw new BadRequestError('Title and status are required');

  const board = await tasks.updateTask(userId, taskId, req.body.task);
  res.status(StatusCodes.OK).json({ board });
};

const patchSubtask = async (req: IUserRequest, res: Response) => {
  const { taskId } = req.params;
  const { userId } = req.user;

  const board = await tasks.updateSubtask(userId, taskId, req.body.subtask);
  res.status(StatusCodes.OK).json({ board });
};

const deleteTask = async (req: IUserRequest, res: Response) => {
  const { taskId } = req.params;
  const { userId } = req.user;

  const board = await tasks.destroyTask(userId, taskId);
  res.status(StatusCodes.OK).json({ board });
};

export default {
  postTask,
  patchTask,
  patchSubtask,
  deleteTask,
};
