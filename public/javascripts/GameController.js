define(function(require){
	'use strict';

	var enums = require('shared/enums');

	function GameController(){

		this.currentPlayer = enums.CellStates.Cross;

		var el_ = {};
		el_.switchButton = $('#switch-button');

		el_.switchButton.on('click', onSwitch_);

		var localGame_ = true;

		this.switchPlayer = function() {
			if (localGame_){
				if(this.currentPlayer === enums.CellStates.Cross) {
					this.currentPlayer = enums.CellStates.Zero;
				} else {
					this.currentPlayer = enums.CellStates.Cross;
				}
			}
		};

		this.getState = function(){
			return localGame_;
		};

		function onSwitch_(item){
			localGame_ = !localGame_;
			el_.switchButton.toggleClass('network-game');
		} 

	}

	return GameController;
});