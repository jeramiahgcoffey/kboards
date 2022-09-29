import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request.js';
import Board from '../models/Board.js';

const getAllBoards = async (req, res) => {
  const { userId } = req.user;

  const boards = await Board.find({ userId });

  res.status(StatusCodes.OK).json({ boards });
};

const getBoard = async (req, res) => {
  const { boardId } = req.params;

  if (!boardId) throw new BadRequestError('Board ID is required');

  const board = await Board.findById(boardId);

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
  res.send(board);
};

export { getAllBoards, getBoard, createBoard };
