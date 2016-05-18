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
	createCanvas(windowWidth, windowHeight, WEBGL);
  	
  	for(i in rings){
  		rings[i].model = loadModel('obj/'+rings[i].obj);
  	}
  	
	mic = new p5.AudioIn()
	mic.start();
	
	fft = new p5.FFT();
	fft.setInput(mic);
	
	
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
	//pointLight(250, 250, 250, windowWidth/2, windowHeight/2, 0);
	pointLight(255, 255, 255, 0, 0, 0);

	//rotateX(radians(rotX));
	//rotateY(radians(rotY));
	//rotateZ(radians(rotZ));

	//basicMaterial(250, 0, 0);
	//ambientMaterial(X,Y,Z);

	//scale(X/scaleFactor,Y/scaleFactor,Z/scaleFactor);
	//scale(X/scaleFactor,X/scaleFactor,X/scaleFactor);
  
	//rotX = rotX + (fft.getEnergy('bass') / accumFactor);
	//rotY = rotY + (fft.getEnergy('lowMid') / accumFactor);
	//rotZ = rotZ + (fft.getEnergy('mid') / accumFactor);

	//rotateZ(radians(rotZ));
	//rotateY(radians(rotY));
	//rotateX(radians(rotX));
	
	
	for(i in rings){
		
		scale(i+1,i+1,i+1);
		
		push();
		
		rings[i].z = rings[i].z + (fft.getEnergy(rings[i].rZ) / accumFactor);
		rings[i].y = rings[i].y + (fft.getEnergy(rings[i].rY) / accumFactor);
		rings[i].x = rings[i].x + (fft.getEnergy(rings[i].rX) / accumFactor);
		
		rotateZ(radians(rings[i].z));
		rotateY(radians(rings[i].y));
		rotateX(radians(rings[i].x));
		//rotate(fft.getEnergy(rings[i].rX));
		
		//translate(1,1,1);
		//rotateZ(radians(1));
		
		scale(fft.getEnergy(rings[i].S)/scaleFactor,fft.getEnergy(rings[i].S)/scaleFactor,fft.getEnergy(rings[i].S)/scaleFactor);
		
		ambientMaterial(fft.getEnergy(rings[i].r),fft.getEnergy(rings[i].g),fft.getEnergy(rings[i].b));
		
		//console.log(radians(fft.getEnergy(rings[i].rX)))
		model(rings[i].model);
		
		pop();

	}
  
}
