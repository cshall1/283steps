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

let darkestPoint;

let zoneOne = {
    box: {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
    },
    isActive: false,
    name: 'LK1',
};

let zoneTwo = {
    box: {
    x: 0,
    y: 0,
    width: 590,
    height: 430,
    },
    isActive: false,
    name: 'LK2',
};

let zoneThree = {
    box: {
    x: 0,
    y: 0,
    width: 590,
    height: 50,
    },
    isActive: false,
    name: 'LK3',
};

let zoneFour = {
    box: {
    x: 0,
    y: 0,
    width: 50,
    height: 430,
    },
    isActive: false,
    name: 'LK4',
};

let zoneArray = [zoneOne, zoneTwo, zoneThree, zoneFour];

//sounds
var len;
let randSound;
let bellSounds = [];
let dingSounds = [];
let bassSounds = [];
let singingSounds = [];
let meditationVoiceLoop;

function playRandomSound(sounds, volume) {
    randSound = random(sounds);
    randSound.setVolume(volume);
    
    if(!randSound.isPlaying() && randSound.isLoaded()) {
        randSound.play();
        console.log("playing")
    }  
}

function activateZone(zone) {
    zone.isActive = true;
    
    if(zone == zoneOne) {
        playRandomSound(bellSounds, 0.1);
        //image(img1, 0, 0, 1920,height);
    }
    
    if(zone == zoneTwo) {
        playRandomSound(singingSounds, 0.1);
        //image(img2, 1921, 0, 1920,height);
    }
    
    if(zone == zoneThree) {
        playRandomSound(dingSounds, 0.8);
        //image(img3, 0, 0, 1920,height);
    }
    
    if(zone == zoneFour) {
        playRandomSound(bassSounds, 0.5);
        //image(img4, 1921, 0, 1920,height);
    }
    
    print(zone.name, " was just activated");
}

function deactivateZone (zone) {
    zone.isActive = false;
    print(zone.name, " was just de-activated");
}

function isDarkestPointInZone(zone) {
    if(darkestPoint.x < zone.box.width+zone.box.x && darkestPoint.y < zone.box.height+zone.box.y) {
        return true;
    } else {
        return false;
    }
}

function queueVoiceLoopAndPlayVoiceFaces() {
    console.log("starting voice faces");
    meditationVoiceFaces.onended(queueVoiceFacesAndPlayVoiceLoop);
    meditationVoiceFaces.play();
}

function queueVoiceFacesAndPlayVoiceLoop() {
    console.log("starting voice loop");
    meditationVoiceLoop.onended(queueVoiceLoopAndPlayVoiceFaces);
    meditationVoiceLoop.play();
}

function setup() {
    createCanvas(3840, 1080);
    // setup p5 capture
    myCapture = createCapture(VIDEO);
    myCapture.size(1280, 720);
    myCapture.hide();
    // wait for OpenCV to init
    p5.cv.onComplete = onOpenCVComplete;

    img1 = loadImage('meditation1.jpg');
    img2 = loadImage('meditation2.jpg');
    img3 = loadImage('meditation3.jpg');
    img4 = loadImage('meditation4.jpg');
    
    bellSounds.push(loadSound("bell_C.wav"));
    bellSounds.push(loadSound("bell_FS.wav"));
    bellSounds.push(loadSound("bell_A.wav"));
    
    singingSounds.push(loadSound("voice1.mp3"));
    singingSounds.push(loadSound("voice2.mp3"));
    singingSounds.push(loadSound("voice3.mp3"));
    singingSounds.push(loadSound("voice4.mp3")); 
    
    dingSounds.push(loadSound("ding_AS.wav"));
    dingSounds.push(loadSound("ding_FS.wav"));
    dingSounds.push(loadSound("ding_DS.wav"));
    
    bassSounds.push(loadSound("bassInOut.wav"));
    
    meditationVoiceLoop = loadSound("voice_loop.wav", queueVoiceFacesAndPlayVoiceLoop);
    meditationVoiceFaces = loadSound("voice_with_images.wav");
}

function onOpenCVComplete() {
    // create a CV capture helper
    myCVCapture = p5.cv.getCvVideoCapture(myCapture);
    // create a CV Mat to read new color frames into
    myMat = p5.cv.getRGBAMat(1280, 720);
    // create a CV mat for color to grayscale conversion
    myMatGrayscale = new cv.Mat();
}

let i;
let zone;

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
    darkestPoint = p5.cv.findMinLocation(myMatGrayscale);
    // draw brightest point
    //circle(brightestPoint.x, brightestPoint.y, 30);
  
    for (i = 0; i < zoneArray.length; i+=1) {
        zone = zoneArray[i];

        if(isDarkestPointInZone(zone) && zone.isActive == false) {
            activateZone(zone);
        } else if(!isDarkestPointInZone(zone) && zone.isActive == true) {
            deactivateZone(zone);
        }
    }
    
    if(darkestPoint.x < 640 && darkestPoint.y < 360) {
      image(img1, 0, 0, 1920,height);
    } 
    if(darkestPoint.x >= 640 && darkestPoint.y < 360) {
      image(img2, 1921, 0, 1920,height);
    } 
//     if (darkestPoint.x < 640 && darkestPoint.y >= 360) {
//       image(img3, 0, 0, 1920,height);
//     } 
//     if (darkestPoint.x >= 640 && darkestPoint.y >= 360) {
//       image(img4, 1921, 0, 1920,height);
//     }
  }
}
