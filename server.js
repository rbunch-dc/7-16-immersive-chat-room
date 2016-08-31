var http = require("http");
var fs = require("fs");

//server is the what happens when someone loads up the page in a browser.
//server is listening below for http traffic at port XXXX
var server = http.createServer(function(req, res){


	if(req.url === '/styles.css'){
		// fs.readFile('styles.css', 'utf-8', function(error, data){
		// 	// console.log(error);
		// 	// console.log(data);
		// 	if(error){
		// 		res.writeHead(500, {'content-type': 'text/html'});
		// 		res.end(error);
		// 	}else{
		// 		res.writeHead(200, {'content-type': 'text/html'});
		// 		res.end(data);
		// 	});
	}

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
var socketUsers = [];
var chatHistory = [];
var currentCanvas = [];

//We need to deal wiht a new socket connection
io.sockets.on('connect', function(socket){
	// console.log(socket.id)
	// console.log(socket);
	socketUsers.push({
		socketID: socket.id,
		name: 'Anonymous'
	});

	io.sockets.emit('users',socketUsers);	

	// console.log(socket);
	console.log("Someone connected via a socket!");

	//Someone just changed their name.
	socket.on('name_to_server', function(name){
		console.log(socket.id);
		for(var i = 0; i<socketUsers.length; i++){
			if(socketUsers[i].socketID == socket.id){
				socketUsers[i].name = name;
				break;
			}
		}
		io.sockets.emit('users',socketUsers);
	});


	socket.on('message_to_server', function(data){
		io.sockets.emit('message_to_client',{
			message: data.message,
			name: data.name,
			date: data.date
		});
	});

	socket.on('drawing_to_server',function(drawingData){
		if(drawingData.lastMousePosition !== null){
			io.sockets.emit('drawing_to_client', drawingData);
		}
	})

//HEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHERE	
	socket.on('disconnect', function(){
		console.log(socket.id + " -- user has disconnected");
		for(var i = 0; i<socketUsers.length; i++){
			if(socketUsers[i].socketID == socket.id){
				socketUsers.splice(i, 1);
				break;
			}
		}
		io.sockets.emit('users',socketUsers);	
	});
//HEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHEREHERE
});

server.listen(8080);
console.log('Listening on Port 8080.');