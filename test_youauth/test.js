// npm install 'path_to_youauth'.
const youauth = require('youauth');

const jsonPath = './jsons/descriptor.json';

async function main(){

  // console.log(youauth.FaceRecognizer);

  // Load the face detection and recognition models.
  await youauth.FaceRecognizer.loadModels();

  // Load the descriptor.json file. Currently made with one photo of trump and biden.
  labeledFaceDescriptors = youauth.FaceRecognizer.loadDescriptors(jsonPath);

  // Load the image that we want to detect faces in. Returns Image object from canvas.
  const testImage = await youauth.FaceRecognizer.loadImage('./images/test_image3.jpg');

  // Print to make sure an image was returned.
  console.log(testImage);

  // Using the faceAPI, detect them faces. Can definitely be shortened.
  const results = await youauth.FaceRecognizer.faceAPI.detectAllFaces(testImage).withFaceLandmarks().withFaceDescriptors();

  // Create a faceMatcher using the labeled descriptors.
  const faceMatcher = new youauth.FaceRecognizer.faceAPI.FaceMatcher(labeledFaceDescriptors, 0.6);

  // Map the descriptors in the results with the descriptor of best match.
  const matches = results.map(fd => faceMatcher.findBestMatch(fd.descriptor));

  // Get the labels that were found.
  const matchedLabels = youauth.FaceRecognizer.getMatchedLabels(matches);

  // Make a copy of testImage to draw detections on.
  const newImage = youauth.FaceRecognizer.faceAPI.createCanvasFromMedia(testImage);

  // Draw the detections on image.
  const outputImage = youauth.FaceRecognizer.drawFaceDetections(matches, results, newImage);

  // Convert to dataURL.
  imageData = outputImage.toDataURL('image/jpg');

  // Save file. Currently hard code to save in ./images.
  youauth.FaceRecognizer.saveImageFile('output.jpg', imageData);

  // Check output.jpg for results!
  console.log("Found People: " + matchedLabels);

  console.log('Done');
}

main();
