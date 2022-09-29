import express from 'express';
import {
  getAllBoards,
  getBoard,
  createBoard,
  createColumn,
  createTask,
  moveTask,
} from '../controllers/boards.js';

const router = express.Router();

router.get('/', getAllBoards);

router.post('/', createBoard);

router.get('/:boardId', getBoard);

router.post('/:boardId/column', createColumn);

router.post('/:boardId/task', createTask);

router.patch('/:boardId/task/:taskId/move', moveTask);

export default router;
