import express from 'express';
import tasksRouter from './tasks.route.js';
import boards from '../controllers/boards.js';

const router = express.Router();

router.use('/tasks', tasksRouter);
router.use('/:boardId/tasks', tasksRouter);

router.get('/', boards.getBoards);
router.get('/:boardId', boards.getBoard);

router.post('/', boards.postBoard);
router.post('/:boardId/columns', boards.postColumn);

router.patch('/:boardId/columns/:columnId', boards.patchColumn);

router.delete('/:boardId/columns/:columnId', boards.deleteColumn);

export default router;
