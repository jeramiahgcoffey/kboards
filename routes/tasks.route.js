import express from 'express';
import boardsController from '../controllers/boards.js';

const router = express.Router({ mergeParams: true });

router.post('/', boardsController.postTask);

router.patch('/:taskId', boardsController.patchTask);
router.patch('/:taskId/subtask/:subtaskId', boardsController.patchSubtask);

export default router;
