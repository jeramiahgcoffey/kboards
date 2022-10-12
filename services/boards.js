import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import Board from '../models/Board.js';

export const fetchUserBoards = async (userId) =>
  await Board.find({ createdBy: userId });

export const fetchBoardById = async (userId, boardId) => {
  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new BadRequestError(`Board ${boardId} not found`);
  return board;
};

export const createBoard = async (userId, name, description) => {
  const board = await Board.create({
    createdBy: userId,
    name,
    description,
  });
  return board;
};

export const createColumn = async (userId, boardId, name, color) => {
  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new NotFoundError(`Board ${boardId} not found`);

  if (
    board.columns.map((c) => c.name.toLowerCase()).includes(name.toLowerCase())
  )
    throw new BadRequestError(`Column ${name} already exists`);
  board.columns.push({
    name: name.toLowerCase(),
    color: color ? color : 'default',
  });
  await board.save();
  return board;
};

export const createTask = async (
  userId,
  boardId,
  title,
  status,
  description,
  subtasks
) => {
  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new BadRequestError(`Board ${boardId} not found`);

  if (
    !board.columns
      .map((c) => c.name.toLowerCase())
      .includes(status.toLowerCase())
  )
    throw new BadRequestError(`Column ${status} not found`);

  board.tasks.push({
    title,
    status: status.toLowerCase(),
    description,
    subtasks: subtasks.map((t) => ({
      title: t,
    })),
  });

  await board.save();
  return board;
};

export const updateTask = async (userId, taskId, data) => {
  const board = await Board.findOne({
    createdBy: userId,
    'tasks._id': taskId,
  });
  if (!board) throw new BadRequestError(`Task ${taskId} not found`);

  const task = await board.tasks.id(taskId);
  task.set({ ...data, status: data.status.toLowerCase() });

  await board.save();
  return board;
};
