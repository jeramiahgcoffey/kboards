import express from 'express';
import { getAllBoards, getBoard, createBoard } from '../controllers/boards.js';

const router = express.Router();

router.get('/', getAllBoards);

router.get('/:boardId', getBoard);

router.post('/', createBoard);

router.patch('/:id', (req, res) => {
  res.send('update board');
});

router.delete('/:id', (req, res) => {
  res.send('delete board');
});

export default router;
