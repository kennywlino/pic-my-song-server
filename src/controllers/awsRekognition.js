import dotenv from 'dotenv';
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
dotenv.config()

const REGION = 'us-west-2';

// AWS credentials are read from env automatically
// so no need to specify with process.env
const client = new RekognitionClient({ region: REGION });

/**
 * 
 * @param {Buffer} imgBuffer - image as a base-64 Buffer
 * @returns {Object} data - data including labels about the image
 */
export async function getLabels(imgBuffer) {
  const params = {
    Image: {
      Bytes: imgBuffer,
    }
  };

  const command = new DetectLabelsCommand(params);

  try {
    const data = await client.send(command);
    const labels = processLabelData(data);
    return labels;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Iterates over the data object returned from DetectsLabelCommand and returns each label name, any aliases, and any parent labels all in a flat array
 * 
 * @param {object} data
 * @returns {Array} labels
 */
function processLabelData(data) {
  let labels = new Set();
  data.Labels.map(label => {
    labels.add(label.Name)
    if (label.Aliases) {
      label.Aliases.map(alias => labels.add(alias.Name));
    }
    // if (label.Categories) {
    //   label.Categories.map(category => labels.add(category.Name));
    // }
    // if (label.Parents) {
    //   label.Parents.map(parent => labels.add(parent.Name));
    // }
  });
  return Array.from(labels);
}

/**
 * 
 * @param {*} labels in a flat array; from processLabelData
 * @param {*} count how many random labels to get
 * @returns {Array} selected ; {count} selected labels
 */
export function getRandomLabels(labels, count) {
  if (count > labels.length) {
    throw new Error("Count cannot be larger than the length of the array");
  }
  const selectedLabels = [];
  const labelsCopy = labels.slice();
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * labelsCopy.length);
    selectedLabels.push(labelsCopy[randomIndex]);
    labelsCopy.splice(randomIndex, 1);
  }
  return selectedLabels;
}