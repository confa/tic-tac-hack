define(function (require){
	'use strict';
	var $ = require('jquery'),
		mediator = require('libs/mediator');

	var ViewManager = function () {
		var MenuView = $('#main-menu-container'),
			GameView = $('#main-game-container');

		// $('#start-game-button').on('click', showGameView);
		$('#back-game-button').on('click', showMenuView);
		mediator.on('socket:game-started', showGameView);

		function showGameView () {
			MenuView.hide();
			GameView.show();		
		}

		function showMenuView () {
			MenuView.show();
			GameView.hide();		
		}
	};

	return new ViewManager();
});