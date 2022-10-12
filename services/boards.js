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
