function midiMsg(c,n,v){
	$.post('http://0.0.0.0:1337/api/', {control:'midi',c:c,n:n,v:v}, function(r){
		console.log(r);
	});
}
