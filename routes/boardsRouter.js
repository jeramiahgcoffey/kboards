import express from 'express';
import {
  getAllBoards,
  getBoard,
  createBoard,
  createColumn,
  createTask,
  updateTask,
  updateSubtask,
} from '../controllers/boards.js';

const router = express.Router();

router.get('/', getAllBoards);

router.post('/', createBoard);

router.get('/:boardId', getBoard);

router.post('/:boardId/column', createColumn);

router.post('/:boardId/task', createTask);

router.patch('/task/:taskId', updateTask);

router.patch('/task/:taskId/subtask/:subtaskId', updateSubtask);

export default router;
