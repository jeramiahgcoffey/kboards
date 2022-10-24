import { tasks } from 'googleapis/build/src/apis/tasks/index.js';
import BadRequestError from '../errors/bad-request.js';
import Board from '../models/Board.js';

const createTask = async (
  userId,
  boardId,
  title,
  status,
  description,
  subtasks
) => {
  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new BadRequestError(`Board ${boardId} not found`);

  if (
    !board.columns
      .map((c) => c.name.toLowerCase())
      .includes(status.toLowerCase())
  )
    throw new BadRequestError(`Column ${status} not found`);

  board.tasks.push({
    title,
    status: status.toLowerCase(),
    description,
    subtasks: subtasks.map((t) => ({
      title: t,
    })),
  });

  await board.save();
  return board;
};

const updateTask = async (userId, taskId, taskData) => {
  const board = await Board.findOne({
    createdBy: userId,
    'tasks._id': taskId,
  });
  if (!board) throw new BadRequestError(`Task ${taskId} not found`);

  const task = board.tasks.id(taskId);
  task.set({
    ...taskData,
    subtasks: taskData.subtasks.map((t) => (t?.title ? t : { title: t })),
    status: taskData.status.toLowerCase(),
  });

  await board.save();
  return board;
};

const updateSubtask = async (userId, taskId, subtaskData) => {
  const board = await Board.findOne({ createdBy: userId, 'tasks._id': taskId });
  if (!board) throw new BadRequestError(`Task ${taskId} not found`);

  const task = board.tasks.id(taskId);
  const subtask = task.subtasks.id(subtaskData._id);
  if (!subtask)
    throw new BadRequestError(`Subtask ${subtaskData._id} not found`);

  subtask.set(subtaskData);
  await board.save();
  return board;
};

const destroyTask = async (userId, taskId) => {
  const board = await Board.findOne({
    createdBy: userId,
    'tasks._id': taskId,
  });

  if (!board) {
    throw new BadRequestError(`Task ${taskId} not found`);
  }

  board.tasks.id(taskId).remove();
  await board.save();
  return board;
};

export default {
  createTask,
  updateTask,
  updateSubtask,
  destroyTask,
};
