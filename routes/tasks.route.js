import express from 'express';
import tasks from '../controllers/tasks.js';

const router = express.Router({ mergeParams: true });

router.post('/', tasks.postTask);

router.patch('/:taskId', tasks.patchTask);
router.patch('/:taskId/subtask/:subtaskId', tasks.patchSubtask);

export default router;
