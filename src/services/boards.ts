import BadRequestError from '../errors/bad-request.js';
import NotFoundError from '../errors/not-found.js';
import Board from '../models/Board.js';

const fetchBoards = async (userId: string) =>
  await Board.find({ createdBy: userId });

const fetchBoardById = async (userId: string, boardId: string) => {
  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new BadRequestError(`Board ${boardId} not found`);
  return board;
};

const createBoard = async (
  userId: string,
  name: string,
  description: string
) => {
  return await Board.create({
    createdBy: userId,
    name,
    description,
  });
};

const createColumn = async (
  userId: string,
  boardId: string,
  name: string,
  color: string
) => {
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

const updateColumn = async (
  userId: string,
  boardId: string,
  columnId: string,
  name: string,
  color: string
) => {
  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new NotFoundError(`Board ${boardId} not found`);

  const column = board.columns.id(columnId);
  if (!column) throw new NotFoundError(`Column ${columnId} not found`);

  column.set({ name, color });
  await board.save();
  return board;
};

const destroyColumn = async (
  userId: string,
  boardId: string,
  columnId: string
) => {
  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new NotFoundError(`Board ${boardId} not found`);

  const column = board.columns.id(columnId);
  if (!column) throw new NotFoundError(`Column ${columnId} not found`);

  column.remove();
  await board.save();
  return board;
};

export default {
  fetchBoards,
  fetchBoardById,
  createBoard,
  createColumn,
  updateColumn,
  destroyColumn,
};
