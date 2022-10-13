import express from 'express';
import authController from '../controllers/auth.js';

const router = express.Router();

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/forgot', authController.forgot);

router.post('/reset', authController.reset);

export default router;
