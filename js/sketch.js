var X;
var Y;
var Z;
var rotX = 45;
var rotY = 45;
var rotZ = 45;
var mic;
var fft;

var accumFactor = 36;
var scaleFactor = 10;

var rings = [
	{
		obj:'triA.obj',
		r:'bass',
		g:'lowMid',
		b:'mid',
		rX:'bass',
		rY:'lowMid',
		rZ:'mid',
		S:'bass',
		x:0,
		y:0,
		z:0,
	},
	
	{
		obj:'triA.obj',
		r:'bass',
		g:'lowMid',
		b:'mid',
		rX:'bass',
		rY:'lowMid',
		rZ:'mid',
		S:'bass',
		x:0,
		y:0,
		z:0,
	},
	
	{
		obj:'triA.obj',
		r:'bass',
		g:'lowMid',
		b:'mid',
		rX:'bass',
		rY:'lowMid',
		rZ:'mid',
		S:'bass',
		x:0,
		y:0,
		z:0,
	}
];


var presets = [
	{
		r:'mid',
		g:'lowMid',
		b:'bass',
		rX:'bass',
		rY:'bass',
		rZ:'bass',
	},
	
	{
		r:'bass',
		g:'lowMid',
		b:'mid',
		rX:'mid',
		rY:'mid',
		rZ:'mid',
	},
	
	{
		r:'lowMid',
		g:'mid',
		b:'bass',
		rX:'lowMid',
		rY:'lowMid',
		rZ:'lowMid',
	},
];

function loadPreset(preset, ring){
	
	for(i in presets[preset]){
		rings[ring][i] = presets[preset][i];
	}
	
}


function setup() {

	frameRate(30);
	createCanvas(windowWidth, windowHeight, WEBGL);
  	
  	for(i in rings){
  		rings[i].model = loadModel('obj/'+rings[i].obj);
  	}
  	
	mic = new p5.AudioIn()
	mic.start();
	
	fft = new p5.FFT();
	fft.setInput(mic);
	
	system = new ParticleSystem(createVector(0,0));
	
	
	$(document).on({
		'keyup':function(e){
			console.log(e.which);
			
			switch(e.which){
				case 81: //q
					loadPreset(0,0)
					loadPreset(1,1)
					loadPreset(2,2)
				break;
				
				case 87: //w
					loadPreset(0,2)
					loadPreset(1,1)
					loadPreset(2,0)
				break;
				
				case 69: //e
					loadPreset(0,1)
					loadPreset(1,2)
					loadPreset(2,0)
				break;
				
				
				
				case 65: //a
					system.injectParticles(1500);
				break;
				
				case 83: //s
					system.injectParticles(1500);
				break;
				
				case 68: //d
					system.injectParticles(1500);
				break;
			}
		}
	});
	
	if (navigator.requestMIDIAccess) {
		console.log('Got MIDI!');
		
		navigator.requestMIDIAccess()
		.then(
			function(midi){
				
				var inputs = midi.inputs.values();
				//console.log(inputs);
		
				for (var input = inputs.next();
					input && !input.done;
					input = inputs.next()) {
					
					console.log(input);
					
					// each time there is a midi message call the onMIDIMessage function
					input.value.onmidimessage = function(message){
						console.log(message);
						console.log(message.data);
					}
					
					
				}
				
			},
			
			function(){
				console.log('MIDI FAILED!');
			}
		
		);
		
		
		
	}
	
	
	
}

function draw(){
  
  
	fft.analyze();

	background(000);
	ambientLight(128, 128, 128);
	pointLight(255, 255, 255, 0, 0, 0);
	
	//return;
	//pointLight(255, 255, 255, windowWidth/2, windowHeight/2, -10);
	
	push()
	//rotateZ(frameCount);
	rotX = rotX+(fft.getEnergy('bass')/5000);
	rotateX(rotX);
	
	rotY = rotY+(fft.getEnergy('lowMid')/5000);
	rotateY(rotY);
	
	if(fft.getEnergy('bass') >= 127){
		system.injectParticles(5);
	}
  	system.run();
	pop()
	
	for(i in rings){
		
		scale(i+1,i+1,i+1);
		
		push();
		
		rings[i].z = rings[i].z + (fft.getEnergy(rings[i].rZ) / accumFactor);
		rings[i].y = rings[i].y + (fft.getEnergy(rings[i].rY) / accumFactor);
		rings[i].x = rings[i].x + (fft.getEnergy(rings[i].rX) / accumFactor);
		
		rotateZ(radians(rings[i].z));
		rotateY(radians(rings[i].y));
		rotateX(radians(rings[i].x));
		
		scale(fft.getEnergy(rings[i].S)/scaleFactor,fft.getEnergy(rings[i].S)/scaleFactor,fft.getEnergy(rings[i].S)/scaleFactor);
		
		ambientMaterial(fft.getEnergy(rings[i].r),fft.getEnergy(rings[i].g),fft.getEnergy(rings[i].b));
		
		//specularMaterial(fft.getEnergy(rings[i].r),fft.getEnergy(rings[i].g),fft.getEnergy(rings[i].b));
		
		
		model(rings[i].model);
		
		pop();

	}
	
	
	
	
	
  
}










//var particlesNumber = 1000;
//var pAccX = 1;
//var pAccY = 1;
//var pAccZ = 1;


// A simple Particle class
var Particle = function(position) {
  //this.acceleration = createVector(random(-0.1, 0.1), random(-0.1, 0.1), random(-0.1, 0.1));
  this.acceleration = createVector(random(-0.1, 0.1), 0, random(-0.1, 0.1));
  //this.acceleration = createVector(1,1,1);
  this.velocity = createVector(random(-0.1, 0.1), random(-0.1, 0.1), random(-0.1, 0.1));
  //this.velocity = createVector(0, 0);
  //this.position = position.copy();
  this.position = createVector(0, 0);
  this.lifespan = 255.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){  
  //noise = createVector(random(-width, width), random(-width, width));
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  //this.position.add([random(-1,1), random(-1,1)]);
  //this.position = noise;
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  translate(this.position.x, this.position.y, this.position.z);
  box(10,10,10);
  //plane(10,10)
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};

ParticleSystem.prototype.injectParticles =  function(n){
	for(i=0; i<=n; i++){
		this.addParticle();
	}
}
