define(function(require){
	'use strict';

	var enums = require('shared/enums'),
		mediator = require('libs/mediator'),
		Game = require('Game');
		require = require('ViewManager');

	function GameController(){

		var el_ = {};
		el_.switchButton = $('#local-network-switcher');
		el_.newGameButton = $('#start-game-button');

		el_.switchButton.on('change', onSwitch_);
		el_.newGameButton.on('click', newGame_);

		var localGame_ = false;

		function onSwitch_(item){
			localGame_ = !localGame_;
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