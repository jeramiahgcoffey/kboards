import express from 'express';
import { login, register, requestToken } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.post('/reset', requestToken);

export default router;
