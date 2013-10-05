define(function(require){
	'use strict';

	var enums = require('shared/enums'),
		mediator = require('libs/mediator'),
		$ = require('jquery'),
		Game = require('Game'),
		viewManager = require('ViewManager'),
		switchControl = require('libs/switch'),
		gamesList = require('GamesList'),
		PlayerController = require('PlayerController');

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

		var shape = enums.CellStates.Zero;
		var localGame_ = false;

		var playerController_ = new PlayerController();

		function newGame_(){
			var names = playerController_.getPlayerNames();
			
			if (!localGame_){
				mediator.publish('game-controller:new', {player: names.player, timestamp: new Date()});
				shape = enums.CellStates.Cross;
			} else {
				mediator.publish('game-controller:new', {player: names.player, rival: names.rival});
				onGameStarted_();
			}
		}

		function onGameStarted_(data){
			var names = playerController_.getPlayerNames();

			var options = {
				isLocal: localGame_,
				player: names.player,
				rival: names.rival,
				shape: shape,
				turn: data ? data.currentTurn : enums.CellStates.Cross
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