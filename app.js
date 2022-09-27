require('dotenv').config();
const express = require('express');
const app = express();


const port = process.env.PORT || 3000;
const start = () => {
  app.listen(port, () => console.log(`Server listening on ${ port }...`));
}

start();