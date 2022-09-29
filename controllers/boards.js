import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import Board from '../models/Board.js';

const getAllBoards = async (req, res) => {
  const { userId } = req.user;

  const boards = await Board.find({ createdBy: userId });

  res.status(StatusCodes.OK).json({ boards });
};

const getBoard = async (req, res) => {
  const { boardId } = req.params;
  const { userId } = req.user;

  if (!boardId) throw new BadRequestError('Board ID is required');

  const board = await Board.findOne({ createdBy: userId, _id: boardId });

  if (!board) throw new BadRequestError(`Board ${boardId} not found`);

  res.status(StatusCodes.OK).json({ board });
};

const createBoard = async (req, res) => {
  const { user, body } = req;

  const board = await Board.create({
    createdBy: user.userId,
    name: body.name,
    description: body.description ?? null,
  });
  res.status(StatusCodes.CREATED).json({ board });
};

const createColumn = async (req, res) => {
  const { boardId } = req.params;
  const { name } = req.body;
  const { userId } = req.user;

  if (!boardId) throw new BadRequestError('Board ID is required');

  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new NotFoundError(`Board ${boardId} not found`);

  if (board.columns.includes(name))
    throw new BadRequestError(`Column ${name} already exists`);
  board.columns.push(name);
  await board.save();
  res.status(StatusCodes.CREATED).json({ board });
};

const createTask = async (req, res) => {
  const { boardId } = req.params;
  const { title, status } = req.body;
  const { userId } = req.user;

  const board = await Board.findOne({ createdBy: userId, _id: boardId });

  if (!board) throw new BadRequestError(`Board ${boardId} not found`);

  if (status && !board.columns.includes(status))
    throw new BadRequestError(`Column ${status} not found`);

  board.tasks.push({ title, status });

  await board.save();

  res.status(StatusCodes.CREATED).json({ board });
};

const moveTask = async (req, res) => {
  const { boardId, taskId } = req.params;
  const { column } = req.body;

  if (!boardId || !taskId || !column)
    throw new BadRequestError('BoardId, taskId, column are required');

  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new BadRequestError(`Board ${boardId} not found`);

  if (!board.columns.includes(column))
    throw new BadRequestError(`Column ${column} not found`);

  const task = await board.tasks.id(taskId);
  if (!task) throw new BadRequestError(`Task ${taskId} not found`);

  if (task.status === column)
    throw new BadRequestError(
      `Task ${task.id} already has a status of ${task.status}`
    );
  task.status = column;

  await board.save();
  res.status(StatusCodes.OK).json({ board });
};

export {
  getAllBoards,
  getBoard,
  createBoard,
  createColumn,
  createTask,
  moveTask,
};
