define(function(require){
	'use strict';

	var enums = require('shared/enums'),
		mediator = require('libs/mediator'),
		Game = require('Game'),
		viewManager = require('ViewManager');

	function GameController(){

		var el_ = {};
		el_.switchButton = $('#local-network-switcher');
		el_.newGameButton = $('#start-game-button');
		el_.player1Name = $('#player1-name');
		el_.player2Name = $('#player2-name');

		el_.joinButtons = $('.join-button');

		var names = {};
		names.player1 = 'player 1';
		names.player2 = 'player 2';

		function bindListeners_(){
			el_.switchButton.on('change', onSwitch_);
			el_.newGameButton.on('click', newGame_);
			$('.player-name').on('focus', function(){
				var container = $(this);
				container.val('');
			});
			$('.player-name').on('blur', function(){
				var container = $(this);
				if (container.val().length === 0){
					container.val('player');
				}  
			});

			el_.joinButtons.on('click', onJoin_);
		}

		bindListeners_();

		var localGame_ = false;

		function onSwitch_(item){
			localGame_ = !localGame_;
			el_.player2Name.toggle();
		} 

		function newGame_(){
			var options = {
				isLocal: localGame_
			};
			if (!localGame_){
				mediator.publish('game-controller:new', {player1: names.player1, timestamp: new Date()});
			}
			new Game(options);
		}

		function onJoin_(){
		    /*jshint validthis:true */
			var container = $(this);
			var id = container.data('id');
			if (typeof id !== 'undefined'){

			}
		}
	}

	return new GameController();
});