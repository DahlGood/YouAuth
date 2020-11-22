const cv = require('opencv4nodejs');
const path = require('path');
const fs = require('fs');

const face_classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

const imgPath = path.resolve('./images', 'people.jpg');

function getFaceFromImage(grayImg){
  const faceRects = face_classifier.detectMultiScale(grayImg).objects;
  if(faceRects[0] === undefined){
    faceRects[0] = new cv.Rect();
  }
  return grayImg.getRegion(faceRects[0]);
}

function getAllFaces(grayImg){
  const faceRects = face_classifier.detectMultiScale(grayImg);
  return faceRects;
}

function drawAll(faceRects, imageMat){
  faceRects.objects.forEach((faceRect, i) => {
    cv.drawDetection(imageMat, faceRect, {color: new cv.Vec(255,0,0)});
  });
  return imageMat;
}

imageMat = cv.imread(imgPath);
// faceResult = getFaceFromImage(imageMat.bgrToGray());
// cv.imshowWait('sample', faceResult);
faceRects = getAllFaces(imageMat.bgrToGray());
newMat = drawAll(faceRects, imageMat);
cv.imshowWait('sample', newMat);
