const faceAPI = require('face-api.js');
require('@tensorflow/tfjs-node');
// Currently being used because no server access.
const canvas = require('canvas');
const fs = require('fs');
const path = require('path');
const modelPath = './models';

const { Canvas, Image, ImageData } = canvas;
faceAPI.env.monkeyPatch({ Canvas, Image, ImageData });

function saveFile(fileName, buf){
  fs.writeFileSync(path.resolve('./images', fileName), buf);
}

async function main(){
  // Load trained models for face recognition and detecting face landmarks.
  await faceAPI.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceAPI.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceAPI.nets.faceRecognitionNet.loadFromDisk(modelPath);
  const optionsSSDMobileNet = new faceAPI.SsdMobilenetv1Options({minConfidence:0.8});

  const testImage = await canvas.loadImage('./images/closed_eyes.jpg');
  const results = await faceAPI.detectAllFaces(testImage, optionsSSDMobileNet).withFaceLandmarks().withFaceDescriptors();
  const outputImage = faceAPI.createCanvasFromMedia(testImage);
  faceAPI.draw.drawDetections(outputImage, results.map(res => res.detection));
  faceAPI.draw.drawFaceLandmarks(outputImage, results.map(res => res.landmarks));
  // Convert image to image data.
  imageData = outputImage.toDataURL('image/jpg');
  // Remove the image data header.
  var data = imageData.replace(/^data:image\/\w+;base64,/, "");
  // Convert to buffer (sequence of bytes) from base64 (what the image data is encrypted as).
  var buf = Buffer.from(data, 'base64');
  saveFile('test_output.jpg', buf);
  console.log('Finished.');
}

main();
