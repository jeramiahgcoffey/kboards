import BadRequestError from '../errors/bad-request.js';
import Board from '../models/Board.js';
import Task from '../models/Task.js';

const createTask = async (req, res) => {
  const { title, boardId, columnId } = req.body;

  const board = await Board.findById(boardId);

  if (!board) throw new BadRequestError(`Board ${boardId} not found`);

  const column = await board.columns.id(columnId);

  if (!column) throw new BadRequestError(`Column ${columnId} not found`);

  column.tasks.push({ title });

  await board.save();

  res.send(board);
};

export { createTask };
