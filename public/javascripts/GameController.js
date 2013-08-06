define(function(require){
	'use strict';

	var enums = require('shared/enums'),
		mediator = require('libs/mediator'),
		Game = require('Game');

	function GameController(){

		var el_ = {};
		el_.switchButton = $('#switch-button');
		el_.newGameButton = $('#new-game-button');

		el_.switchButton.on('click', onSwitch_);
		el_.newGameButton.on('click', newGame_);

		var localGame_ = false;

		function onSwitch_(item){
			localGame_ = !localGame_;
			el_.switchButton.toggleClass('network-game');
		} 

		function newGame_(){
			var options = {
				isLocal: localGame_
			};
			new Game(options);
		}
	}

	return new GameController();
});