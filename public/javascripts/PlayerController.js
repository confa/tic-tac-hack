define(function(require) {
	'use strict';

	var mediator = require('libs/mediator'),
		$ = require('jquery');

	function PlayerController () {
		var el_ = {};
		el_.playerName = $('#player-name');
		el_.rivalName = $('#rival-name');
		el_.playerGameLabel = $('#player-game-label');
		el_.rivalGameLabel = $('#rival-game-label');

		var names = {};
		names.player = 'player 1';
		names.rival = 'player 2';
		mediator.publish('game-controller:player', names.player);

		function bindListeners_(){			
						
			$('.player-name').on('focus', function(){
				var container = $(this);
				container.val('');
			});

			$('.player-name').on('blur', function(){
				var container = $(this);
				if (container.val().length === 0){
					container.val('player');
				}

				if (this === el_.playerName.get(0)) {
					names.player = container.val();
					mediator.publish('game-controller:player', names.player);
					el_.playerGameLabel.text(names.player);
				} else if (this === el_.rivalName.get(0)) {
					names.rival = container.val();
					mediator.publish('game-controller:rival', names.rival);
					el_.rivalGameLabel.text(names.rival);
				}				
			});
		}

		this.getPlayerNames = function () {
			return names;
		}

		bindListeners_();
	}

	return new PlayerController();
});