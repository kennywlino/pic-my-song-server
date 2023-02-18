// import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

// const client = new RekognitionClient({ region: "us-west-2"});

// (curr) input: URL in string format
// (goal) input: URL or image in any format (e.g. .jpg, .png, .gif, etc)
// output: base-64 format image
const processImage = async (imgUrl) => {
  const reader = new FileReader();
  try {
    const response = await fetch(imgUrl);
    const data = await response.arrayBuffer();
    reader.readAsArrayBuffer(new Blob([data]));
  } catch (error) {
    console.error(error);
  }

  reader.onload = () => {
    const arrayBuffer = reader.result;
    console.log('arrayBuffer:', arrayBuffer);
  };
};

// input: image in base-64 format
// output: labels from AWS Rekognition
// const getLabels = async (img: Array<number>): Promise<any> => {
//   const params = {
//     Image: {
//       Bytes: img,
//     }
//   };

//   const command = new DetectLabelsCommand(params);

//   try {
//     const data = await client.send(command);
//     return data;
//   } catch (error: any) {
//     console.error("Error:", error);
//   }
// };

const path = "/Users/kennywlino/Downloads/test.jpeg";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
processImage(path);