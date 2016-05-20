/*****
						
COMMAND		DATA BYTE 1 		DATA BYTE 2 		COMMENT
128-143 	Key # (0-127) 		Off Velocity (0-127) 	Note OFF
144-159 	Key # (0-127) 		On Velocity (0-127) 	Note ON
160-175 	Key # (0-127) 		Pressure (0-127) 	Poly Key Pressure
176-191 	Control # (0-127) 	Control Value (0-127) 	Control Change
192-207 	Program # (0-127) 	-- Not Used -- 		Program Change
208-223 	Pressure Value(0-127)	-- Not Used -- 		Mono Key Pressure (Channel Pressure)
224-239 	Range (LSB) 		Range (MSB) 		Pitch Bend
240-255 	Manufacturer's ID 	Model ID 		System 
						
*****/

var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var midi = require('midi');

// Set up a new output.
var MIDIout = new midi.output();

// Count the available output ports.
MIDIout.getPortCount();

// Get the name of a specified output port.
MIDIout.getPortName(0);

// Setup www client path
var clientPath = './client/www';

http.createServer(function (req, res) {

	var reqUrl = req.url;
	//console.log(reqUrl);
	var reqArr = reqUrl.split("/");
	//console.log(reqArr);
	
	switch(reqArr[1]){
		case 'api':
			//POSTare su questi url le richieste alla API per ottenere risposte in json
			//console.log('api request');
			//console.log(req);
			
			var POST = "";

			req.on("data", function(chunk) {
				POST += chunk;
				//console.log(POST);
				
				
				
				if (POST.length > 1e6){
					req.end("Too much data!");
				}
                		
				var post = qs.parse(POST);
				//console.log(post);
				
				switch(post.control){
					
					case 'midi':
						
						console.log(post.data);
						console.log(post);
						
						// Open the first available output port.
						MIDIout.openPort(0);

						// Send a MIDI message.
						//MIDIout.sendMessage([176,1,0]);
						//MIDIout.sendMessage([176,1,127]);
						
						MIDIout.sendMessage(
							[
							parseInt(post.c),
							parseInt(post.n),
							parseInt(post.v)
							]
						);

						// Close the port when done.
						MIDIout.closePort();
						
						
						var result = {
							
							status:"OK",
							message:"Midi message sent",
							gui:"midi",
						
						}
						
						res.setHeader('Access-Control-Allow-Origin', '*');
						res.setHeader('content-type', 'application/json');
						res.end(JSON.stringify(result));
						
					break;
					
					default:
						res.writeHeader(401);
						res.end();
				}
				
			});
			
		break;
		
		default:
			var filePath = clientPath + reqUrl;
			//console.log('filePath: '+filePath);
			
			if ((filePath == clientPath) || (filePath == clientPath+'/')){
				filePath = clientPath+'/index.html';
			}
				
		
			var extname = path.extname(filePath);
			var contentType = 'text/html';
			switch (extname) {
				case '.html':
					contentType = 'text/html';
					break;
				case '.js':
					contentType = 'text/javascript';
					break;
				case '.css':
					contentType = 'text/css';
					break;
				case '.json':
					contentType = 'application/json';
					break;
				default:
					contentType = 'text/plain';
					
				
			}
	
			fs.exists(filePath, function(exists) {
	
				if (exists) {
					fs.readFile(filePath, function(error, content) {
						if (error) {
							res.writeHead(500);
							res.end();
						}
						else {
							res.writeHead(200, { 'Content-Type': contentType });
							res.end(content, 'utf-8');
						}
					});
				}
				else {
					res.writeHead(404);
					res.end();
				}
			});
	}
	
	
}).listen(1337, '0.0.0.0');
console.log('Server running at http://0.0.0.0:1337/');
