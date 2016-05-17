var X;
var Y;
var Z;
var rotX = 45;
var rotY = 45;
var rotZ = 45;
var mic;
var fft;

var accumFactor = 36;



function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
  
	mic = new p5.AudioIn()
	mic.start();
	
	fft = new p5.FFT();
	fft.setInput(mic);
}

function draw(){
  
  
  //var spectrum = 
  //console.log(spectrum);
  fft.analyze();
  X = fft.getEnergy('bass');
  Y = fft.getEnergy('lowMid');
  Z = fft.getEnergy('mid');
  //console.log(fft.getEnergy('bass'));
  
  rotX = rotX + (fft.getEnergy('bass') / accumFactor);
  rotY = rotY + (fft.getEnergy('lowMid') / accumFactor);
  rotZ = rotZ + (fft.getEnergy('mid') / accumFactor);
  
  background(000);
  ambientLight(128, 128, 128);
  //pointLight(250, 250, 250, windowWidth/2, windowHeight/2, 0);
  
  pointLight(255, 255, 255, 0, 0, 0);
  
  rotateX(radians(rotX));
  rotateY(radians(rotY));
  rotateZ(radians(rotZ));
  
  //basicMaterial(250, 0, 0);
  ambientMaterial(128,128,128);
  
  box(X, Y, Z);
}
