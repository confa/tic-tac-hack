define(function(require) {
	'use strict';

	var game = require('./Game'),
		io = require('socketio'),
		_ = require('underscore'),
		mediator = require('libs/mediator'),
		Sockiator = require('shared/Sockiator');


	var self;
	function SocketHandler() {
		self = this;
		this.socket = io.connect('http://localhost:1414');

		mediator.on('game:turn-local', function(data){
			delete data.cellDiv;
			self.socket.emit('turn', data);
		});
	}

	SocketHandler.prototype = _.extend(SocketHandler.prototype, Sockiator.prototype);

	var socketHandler = new SocketHandler();

	socketHandler
		.in({
			'turn': 'socket:turn-network',
			'games-list': 'socket:games-list',
			'game-added': 'socket:game-added',
			'game-removed': 'socket:game-removed',
			'game-started': 'socket:game-started',
			'denied': 'socket:denied',
			'partner-disconnected': 'socket:disconnected'
		})
		.out({
			'game-controller:new-network':'new-game',
			'game-list:join':'join',
			'view-manager:left-game' : 'left-game'
		});

	return socketHandler;
});
