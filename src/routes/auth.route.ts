import express from 'express';
import auth from '../controllers/auth.js';

const router = express.Router();

router.post('/login', auth.login);

router.post('/register', auth.register);

router.post('/forgot', auth.forgot);

router.post('/reset', auth.reset);

export default router;
