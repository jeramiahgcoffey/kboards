import express from 'express';
import { getAllBoards, createBoard } from '../controllers/boards.js';

const router = express.Router();

router.get('/', getAllBoards);

router.get('/:id', (req, res) => {
  res.send('get board');
});

router.post('/', createBoard);

router.patch('/:id', (req, res) => {
  res.send('update board');
});

router.delete('/:id', (req, res) => {
  res.send('delete board');
});

export default router;
