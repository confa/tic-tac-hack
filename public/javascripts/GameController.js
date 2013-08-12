define(function(require){
	'use strict';

	var enums = require('shared/enums'),
		mediator = require('libs/mediator'),
		$ = require('jquery'),
		Game = require('Game'),
		viewManager = require('ViewManager'),
		switchControl = require('libs/switch'),
		gamesList = require('GamesList');

	function GameController(){

		$.fn.switchButton = switchControl;
		$('.switch').switchButton('NET', 'LOCAL');
		var el_ = {};
		el_.switchButton = $('#local-network-switcher');
		el_.newGameButton = $('#start-game-button');
		el_.player1Name = $('#player1-name');
		el_.player2Name = $('#player2-name');

		var names = {};
		names.player1 = 'player 1';
		names.player2 = 'player 2';
		mediator.publish('game-controller:player1', names.player1);

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

				if (this === el_.player1Name.get(0)) {
					names.player1 = container.val();
					mediator.publish('game-controller:player1', names.player1);
				} else if (this === el_.player2Name.get(0)) {
					names.player2 = container.val();
					mediator.publish('game-controller:player2', names.player2);
				}				
			});
		}

		bindListeners_();

		var localGame_ = false;

		function onSwitch_(item){
			localGame_ = !localGame_;
			el_.player2Name.toggle();
		} 

		function newGame_(){
			var options = {
				isLocal: localGame_,
				player1: names.player1,
				player2: names.player2
			};
			if (!localGame_){
				mediator.publish('game-controller:new-network', {player1: names.player1, timestamp: new Date()});
			} else {
				mediator.publish('game-controller:new-local', {player1: names.player1, player2: names.player2});
			}
			new Game(options);
		}
	}

	return new GameController();
});