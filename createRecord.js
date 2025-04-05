let sound, fft;
let peaks = [];

// params
let samplingRate = 44100;
let rpm = 45.0;
let amplitude = 10;
let spacing = 10;
let minDist = 6.0;
let thetaIter = 5880;
let innerHole = 0.286;
let innerRad = 2.25;
let outerRad = 5.75;
let scaleNum = 72;
let lineWidth = 0.1;
let diameter = 11.8;

let secPerMin = 60;
let uploadedFile;
let cutlines = true;
let dpi = 1200;

let waveform = [];
let uploaded = false;
let doDraw = false;
let svgContent = "";

//scale pixel distances
amplitude =  amplitude/dpi*scaleNum;
minDist =  minDist/dpi*scaleNum;
spacing =  spacing/dpi*scaleNum;

function preload() {
}

function createControl(label, defaultValue, positionY, callback) {
  let div = createDiv(label);
  div.position(10, positionY);
  let input = createInput(defaultValue.toString(), 'number');
  input.position(150, positionY);
  input.style('width', '50px');
  input.input(() => callback(parseFloat(input.value())));
}

function refreshDrawing() {
  doDraw = true;
  loop();
}

function setup() {
  let cnv = createCanvas(diameter * scaleNum, diameter * scaleNum, SVG);
  cnv.position(250, 0)
  let uploadButton = createFileInput(handleFile);
  uploadButton.position(10, 10);
  let saveButton = createButton("Save file");
  saveButton.mousePressed(saveOutput);
  saveButton.position(10, 40);
  let refreshButton = createButton("Update Record")
  refreshButton.mousePressed(refreshDrawing)
  refreshButton.position(90, 40)
  

  // Create controls
  let startY = 90;
  let gap = 30;
  createControl("Sampling Rate", samplingRate, startY, (val) => samplingRate = val);
  createControl("RPM", rpm, startY + gap, (val) => rpm = val);
  createControl("Amplitude", amplitude, startY + 2 * gap, (val) => amplitude = val);
  createControl("Spacing", spacing, startY + 3 * gap, (val) => spacing = val);
  createControl("Min Distance", minDist, startY + 4 * gap, (val) => minDist = val);
  createControl("Inner Hole", innerHole, startY + 5 * gap, (val) => innerHole = val);
  createControl("Inner Radius", innerRad, startY + 6 * gap, (val) => innerRad = val);
  createControl("Outer Radius", outerRad, startY + 7 * gap, (val) => outerRad = val);
  createControl("Line Width", lineWidth, startY + 8 * gap, (val) => lineWidth = val);
  createControl("Diameter", diameter, startY + 9 * gap, (val) => diameter = val);
  
}
  
function draw() {
  background(255);

  if (doDraw) {
    drawSpiralWaveform();
    isDrawing = false;
    noLoop(); // we just want to export once
    doDraw = false;
  }
}

function saveOutput() {
  save("mySVG.svg"); // give file name
}

function handleFile(file) {
    if (file.type === 'audio') {
        uploadedFile = file;
        sound = loadSound(uploadedFile.data, analyzeAudio)
        loop()
    }
  }

function analyzeAudio() {
  let duration = sound.duration();
  let numSamples = Math.floor(samplingRate * duration);
  peaks = sound.getPeaks(numSamples);
  doDraw = true;
}

function drawSpiralWaveform() {
    noFill();
    stroke(255, 0, 0);
    strokeWeight(lineWidth);
  
    let incrNum = TWO_PI / thetaIter;
    let radIncrNum = (2*amplitude + spacing) / thetaIter;
    let radius = outerRad * scaleNum;
    
    beginShape();
    let index = 0;
    let indexIncr = Math.floor((samplingRate * secPerMin / rpm) / thetaIter);
  
    // initial empty groove
    for (let theta = 0; theta < TWO_PI; theta += incrNum) {
      let radCalc = radius;
      let x = width / 2 + radCalc * cos(theta);
      let y = height / 2 - radCalc * sin(theta);
      vertex(x, y);
      radius -= radIncrNum;
    }

    endShape()
  
    // main body of record
    while (radius > innerRad * scaleNum && index < peaks.length - thetaIter * indexIncr) {
      beginShape()
      for (let theta = 0; theta < TWO_PI; theta += incrNum) {
        let radCalc = radius + peaks[index] * amplitude;
        index += indexIncr;
        let x = width / 2 + radCalc * cos(theta);
        let y = height / 2 - radCalc * sin(theta);
        vertex(x, y);
        radius -= radIncrNum;
      }
      endShape()
    }
  
    // silent inner locked groove
    beginShape()
    for (let theta = 0; theta < TWO_PI; theta += incrNum) {
      let radCalc = radius;
      let x = width / 2 + radCalc * cos(theta);
      let y = height / 2 - radCalc * sin(theta);
      vertex(x, y);
      radius -= radIncrNum;
    }
    endShape();

    if (cutlines){
      //draw cut lines (100 units = 1")
      stroke(0);//draw in black
      ellipse(width/2, height/2,innerHole*scaleNum,innerHole*scaleNum);//0.286" center hole
      ellipse(width/2, height/2,diameter*scaleNum,diameter*scaleNum);//12" diameter outer edge 
    }
}
