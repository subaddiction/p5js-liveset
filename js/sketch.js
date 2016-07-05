var X;
var Y;
var Z;
var rotX = 45;
var rotY = 45;
var rotZ = 45;
var mic;
var fft;
var particleID = 0;
var particles_size = 10;
var particles_resize = 10;

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
	var p_color;
	
	var p_number = 120;
	
	
	$(document).on({
		'keyup':function(e){
			//console.log(e.which);
			
			
			
			//p_color = null;
			
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
					p_color = color(fft.getEnergy('bass'),fft.getEnergy('mid'),fft.getEnergy('treble'));
					system.injectParticles(p_number, p_color);
				break;
				
				case 83: //s
					p_color = color(fft.getEnergy('treble'),fft.getEnergy('mid'),fft.getEnergy('bass'));
					system.injectParticles(p_number, p_color);
				break;
				
				case 68: //d
					p_color = color(fft.getEnergy('mid'),fft.getEnergy('bass'),fft.getEnergy('treble'));
					system.injectParticles(p_number, p_color);
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
  	
  	var push_particles = 3;
  	var push_treshold = 127;
  	
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
	
	if(fft.getEnergy('bass') >= push_treshold){
		var bass_color = color(fft.getEnergy('bass'),fft.getEnergy('mid'),fft.getEnergy('treble'));
		system.injectParticles(push_particles, bass_color);
	}
	
	if(fft.getEnergy('mid') >= push_treshold){
		var mid_color = color(fft.getEnergy('mid'),fft.getEnergy('bass'),fft.getEnergy('treble'));
		system.injectParticles(push_particles, mid_color);
	}
	
	if(fft.getEnergy('treble') >= push_treshold){
		var treble_color = color(fft.getEnergy('treble'),fft.getEnergy('mid'),fft.getEnergy('bass'));
		system.injectParticles(push_particles, treble_color);
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
var Particle = function(id, position, pcolor) {
  //console.log(id%4);
//  var quadrant = id%2;
  
//  var randX = random(-100, 100)/1000;
//  var randZ = random(-100, 100)/1000;

//  var minimo = -96;
//  var maximo = 96;
//  
//  var randX = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo; //Math.random();
//  var randZ = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;

//  randX = randX/1000;
//  randZ = randZ/1000;

//  this.acceleration = createVector(randX, 0, randZ);
//  this.velocity = createVector(randX, 0, randZ);

  //this.acceleration = createVector(random(-0.1, 0.1), 0, random(-0.1, 0.1));
  //this.velocity = createVector(random(-0.1, 0.1), 0, random(-0.1, 0.1));
  
  //this.position = position.copy();
  this.position = createVector(0, 0);
  this.lifespan = 60.0;
  
  var velocityRange = 100;
  var velocityFactor = 0.1;
  
  var randomX = (random(0, velocityRange)-(velocityRange/2))*velocityFactor; //random(-36,36)/36;
  var randomY = (random(0, velocityRange)-(velocityRange/2))*velocityFactor; //random(-36,36)/36;
  
//  console.log(randomX+' '+randomY);
//  randomX = randomX - 0.05;
//  randomY = randomY - 0.05;
  
  this.velocity = createVector(randomX,randomY);
  this.acceleration = createVector(randomX,randomY);

//  if(!p_color){
//  	this.color = color(fft.getEnergy('bass'),fft.getEnergy('bass'),fft.getEnergy('bass'));
//  } else {
//  	this.color = p_color;
//  }

  this.pcolor = pcolor;

  
  
  //console.log(fft.getEnergy('bass'));
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
  //console.log(this);
};

// Method to display
Particle.prototype.display = function() {
  
  push();
  fill(this.pcolor);
  translate(this.position.x, this.position.y, this.position.z);
  sphere(particles_resize);
  //box(10,10,10);
  //plane(10,10)
  pop();
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

ParticleSystem.prototype.addParticle = function(pcolor) {
  this.particles.push(new Particle(particleID, this.origin, pcolor));
  particleID++;
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

ParticleSystem.prototype.injectParticles =  function(n, c){
	for(i=0; i<n; i++){
		particles_resize = random(2,20);
		this.addParticle(c);
	}
}
