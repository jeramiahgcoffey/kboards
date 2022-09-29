import Column from '../models/Column.js';

const createColumn = async (req, res) => {
  const { name, boardId } = req.body;

  const column = await Column.create({
    name,
    boardId,
  });

  res.send(column);
};

export { createColumn };
