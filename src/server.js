// required packages
import express from 'express';
import cors from 'cors';
import awsRekognitionRoute from './routes/awsRekognitionRoute.js';
// import spotifyAuthRoutes from './routes/spotifyAuthRoutes.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/process-image', awsRekognitionRoute);
// app.use('/api/spotify', spotifyAuthRoutes);

app.get('/', (_req, res) => {
  res.status(200).send('Welcome to the PicMySong server!');
});

// catch-all route for non-existent endpoints
app.get('*', (_req, res) => {
  res.status(404).send('Not available');
});

export const start = (port) => {
  if (!port) throw new Error ('No port provided.');
  app.listen(port, () => console.log(`Listening on ${port}`));
};