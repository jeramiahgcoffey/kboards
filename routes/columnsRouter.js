import express from 'express';
import { createColumn } from '../controllers/columns.js';

const router = express.Router();

router.post('/', createColumn);

export default router;
