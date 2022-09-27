import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();

// Connect DB
import connectDB from './db/connect.js';

// Routers
import authRouter from './routes/authRouter.js';

// Middleware
import errorHandlerMiddleware from './middleware/error-handler.js';

import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('kanban api');
});
app.use('/api/v1/auth', authRouter);

app.use(errorHandlerMiddleware);

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
