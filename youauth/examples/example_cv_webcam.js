var cv = require('opencv4nodejs');

// The default camera port. #NOTE might need to change for some computers.
const devicePort = 0;
// Set delay of 1 ms to refresh frame.
var delay = 1;

// Load face cascade.
const face_cascade = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);
// Load eye cascade.
const eye_cascade = new cv.CascadeClassifier(cv.HAAR_EYE);

const sortByNumDetections = result => result.numDetections
  .map((num, i) => ({ num, i }))
  .sort(((n0, n1) => n1.num - n0.num))
  .map(({ i }) => i);

// mat objects have function drawRectangle();
// drawRectangle(rect, color, thickness, line);

// Start video capture.
const cap = new cv.VideoCapture(devicePort);
// Variable to quit.
var done = false;

// Set interval for minimum delay (few ms). Sort of like infinite loop until clearInterval is called.
const interval = setInterval(() => {
  // Read frame from cature. Frame is of type mat object.
  let frame = cap.read();

  // If frame is empty loop back to start on end of stream reached.
  if (frame.empty) {
    cap.reset();
    frame = cap.read();
  }

  // Convert frame to grayscale, and use detectMultiScale to figure out bounding rectange dimensions.
  const face_result = face_cascade.detectMultiScale(frame.bgrToGray());

  // Get highest confidence face.
  var face_rect = face_result.objects[sortByNumDetections(face_result)[0]];
  // If nothing is found, then set to empty rectangle.
  if(face_rect == undefined){
    face_rect = new cv.Rect();
  }

  // Print dimensions of rectange and confidence for face detection.
  //console.log('faceRects:', face_result.objects);
  //console.log('face_confidences:', face_result.numDetections);

  const face_region = frame.getRegion(face_rect);

  // Detect eyes in the regions where a face was detected.
  const eye_result = eye_cascade.detectMultiScale(face_region);

  //console.log('eyeRects:', eye_result.objects);
  //console.log('eye_confidences:', eye_result.numDetections);

  // Get the best two matches for eyes.
  const eye_rect = sortByNumDetections(eye_result).slice(0,2).map(i => eye_result.objects[i]);

  /* DRAW RECTANGLES */

  // // Loop through all detections in face_result.
  // face_result.objects.forEach((rect, i) => {
  //   // Example had thickness calculation, not sure what for. Passing just 2 works fine.
  //   const thickness = face_result.numDetections[i] < 10 ? 1 : 2;
  //   // Draw the rectangle with blue lines.
  //   frame.drawRectangle(rect, new cv.Vec(255, 0, 0), thickness, cv.LINE_8);
  // });

  let thickness = 2;

  // Draw face.
  frame.drawRectangle(face_rect, new cv.Vec(255, 0, 0), thickness, cv.LINE_8);
  // Draw eyes.
  eye_rect.forEach(rect => face_region.drawRectangle(rect, new cv.Vec(0, 255, 0), thickness, cv.LINE_8));

  /* DRAW RECTANGLES */

  // Show the frame in a window.
  cv.imshow("FaceCapture(Rapid tap a key to exit)", frame);

  // There is delay for key press to quit.
  const key = cv.waitKey(delay);
  // Check if key is any key, then set done to if its true or not. (No idea what -1 or 255 represent).
  done = key !== -1 && key !== 255;
  if (done) {
    clearInterval(interval);
    console.log('Key pressed, exiting.');
  }
}, 0);
