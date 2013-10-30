define(function (require){
	'use strict';
	var $ = require('jquery'),
		mediator = require('libs/mediator');

	var ViewManager = function () {
		var el_ = {
			menuView: $('#main-menu-container'),
			gameView: $('#main-game-container')
		};

		// $('#start-game-button').on('click', showGameView);
		$('#back-game-button').on('click', showMenuView);
		mediator.on('socket:game-started', showGameView);
		mediator.on('game-controller:new', showGameView);

		function showGameView () {
			el_.menuView.hide();
			el_.gameView.show();		
		}

		function showMenuView () {
			el_.menuView.show();
			el_.gameView.hide();		
		}
	};

	return new ViewManager();
});