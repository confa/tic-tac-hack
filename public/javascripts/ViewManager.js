define(function (require)
{
	'use strict';

	var ViewManager = function () {
		var MenuView = $('#main-menu-container'),
			GameView = $('#main-game-container');

		$('#start-game-button').on('click', function () {
			MenuView.hide();
			GameView.show();
		});

		$('#back-game-button').on('click', function () {
			MenuView.show();
			GameView.hide();
		});
	};

	return new ViewManager();
});