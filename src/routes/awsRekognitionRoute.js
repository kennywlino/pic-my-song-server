import fs from 'fs';

// import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

// const client = new RekognitionClient({ region: "us-west-2"});

// (curr) input: image path as string
// output: ArrayBuffer
const load = (imgPath) => {
  fs.readFile(imgPath, (err, data) => {
    if (err) {
      throw err;
    }

    // gives us a Buffer needed for AWS;
    // AWS wants a Uint8Array and "Buffer instances are also JavaScript Uint8Array and TypedArray instances"
    // https://nodejs.org/api/buffer.html#buffer
    const buffer = Buffer.from(data, 'utf-8');
    console.log('buffer inside load', buffer);
    return buffer;
  });
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

let testBuffer = load(path);
console.log('testBuffer:', testBuffer);