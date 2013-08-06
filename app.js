var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	enums = require('./enums');

server.listen(1414);

app.use(express.static(__dirname + '/public'));

var cross = false,
	connected = 0;

io.sockets.on('connection', function (socket) {
	if (connected < 1000){
		var shape = cross === true ? enums.CellStates.Zero : enums.CellStates.Cross;
		connected++;
		socket.emit('shape', shape);
		console.log('connected' + connected + '. shape: ' + shape)
		cross = true;
		socket.on('turn', function (data) {
			io.sockets.emit('turn', data);
		});
		
		socket.on('disconnect', function(){
			io.sockets.emit('opponent:disconnected');
		});
	} else {
		socket.emit('denied');
		socket.disconnect();
	}
});
