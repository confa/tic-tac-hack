var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	enums = require('./enums'),
	games = new (require('./Games'))();

server.listen(5858);

app.use(express.static(__dirname + '/public'));

var cross = false,
	connected = 0;

io.sockets.on('connection', function (socket) {

	socket.emit('games-list', games.list);

	socket.on('new-game', function (data) {
		var game = games.add(data);
		io.sockets.emit('game-added', game);
	});

	socket.on('join', function (data) {
		var game = games.join(data);
		if (game){
			io.sockets.emit('game-started', game);
		}
	});

	if (connected < 1000){
		var shape = cross === true ? enums.CellStates.Zero : enums.CellStates.Cross;
		connected++;
		socket.emit('shape', shape);
		console.log('connected' + connected + '. shape: ' + shape);
		cross = true;
		socket.on('turn', function (data) {
			io.sockets.emit('turn', data);
		});

		
		// socket.on('disconnect', function(){
		// 	io.sockets.emit('opponent:disconnected');
		// });
	} else {
		socket.emit('denied');
		socket.disconnect();
	}
});
