var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	enums = require('./enums'),
	games = new (require('./Games'))();

server.listen(1414);

app.use(express.static(__dirname + '/public'));

var cross = false,
	connected = 0;

io.set('log level', 0);

io.sockets.on('connection', function (socket) {

	socket.emit('games-list', games.getPending());

	socket.on('new-game', function (data) {
		var game = games.add(data);
		io.sockets.emit('game-added', game);
		socket.join('game-' + game.id);
	});

	socket.on('join', function (data) {
		var game = games.join(data);

		if (game){
			var roomName = 'game-' + game.id;
			io.sockets.emit('game-removed', game);
			socket.join(roomName);
			io.sockets.in(roomName).emit('game-started', game);
		}
	});

	socket.on('turn', function(data){
		var roomName = io.sockets.manager.roomClinents[socket.id][1];
		io.sockets.in('game-' + roomName).emit('turn', data);
	});
});
