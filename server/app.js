import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to WayFarer Transport Services' });
});
app.use('*', (req, res) => {
  res.status(404).send({ error: 'Invalid Route' });
});
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default app;
