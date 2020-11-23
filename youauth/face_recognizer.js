const faceAPI = require('face-api.js');
const tf = require('@tensorflow/tfjs-node');
const canvas = require('canvas');
const fs = require('fs');
const path = require('path');

// Current model path. Needs to exist.
const modelPath = './models';

const { Canvas, Image, ImageData } = canvas;
faceAPI.env.monkeyPatch({ Canvas, Image, ImageData });

// Loads the models for face-api. Must be called first before using api.
async function loadModels(){
  await faceAPI.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceAPI.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceAPI.nets.faceRecognitionNet.loadFromDisk(modelPath);
  console.log('Models loaded.');
  return true;
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

// Saved the labeled face descriptors as a json file for later use.
function saveDescriptors(labeledFaceDescriptors, filePath){
  // stringify the array.
  const jsonString = JSON.stringify(labeledFaceDescriptors);
  // Write file to the path.
  fs.writeFileSync(filePath, jsonString);
}

// Load the labeled descriptors from the json file.
function loadDescriptors(filePath){
  // Read json strin from the json file.
  const jsonString = fs.readFileSync(filePath);
  // Parse the json.
  var contents = JSON.parse(jsonString);
  // Initialize new labeledFaceDescriptors array.
  labeledFaceDescriptors = [];
  // For each (label, descriptors).
  contents.forEach((content, i) => {
    // Create new [Float32Array].
    let values = new Float32Array(content.descriptors[0]);
    let arr = [values];
    // Create new LabeledFaceDescriptors using the label and descriptor.
    labeledFaceDescriptors[i] = new faceAPI.LabeledFaceDescriptors(content.label, arr);
  })
  return labeledFaceDescriptors;
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

// Save images to folder. Right now has a default path.
function saveImageFile(fileName, imageData){
  // Remove the image data header.
  var data = imageData.replace(/^data:image\/\w+;base64,/, "");
  // Convert to buffer (sequence of bytes) from base64 (what the image data is encrypted as).
  var buf = Buffer.from(data, 'base64');
  // Save file to images folder.
  fs.writeFileSync(path.resolve('./images', fileName), buf);
}

// Wrapper for loadImage with canvas.
async function loadImage(filePath){
  return await canvas.loadImage(filePath);
}

// Draw matches on image.
function drawFaceDetections(matches, results, outputImage){
  matches.forEach((match, i) => {
    const box = results[i].detection.box;
    const label = match.toString();
    const drawBox = new faceAPI.draw.DrawBox(box, {label:label});
    drawBox.draw(outputImage);
  });
  return outputImage;
}

module.exports = {
  saveImageFile: saveImageFile,
  getMatchedLabels: getMatchedLabels,
  loadDescriptors: loadDescriptors,
  saveDescriptors: saveDescriptors,
  labelDescriptors: labelDescriptors,
  drawFaceDetections: drawFaceDetections,
  loadImage: loadImage,
  loadModels: loadModels,
  faceAPI: faceAPI,
}
