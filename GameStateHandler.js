module.exports = GameStateHandler;

var cross = false,
	connected = 0;

var io,
	games = new (require('./Games'))(),
	enums = require('./enums'),
	_ = require('underscore');

function GameStateHandler(server){
	io = require('socket.io').listen(server);
	var self = this;

	io.set('log level', 0);

	io.sockets.on('connection', function (socket) {

		socket.emit('games-list', games.getPending());

		socket.on('new-game', function (data) {
			self.onNewGame(data, socket);
		});

		socket.on('join', function (data) {
			self.onJoin(data, socket);
		});

		socket.on('turn', function(data){
			self.onTurn(data, socket);
		});

		socket.on('game-over', function(data){
			self.onGameOverTurn(data, socket);
		});

		socket.on('disconnect', function () {
			self.onDisconnect(socket);
		});
	});

}

GameStateHandler.prototype.onJoin = function(game, socket) {
	var game = games.join(game);

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
}

GameStateHandler.prototype.onTurn = function(data, socket) {
	var room = getRoomForSocket(socket);
	if (typeof room !== 'undefined'){
		io.sockets.in(room).emit('turn', data);
	}
}

GameStateHandler.prototype.onNewGame = function(data, socket) {
	var game = games.add(data);
	socket.broadcast.emit('game-added', game);
	socket.join('game-' + game.id);
};

GameStateHandler.prototype.onDisconnect = function(socket) {
	var room = getRoomForSocket(socket);
	if (typeof room !== 'undefined'){
		io.sockets.in(room).emit('partner-disconnected');
		var id = parseInt(room.substring(5));
		if (!isNaN(id)){
			var game = games.getById(id);
			if (game){
				if (game.started){
					games.finish(game);
				} else {
					games.remove(game);
					io.sockets.emit('game-removed', game);
				}
			}
		}
	}
};

function getRoomForSocket(socket){
	var rooms = io.sockets.manager.roomClients[socket.id];
	var roomName;
	for (var i in rooms){ 
		if (i !== ''){
			roomName = i.substring(1);
			break;
		}
	}
	return roomName;
}