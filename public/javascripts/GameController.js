define(function(require){
	'use strict';

	var enums = require('shared/enums'),
		mediator = require('libs/mediator'),
		require = require('ViewManager');

	function GameController(){

		this.currentPlayer = enums.CellStates.Cross;
		this.turnAllowed = true;

		mediator.on('shape',function(shape){
			this.currentPlayer = shape;
		});

		var el_ = {};
		el_.switchButton = $('#switch-button');

		el_.switchButton.on('click', onSwitch_);

		var localGame_ = false;

		this.switchPlayer = function() {
			if (localGame_){
				if(this.currentPlayer === enums.CellStates.Cross) {
					this.currentPlayer = enums.CellStates.Zero;
				} else {
					this.currentPlayer = enums.CellStates.Cross;
				}
			}
		};

		this.isLocal = function(){
			return localGame_;
		};

		function onSwitch_(item){
			localGame_ = !localGame_;
			el_.switchButton.toggleClass('network-game');
		} 


	}

	return GameController;
});