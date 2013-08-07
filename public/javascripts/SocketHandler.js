define(function(require) {
	'use strict';

	var game = require('./Game'),
		io = require('socketio'),
		mediator = require('libs/mediator');

	var socket;

	function SocketHandler() {
		var self = this;
		socket = io.connect('http://localhost:1414');
		socket.on('turn', onTurn_);
		socket.on('shape', onConnection_);
		socket.on('denied', onDenied_);
		socket.on('opponent:disconnected', onDisconnect_);
		mediator.on('game:turn-local', function(data){publish_('turn', data);});
		mediator.on('game-controller:new', function(data){publish_('new-game', data);});
	}

	function publish_ (message, data){
			delete data.cellDiv;
			socket.emit(message, data);
	}

	function onTurn_(data){
		if (typeof data.player !== 'undefined' && typeof data.cell === 'number' && typeof data.field === 'number'){
			console.log(data);
			mediator.publish('socket:turn-network', data);
		}
	}

	function onConnection_(shape){
		if (typeof shape !== 'undefined'){
			mediator.publish('socket:shape', shape);
			console.log('shape', shape);
		}
	}

	function onDenied_(){
		alert("No vacant seats. Try later");
	}

	function onDisconnect_(){
		alert("Opponent disconnected");
	}

	return new SocketHandler();
});
