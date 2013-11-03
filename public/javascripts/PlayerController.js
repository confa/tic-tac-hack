define(function(require) {
	'use strict';

	var mediator = require('libs/mediator'),
		$ = require('jquery');

	function PlayerController () {
		var self = this;
		var el_ = {};
		el_.playerName = $('#player-name');
		el_.rivalName = $('#rival-name');
		el_.playerGameLabel = $('#player-game-label');
		el_.rivalGameLabel = $('#rival-game-label');

		el_.playerNames = $('.player-name');

		var names = {};
		names.player = '';
		names.rival = '';
		mediator.publish('player-controller:player', names.player);

		function bindListeners_(){			
						
			mediator.on('socket:game-started', function(game){
				self.renderNames({playerName: game.player, rivalName: game.player2});
			});

			mediator.on('game-controller:mode', function(isLocalGame){
				el_.rivalName.toggle();
			});

			mediator.on('game-controller:new', function(data){
				self.renderNames({playerName: data.player || names.player, rivalName: data.rival || names.rival});	
			});

			el_.playerNames.on('focus', function(){
				var container = $(this);
				container.val('');
			});

			el_.playerNames.on('blur', function(){
				var container = $(this);
				if (container.val().length === 0){
					container.val('player');
				}
				if (this === el_.playerName.get(0)) {
					names.player = container.val();
					mediator.publish('player-controller:player', names.player);
				} else if (this === el_.rivalName.get(0)) {
					names.rival = container.val();
					mediator.publish('player-controller:rival', names.rival);
					el_.rivalGameLabel.text(names.rival);
				}	
			});
		}

		this.getPlayerNames = function () {
			return _.clone(names);
		};

		this.renderNames = function(options){
			if (options.playerName){
				el_.playerGameLabel.text(options.playerName);
			}
			if (options.rivalName){
				el_.rivalGameLabel.text(options.rivalName);
			}
		};

		bindListeners_();
	}

	return PlayerController;
});