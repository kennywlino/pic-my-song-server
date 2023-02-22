import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

// Multer needs a location to upload images;
// integrate this with Cloudinary when ready
const upload = multer({ dest: "uploads/" })

dotenv.config()

const router = express.Router();

const REGION = 'us-west-2';

// AWS credentials are read from env automatically
// so no need to specify with process.env
const client = new RekognitionClient({ region: REGION });

router.post('/get-songs', upload.single("img"), getSongs);

const getSongs = (req, res) => {
  console.log(req.body);
  // let testBuffer = await load(path);
  // let labelData = await getLabels(testBuffer);
};

/**
 * Loads an image from path or URL. 
 * @param {string} imgPath - the path of an image 
 * @returns {Buffer} buffer
 */
const load = async (imgPath) => {
  try {
    const data = await fs.promises.readFile(imgPath, 'base64');
    const buffer = Buffer.from(data, 'base64');
    return buffer;
  } catch (err) {
    console.error(err);
  }
};

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
    console.error("Error:", error);
  }
};

const path = "/Users/kennywlino/Downloads/test.jpeg";

let testBuffer = await load(path);
let labelData = await getLabels(testBuffer);
console.log(labelData);

export default router;