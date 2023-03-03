import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import qs from 'qs';
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

// Multer needs a location to upload images;
// integrate this with Cloudinary when ready
const upload = multer();

dotenv.config()

const router = express.Router();

const REGION = 'us-west-2';

// AWS credentials are read from env automatically
// so no need to specify with process.env
const client = new RekognitionClient({ region: REGION });

router.post('/get-songs', upload.single("img"), getSongs);

async function getSongs(req, res) {
  //let labelData = await getLabels(req.file.buffer);
  let results = await searchSpotify('jeans');
  console.log(results);
  console.log('---------END OF RESULTS---------');
  results.albums.items.map(item => console.log(item));
  console.log('-------END OF ALBUMS-----------');
  results.artists.items.map(item => console.log(item));
  console.log('--------END OF ARTISTS----------');
  results.tracks.items.map(item => console.log(item));
  // results.map(item => item.items.map(obj => console.log(obj))); 
};

/**
 * Loads an image from path or URL. 
 * @param {string} imgPath - the path of an image 
 * @returns {Buffer} buffer
 */
// const load = async (imgPath) => {
//   try {
//     const data = await fs.promises.readFile(imgPath, 'base64');
//     const buffer = Buffer.from(data, 'base64');
//     return buffer;
//   } catch (err) {
//     console.error(err);
//   }
// };

/**
 * 
 * @param {Buffer} imgBuffer - image as a base-64 Buffer
 * @returns {Object} data - data including labels about the image
 */
const getLabels = async (imgBuffer) => {
  const params = {
    Image: {
      Bytes: imgBuffer,
    }
  };

  const command = new DetectLabelsCommand(params);

  try {
    const data = await client.send(command);
    return data;
  } catch (error) {
    console.error(error);
  }
};

async function getSpotifyAuthorization() {
  try {
    const auth_token = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`, 'utf-8').toString('base64');
    const token_url = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({'grant_type':'client_credentials'});

    const res = await axios.post(token_url, data, {
      headers: {
        'Authorization': `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return res.data.access_token;
  } catch(error) {
    console.error(error);
  }
}

/**
 * 
 * @param {string} query 
 * @returns {Array} array of matching songs
 */
async function searchSpotify(query) {
  let accessToken = await getSpotifyAuthorization();

  const search_url = `https://api.spotify.com/v1/search?q=${query}&type=track,album,artist&limit=10`;

  try { 
    const res = await axios.get(search_url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return res.data;
  } catch(error) {
    console.error(error);
  }
}

export default router;