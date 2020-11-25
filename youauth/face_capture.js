class FaceCapture{

  constructor(constraints, video){
    this.constraints = constraints;
    this.video = video;
    this.imageCapture = null;
  }

  // start the video stream.
  async startStream(){
    let videoStream = null;
    try {
      videoStream = await navigator.mediaDevices.getUserMedia(this.constraints);
      // Set the src of the video as the video stream.
      this.video.srcObject = videoStream;
      this.video.play();

      const track = videoStream.getVideoTracks()[0];
      this.imageCapture = new ImageCapture(track);

    } catch(err) {
      console.log(err);
    }
  }

  // Draws the image capture on to a canvas.
  drawCanvas(canvas, imageBitmap) {
    canvas.width = 630;
    canvas.height = 500;
    canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height);
    canvas.getContext('2d').drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
  }

  // Show the captured image on a canvas.
  showCapture(canvas) {
    this.imageCapture.takePhoto()
    .then(blob => createImageBitmap(blob))
    .then(imageBitmap => {
      this.drawCanvas(canvas, imageBitmap);
    })
    .catch(err => console.log(err));
  }
}

// Example of how to use.
function testFunction() {

  const constraints = {
    video: {
      width: 630,
      height: 500,
    },
  }

  var video = document.querySelector('video');
  var imageBitmap;
  var capture = document.querySelector('#capture');
  var canvas = document.querySelector('#display');

  faceCapture = new FaceCapture(constraints, video);

  faceCapture.startStream();

  capture.addEventListener("click", function(){
    faceCapture.showCapture(canvas);
  });
}

module.exports = {FaceCapture: FaceCapture};
