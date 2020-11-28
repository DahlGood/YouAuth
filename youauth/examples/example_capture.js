// Example of how to use.
function testFunction() {

  const constraints = {
    video: {
      width: 630,
      height: 500,
    },
  }

  var video = document.querySelector('video');
  var capture = document.querySelector('#capture');
  var canvas = document.querySelector('#display');

  faceCapture = new FaceCapture(constraints, video);

  faceCapture.startStream();

  capture.addEventListener("click", function(){
    dataURL = faceCapture.takePicture(canvas);
    console.log(dataURL);
  });
}
