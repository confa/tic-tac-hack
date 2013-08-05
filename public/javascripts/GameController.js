define(function(require){
	'use strict';

	var enums = require('shared/enums'),
		mediator = require('libs/mediator');

	function GameController(){

		this.currentPlayer = enums.CellStates.Cross;
		this.turnAllowed = true;
		var self = this;
		mediator.on('shape',function(shape){
			self.currentPlayer = shape;
			self.turnAllowed = shape === enums.CellStates.Cross;
		});

		var el_ = {};
		el_.switchButton = $('#switch-button');

		el_.switchButton.on('click', onSwitch_);

		var localGame_ = false;

		this.switchPlayer = function() {
			if (localGame_){
				if(this.currentPlayer === enums.CellStates.Cross) {
					this.currentPlayer = enums.CellStates.Zero;
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