define(function(require){
	'use strict';

	var enums = require('shared/enums'),
		mediator = require('libs/mediator'),
		$ = require('jquery'),
		Game = require('Game'),
		viewManager = require('ViewManager'),
		switchControl = require('libs/switch'),
		gamesList = require('GamesList'),
		playerController = require('PlayerController');

	function GameController(){

		var el_ = {};
		el_.switchButton = $('#local-network-switcher');
		el_.newGameButton = $('#start-game-button');
		el_.rivalName = $('#rival-name');

		$.fn.switchButton = switchControl;
		el_.switchButton.switchButton('NET', 'LOCAL');

		el_.newGameButton.on('click', newGame_);
		el_.switchButton.on('change', onSwitch_);

		mediator.subscribe('socket:game-started', onGameStarted_);

		var localGame_ = false;

		function newGame_(){
			var names = playerController.getPlayerNames();
			
			if (!localGame_){
				mediator.publish('game-controller:new', {player: names.player, timestamp: new Date()});
			} else {
				mediator.publish('game-controller:new', {player: names.player, rival: names.rival});
				onGameStarted_();
			}
		}

		function onGameStarted_(){
			var names = playerController.getPlayerNames();

			var options = {
				isLocal: localGame_,
				player: names.player,
				rival: names.rival
			};
			new Game(options);
		}

		function onSwitch_(item){
			localGame_ = !localGame_;
			mediator.publish('game-controller:mode', localGame_);
		}
	}

	return new GameController();
});