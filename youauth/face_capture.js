class FaceCapture{

  constructor(constraints, video){
    this.constraints = constraints;
    this.video = video;

  }

  // start the video stream.
  async startStream(){
    let videoStream = null;
    try {
      videoStream = await navigator.mediaDevices.getUserMedia(this.constraints);
      // Set the src of the video as the video stream.
      this.video.srcObject = videoStream;
      // Play the video.
      this.video.play();

    } catch(err) {
      console.log(err);
    }
  }

  // Draws the image capture on to a canvas.
  drawCanvas(canvas, video) {
    canvas.width = this.constraints.video.width;
    canvas.height = this.constraints.video.height;
    // Clear the canvas.
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    // Draw the video onto the canvas.
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  // Take a picture of the current video.
  takePicture(){
    const canvas = document.createElement("canvas");
    this.drawCanvas(canvas, this.video);
    // Return data URL of the loaded image.
    return canvas.toDataURL('image/jpg');
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
  var capture = document.querySelector('#capture');
  var canvas = document.querySelector('#display');

  faceCapture = new FaceCapture(constraints, video);

  faceCapture.startStream();

  capture.addEventListener("click", function(){
    dataURL = faceCapture.takePicture(canvas);
    console.log(dataURL);
  });
}

module.exports = {FaceCapture: FaceCapture};
