import express from 'express';
import {
  getAllBoards,
  getBoard,
  postBoard,
  postColumn,
  createTask,
  updateTask,
  updateSubtask,
} from '../controllers/boards.js';

const router = express.Router();

router.get('/', getAllBoards);

router.post('/', postBoard);

router.get('/:boardId', getBoard);

router.post('/:boardId/column', postColumn);

router.post('/:boardId/task', createTask);

router.patch('/task/:taskId', updateTask);

router.patch('/task/:taskId/subtask/:subtaskId', updateSubtask);

export default router;
