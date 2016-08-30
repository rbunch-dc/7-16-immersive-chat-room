var http = require("http");
var fs = require("fs");

//server is the what happens when someone loads up the page in a browser.
//server is listening below for http traffic at port XXXX
var server = http.createServer(function(req, res){
	console.log("Someone connected via http");
	fs.readFile('index.html', 'utf-8', function(error, data){
		// console.log(error);
		// console.log(data);
		if(error){
			res.writeHead(500, {'content-type': 'text/html'});
			res.end(error);
		}else{
			res.writeHead(200, {'content-type': 'text/html'});
			res.end(data);
		}
	});
});

//Include the socketio module
var socketIo = require('socket.io');
// listen to the server which is listening on port XXXX
var io = socketIo.listen(server);
//We need to deal wiht a new socket connection
io.sockets.on('connect', function(socket){
	// console.log(socket);
	console.log("Someone connected via a socket!");
	socket.on('message_to_server', function(data){
		console.log('Someone senet a message to the server!!');
	});
});

server.listen(8080);
console.log('Listening on Port 8080.');