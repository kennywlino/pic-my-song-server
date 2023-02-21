import dotenv from 'dotenv';
dotenv.config()
import fs from 'fs';

import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

const REGION = 'us-west-2';

// AWS credentials are read from env automatically
const client = new RekognitionClient({ region: REGION });

// (curr) input: image path as string
// output: ArrayBuffer
const load = async (imgPath) => {
  try {
    const data = await fs.promises.readFile(imgPath, 'base64');

    // gives us a Buffer needed for AWS;
    // AWS wants a Uint8Array and "Buffer instances are also JavaScript Uint8Array and TypedArray instances"
    // https://nodejs.org/api/buffer.html#buffer
    
    const buffer = Buffer.from(data, 'base64');
    return buffer;
  } catch (err) {
    console.error(err);
  }
};

// input: image in base-64 format
// output: labels from AWS Rekognition
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