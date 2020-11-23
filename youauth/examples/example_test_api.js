const faceAPI = require('face-api.js');
const tf = require('@tensorflow/tfjs-node');
// Currently being used because no server access.
const canvas = require('canvas');
const fs = require('fs');
const path = require('path');
const modelPath = './models';

const { Canvas, Image, ImageData } = canvas;
faceAPI.env.monkeyPatch({ Canvas, Image, ImageData });

function saveImageFile(fileName, imageData){
  // Remove the image data header.
  var data = imageData.replace(/^data:image\/\w+;base64,/, "");
  // Convert to buffer (sequence of bytes) from base64 (what the image data is encrypted as).
  var buf = Buffer.from(data, 'base64');
  // Save file to images folder.
  fs.writeFileSync(path.resolve('./images', fileName), buf);
}

// Test function for loading image as tensor.
function loadImage(imgPath){
  const buffer = fs.readFileSync(imgPath);
  const buf = Buffer.from(buffer, 'base64');
  const tensor = tf.node.decodeImage(buf);
  return tensor;
}

// Test function for converting tensor to JPG.
function convertJPG(tensor){
  return new Promise((resolve) => {
    const arr = tf.node.encodeJpeg(tensor);
    resolve(arr);
  });
}

// Returns array of labels that were found in matches.
function getMatchedLabels(matches){
  matchedLabels = [];
  matches.forEach((match, i) => {
    label = match._label;
    if(label !== 'unknown'){
      matchedLabels.push(label);
    }
  });
  return matchedLabels;
}

// Saved the labeled face descriptors as a json file for later use.
function saveDescriptors(labeledFaceDescriptors, filePath){
  console.log(labeledFaceDescriptors);
  const jsonString = JSON.stringify(labeledFaceDescriptors);
  fs.writeFileSync(filePath, jsonString);
}

function loadDescriptors(filePath){
  const jsonString = fs.readFileSync(filePath);
  var contents = JSON.parse(jsonString);
  labeledFaceDescriptors = [];
  contents.forEach((content, i) => {
    let values = new Float32Array(content.descriptors[0]);
    let arr = [values];
    labeledFaceDescriptors[i] = new faceAPI.LabeledFaceDescriptors(content.label, arr);
  })
  return labeledFaceDescriptors;
}

// Gather descriptive features of reference images.
function labelDescriptors(labels, refImages){
  // Make sure labels and regImages are same length.
  if(labels.length !== refImages.length){
    console.log('Labels and images not aligned!');
    return;
  }
  return Promise.all(
    // Return new array with LabeledFaceDescriptors(labels, descriptors(Float32Array));
    labels.map(async(label, i) =>{
      const img = await canvas.loadImage(refImages[i]);
      const result = await faceAPI.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      // Warn if face detection is below a certain amount.
      if(result === undefined){
        console.log('No faces detected in %s.', refImages[i]);
        return;
      }
      const faceDescriptor = [result.descriptor];
      return new faceAPI.LabeledFaceDescriptors(label, faceDescriptor);
    })
  );
}

async function main(){
  // Load trained models for face recognition and detecting face landmarks.
  await faceAPI.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceAPI.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceAPI.nets.faceRecognitionNet.loadFromDisk(modelPath);

  // Puts labels here. Make sure to align and match with reference images.
  // const labels = ['cap', 'cap_marvel', 'tony', 'widow', 'thor'];
  // const refImages = ['./images/cap.jpg', './images/marvel.jpg', './images/tony.jpg', './images/widow.jpg', './images/thor.jpg'];
  const labels = ['trump', 'biden'];
  const refImages = ['./images/trump.jpg', './images/biden.jpg'];
  const jsonPath = './jsons/descriptor.json';

  // const labeledFaceDescriptors = await labelDescriptors(labels, refImages);
  const labeledFaceDescriptors = loadDescriptors(jsonPath);

  // const testImage = await canvas.loadImage('./images/test_image8.jpg');
  const testImage = await canvas.loadImage('./images/test_image2.jpg');

  const results = await faceAPI.detectAllFaces(testImage).withFaceLandmarks().withFaceDescriptors();

  // Create face matcher with the labeled face descriptors. Set euclidean distance threshold to 0.6;
  const faceMatcher = new faceAPI.FaceMatcher(labeledFaceDescriptors, 0.6);

  // Match the face descriptors in results to the ones in faceMatcher.
  const matches = results.map(fd => faceMatcher.findBestMatch(fd.descriptor));

  const matchedLabels = getMatchedLabels(matches);

  console.log(matchedLabels);

  const outputImage = faceAPI.createCanvasFromMedia(testImage);

  matches.forEach((match, i) => {
    const box = results[i].detection.box;
    const label = match.toString();
    const drawBox = new faceAPI.draw.DrawBox(box, {label:label});
    drawBox.draw(outputImage);
  });

  // faceAPI.draw.drawDetections(outputImage, results.map(res => res.detection));
  // faceAPI.draw.drawFaceLandmarks(outputImage, results.map(res => res.landmarks));

  // Convert image to image data.
  imageData = outputImage.toDataURL('image/jpg');
  saveImageFile('output.jpg', imageData);
  console.log('Finished.');
  saveDescriptors(labeledFaceDescriptors, jsonPath);
}

main();
