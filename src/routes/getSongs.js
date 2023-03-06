import axios from 'axios';
import express from 'express';
import multer from 'multer';
import qs from 'qs';

import { getLabels } from '../controllers/awsRekognition.js';

// Multer needs a location to upload images;
// integrate this with Cloudinary when ready
const upload = multer();

const router = express.Router();

router.post('/get-songs', upload.single("img"), getSongs);

export async function getSongs(req, res) {
  try {
    const image = req.file.buffer;
    let labels = await getLabels(image);
    res.status(200).send(labels);
  } catch(error) {
    console.error(error);
    res.status(404).send([]);
  };
}

export default router;