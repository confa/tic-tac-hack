define(function (require){
	'use strict';
	var $ = require('jquery'),
		Modal = require('ModalWindow'),
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

		$('#back-game-button').on('click', backButtonClicked);
		mediator.subscribe('socket:game-started', showGameView);
		mediator.subscribe('game-controller:new', showGameView);
		mediator.subscribe('socket:disconnected', opponentDisconnected);

		function opponentDisconnected() {
			var modal = new Modal({header: 'Warning!', text: 'Your opponent has disconnected :(', confirmButton: true, cancelButton: false});
			modal.launch();

			mediator.subscribe('modal:confirm-clicked', function() {
				showMenuView();
			});
		}

		function backButtonClicked() {
			var modal = new Modal({header: 'Warning!', text: 'If you exit from game you\'ll lost all turns. Do you want to proceed?', confirmButton: true, cancelButton: true});
			modal.launch();

			mediator.subscribe('modal:confirm-clicked', function() {
				showMenuView();
			});
		}

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