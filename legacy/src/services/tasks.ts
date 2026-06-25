import BadRequestError from '../errors/bad-request.js';
import Board, { IStatus } from '../models/Board.js';

const createTask = async (
  userId: string,
  boardId: string,
  title: string,
  status: IStatus,
  description: string,
  subtasks: string[]
) => {
  const board = await Board.findOne({ createdBy: userId, _id: boardId });
  if (!board) throw new BadRequestError(`Board ${boardId} not found`);
  if (
    !board.columns
      .map((c) => c.name.toLowerCase())
      .includes(status.name.toLowerCase())
  )
    throw new BadRequestError(`Status ${status._id} not found`);

  board.tasks.push({
    title,
    status,
    description,
    subtasks: subtasks.map((t) => ({
      title: t,
    })),
  });

  await board.save();
  return board;
};

const updateTask = async (
  userId: string,
  taskId: string,
  taskData: {
    title: string;
    description: string;
    status: IStatus;
    subtasks: { title: string }[] | string[];
  }
) => {
  const board = await Board.findOne({
    createdBy: userId,
    'tasks._id': taskId,
  });
  if (!board) throw new BadRequestError(`Task ${taskId} not found`);

  const task = board.tasks.id(taskId);
  task.set({
    ...taskData,
    subtasks: taskData.subtasks.map((t) => (t?.title ? t : { title: t })),
  });

  await board.save();
  return board;
};

const updateSubtask = async (
  userId: string,
  taskId: string,
  subtaskData: { _id: string; title: string; completed: boolean }
) => {
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

const destroyTask = async (userId: string, taskId: string) => {
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
