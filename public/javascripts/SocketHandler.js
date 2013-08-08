define(function(require) {
	'use strict';

	var game = require('./Game'),
		io = require('socketio'),
		mediator = require('libs/mediator');

	var socket;

	function SocketHandler() {
		var self = this;
		socket = io.connect('http://localhost:5858');
		socket.on('turn', listeners.onTurn_);
		socket.on('shape', listeners.onGameStart_);
		socket.on('games-list', listeners.onConnection_);
		socket.on('game-added', listeners.onGameAdd_);
		socket.on('games-removed', listeners.onGameRemove_);
		socket.on('game-started', listeners.onGameStarted_);
		socket.on('denied', listeners.onDenied_);
		socket.on('opponent:disconnected', listeners.onDisconnect_);


		mediator.on('game:turn-local', function(data){publish_('turn', data);});
		mediator.on('game-controller:new', function(data){publish_('new-game', data);});
		mediator.on('game-list:join', function (data) {publish_('join', data);});
	}
	
	function publish_ (message, data){
			delete data.cellDiv;
			socket.emit(message, data);
	}

	var listeners = {
		onTurn_: function(data){
			if (typeof data.player !== 'undefined' && typeof data.cell === 'number' && typeof data.field === 'number'){
				console.log(data);
				mediator.publish('socket:turn-network', data);
			}
		},

		onConnection_: function (gamesList) {
			mediator.publish('socket:games-list', gamesList);
		},

		onGameAdd_: function (game) {
			mediator.publish('socket:games-added', game);
		},

		onGameRemove_: function (game) {
			mediator.publish('socket:games-removed', game);
		},

		onGameStarted_: function () {
			mediator.publish('socket:game-started');	
		},

		onGameStart_: function(shape){
			if (typeof shape !== 'undefined'){
				mediator.publish('socket:shape', shape);
				console.log('shape', shape);
			}
		},

		onDenied_: function(){
			alert("No vacant seats. Try later");
		},

		onDisconnect_: function(){
			alert("Opponent disconnected");
		}
	};
	return new SocketHandler();
});
