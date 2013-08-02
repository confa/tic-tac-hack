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
		mediator.on('turn:local', function(data){self.pubTurn(data);});
	}

	SocketHandler.prototype = {

		pubTurn: function(data){
			delete data.cellDiv;
			socket.emit('turn', data);
		}

	};

	function onTurn_(data){
		if (typeof data.player !== 'undefined' && typeof data.cell === 'number' && typeof data.field === 'number'){
			mediator.publish('turn:network', data);
		}
	}

	function onConnection_(shape){
		if (typeof shape !== 'undefined'){
			mediator.publish('shape', shape);
		}
	}

	return new SocketHandler();
});
