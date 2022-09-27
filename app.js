require('dotenv').config();
require('express-async-errors');

const connectDB = require('./db/connect');

// Middleware
const errorHandlerMiddleware = require('./middleware/error-handler');

const express = require('express');
const app = express();



app.get('/', (req, res) => {
  res.send('kanban api')
});

app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on ${ port }...`));
  } catch (error) {
    console.log(error);
  }
}

start();