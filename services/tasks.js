import { tasks } from 'googleapis/build/src/apis/tasks/index.js';
import BadRequestError from '../errors/bad-request.js';
import Board from '../models/Board.js';
import mongoose from "mongoose";

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

  console.log(board.columns.map(c => c._id))
  // if (
  //   !board.columns
  //     .map(c => c._id)
  //     .includes(status._id)
  // )
  //   throw new BadRequestError(`Column ${status._id} not found`);

  board.tasks.push({
    title,
    status,
    description,
    subtasks: subtasks.map((t) => ({
      title: t,
    })),
  });
  console.log(board.columns)

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
