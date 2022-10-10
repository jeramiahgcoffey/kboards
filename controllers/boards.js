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
  const { name, color } = req.body;
  const { userId } = req.user;

  if (!boardId) throw new BadRequestError('Board ID is required');

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
  res.status(StatusCodes.CREATED).json({ board });
};

const createTask = async (req, res) => {
  const { boardId } = req.params;
  const { title, status, description, subtasks } = req.body;
  const { userId } = req.user;

  const board = await Board.findOne({ createdBy: userId, _id: boardId });

  if (!board) throw new BadRequestError(`Board ${boardId} not found`);

  if (!status) throw new BadRequestError('No column found');

  if (
    status &&
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

  res.status(StatusCodes.CREATED).json({ board });
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.user;

  const board = await Board.findOne({ createdBy: userId, 'tasks._id': taskId });
  if (!board) throw new BadRequestError(`Task ${taskId} not found`);

  const task = await board.tasks.id(taskId);
  task.set({ ...req.body.task, status: req.body.task.status.toLowerCase() });

  await board.save();

  res.status(StatusCodes.OK).json({ board });
};

const updateSubtask = async (req, res) => {
  const { taskId, subtaskId } = req.params;
  const { userId } = req.user;

  const board = await Board.findOne({
    createdBy: userId,
    'subtasks._id': subtaskId,
  });
  if (!board) throw new BadRequestError(`Subtask ${subtaskId} not found`);

  const task = await board.tasks.id(taskId);
  if (!task) throw new BadRequestError(`Task ${taskId} not found`);

  const subtask = await task.subtasks.id(subtaskId);
  subtask.set(req.body.subtask);

  await board.save();

  res.status(StatusCodes.OK).json({ board });
};

export {
  getAllBoards,
  getBoard,
  createBoard,
  createColumn,
  createTask,
  updateTask,
  updateSubtask,
};
