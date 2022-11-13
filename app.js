import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/connect.js';

import authRouter from './routes/auth.route.js';
import boardsRouter from './routes/boards.route.js';

import errorHandlerMiddleware from './middleware/error-handler.js';
import authMiddleware from './middleware/authentication.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

app.use(express.static('client/dist/spa'))

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/boards', authMiddleware, boardsRouter);

// Middleware
app.use(errorHandlerMiddleware);

// Start server
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
