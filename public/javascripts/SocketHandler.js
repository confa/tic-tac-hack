var app = app || {};

(function(){
	'use strict';
	var socket;

	app.SocketHandler = function(){
		socket = io.connect('http://localhost');
		socket.on('turn', function (data) {
			console.log(data);
		});
	};

	app.SocketHandler.prototype = {
		subscribe: function(matchId){
				var self = this;
				if (matchId)
				{
					this.matchId = matchId;    
					this.socket.emit('subscribe', { Topic: matchId, LiveUpdates : 'true', OddsUpdates : 'true', VideoUpdates : 'true', ConditionsUpdates : 'true' }); 
					if (typeof this.socket !== 'undefined') {
						this.socket.on('message', function(frame){
							self.onMessage(frame);
						});
						this.socket.on('error', function(reason) { console.log('error', reason); });
						this.socket.on('connect', function () { console.log('Connected'); });
						this.socket.on('disconnect', function () { console.log('Disconnected'); });
						this.socket.on('reconnect', function () { console.log('Reconnected'); });
						this.socket.on('reconnecting', function () { console.log('Reconnecting'); });
						this.socket.on('connect_failed', function () { console.log('All connection attempts failed'); });
					}
				}
		},

		unsubscribe: function() {
			if (typeof this.socket !== 'undefined') {
				socket.emit('unsubscribe', { Topic: this.matchId });
			}
		},

		pub: function(){
			socket.emit('turn', {asd: 'asd'});
		}
	};
}());