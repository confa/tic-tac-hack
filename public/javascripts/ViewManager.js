define(function (require){
	'use strict';
	var $ = require('jquery'),
		mediator = require('libs/mediator');

	var ViewManager = function () {
		var el_ = {
			menuView: $('#main-menu-container'),
			gameView: $('#main-game-container'),
			notSupportedView: $('#game-not-supported-container')
		};

		var css3Supported = true;

		(function() {
			if (typeof document.body.style.borderRadius === 'undefined') {
				css3Supported = false;
				showNotSupported();
				alert('You are using the old browser version. Please install the newest one or delete your IE.');
			}
		}());

		$('#back-game-button').on('click', showMenuView);
		mediator.on('socket:game-started', showGameView);
		mediator.on('game-controller:new', showGameView);

		function showGameView() {
			if(css3Supported) {
				el_.menuView.hide();
				el_.gameView.show();
			}		
		}

		function showMenuView() {
			if(css3Supported) {
				el_.menuView.show();
				el_.gameView.hide();
			}		
		}

		function showNotSupported() {
			el_.notSupportedView.show();
			el_.gameView.hide();
			el_.menuView.hide();
		}
	};

	return new ViewManager();
});