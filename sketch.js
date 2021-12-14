/**
 * Based on the Processing Video Brightness Tracking example
 * by Golan Levin.
 *
 * Tracks the brightest pixel in a live video signal.
 */

// p5.js Video capture
let myCapture;
// OpenCV capture helper
let myCVCapture;
// (RGBA) Mat to store the latest color camera frame
let myMat;
// Mat to store the grayscale converted camera frame
let myMatGrayscale;
let img1;
let img2;
let img3;
let img4;

function preload() {
  img1 = loadImage('meditation1.jpg');
  img2 = loadImage('meditation2.jpg');
  img3 = loadImage('meditation3.jpg');
  img4 = loadImage('meditation4.jpg');
}

function setup() {
  createCanvas(3840, 1080);
  // setup p5 capture
  myCapture = createCapture(VIDEO);
  myCapture.size(640, 480);
  myCapture.hide();
  // wait for OpenCV to init
  p5.cv.onComplete = onOpenCVComplete;
}

function onOpenCVComplete() {
  // create a CV capture helper
  myCVCapture = p5.cv.getCvVideoCapture(myCapture);
  // create a CV Mat to read new color frames into
  myMat = p5.cv.getRGBAMat(640, 480);
  // create a CV mat for color to grayscale conversion
  myMatGrayscale = new cv.Mat();
}

function draw() {
  background(0);
  if (p5.cv.isReady) {
    // read from CV Capture into myMat
    myCVCapture.read(myMat);
    // convert Mat to grayscale
    p5.cv.copyGray(myMat, myMatGrayscale);
    // display Mat
    p5.cv.drawMat(myMatGrayscale, 0, 0);
    // get brightnest point
    let brightestPoint = p5.cv.findMinLocation(myMatGrayscale);
    // draw brightest point
    circle(brightestPoint.x, brightestPoint.y, 30);

    if(brightestPoint.x < width/2 && brightestPoint.y < height/2) {
      print("LK1");
      image(img1, 0, 0, 1920,height);
    } else if(brightestPoint.x > width/2 && brightestPoint.y < height/2) {
      print("LK2");
      image(img2, 1921, 0, 1920,height);
    } else if (brightestPoint.x < width/2 && brightestPoint.y > height/2) {
      print("LK3");
      image(img3, 0, 0, 1920,height);
    } else if (brightestPoint.x > width/2 && brightestPoint.y > height/2) {
      print("LK4");
      image(img4, 1921, 0, 1920,height);
    }
  } else {
    image(myCapture, 0, 0);
  }
}
