import Task from '../models/Task.js';

const createTask = async (req, res) => {
  const { title, boardId, column } = req.body;
  console.log(title);
  const task = await Task.create({
    title,
    boardId,
    column,
  });

  res.send(task);
};

export { createTask };
