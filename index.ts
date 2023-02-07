import 'dotenv/config';

import express from 'express';
const app = express();

const PORT: number = parseInt(<string>process.env.PORT, 10) || 3004;

app.get('/', (_req, res) => {
  res.status(200).send('Hello world!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${PORT}`);
});