import BadRequestError from '../errors/bad-request.js';
import Board from '../models/Board.js';
import Column from '../models/Column.js';

const createColumn = async (req, res) => {
  const { name, boardId } = req.body;

  const board = await Board.findById(boardId);

  if (!board) throw new BadRequestError(`Board ${boardId} not found`);

  board.columns.push({
    name,
  });

  await board.save();
  // const column = await Column.create({
  //   name,
  //   boardId,
  // });

  res.send(board);
};

export { createColumn };
