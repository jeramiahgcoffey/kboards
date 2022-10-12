import express from 'express';
import {
  getAllBoards,
  getBoard,
  postBoard,
  postColumn,
  postTask,
  patchTask,
  updateSubtask,
} from '../controllers/boards.js';

const router = express.Router();

router.get('/', getAllBoards);
router.get('/:boardId', getBoard);

router.post('/', postBoard);
router.post('/:boardId/column', postColumn);
router.post('/:boardId/task', postTask);

router.patch('/task', patchTask);
router.patch('/task/:taskId/subtask/:subtaskId', updateSubtask);

export default router;
