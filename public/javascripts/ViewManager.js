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

		var css3Supported = true,
			modal = {};

		(function() {
			if (typeof document.body.style.borderRadius === 'undefined') {
				css3Supported = false;

				modal = new Modal({header: 'Error!', text: 'You are using the old browser version. Please install the newest one or delete your IE.'});
				modal.launch();

				mediator.once('modal:confirm-clicked', function() {
					showNotSupported();
				});
			} else {
				showMenuView();
			}
		}());

		$('#back-game-button').on('click', backButtonClicked);
		mediator.subscribe('socket:game-started', showGameView);
		mediator.subscribe('game-controller:new', showGameView);
		mediator.subscribe('socket:disconnected', opponentDisconnected);

		function opponentDisconnected() {
			modal = new Modal({header: 'Warning!', text: 'Your opponent has disconnected :(', confirmButton: true});
			modal.launch();

			mediator.once('modal:confirm-clicked', function() {
				showMenuView();
			});
		}

		function backButtonClicked() {
			modal = new Modal({header: 'Warning!', text: 'If you exit from game you\'ll lost all turns. Do you want to proceed?', confirmButton: true, cancelButton: true});
			modal.launch();

			mediator.once('modal:confirm-clicked', function() {
				showMenuView();
				mediator.publish('view-manager:left-game', {});
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