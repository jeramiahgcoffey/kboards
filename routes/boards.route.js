import express from 'express';
import tasksRouter from './tasks.route.js';
import boardsController from '../controllers/boards.js';
const router = express.Router();

router.use('/tasks', tasksRouter);
router.use('/:boardId/tasks', tasksRouter);

router.get('/', boardsController.getBoards);
router.get('/:boardId', boardsController.getBoard);

router.post('/', boardsController.postBoard);
router.post('/:boardId/column', boardsController.postColumn);

export default router;
