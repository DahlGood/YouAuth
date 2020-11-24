const faceAPI = require('face-api.js');
// tensorflow is optional, but makes the code run faster.
const tf = require('@tensorflow/tfjs-node');
const canvas = require('canvas');
const fs = require('fs');
const path = require('path');

// Path to the face detection, face recognition, etc. models.
const modelPath = path.resolve(__dirname, './models');

// Use Nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData.
const { Canvas, Image, ImageData } = canvas;
// Patch the environment for face-api.js to use wrappers provided by canvas.
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
  /*
   * labels is an array of names.
   * refImages is an array of dataURLs or Image Objects.
   *
   * Reference images must have a singular face. Throws error is more than one face found.
  */
  // Make sure labels and regImages are same length.
  if(labels.length !== refImages.length){
    console.error('Labels and images not aligned!');
    return;
  }

  const options = new faceAPI.SsdMobilenetv1Options({minConfidence:0.90});

  return Promise.all(
    // Return new array with LabeledFaceDescriptors(labels, descriptors(Float32Array));
    labels.map(async(label, i) =>{
      const img = await canvas.loadImage(refImages[i]);
      const result = await faceAPI.detectSingleFace(img, options).withFaceLandmarks().withFaceDescriptor();
      /*
        Add code to throw error if singular face confidence is low.
      */
      if(result === undefined){
        console.error('No faces detected in %s.', refImages[i]);
        return;
      }
      const faceDescriptor = [result.descriptor];
      return new faceAPI.LabeledFaceDescriptors(label, faceDescriptor);
    })
  );
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
  /*
   * matches is an array of FaceMatch objects from face-api.js.
   * Each FaceMatch contains a string: label, and a number: distance.
   * Example:
   * [
   *  FaceMatch { _label: 'person1', _distance: 0.35212970923781933 },
   *  FaceMatch { _label: 'person2', _distance: 0.4249780266473695 }
   * ]
  */
  // Create an array of labels that were found (aka not unknown).
  matchedLabels = [];
  // For each FaceMatch object in matches.
  matches.forEach((match, i) => {
    // Get the label of each match.
    label = match._label;
    // By default unknown faces are labeled 'unknown'.
    if(label !== 'unknown'){
      // Add the found label to the array.
      matchedLabels.push(label);
    }
  });
  return matchedLabels;
}

// Saved the labeled face descriptors as a json file for later use.
function saveDescriptors(labeledFaceDescriptors, filePath){
  // stringify the array.
  const jsonString = JSON.stringify(labeledFaceDescriptors);
  // Write file to the path.
  fs.writeFileSync(filePath, jsonString);
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
