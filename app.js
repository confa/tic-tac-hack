var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	enums = require('./enums'),
	_ = require('underscore'),
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
		socket.broadcast.emit('game-added', game);
		socket.join('game-' + game.id);
	});

	socket.on('join', function (data) {
		var game = games.join(data);

		if (game){
			var roomName = 'game-' + game.id;
			io.sockets.emit('game-removed', game);
			socket.join(roomName);

			var participants = io.sockets.in(roomName).sockets;
			var participantsIds = _.keys(participants); 
			game.shape = Math.floor(Math.random() * 2);
			participants[participantsIds[0]].emit('game-started', game);
			game.shape = +!game.shape;
			participants[participantsIds[1]].emit('game-started', game);
		}
	});

	socket.on('turn', function(data){
		var rooms = io.sockets.manager.roomClients[socket.id];
		var roomName;
		for (var i in rooms){ 
			if (i !== ''){
				roomName = i.substring(1);
				break;
			}
		}
		if (typeof roomName !== 'undefined'){
			io.sockets.in(roomName).emit('turn', data);
		}
	});
});
