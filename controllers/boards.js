import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import Board from '../models/Board.js';
import {
  createBoard,
  createColumn,
  createTask,
  fetchUserBoards,
  updateTask,
} from '../services/boards.js';

const getAllBoards = async (req, res) => {
  const { userId } = req.user;

  const boards = await fetchUserBoards(userId);
  res.status(StatusCodes.OK).json({ boards });
};

const getBoard = async (req, res) => {
  const { boardId } = req.params;
  const { userId } = req.user;

  if (!boardId) throw new BadRequestError('Board ID is required');

  const board = await fetchBoardById(userId, boardId);
  res.status(StatusCodes.OK).json({ board });
};

const postBoard = async (req, res) => {
  const {
    user: { userId },
    body: { name, description },
  } = req;

  const board = await createBoard(userId, name, description);
  res.status(StatusCodes.CREATED).json({ board });
};

const postColumn = async (req, res) => {
  const { boardId } = req.params;
  const { name, color } = req.body;
  const { userId } = req.user;

  if (!boardId) throw new BadRequestError('Board ID is required');
  if (!name) throw new BadRequestError('Name is required');

  const board = await createColumn(userId, boardId, name, color);
  res.status(StatusCodes.CREATED).json({ board });
};

const postTask = async (req, res) => {
  const { boardId } = req.params;
  const { title, status, description, subtasks } = req.body;
  const { userId } = req.user;

  if (!status) throw new BadRequestError('No column found');

  const board = await createTask(
    userId,
    boardId,
    title,
    status,
    description,
    subtasks
  );
  res.status(StatusCodes.CREATED).json({ board });
};

const patchTask = async (req, res) => {
  const { userId } = req.user;
  const {
    taskId,
    task: { title, status },
  } = req.body;

  if (!taskId) throw new BadRequestError('TaskId is required');
  if (!title || !status)
    throw new BadRequestError('Title and status are required');

  const board = await updateTask(userId, taskId, req.body.task);
  res.status(StatusCodes.OK).json({ board });
};

const updateSubtask = async (req, res) => {
  const { taskId, subtaskId } = req.params;
  const { userId } = req.user;

  const board = await Board.findOne({ createdBy: userId, 'tasks._id': taskId });
  if (!board) throw new BadRequestError(`Task ${taskId} not found`);

  const task = await board.tasks.id(taskId);
  if (!task) throw new BadRequestError(`Task ${taskId} not found`);

  const subtask = await task.subtasks.id(subtaskId);
  if (!subtask) throw new BadRequestError(`Subtask ${subtaskId} not found`);

  subtask.set(req.body.subtask);

  await board.save();

  res.status(StatusCodes.OK).json({ board });
};

export {
  getAllBoards,
  getBoard,
  postBoard,
  postColumn,
  postTask,
  patchTask,
  updateSubtask,
};
