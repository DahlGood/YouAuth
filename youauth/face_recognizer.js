const faceAPI = require('face-api.js');
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

// FaceRecognizer Object constructor.
function FaceRecognizer(){
  // Minimum confidence for valid face. Higher means less chance of wrong detections.
  this.minConfidence = 0.9;
  // Not sure what this does yet.
  this.faceMatchConfidence = 0.8;
}

// Gather descriptive features of reference images.
FaceRecognizer.prototype.labelDescriptors = function labelDescriptors(labels, refImages){
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
  // Use SSD MobileNet Face Detection for higher accuracy.
  const options = new faceAPI.SsdMobilenetv1Options({minConfidence: this.minConfidence });
  // Return array of LabeledFaceDescriptors objects. Each has a label and a Float32Array (descriptors).
  return Promise.all(
    labels.map(async(label, i) =>{
      const img = await canvas.loadImage(refImages[i]);
      const result = await faceAPI.detectSingleFace(img, options).withFaceLandmarks().withFaceDescriptor();
      /*
        Add code to throw error if singular face confidence is low.
      */
      if(result === undefined){
        console.error('No faces detected in.');
        return;
      }
      const faceDescriptor = [result.descriptor];
      return new faceAPI.LabeledFaceDescriptors(label, faceDescriptor);
    })
  );
}

// Load the labeled descriptors from the JSON.stringified LabeledFaceDescriptors object.
FaceRecognizer.prototype.loadDescriptors = function loadDescriptors(jsonString){
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
FaceRecognizer.prototype.getMatchedLabels = function getMatchedLabels(matches){
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

// Detects faces in image using face-api.js.
FaceRecognizer.prototype.detect = async function detect(img){
  const detectionResults = await faceAPI.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
  return detectionResults;
}

// Get the matches from face detection results using face-api.js.
FaceRecognizer.prototype.getMatches = function getMatches(detectionResults, labeledFaceDescriptors){
  // Create a faceMatcher using the labeled descriptors.
  const faceMatcher = new faceAPI.FaceMatcher(labeledFaceDescriptors, this.faceMatchConfidence);
  // Map the descriptors in the results with the descriptor of best match.
  const matches = detectionResults.map(fd => faceMatcher.findBestMatch(fd.descriptor));
  return matches;
}

// Saved the labeled face descriptors as a json file for later use.
FaceRecognizer.prototype.saveDescriptors = function saveDescriptors(labeledFaceDescriptors, filePath){
  // stringify the array.
  const jsonString = JSON.stringify(labeledFaceDescriptors);
  // Write file to the path.
  fs.writeFileSync(filePath, jsonString);
}

// Save images to folder. Right now has a default path.
FaceRecognizer.prototype.saveImageFile = function saveImageFile(fileName, imageData){
  // Remove the image data header.
  var data = imageData.replace(/^data:image\/\w+;base64,/, "");
  // Convert to buffer (sequence of bytes) from base64 (what the image data is encrypted as).
  var buf = Buffer.from(data, 'base64');
  // Save file to images folder.
  fs.writeFileSync(path.resolve('./images', fileName), buf);
}

// Wrapper for loadImage with canvas.
FaceRecognizer.prototype.loadImage = async function loadImage(filePath){
  return canvas.loadImage(filePath);
}

// Draw matches on image.
FaceRecognizer.prototype.drawFaceDetections = function drawFaceDetections(matches, results, outputImage){
  matches.forEach((match, i) => {
    const box = results[i].detection.box;
    const label = match.toString();
    const drawBox = new faceAPI.draw.DrawBox(box, {label:label});
    drawBox.draw(outputImage);
  });
  return outputImage;
}

function createCanvas(img){
  return faceAPI.createCanvasFromMedia(img);
}

module.exports = {
  FaceRecognizer: FaceRecognizer,
  createCanvas: createCanvas,
  loadModels: loadModels,
}
