import express from 'express';
import {
  login,
  register,
  requestToken,
  resetPassword,
} from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.post('/forgot', requestToken);

router.post('/reset', resetPassword);

export default router;
