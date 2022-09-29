import Board from '../models/Board.js';

const getAllBoards = (req, res) => {
  res.send('get all boards');
};

const createBoard = async (req, res) => {
  const { user, body } = req;

  const board = await Board.create({
    owner: user.userId,
    name: body.name,
    description: body.description ?? null,
  });
  res.send(board);
};

export { getAllBoards, createBoard };
