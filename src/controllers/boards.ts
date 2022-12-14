import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import boards from '../services/boards.js';

const getBoards = async (req, res) => {
  const { userId } = req.user;

  const allBoards = await boards.fetchBoards(userId);
  res.status(StatusCodes.OK).json({ boards: allBoards });
};

const getBoard = async (req, res) => {
  const { boardId } = req.params;
  const { userId } = req.user;

  const board = await boards.fetchBoardById(userId, boardId);
  res.status(StatusCodes.OK).json({ board });
};

const postBoard = async (req, res) => {
  const {
    user: { userId },
    body: { name, description },
  } = req;

  if (!name) throw new BadRequestError('Board name is required');

  const board = await boards.createBoard(userId, name, description);
  res.status(StatusCodes.CREATED).json({ board });
};

const postColumn = async (req, res) => {
  const { boardId } = req.params;
  const { name, color } = req.body;
  const { userId } = req.user;

  if (!name) throw new BadRequestError('Name is required');

  const board = await boards.createColumn(userId, boardId, name, color);
  res.status(StatusCodes.CREATED).json({ board });
};

const patchColumn = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { name, color } = req.body;
  const { userId } = req.user;

  if (!name || !color) throw new BadRequestError('Name and color are required');

  const board = await boards.updateColumn(
    userId,
    boardId,
    columnId,
    name,
    color
  );
  res.status(StatusCodes.OK).json({ board });
};

const deleteColumn = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { userId } = req.user;

  const board = await boards.destroyColumn(userId, boardId, columnId);
  res.status(StatusCodes.OK).json({ board });
};

export default {
  getBoards,
  getBoard,
  postBoard,
  postColumn,
  patchColumn,
  deleteColumn,
};
