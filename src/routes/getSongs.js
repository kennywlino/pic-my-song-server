import express from 'express';
import multer from 'multer';

import { getLabels, getRandomLabels } from '../controllers/awsRekognition.js';
import { searchSpotify } from '../controllers/spotify.js';

// Multer needs a location to upload images;
// integrate this with Cloudinary when ready
const upload = multer();

const router = express.Router();

router.post('/get-songs', upload.single("img"), getSongs);

export async function getSongs(req, res) {
  try {
    const image = req.file.buffer;
    const labels = await getLabels(image);
    const randomLabels = getRandomLabels(labels, 1);

    const resultsPromises = randomLabels.map(async label => {
      const searchResults = await searchSpotify(label);
      return searchResults;
    });

    const songsData = await Promise.all(resultsPromises);
    res.status(200).send(songsData);
  } catch(error) {
    console.error(error);
    res.status(400).send("Get songs failed");
  };
}

export default router;