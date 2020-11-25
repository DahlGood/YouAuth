// npm install 'path_to_youauth'.
const youauth = require('youauth');

const jsonPath = './jsons/descriptor.json';

async function main(){

  // console.log(youauth.FaceRecognizer);

  // Load the face detection and recognition models.
  await youauth.loadModels();

  // Load the descriptor.json file. Currently made with one photo of trump and biden.
  // labeledFaceDescriptors = youauth.FaceRecognizer.loadDescriptors(jsonPath);

  const newRecognizer = new youauth.FaceRecognizer();

  const labels = ['trump', 'biden'];
  const refImages = ['./images/trump.jpg', './images/biden.jpg'];

  const labeledFaceDescriptors = await newRecognizer.labelDescriptors(labels, refImages);

  // Load the image that we want to detect faces in. Returns Image object from canvas.
  const testImage = await newRecognizer.loadImage('./images/test_image3.jpg');

  // Print to make sure an image was returned.
  console.log(testImage);

  // Using the faceAPI, detect them faces. Can definitely be shortened.
  const results = await newRecognizer.detect(testImage);

  // Map the descriptors in the results with the descriptor of best match.
  const matches = newRecognizer.getMatches(results, labeledFaceDescriptors);

  // Get the labels that were found.
  const matchedLabels = newRecognizer.getMatchedLabels(matches);

  // Make a copy of testImage to draw detections on.
  const newImage = youauth.createCanvas(testImage);

  // Draw the detections on image.
  const outputImage = newRecognizer.drawFaceDetections(matches, results, newImage);

  // Convert to dataURL.
  imageData = outputImage.toDataURL('image/jpg');

  // Save file. Currently hard code to save in ./images.
  newRecognizer.saveImageFile('output.jpg', imageData);

  // Check output.jpg for results!
  console.log("Found People: " + matchedLabels);

  console.log('Done');
}

main();
